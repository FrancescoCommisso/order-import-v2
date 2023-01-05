const fs = require("fs");

fs.writeFileSync(
  `${__dirname}/event.json`,
  JSON.stringify({ body: JSON.stringify({ orderId: "4975527526570" }) })
);
