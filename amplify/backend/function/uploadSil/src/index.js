/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const res = {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: null,
  };
  try {
    const uploadSil = await require("./config")();

    const { sil, orderId: order_id, orderNumber: order_number } = JSON.parse(
      event.body
    );

    const uploaded = await uploadSil.main({ order_id, sil, order_number });

    res.body = JSON.stringify(uploaded);
  } catch (e) {
    console.log(e);
    res.body = JSON.stringify({ error: e.message });
  }
  return res;
};
