module.exports = class UploadSil {
  constructor({ orderService, shopifyService }) {
    this.orderService = orderService;
    this.shopifyService = shopifyService;
  }

  async uploadSil({ order_number, sil }) {
    await this.orderService.makeQuery(
      ({ knex, args }) =>
        knex("Shopify_Sales")
          .insert({
            sil_file: sil,
            order_number,
          })
          .returning("*"),
      null,
      5
    );
    return true;
  }

  async markAsImported({ order_id }) {
    const oldOrder = await this.shopifyService.shopifyStore.order.get(order_id);
    const oldTags = oldOrder.tags.split(",");

    const newOrder = {
      ...oldOrder,
      tags: [...oldTags, "Imported"].reduce((acc, cv, i) => {
        if (!cv) return acc;
        if (i === oldTags.length) return acc + cv;
        return acc + cv + ",";
      }, ""),
    };

    await this.shopifyService.shopifyStore.order.update(order_id, newOrder);
    return true;
  }

  async main({ order_id, order_number, sil }) {
    const res = {};
    try {
      res.imported = await this.uploadSil({ order_number, sil });
      res.updated = await this.markAsImported({ order_id });
      return res;
    } catch (e) {
      console.log("Error Uploading Sale Order", e.message);
      res.error = e.message;
      return res;
    }
  }
};
