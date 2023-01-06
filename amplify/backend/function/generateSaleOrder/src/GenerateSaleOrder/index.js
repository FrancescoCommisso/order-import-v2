class GenerateSaleOrder {
  constructor({ productService, productResolver, customerService }) {
    this.productService = productService;
    this.productResolver = productResolver;
    this.customerService = customerService;
  }

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

      const confirmCorrectTax = ({ fulfilledLineItem, mvrLineItem }) => {
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

      return {
        upc: mvrLineItem.UPC_CODE,
        description: mvrLineItem.EXPANDED_DESCRIPTION,
        brand: mvrLineItem.BRAND_DESCRIPTION,
        quantity: fli.quantity,
        weight: fli.rwaItem.rwa_weight,
        price: fli.price,
        tax: confirmCorrectTax({ fulfilledLineItem: fli, mvrLineItem }),
      };
    });

    return res;
  }

  async main({ shopifyOrder }) {
    const customerId = await this.fetchCustomerId({
      customerEmail: shopifyOrder.customerEmail,
    });
    const saleOrderLineItems = await this.fetchSaleOrderLineItems({
      fulfilledLineItems: shopifyOrder.fulfilledLineItems,
    });
  }
}

module.exports = GenerateSaleOrder;
