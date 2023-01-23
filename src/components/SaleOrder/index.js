import currency from "currency.js";
import React, { useState } from "react";
import { API } from "aws-amplify";
import { Buttons, Wrapper } from "./style";

const SaleOrder = ({
  saleOrder,
  setSil,
  highlightedRow,
  setHighlightedRow,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCalculatedTotals, setShowCalculatedTotals] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rowClass = ({ error, upc }) => {
    if (error) return "error";
    if (upc == highlightedRow) return "hoverRow";
    return "";
  };

  const generateSil = async () => {
    setLoading(true);
    setError("");
    setSil(null);

    try {
      if (!selectedCustomer) throw new Error("Invalid Customer Selected");
      const silData = { ...saleOrder, customerId: selectedCustomer };
      console.log(silData);
      const sil = await API.post("orderImportApi", "/generateSil", {
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
    <Wrapper>
      <p className="title">SMS Sale Order</p>
      <select
        onChange={(e) => {
          setSelectedCustomer(e.target.value);
        }}
      >
        <option value={""}>SELECT MVR CUSTOMER</option>
        {saleOrder.customerId.map((c) => {
          return (
            <option
              key={c.CUSTOMER_ID}
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
            {showCalculatedTotals && <th>Errors</th>}
          </tr>
        </thead>
        <tbody>
          {saleOrder.saleOrderLineItems.map((li) => {
            const taxRate = li.tax.mvrTax === "hst" ? 0.13 : 0;
            return (
              <tr
                key={`mvr${li.upc}`}
                onMouseEnter={(e) => {
                  setHighlightedRow(li.upc);
                }}
                onMouseLeave={(e) => {
                  setHighlightedRow(false);
                }}
                className={rowClass({ upc: li.upc, error: li.error })}
              >
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

                {showCalculatedTotals && <td>{li.error || ""}</td>}
              </tr>
            );
          })}
          <tr>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            {showCalculatedTotals && <td className="emptyCell"></td>}
            <td className="totalsCell">mvr subtotal</td>
            <td className="totalsCell">{saleOrder.totals.subtotal}</td>
          </tr>
          <tr>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            {showCalculatedTotals && <td className="emptyCell"></td>}
            <td className="totalsCell">mvr tax</td>
            <td className="totalsCell">{saleOrder.totals.tax}</td>
          </tr>
          <tr>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            <td className="emptyCell"></td>
            {showCalculatedTotals && <td className="emptyCell"></td>}
            <td className="totalsCell">mvr total</td>
            <td className="totalsCell">{saleOrder.totals.grandtotal}</td>
          </tr>
        </tbody>
      </table>
      <p className="error">{error}</p>

      <Buttons>
        <button onClick={() => setShowCalculatedTotals(!showCalculatedTotals)}>
          Show Calculated Totals
        </button>
        <button disabled={loading} onClick={generateSil}>
          Generate SIL
        </button>
      </Buttons>
    </Wrapper>
  );
};

export default SaleOrder;
