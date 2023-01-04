const AWS = require("aws-sdk");
const Shopify = require("shopify-api-node");
const SecretsManager = new AWS.SecretsManager({
  region: "us-east-1",
});
AWS.config.update({ region: "us-east-1" });

const FetchShopifyOrder = require("./FetchShopifyOrder");

module.exports = async () => {
  const secretName = `mvr-master-shopify`;
  const { store_name, key, secret } = JSON.parse(
    (await SecretsManager.getSecretValue({ SecretId: secretName }).promise())
      .SecretString
  );

  const shopifyStore = new Shopify({
    shopName: store_name,
    apiKey: key,
    password: secret,
    autoLimit: { calls: 2, interval: 1000, bucketSize: 35 },
  });

  return new FetchShopifyOrder({ shopifyStore });
};
