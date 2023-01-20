jest.setTimeout(10000000);
describe("UploadSaleOrder", () => {
  let uploadSaleOrder = null;
  beforeEach(async () => {
    uploadSaleOrder = await require("../../config.js")();
  });

  test("uploadSil", async () => {
    jest.setTimeout(10000000);
    const { sil, order_number } = require("./test-data/uploadSil/input.json");

    const res = await uploadSaleOrder.uploadSil({ order_number, sil });
    console.log(res);
  });

  test("markAsOrdered", async () => {
    const { order_id } = require("./test-data/markAsImported/input.json");
    const res = await uploadSaleOrder.markAsImported({ order_id });

    console.log(res);
  });

  test("main", async () => {
    jest.setTimeout(10000000);

    const TEST = {
      sil:
        "INSERT INTO HEADER_DCT VALUES\n('HM','9482','001901','001901',,,'2019001','2359','2020001','0000',,'ADD','s9482',,,,,,,,,,);\n\nCREATE VIEW SAL_IMPORT AS SELECT F1763,F1148,F1032,F1063,F01,F1739,F1740,F1007,F1081,F1068 FROM ITEM_DCT;\n\nINSERT INTO SAL_IMPORT VALUES\n(,0100001939,,710,'0022710000000',1,,60.49,'',),\n(,,,710,'0006202002405',1,,8.02,'',),\n(,,,710,'0006202000307',3,,5.05,'',),\n(,,,710,'0005849683962',6,,49.05,'',),\n(,,,710,'0000000003651',1,,0.00,'',),\n(,,,710,'0020100200000',,20,17.59,'',),\n(,,,710,'0022071800000',,12,14.29,'',),\n(,,,760,'',,,,ENTRY='4975527526570',),\n(,,,382,'',,,,,'suspend'),\n\n@UPDATE_BATCH(JOB=ADDRPL,TAR=SAL_BAT,KEY=F1032=:F1032,\nSRC=SELECT BAT.F1148,MAX(CLT.F1155),@wizget(BATCH) as F1032,'M@WIZGET(SOURCE)@WIZGET(BATCH)' as F1255, 'ORDER' as F1068\nFROM M@WIZGET(SOURCE)@WIZGET(BATCH) BAT LEFT OUTER JOIN CLT_TAB CLT ON CLT.F1148=BAT.F1148\nGROUP BY BAT.F1148);\n\nUPDATE M@WIZGET(SOURCE)@WIZGET(BATCH) SET F1032=@wizget(BATCH);\n\nDELETE FROM HEADER_DCT WHERE F902='@WIZGET(BATCH)' AND F903='@WIZGET(SOURCE)';",
      order_id: 4975527526570,
      order_number: 9482,
    };

    const res = await uploadSaleOrder.main(TEST);
    console.log(res);
  });
});
