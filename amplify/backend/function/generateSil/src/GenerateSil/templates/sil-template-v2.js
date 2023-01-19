const SIL_TEMPLATE = ({
  orderId,
  orderNumber,
  customerId,
  lineItems,
  rwaLineItems,
}) => {
  const [firstLineItem, ...restLineItems] = lineItems;
  return `INSERT INTO HEADER_DCT VALUES
('HM','${orderNumber}','001901','001901',,,'2019001','2359','2020001','0000',,'ADD','s${orderNumber}',,,,,,,,,,);

CREATE VIEW SAL_IMPORT AS SELECT F1763,F1148,F1032,F1063,F01,F1739,F1740,F1007,F1081,F1068 FROM ITEM_DCT;

INSERT INTO SAL_IMPORT VALUES
(,${customerId},,710,'${firstLineItem.upc}',${firstLineItem.quantity},,${
    firstLineItem.price
  },'',),
${restLineItems.reduce((acc, cv, i) => {
  if (i === restLineItems.length - 1)
    return `${acc}(,,,710,'${cv.upc}',${cv.quantity},,${cv.price},'',),`;
  return `${acc}(,,,710,'${cv.upc}',${cv.quantity},,${cv.price},'',),\n`;
}, "")}
${rwaLineItems.reduce((acc, cv, i) => {
  if (i === rwaLineItems.length - 1)
    return `${acc}(,,,710,'${cv.upc}',,${cv.quantity},${cv.price},'',),`;
  return `${acc}(,,,710,'${cv.upc}',,${cv.quantity},${cv.price},'',),\n`;
}, "")}
(,,,760,'',,,,ENTRY='${orderId}',),
(,,,382,'',,,,,'suspend'),

@UPDATE_BATCH(JOB=ADDRPL,TAR=SAL_BAT,KEY=F1032=:F1032,
SRC=SELECT BAT.F1148,MAX(CLT.F1155),@wizget(BATCH) as F1032,'M@WIZGET(SOURCE)@WIZGET(BATCH)' as F1255, 'ORDER' as F1068
FROM M@WIZGET(SOURCE)@WIZGET(BATCH) BAT LEFT OUTER JOIN CLT_TAB CLT ON CLT.F1148=BAT.F1148
GROUP BY BAT.F1148);

UPDATE M@WIZGET(SOURCE)@WIZGET(BATCH) SET F1032=@wizget(BATCH);

DELETE FROM HEADER_DCT WHERE F902='@WIZGET(BATCH)' AND F903='@WIZGET(SOURCE)';`;
};

module.exports = SIL_TEMPLATE;
