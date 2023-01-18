/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const res = {
    statusCode: 200,

    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: null,
  };

  try {
    const { shopifyOrder } = JSON.parse(event.body);
    const generateSaleOrder = await require("./config")();

    const saleOrder = await generateSaleOrder.main({ shopifyOrder });
    console.log(saleOrder);
    res.body = JSON.stringify(saleOrder);
  } catch (e) {
    console.log(e);
    res.body = JSON.stringify({ error: e.message });
  }

  return res;
};
