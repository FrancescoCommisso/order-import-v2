jest.setTimeout(1000000);

describe("GenerateSaleOrder", () => {
  let generateSaleOrder;

  beforeEach(async () => {
    generateSaleOrder = await require("../../config")();
  });

  test("fetchCustomerId", async () => {
    const TEST_SHOPIFY_ORDER = require("./test-data/rwa-order.json");
    const res = await generateSaleOrder.fetchCustomerId({
      customerEmail: "francesco.commisso@mvrwholesale.com",
    });
    console.log(res);
  });

  test("fetchSaleOrderLineItems", async () => {
    const TEST_SHOPIFY_ORDER = require("./test-data/rwa-order.json");
    const res = await generateSaleOrder.fetchSaleOrderLineItems({
      fulfilledLineItems: TEST_SHOPIFY_ORDER.fulfilledLineItems,
    });
    console.log(res);
  });

  test("main", async () => {
    const TEST_SHOPIFY_ORDER = require("./test-data/rwa-order.json");
    const main = await generateSaleOrder.main({
      shopifyOrder: TEST_SHOPIFY_ORDER,
    });
  });
});
