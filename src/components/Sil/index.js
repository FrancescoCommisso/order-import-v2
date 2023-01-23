import React, { Component, useState } from "react";
import { API } from "aws-amplify";
import { Wrapper } from "./style";
const SilView = ({ sil: { sil, orderId, orderNumber } }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadSil = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.post("orderImportApi", "/uploadSil", {
        body: { sil, orderId, orderNumber },
      });

      console.log(res);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }

    setLoading(false);
  };

  return (
    <Wrapper>
      <textarea readOnly={true} style={{ textAlign: "left" }}>
        {sil}
      </textarea>
      <button disabled={loading} onClick={uploadSil}>
        Upload Sil
      </button>
      <p>{error}</p>
    </Wrapper>
  );
};

export default SilView;
