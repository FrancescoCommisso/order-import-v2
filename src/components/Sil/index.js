import React, { Component, useState } from "react";
import { API } from "aws-amplify";
import { Wrapper } from "./style";
const SilView = ({ sil: { sil, orderId, orderNumber } }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(null);
  const [imported, setImported] = useState(null);

  const uploadSil = async () => {
    setLoading(true);
    setError("");
    setImported(null);
    setUpdated(null);
    try {
      const res = await API.post("orderImportApi", "/uploadSil", {
        body: { sil, orderId, orderNumber },
      });

      const { error, imported, updated } = res;
      console.log(error);
      if (error.match(/Cannot insert duplicate key in object/g))
        setError("This order has already been imported.");
      else if (error.match(/Request failed with status code 504/g))
        setError("Function timed out. Try again.");
      else setError(error);
      setUpdated(updated);
      setImported(imported);
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
      {imported && <p>Imported: {imported}</p>}
      {updated && <p>Updated: {updated}</p>}
      {error && <p className="error">Error: {error}</p>}
    </Wrapper>
  );
};

export default SilView;
