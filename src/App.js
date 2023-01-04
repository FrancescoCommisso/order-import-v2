import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
import ShopifyOrderInput from "./components/ShopifyOrderInput";
Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  return (
    <div className="App">
      <p>Order Import Client V2</p>

      <p>{user.attributes.email}</p>
      <button onClick={signOut}>Sign out</button>
      <ShopifyOrderInput></ShopifyOrderInput>
    </div>
  );
};

export default withAuthenticator(App);
