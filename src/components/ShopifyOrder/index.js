import currency from "currency.js";
import React, { Component, useState } from "react";
const testOrder = require("./test-order.json");
const testRawOrder = require("./test-raw-order.json");

const twoDecimals = ({ value }) => (Math.round(value * 100) / 100).toFixed(2);

const ShopifyOrder = ({ shopifyOrder, rawOrder }) => {
  const [showCalculatedTotals, setShowCalculatedTotals] = useState(false);
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
            <th>price</th>
            {showCalculatedTotals && <th>per unit tax*</th>}

            {showCalculatedTotals && <th> line item subtotal*</th>}
            <th>tax</th>
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
                <td>{li.price}</td>
                {showCalculatedTotals && <td>{perUnitTax}</td>}
                {showCalculatedTotals && <td>{lineItemSubtotal}</td>}

                <td>
                  {li.tax.lineItemTotalTax ||
                    twoDecimals({
                      value: 0,
                    })}
                </td>
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
        </tbody>
      </table>
      <button onClick={() => setShowCalculatedTotals(!showCalculatedTotals)}>
        show calculated totals
      </button>
    </div>
  );
};

export default ShopifyOrder;
