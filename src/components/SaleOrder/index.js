import currency from "currency.js";
import React, { useState } from "react";
const TEST_SALE_ORDER = require("./test-sale-order.json");

const SaleOrder = ({ saleOrder = TEST_SALE_ORDER }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div>
      <select
        onChange={(e) => {
          setSelectedCustomer(e.target.value);
        }}
      >
        <option value={false}>SELECT MVR CUSTOMER</option>
        {saleOrder.customerId.map((c) => {
          return (
            <option
              value={c.CUSTOMER_ID}
            >{`${c.CUSTOMER_ID} - ${c.EMAIL_ADDRESS}`}</option>
          );
        })}
      </select>

      <table>
        <thead>
          <tr>
            <th>upc</th>
            <th>description</th>
            <th>size</th>
            <th>brand</th>
            <th>quantity</th>
            <th>Weight</th>
            <th>tax*</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          {saleOrder.saleOrderLineItems.map((li) => {
            const taxRate = li.tax.mvrTax === "hst" ? 0.13 : 0;
            return (
              <tr>
                <td>{li.upc}</td>
                <td>{li.description}</td>
                <td>{li.size}</td>
                <td>{li.brand}</td>
                <td>{li.quantity}</td>
                <td>{li.weight}</td>
                <td>{currency(li.price * li.quantity * taxRate).value}</td>
                <td>{li.price}</td>
              </tr>
            );
          })}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>mvr subtotal</td>
            <td>{saleOrder.totals.subtotal}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>mvr tax</td>
            <td>{saleOrder.totals.tax}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>mvr total</td>
            <td>{saleOrder.totals.grandtotal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SaleOrder;
