import currency from "currency.js";
import React, { useState } from "react";
import { API } from "aws-amplify";

const SaleOrder = ({ saleOrder, setSil }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCalculatedTotals, setShowCalculatedTotals] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSil = async () => {
    setLoading(true);
    setError("");
    setSil(null);

    try {
      if (!selectedCustomer) throw new Error("Invalid Customer Selected");
      const silData = { ...saleOrder, customerId: selectedCustomer };
      console.log(silData);
      const { sil } = await API.post("orderImportApi", "/generateSil", {
        body: silData,
      });
      console.log(sil);
      setSil(sil);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <select
        onChange={(e) => {
          setSelectedCustomer(e.target.value);
        }}
      >
        <option value={""}>SELECT MVR CUSTOMER</option>
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
            <th>tax rate</th>
            {showCalculatedTotals && <th>tax*</th>}
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
                <td>{taxRate}</td>
                {showCalculatedTotals && (
                  <td>{currency(li.price * li.quantity * taxRate).value}</td>
                )}

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
            {showCalculatedTotals && <td></td>}
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
            {showCalculatedTotals && <td></td>}
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
            {showCalculatedTotals && <td></td>}
            <td>mvr total</td>
            <td>{saleOrder.totals.grandtotal}</td>
          </tr>
        </tbody>
      </table>
      <p>{error}</p>
      <button onClick={() => setShowCalculatedTotals(!showCalculatedTotals)}>
        Show Calculated Totals
      </button>
      <button disabled={loading} onClick={generateSil}>
        Generate SIL
      </button>
    </div>
  );
};

export default SaleOrder;
