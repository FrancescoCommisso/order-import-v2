const fs = require("fs");

fs.writeFileSync(
  `${__dirname}/event.json`,
  JSON.stringify({
    body: JSON.stringify({
      shopifyOrder: {
        fulfillmentStatus: "fulfilled",
        orderId: 4975527526570,
        customerEmail: "francescocommisso1996@gmail.com",
        currentSubtotal: "901.24",
        currentTotal: "942.51",
        currentTotalTax: "41.27",
        fulfilledLineItems: [
          {
            lineItemId: 12277063712938,
            sku: null,
            title:
              "*RWA* 0020100200000 FRICO - MILD GOUDA PER KG -- 20kg @ $17.59/kg",
            quantity: 1,
            price: "351.80",
            tax: {},
            rwaItem: {
              rwa_sku: "0020100200000",
              rwa_weight: 20,
              rwa_price: 17.59,
            },
          },
          {
            lineItemId: 12277063745706,
            sku: null,
            title:
              "*RWA* 0022071800000 DELFRESH - PASTRAMI PER KG -- 12kg @ $14.29/kg",
            quantity: 1,
            price: "171.48",
            tax: {},
            rwaItem: {
              rwa_sku: "0022071800000",
              rwa_weight: 12,
              rwa_price: 14.29,
            },
          },
          {
            lineItemId: 12277052113066,
            sku: "0022710000000",
            title: "FRESH - HALAL CHICKEN THIGHS SKINLESS BONELESS 5KG",
            quantity: 1,
            price: "60.49",
            tax: {},
            rwaItem: {
              rwa_sku: null,
              rwa_weight: null,
              rwa_price: null,
            },
          },
          {
            lineItemId: 12277052211370,
            sku: "0006202002405",
            title: "FERRERO ROCHER - COLLECTION T15 156GR",
            quantity: 1,
            price: "8.02",
            tax: {
              rate: 0.13,
              title: "HST",
              lineItemTaxPerUnit: "1.04",
              lineItemTotalTax: "1.04",
            },
            rwaItem: {
              rwa_sku: null,
              rwa_weight: null,
              rwa_price: null,
            },
          },
          {
            lineItemId: 12277052244138,
            sku: "0006202000307",
            title: "FERRERO RAFFAELO - RAFFAELLO XMAS 150GR",
            quantity: 3,
            price: "5.05",
            tax: {
              rate: 0.13,
              title: "HST",
              lineItemTaxPerUnit: "1.97",
              lineItemTotalTax: "1.97",
            },
            rwaItem: {
              rwa_sku: null,
              rwa_weight: null,
              rwa_price: null,
            },
          },
          {
            lineItemId: 12328101970090,
            sku: "0005849683962",
            title: "SKITTLES - WILD BERRY 36x61.5 GR",
            quantity: 6,
            price: "49.05",
            tax: {
              rate: 0.13,
              title: "HST",
              lineItemTaxPerUnit: "38.26",
              lineItemTotalTax: "38.26",
            },
            rwaItem: {
              rwa_sku: null,
              rwa_weight: null,
              rwa_price: null,
            },
          },
        ],
        shipping: {
          topLevelShipping: "0.00",
          shippingTotals: {
            title: "Large Delivery",
            price: "0.00",
            tax: "0.00",
          },
        },
      },
    }),
  })
);
