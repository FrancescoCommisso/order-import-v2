import React, { Component, useState } from "react";

const SilView = ({ sil }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      <p>{sil}</p>
    </div>
  );
};

export default SilView;
