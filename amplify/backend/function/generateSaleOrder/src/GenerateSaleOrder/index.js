const currency = require("currency.js");
class GenerateSaleOrder {
  constructor({ productService, productResolver, customerService }) {
    this.productService = productService;
    this.productResolver = productResolver;
    this.customerService = customerService;
  }

  confirmCorrectTax = ({ fulfilledLineItem, mvrLineItem }) => {
    const mvrLineItemTax = this.productResolver.determineTaxLevel(
      mvrLineItem.SUB_DEPARTMENT_CODE
    );
    const fliTax = fulfilledLineItem.tax.title || "nontaxable";
    return {
      mvrTax: mvrLineItemTax.toLowerCase(),
      shopifyTax: fliTax.toLowerCase(),
      match: mvrLineItemTax.toLowerCase() === fliTax.toLowerCase(),
    };
  };
  async fetchCustomerId({ customerEmail }) {
    const customers = await this.customerService.customerByEmail({
      email: customerEmail,
    });
    return customers;
  }

  async fetchSaleOrderLineItems({ fulfilledLineItems }) {
    const mvrLineItems = await this.productService.productsByUPCOrAlt({
      upcs: fulfilledLineItems.map((fli) => {
        return fli.sku || fli.rwaItem.rwa_sku;
      }),
    });

    const res = fulfilledLineItems.map((fli) => {
      const mvrLineItem = mvrLineItems.products.find(
        (mvrp) =>
          mvrp.UPC_CODE === fli.sku || mvrp.UPC_CODE === fli.rwaItem.rwa_sku
      );

      return {
        upc: mvrLineItem.UPC_CODE,
        description: mvrLineItem.EXPANDED_DESCRIPTION,
        brand: mvrLineItem.BRAND_DESCRIPTION,
        quantity: fli.quantity,
        weight: fli.rwaItem.rwa_weight,
        price: fli.price,
        tax: this.confirmCorrectTax({ fulfilledLineItem: fli, mvrLineItem }),
      };
    });

    return res;
  }

  async calculateShipping({ shipping }) {
    const DELIVERY_FEE_UPC = "0000000003651";

    try {
      const deliveryItem = (
        await this.productService.productsByUPCOrAlt({
          upcs: [DELIVERY_FEE_UPC],
        })
      ).products[0];

      return {
        upc: deliveryItem.UPC_CODE,
        description: deliveryItem.EXPANDED_DESCRIPTION,
        brand: "",
        quantity: 1,
        weight: null,
        price: shipping.topLevelShipping,
        tax: this.confirmCorrectTax({
          mvrLineItem: deliveryItem,
          fulfilledLineItem: {
            tax: { title: shipping.shippingTotals.taxTitle },
          },
        }),
      };
    } catch (e) {
      console.log("Error fetching delivery_product", e.message);
    }
  }

  calculateTotals({ allLineItems }) {
    const totals = { tax: null, subtotal: null, grandtotal: null };

    totals.tax = allLineItems.reduce((acc, cv) => {
      const cv_tax_rate =
        cv.tax.mvrTax === "hst" ? currency(0.13).value : currency(0).value;

      const cv_tax = currency(cv.price * cv_tax_rate * cv.quantity);
      return currency(acc).add(cv_tax).value;
    }, 0);

    totals.subtotal = allLineItems.reduce((acc, cv) => {
      const cv_subtotal = currency(cv.price * cv.quantity);
      return currency(acc).add(cv_subtotal).value;
    }, 0);

    totals.grandtotal = allLineItems.reduce((acc, cv) => {
      const cv_tax_rate =
        cv.tax.mvrTax === "hst" ? currency(0.13).value : currency(0).value;

      const cv_tax = currency(cv.price * cv_tax_rate * cv.quantity);
      const cv_subtotal = currency(cv.price * cv.quantity);
      const cv_grandtotal = cv_subtotal.add(cv_tax);
      return currency(acc).add(cv_grandtotal).value;
    }, 0);

    return totals;
  }

  async main({ shopifyOrder }) {
    const res = { customerId: null, saleOrderLineItems: null, totals: null };
    const customerId = await this.fetchCustomerId({
      customerEmail: shopifyOrder.customerEmail,
    });
    const saleOrderLineItems = await this.fetchSaleOrderLineItems({
      fulfilledLineItems: shopifyOrder.fulfilledLineItems,
    });

    const deliveryLineItem = await this.calculateShipping({
      shipping: shopifyOrder.shipping,
    });

    const totals = this.calculateTotals({
      allLineItems: [...saleOrderLineItems, deliveryLineItem],
    });

    res.customerId = customerId;
    res.saleOrderLineItems = [...saleOrderLineItems, deliveryLineItem];
    res.totals = totals;
    return res;
  }
}

module.exports = GenerateSaleOrder;
