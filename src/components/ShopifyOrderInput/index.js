import React, { useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

const ShopifyOrderInput = () => {
  const [orderUrl, setOrderUrl] = useState("");

  const fetchShopifyOrder = async () => {};

  return (
    <div>
      <input placeholder="order url"></input>
      <button>Search</button>
    </div>
  );
};

export default ShopifyOrderInput;
