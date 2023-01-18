import currency from "currency.js";
import React, { Component, useState } from "react";
import { API } from "aws-amplify";
const testOrder = require("./test-order.json");
const testRawOrder = require("./test-raw-order.json");

const twoDecimals = ({ value }) => (Math.round(value * 100) / 100).toFixed(2);

const ShopifyOrder = ({ shopifyOrder, rawOrder, setSaleOrder }) => {
  const [showCalculatedTotals, setShowCalculatedTotals] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSaleOrder = async () => {
    setLoading(true);
    setSaleOrder(null);
    setError("");

    try {
      const res = await API.post("orderImportApi", "/generateSaleOrder", {
        body: { shopifyOrder },
      });

      // setSaleOrder(res);
      console.log(res);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <p>Order {rawOrder.order_number}</p>
      <p>Customer {rawOrder.customer.email}</p>
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
            const perUnitTax = twoDecimals({
              value: currency(li.price).multiply(li.tax.rate || 0).value,
            });
            const lineItemSubtotal = currency(li.price).multiply(li.quantity)
              .value;
            const lineItemTotal = currency(lineItemSubtotal).add(
              li.tax.lineItemTotalTax
            ).value;
            return (
              <tr>
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
          <tr>
            <td></td>
            <td>{shopifyOrder.shipping.shippingTotals.title.toUpperCase()}</td>
            <td></td>
            <td></td>
            <td>{shopifyOrder.shipping.shippingTotals.price}</td>
            <td>{shopifyOrder.shipping.shippingTotals.tax}</td>
          </tr>
          <tr></tr>
          <tr></tr>
          <tr>
            <td></td>
            {showCalculatedTotals && <td></td>}
            {showCalculatedTotals && <td></td>}
            {showCalculatedTotals && <td></td>}

            <td></td>
            <td></td>
            <td></td>
            <td>Order Subtotal</td>
            <td>{shopifyOrder.currentSubtotal}</td>
          </tr>
          <tr>
            <td></td>
            {showCalculatedTotals && <td></td>}
            {showCalculatedTotals && <td></td>}
            {showCalculatedTotals && <td></td>}

            <td></td>
            <td></td>
            <td></td>
            <td>Order Tax</td>
            <td>{shopifyOrder.currentTotalTax}</td>
          </tr>
          <tr>
            <td></td>
            {showCalculatedTotals && <td></td>}
            {showCalculatedTotals && <td></td>}
            {showCalculatedTotals && <td></td>}

            <td></td>
            <td></td>
            <td></td>
            <td>Order Total</td>
            <td>{shopifyOrder.currentTotal}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => setShowCalculatedTotals(!showCalculatedTotals)}>
        Show Calculated Totals
      </button>
      <button disabled={loading} onClick={generateSaleOrder}>
        Generate Sale Order
      </button>
    </div>
  );
};

export default ShopifyOrder;
