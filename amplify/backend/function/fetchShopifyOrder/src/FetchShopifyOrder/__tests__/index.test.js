describe("FetchShopifyOrder", () => {
  let fetchShopifyOrder;

  beforeEach(async () => {
    fetchShopifyOrder = await require("../../config")();
  });

  test("parseLineItems", async () => {
    const TEST_RAW_ORDER = require("./test-data/weighted-order.json");

    const res = await fetchShopifyOrder.parseLineItems({
      rawOrder: TEST_RAW_ORDER,
    });

    console.log(res);
  });

  test("fetchRawOrder", async () => {
    const TEST_ORDER_ID = "4975527526570";

    const res = await fetchShopifyOrder.fetchRawOrder({
      orderId: TEST_ORDER_ID,
    });
    // require("fs").writeFileSync(`${__dirname}/dlt.json`, JSON.stringify(res));
    console.log(res);
  });

  test("main", async () => {
    const TEST_ORDER_ID = "4975527526570";

    const res = await fetchShopifyOrder.main({
      orderId: TEST_ORDER_ID,
    });

    console.log(res.shopifyOrder.shipping);
  });
});
