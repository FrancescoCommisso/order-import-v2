class FetchShopifyOrder {
  constructor({ shopifyStore }) {
    this.shopifyStore = shopifyStore;
  }

  async fetchRawOrder({ orderId }) {
    const order = await this.shopifyStore.order.get(orderId);
    return order;
  }

  parseLineItems({ rawOrder }) {
    let fulfilledLineItems = [];

    const parseTax = ({ fli }) => {
      return fli.tax_lines[0]
        ? {
            rate: fli.tax_lines[0].rate,
            title: fli.tax_lines[0].title,
            lineItemTaxPerUnit: fli.tax_lines[0].price,
            lineItemTotalTax: fli.tax_lines[0].price,
          }
        : {};
    };

    const parseRwaItem = ({ fli }) => {
      let rwa_sku = null;
      let rwa_weight = null;
      let rwa_price = null;

      rwa_sku = fli.title.match(/\*RWA\* \d{13}/)
        ? fli.title.match(/\*RWA\* \d{13}/)[0].split(" ")[1]
        : null;
      if (rwa_sku) {
        rwa_weight = parseFloat(fli.title.match(/(?<=-- )(.*)(?=kg @)/g));
        rwa_price = parseFloat(fli.title.match(/(?<=\$)(.*)(?=\/)/g));
      }

      return { rwa_sku, rwa_weight, rwa_price };
    };

    for (let fulfillment of rawOrder.fulfillments.filter(
      (f) => f.status === "success"
    )) {
      const fulfillmentLineItems = fulfillment.line_items.map((fli) => {
        return {
          lineItemId: fli.id,
          sku: fli.sku,
          title: fli.title,
          quantity: fli.quantity,
          price: fli.price,
          tax: parseTax({ fli }),
          rwaItem: parseRwaItem({ fli }),
        };
      });
      fulfilledLineItems = [...fulfilledLineItems, ...fulfillmentLineItems];
    }
    return fulfilledLineItems;
  }

  parseOrder({ rawOrder }) {
    const parsedOrder = {
      fulfillmentStatus: rawOrder.fulfillment_status,
      orderId: rawOrder.id,
      customerEmail: rawOrder.email,
      currentSubtotal: rawOrder.current_subtotal_price,
      currentTotal: rawOrder.current_total_price,
      currentTotalTax: rawOrder.current_total_tax,
      fulfilledLineItems: this.parseLineItems({ rawOrder }),
      shipping: {
        topLevelShipping: rawOrder.total_shipping_price_set.shop_money.amount,
        shippingTotals: {
          title: rawOrder.shipping_lines[0].title,
          price: rawOrder.shipping_lines[0].price,
          tax: rawOrder.shipping_lines[0].tax_lines[0].price,
        },
      },
    };

    return parsedOrder;
  }

  async main({ orderId }) {
    const rawOrder = await this.fetchRawOrder({ orderId });
    const shopifyOrder = this.parseOrder({ rawOrder });
    return { shopifyOrder, rawOrder };
  }
}

module.exports = FetchShopifyOrder;
