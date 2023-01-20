import useLocalStorage from "use-local-storage";
import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import ShopifyOrderInput from "./components/ShopifyOrderInput";
import { useState } from "react";
import ShopifyOrder from "./components/ShopifyOrder";
import SaleOrder from "./components/SaleOrder";
import SilView from "./components/Sil";
import Header from "./components/Header";
import { SideBySide } from "./components/SideBySide/style";
import { AppBody } from "./style";
Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );
  if (theme == "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
  const switchTheme = () => {
    console.log({ theme });
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const [shopifyOrder, setShopifyOrder] = useState(null);
  const [rawOrder, setRawOrder] = useState(null);
  const [saleOrder, setSaleOrder] = useState(null);
  const [sil, setSil] = useState(null);
  const [highlightedRow, setHighlightedRow] = useState(null);

  return (
    <div className="App" data-theme={theme}>
      <Header
        switchTheme={switchTheme}
        email={user.attributes.email}
        signOut={signOut}
      ></Header>

      <AppBody>
        <ShopifyOrderInput
          setShopifyOrder={setShopifyOrder}
          setSaleOrder={setSaleOrder}
          setSil={setSil}
          setRawOrder={setRawOrder}
          setShopifyOrder={setShopifyOrder}
        ></ShopifyOrderInput>

        <SideBySide>
          {shopifyOrder && rawOrder && (
            <ShopifyOrder
              setHighlightedRow={setHighlightedRow}
              highlightedRow={highlightedRow}
              shopifyOrder={shopifyOrder}
              rawOrder={rawOrder}
              setSaleOrder={setSaleOrder}
            ></ShopifyOrder>
          )}
          {saleOrder && (
            <SaleOrder
              setHighlightedRow={setHighlightedRow}
              highlightedRow={highlightedRow}
              setSil={setSil}
              saleOrder={saleOrder}
            ></SaleOrder>
          )}
        </SideBySide>

        {sil && <SilView sil={sil}></SilView>}
      </AppBody>
    </div>
  );
};

export default withAuthenticator(App);
