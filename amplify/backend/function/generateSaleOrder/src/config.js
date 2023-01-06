const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const SecretsManager = new AWS.SecretsManager({
  region: "us-east-1",
});
const {
  services: { CustomerService, ProductService, TagController },
  resolvers: { ProductResolver },
} = require("mvr-services");
const GenerateSaleOrder = require("./GenerateSaleOrder");

module.exports = async () => {
  const secretName = `mvr-master-shopify`;
  const {
    db_user,
    db_password,
    tunnel_ip,
    tunnel_username,
    tunnel_key,
    db_database,
    db_ip,
    db_port,
  } = JSON.parse(
    (await SecretsManager.getSecretValue({ SecretId: secretName }).promise())
      .SecretString
  );

  const mssqlConnection = {
    server: "localhost",
    database: db_database,
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

  return new GenerateSaleOrder({
    productService: new ProductService(mssqlConnection, tunnelConfig),
    productResolver: new ProductResolver({
      tagController: new TagController(),
    }),
    customerService: new CustomerService(mssqlConnection, tunnelConfig),
  });
};
