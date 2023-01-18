import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import ShopifyOrderInput from "./components/ShopifyOrderInput";
import { useState } from "react";
import ShopifyOrder from "./components/ShopifyOrder";
import SaleOrder from "./components/SaleOrder";

Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  const [shopifyOrder, setShopifyOrder] = useState(null);
  const [rawOrder, setRawOrder] = useState(null);
  const [saleOrder, setSaleOrder] = useState(null);

  return (
    <div className="App">
      <p>Order Import Client V2</p>
      <p>{user.attributes.email}</p>
      <button onClick={signOut}>Sign out</button>
      <ShopifyOrderInput
        setRawOrder={setRawOrder}
        setShopifyOrder={setShopifyOrder}
      ></ShopifyOrderInput>
      {shopifyOrder && rawOrder && (
        <ShopifyOrder
          shopifyOrder={shopifyOrder}
          rawOrder={rawOrder}
          setSaleOrder={setSaleOrder}
        ></ShopifyOrder>
      )}
      <SaleOrder></SaleOrder>
    </div>
  );
};

export default withAuthenticator(App);
