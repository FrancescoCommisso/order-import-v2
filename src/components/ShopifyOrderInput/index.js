import React, { useState } from "react";
import { API } from "aws-amplify";
import { Wrapper, Inputs } from "./style";

const ShopifyOrderInput = ({
  setShopifyOrder,
  setRawOrder,
  setSaleOrder,
  setSil,
}) => {
  const [orderUrl, setOrderUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchShopifyOrder = async () => {
    setLoading(true);
    setShopifyOrder(null);
    setRawOrder(null);
    setSaleOrder(null);
    setSil(null);
    setError("");

    const orderId = parseOrderId({ orderUrl });

    if (orderId) {
      try {
        console.log("running", orderId);
        const { shopifyOrder, rawOrder, error } = await API.post(
          "orderImportApi",
          "/shopifyOrder",
          {
            body: { orderId },
          }
        );
        if (error) throw new Error(error);
        console.log(shopifyOrder);
        console.log(rawOrder);

        setShopifyOrder(shopifyOrder);
        setRawOrder(rawOrder);
      } catch (e) {
        console.log(e);
        setError(e.message);
      }
    }

    setLoading(false);
  };

  const parseOrderId = ({ orderUrl }) => {
    try {
      const orderIdMatch = orderUrl.match(/\d{13}/);
      const orderId = orderIdMatch[0];
      return orderId;
    } catch (e) {
      setError("Invalid Order URL");
    }
  };

  return (
    <Wrapper>
      <Inputs>
        <input
          onChange={(e) => {
            setError("");
            setOrderUrl(e.target.value);
          }}
          placeholder="order url"
        ></input>
        <button disabled={loading} onClick={fetchShopifyOrder}>
          Search
        </button>
      </Inputs>

      <p className="error">{error}</p>
    </Wrapper>
  );
};

export default ShopifyOrderInput;
