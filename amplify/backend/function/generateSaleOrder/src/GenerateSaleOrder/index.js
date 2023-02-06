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

    //handle missing
    const missing = mvrLineItems.missing.map((miss) => {
      try {
        const missingFli = fulfilledLineItems.find((mfli) => mfli.sku == miss);

        return {
          upc: missingFli.sku,
          description: missingFli.title,
          brand: null,
          quantity: missingFli.quantity,
          pricePerUnit: missingFli.rwaItem
            ? missingFli.rwaItem.rwa_price
            : null,
          weight: missingFli.rwaItem.rwa_weight,
          price: missingFli.price,
          tax: {},
          error: "Product not found by upc or alt.",
        };
      } catch (e) {
        throw new Error(`Error parsing missing line items ${e.message}`);
      }
    });

    const res = fulfilledLineItems
      .filter(
        (fli) =>
          !mvrLineItems.missing.includes(fli.sku) &&
          !mvrLineItems.missing.includes(fli.rwaItem.rwa_sku)
      )
      .map((fli) => {
        try {
          const mvrLineItem = mvrLineItems.products.find((mvrp) => {
            const sku = fli.sku || fli.rwaItem.rwa_sku;
            if (mvrp.UPC_CODE === sku) return true;
            if (mvrp.alternateCodes && mvrp.alternateCodes.includes(sku))
              return true;
            return false;
          });

          return {
            upc: mvrLineItem.UPC_CODE,
            description: mvrLineItem.EXPANDED_DESCRIPTION,
            brand: mvrLineItem.BRAND_DESCRIPTION,
            quantity: fli.quantity,
            pricePerUnit: fli.rwaItem ? fli.rwaItem.rwa_price : null,
            weight: fli.rwaItem.rwa_weight,
            price: fli.price,
            tax: this.confirmCorrectTax({
              fulfilledLineItem: fli,
              mvrLineItem,
            }),
          };
        } catch (e) {
          throw new Error(
            `Error in fetchSaleOrderLineItems(). Product: ${JSON.stringify(
              fli
            )}. Error: ${e.message}`
          );
        }
      });

    return [...res, ...missing];
  }

  async calculateShipping({ shipping }) {
    const DELIVERY_FEE_UPC = "0000000000098";

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
    const res = {
      customerId: null,
      saleOrderLineItems: null,
      totals: null,
      orderId: shopifyOrder.orderId,
      orderNumber: shopifyOrder.orderNumber,
    };
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
