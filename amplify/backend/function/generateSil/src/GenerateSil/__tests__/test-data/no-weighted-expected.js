const res = `INSERT INTO HEADER_DCT VALUES
('HM','9921','001901','001901',,,'2019001','2359','2020001','0000',,'ADD','s9921',,,,,,,,,,);

CREATE VIEW SAL_IMPORT AS SELECT F1763,F1148,F1032,F1063,F01,F1739,F1740,F1007,F1081,F1068 FROM ITEM_DCT;

INSERT INTO SAL_IMPORT VALUES
(,4169222345,,710,'0069206400213',1,,87.99,'',),
(,,,710,'0062907401939',1,,20.23,'',),
(,,,710,'1006165901642',1,,97.23,'',),
(,,,710,'0006090344301',1,,31.89,'',),
(,,,710,'0007261375015',2,,13.19,'',),
(,,,710,'0080649423002',2,,23.09,'',),
(,,,710,'0006210000895',4,,8.13,'',),
(,,,710,'1006132805144',2,,32.99,'',),
(,,,710,'8008825001136',12,,2.19,'',),
(,,,710,'0006700001013',2,,13.19,'',),
(,,,710,'5017160001643',4,,23.75,'',),
(,,,710,'5017160001636',10,,23.75,'',),
(,,,710,'1006265102965',1,,26.94,'',),
(,,,710,'0000000003651',1,,0.00,'',),
(,,,760,'',,,,ENTRY='5030649200810',),
(,,,382,'',,,,,'suspend'),

@UPDATE_BATCH(JOB=ADDRPL,TAR=SAL_BAT,KEY=F1032=:F1032,
SRC=SELECT BAT.F1148,MAX(CLT.F1155),@wizget(BATCH) as F1032,'M@WIZGET(SOURCE)@WIZGET(BATCH)' as F1255, 'ORDER' as F1068
FROM M@WIZGET(SOURCE)@WIZGET(BATCH) BAT LEFT OUTER JOIN CLT_TAB CLT ON CLT.F1148=BAT.F1148
GROUP BY BAT.F1148);

UPDATE M@WIZGET(SOURCE)@WIZGET(BATCH) SET F1032=@wizget(BATCH);

DELETE FROM HEADER_DCT WHERE F902='@WIZGET(BATCH)' AND F903='@WIZGET(SOURCE)';`;

module.exports = res;