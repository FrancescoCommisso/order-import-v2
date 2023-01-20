import React, { Component, useState } from "react";
import { API } from "aws-amplify";

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
    <div>
      <textarea style={{ textAlign: "left" }}>{sil}</textarea>
      <button disabled={loading} onClick={uploadSil}>
        Upload Sil
      </button>
      <p>{error}</p>
    </div>
  );
};

export default SilView;
