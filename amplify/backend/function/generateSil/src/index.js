/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const res = {
    statusCode: 200,

    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: null,
  };

  try {
    const GenerateSil = require("./GenerateSil");
    const silData = JSON.parse(event.body);
    console.log("Sil Data", { silData });
    const generateSil = new GenerateSil();
    const sil = generateSil.main({ silData });
    console.log("Sil\n", sil);
    res.body = JSON.stringify({ sil });
  } catch (e) {
    console.log(e);
    res.body = JSON.stringify({ error: e.message });
  }
  return res;
};
