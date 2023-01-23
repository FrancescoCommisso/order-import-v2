import currency from "currency.js";
import React, { Component, useEffect, useRef, useState } from "react";
import { API } from "aws-amplify";
import { Buttons, OrderInfo, Wrapper } from "./style";

const twoDecimals = ({ value }) => (Math.round(value * 100) / 100).toFixed(2);

const ShopifyOrder = ({
  shopifyOrder,
  rawOrder,
  setSaleOrder,
  highlightedRow,
  setHighlightedRow,
}) => {
  const [showCalculatedTotals, setShowCalculatedTotals] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState(
    rawOrder.cancelled_at ? "cancelled" : shopifyOrder.fulfillmentStatus
  );

  useEffect(() => {
    if (orderStatus != "fulfilled")
      setError(
        "This order has not been completely fulfilled. It can not be imported into SMS until all products are marked as fulfill in the shopify admin portal."
      );

    if (orderStatus == "cancelled")
      setError("This order has been cancelled and can not be imported to SMS.");
  }, []);

  const generateSaleOrder = async () => {
    setLoading(true);
    setSaleOrder(null);
    setError("");

    try {
      const res = await API.post("orderImportApi", "/generateSaleOrder", {
        body: { shopifyOrder },
      });

      if (res.error) throw new Error(res.error);

      setSaleOrder(res);
      console.log(res);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }

    setLoading(false);
  };

  return (
    <Wrapper>
      <p className="title">Shopify Order</p>
      <OrderInfo>
        <a
          target="_blank"
          href={`https://mvr-plus.myshopify.com/admin/orders/${shopifyOrder.orderId}`}
        >
          Order: {rawOrder.order_number}
        </a>
        <a
          target="_blank"
          href={`https://mvr-plus.myshopify.com/admin/customers/${rawOrder.customer.id}`}
        >
          Customer: {rawOrder.customer.email}
        </a>
        <p
          className={orderStatus === "fulfilled" ? "good" : "error"}
          target="_blank"
        >
          Order Status: {orderStatus}
        </p>
      </OrderInfo>

      <table>
        <thead>
          <tr>
            <th>upc</th>
            <th>title</th>
            <th>quantity</th>
            <th>weight(kg)</th>
            <th>tax</th>
            <th>price</th>
            {showCalculatedTotals && <th>per unit tax*</th>}

            {showCalculatedTotals && <th> line item subtotal*</th>}

            {showCalculatedTotals && <th>line item total*</th>}
          </tr>
        </thead>
        <tbody>
          {shopifyOrder.fulfilledLineItems.map((li) => {
            const upc = li.sku || li.rwaItem.rwa_sku;

            const perUnitTax = twoDecimals({
              value: currency(li.price).multiply(li.tax.rate || 0).value,
            });
            const lineItemSubtotal = currency(li.price).multiply(li.quantity)
              .value;
            const lineItemTotal = currency(lineItemSubtotal).add(
              li.tax.lineItemTotalTax
            ).value;
            return (
              <tr
                onMouseEnter={(e) => {
                  setHighlightedRow(upc);
                }}
                onMouseLeave={(e) => {
                  setHighlightedRow(false);
                }}
                className={upc === highlightedRow ? "hoverRow" : ""}
                key={upc || "shipping"}
              >
                <td>{li.sku || li.rwaItem.rwa_sku}</td>
                <td>{li.title}</td>
                <td>{li.quantity}</td>
                <td>
                  {twoDecimals({
                    value: parseFloat(li.rwaItem.rwa_weight) || 0,
                  })}
                </td>
                <td>
                  {li.tax.lineItemTotalTax ||
                    twoDecimals({
                      value: 0,
                    })}
                </td>
                <td>{li.price}</td>
                {showCalculatedTotals && <td>{perUnitTax}</td>}
                {showCalculatedTotals && <td>{lineItemSubtotal}</td>}
                {showCalculatedTotals && <td>{lineItemTotal}</td>}
              </tr>
            );
          })}
          <tr className={"0000000003651" == highlightedRow ? "hoverRow" : ""}>
            <td></td>
            <td>{shopifyOrder.shipping.shippingTotals.title.toUpperCase()}</td>
            <td></td>
            <td></td>
            <td>{shopifyOrder.shipping.shippingTotals.tax}</td>
            <td>{shopifyOrder.shipping.shippingTotals.price}</td>
            {showCalculatedTotals && <td></td>}
            {showCalculatedTotals && <td></td>}
            {showCalculatedTotals && <td></td>}
          </tr>
          <tr></tr>
          <tr></tr>
          <tr>
            <td className="emptyCell"></td>
            {showCalculatedTotals && <td className="emptyCell"></td>}
            {showCalculatedTotals && <td className="emptyCell"></td>}
            {showCalculatedTotals && <td className="emptyCell"></td>}

            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="totalsCell">shopify subtotal</td>
            <td className="totalsCell">{shopifyOrder.currentSubtotal}</td>
          </tr>
          <tr>
            <td className="emptyCell"></td>
            {showCalculatedTotals && <td className="emptyCell"></td>}
            {showCalculatedTotals && <td className="emptyCell"></td>}
            {showCalculatedTotals && <td className="emptyCell"></td>}

            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="totalsCell">shopify tax</td>
            <td className="totalsCell">{shopifyOrder.currentTotalTax}</td>
          </tr>
          <tr>
            <td className="emptyCell"></td>
            {showCalculatedTotals && <td className="emptyCell"></td>}
            {showCalculatedTotals && <td className="emptyCell"></td>}
            {showCalculatedTotals && <td className="emptyCell"></td>}

            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="totalsCell">shopify total</td>
            <td className="totalsCell">{shopifyOrder.currentTotal}</td>
          </tr>
        </tbody>
      </table>
      <p className="error">{error}</p>

      {orderStatus === "fulfilled" && (
        <Buttons>
          <button
            onClick={() => setShowCalculatedTotals(!showCalculatedTotals)}
          >
            Show Calculated Totals
          </button>
          <button disabled={loading} onClick={generateSaleOrder}>
            Generate Sale Order
          </button>
        </Buttons>
      )}
    </Wrapper>
  );
};

export default ShopifyOrder;
