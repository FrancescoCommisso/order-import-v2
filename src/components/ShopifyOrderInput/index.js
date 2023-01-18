import React, { useState } from "react";
import { API } from "aws-amplify";

const ShopifyOrderInput = ({ setShopifyOrder, setRawOrder }) => {
  const [orderUrl, setOrderUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchShopifyOrder = async () => {
    setLoading(true);
    setShopifyOrder(null);
    setRawOrder(null);
    setError("");

    const orderId = parseOrderId({ orderUrl });

    if (orderId) {
      try {
        console.log("running", orderId);
        const { shopifyOrder, rawOrder } = await API.post(
          "orderImportApi",
          "/shopifyOrder",
          {
            body: { orderId },
          }
        );
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
    <div>
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
      <p>{error}</p>
    </div>
  );
};

export default ShopifyOrderInput;
