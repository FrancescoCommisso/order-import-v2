const SIL_TEMPLATE = require("./templates/sil-template-v2");

module.exports = class GenerateSil {
  constructor() {}

  generateSil({ silData }) {
    const customerId = silData.customerId;
    const orderNumber = silData.orderNumber;
    const orderId = silData.orderId || silData.orderNumber;

    if (!customerId) throw new Error("Missing Customer ID");

    const rwaItems = silData.saleOrderLineItems
      .filter((soli) => {
        return soli.weight !== null;
      })
      .map((rwali) => {
        return { ...rwali, quantity: rwali.weight, price: rwali.pricePerUnit };
      });

    const nonRwaItems = silData.saleOrderLineItems.filter((soli) => {
      return soli.weight == null;
    });

    console.log([...nonRwaItems, ...rwaItems]);

    return SIL_TEMPLATE({
      orderId,
      orderNumber,
      customerId,
      lineItems: [...nonRwaItems],
      rwaLineItems: [...rwaItems],
    });
  }

  main({ silData }) {
    const res = { sil: null, orderId: null, orderNumber: null };
    res.sil = this.generateSil({ silData });
    res.orderId = silData.orderId;
    res.orderNumber = silData.orderNumber;

    return res;
  }
};
