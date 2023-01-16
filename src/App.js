import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
import ShopifyOrderInput from "./components/ShopifyOrderInput";
import { useState } from "react";
Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  const [shopifyOrder, setShopifyOrder] = useState(null);
  const [rawOrder, setRawOrder] = useState(null);

  return (
    <div className="App">
      <p>Order Import Client V2</p>

      <p>{user.attributes.email}</p>
      <button onClick={signOut}>Sign out</button>
      <ShopifyOrderInput
        setRawOrder={setRawOrder}
        setShopifyOrder={setShopifyOrder}
      ></ShopifyOrderInput>
    </div>
  );
};

export default withAuthenticator(App);
