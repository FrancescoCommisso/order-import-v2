module.exports = ({ orderNumber, orderId, customerId, line_items }) => {
  const [first_line_item, ...rest_line_items] = line_items;

  return `INSERT INTO HEADER_DCT VALUES
('HM','${orderNumber}','001901','001901',,,'2019001','2359','2020001','0000',,'ADD','s${orderNumber}',,,,,,,,,,);
    
CREATE VIEW SAL_IMPORT AS SELECT F1763,F1148,F1032,F1063,F01,F1739,F1007,F1081,F1068 FROM ITEM_DCT;
    
INSERT INTO SAL_IMPORT VALUES
(,${customerId},,710,'${first_line_item.UPC_CODE || first_line_item.sku}',${
    first_line_item.quantity
  },${first_line_item.PRICE},'',),
${rest_line_items.reduce((acc, cv, i) => {
  if (i === rest_line_items.length - 1)
    return `${acc}(,,,710,'${cv.UPC_CODE || cv.sku}',${cv.quantity},${
      cv.PRICE
    },'',),`;
  return `${acc}(,,,710,'${cv.UPC_CODE || cv.sku}',${cv.quantity},${
    cv.PRICE
  },'',),\n`;
}, "")}
(,,,760,'',,,ENTRY='${orderId}',),
(,,,382,'',,,,'suspend'),
        
@UPDATE_BATCH(JOB=ADDRPL,TAR=SAL_BAT,KEY=F1032=:F1032,
SRC=SELECT BAT.F1148,MAX(CLT.F1155),@wizget(BATCH) as F1032,'M@WIZGET(SOURCE)@WIZGET(BATCH)' as F1255, 'ORDER' as F1068
FROM M@WIZGET(SOURCE)@WIZGET(BATCH) BAT LEFT OUTER JOIN CLT_TAB CLT ON CLT.F1148=BAT.F1148
GROUP BY BAT.F1148);
        
UPDATE M@WIZGET(SOURCE)@WIZGET(BATCH) SET F1032=@wizget(BATCH);
        
DELETE FROM HEADER_DCT WHERE F902='@WIZGET(BATCH)' AND F903='@WIZGET(SOURCE)';`;
};
