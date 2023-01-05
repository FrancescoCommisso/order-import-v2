/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: null,
  };
  try {
    const { orderId } = JSON.parse(event.body);
    const fetchShopifyOrder = await require("./config")();

    console.log(orderId);

    const shopifyOrder = await fetchShopifyOrder.main({
      orderId,
    });

    response.body = shopifyOrder;
  } catch (e) {
    console.log(e);
    response.body = `Error: ${e.message}`;
  }

  return response;
};
