const res = `INSERT INTO HEADER_DCT VALUES
('HM','9482','001901','001901',,,'2019001','2359','2020001','0000',,'ADD','s9482',,,,,,,,,,);

CREATE VIEW SAL_IMPORT AS SELECT F1763,F1148,F1032,F1063,F01,F1739,F1740,F1007,F1081,F1068 FROM ITEM_DCT;

INSERT INTO SAL_IMPORT VALUES
(,0100001939,,710,'0022710000000',1,,60.49,'',),
(,,,710,'0006202002405',1,,8.02,'',),
(,,,710,'0006202000307',3,,5.05,'',),
(,,,710,'0005849683962',6,,49.05,'',),
(,,,710,'0000000003651',1,,0.00,'',),
(,,,710,'0020100200000',,20,17.59,'',),
(,,,710,'0022071800000',,12,14.29,'',),
(,,,760,'',,,,ENTRY='4975527526570',),
(,,,382,'',,,,,'suspend'),

@UPDATE_BATCH(JOB=ADDRPL,TAR=SAL_BAT,KEY=F1032=:F1032,
SRC=SELECT BAT.F1148,MAX(CLT.F1155),@wizget(BATCH) as F1032,'M@WIZGET(SOURCE)@WIZGET(BATCH)' as F1255, 'ORDER' as F1068
FROM M@WIZGET(SOURCE)@WIZGET(BATCH) BAT LEFT OUTER JOIN CLT_TAB CLT ON CLT.F1148=BAT.F1148
GROUP BY BAT.F1148);

UPDATE M@WIZGET(SOURCE)@WIZGET(BATCH) SET F1032=@wizget(BATCH);

DELETE FROM HEADER_DCT WHERE F902='@WIZGET(BATCH)' AND F903='@WIZGET(SOURCE)';`;

module.exports = res;
