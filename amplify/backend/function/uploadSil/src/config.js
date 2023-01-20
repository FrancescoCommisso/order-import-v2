const Shopify = require("shopify-api-node");
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const SecretsManager = new AWS.SecretsManager({
  region: "us-east-1",
});
const {
  services: { OrderService, ShopifyService, TagController },
} = require("mvr-services");
const UploadSaleOrder = require("./UploadSil");

module.exports = async () => {
  const secretName = `mvr-master-shopify`;
  const {
    db_user,
    db_password,
    tunnel_ip,
    tunnel_username,
    tunnel_key,
    db_ip,
    db_port,
    store_name,
    key,
    secret,
  } = JSON.parse(
    (await SecretsManager.getSecretValue({ SecretId: secretName }).promise())
      .SecretString
  );

  const mssqlConnection = {
    server: "localhost",
    database: "EXTERNAL_SALES",
    user: db_user,
    password: db_password,
    options: {
      cryptoCredentialsDetails: {
        minVersion: "TLSv1",
      },
    },
    port: parseInt(db_port),
  };

  const tunnelConfig = {
    TUNNEL_USERNAME: tunnel_username,
    TUNNEL_PRIVATE_KEY: Buffer.from(tunnel_key, "base64").toString(),
    TUNNEL_IP: tunnel_ip,
    SQL_SERVER_IP: db_ip,
    SQL_SERVER_PORT: db_port,
  };
  const ShopifyStore = new Shopify({
    shopName: store_name,
    apiKey: key,
    password: secret,
    autoLimit: { calls: 2, interval: 1000, bucketSize: 35 },
  });

  return new UploadSaleOrder({
    orderService: new OrderService(mssqlConnection, tunnelConfig),

    shopifyService: new ShopifyService(ShopifyStore, new TagController()),
  });
};
