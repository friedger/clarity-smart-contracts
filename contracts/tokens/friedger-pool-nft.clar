(impl-trait 'SP1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS6RXRAY4.nft-trait.nft-trait)

(define-non-fungible-token friedger-pool uint)

;; Internals
(define-private (is-owner (token-id uint)  (user principal))
  (is-eq user
       ;; if no owner, return false
       (unwrap! (nft-get-owner? friedger-pool token-id) false)))

(define-private (find (user principal) (ctx {member: principal, index: uint, result: uint}))
  (let
    ((member (get member ctx))
     (index (get index ctx)))
  (if (is-eq user member)
    {member: member, index: (+ index u1), result: index}
    {member: member, index: (+ index u1), result: (get result ctx)})))

;; Public functions
(define-constant err-permission-denied u1)

;; Last token ID, limited to uint range
(define-read-only (get-last-token-id)
  (ok (len initial-members)))

;; URI for metadata associated with the token
(define-read-only (get-token-uri (token-id uint))
  (ok (some "https://pool.friedger.de/nft.json")))

(define-read-only (get-meta (id uint))
  (ok {name: "Friedger Pool Early Member", uri: "https://pool.friedger.de/nft.png", mime-type: "image/png"}))

(define-read-only (get-nft-meta)
  (ok {name: "Friedger Pool", uri: "https://pool.friedger.de/nft.png", mime-type: "image/png"}))

;; Gets the owner of the 'SPecified token ID.
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? friedger-pool token-id)))

;; Transfers tokens to a 'SPecified principal.
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (if (and (is-owner token-id sender) (is-eq sender tx-sender))
    (match (nft-transfer? friedger-pool token-id sender recipient)
      success (ok success)
      error (err {kind: "nft-transfer-failed", code: error})
    )
    (err {kind: "permission-denied", code: err-permission-denied})))

;; Claim pre-minted tokens.
(define-public (claim (amount-in-stx uint))
  (let ((token-id (get result (fold find initial-members {member: tx-sender, index: u1, result: u0})))
        (amount-ustx (* amount-in-stx u1000000)))
    (if (> token-id u0)
      (begin
        (if (> amount-in-stx u0)
          (match (stx-transfer? amount-ustx tx-sender 'SP3AQDW78BWS2AZMBZWD7XWGH5HQS3HHVS2MC9NBD)
            success true
            error true)
          true)
        (match (nft-mint? friedger-pool token-id tx-sender)
          success (ok success)
          error (err {kind: "nft-mint-failed", code: error})))
      (err {kind: "permission-denied", code: err-permission-denied}))))

;; list of members
(define-constant initial-members (list
'SP103VXJR1E4KHSF19KKDXN1BNAG3HHRMD5QWDCNY
'SP1049B6SW0W3ZH4TQDGWPPVARFHCHM3MFZ89MHG5
'SP107ENYMVJ2YN23E0YZJ1DC28YX0KAFRWQ2XR0R
'SP108W069Y9R0GZS67CPH1WM5G96BX0NB60335GQ3
'SP10SDYWM9JSP6NGRP8VJKD98ZVGWMFJKECSNBDKC
'SP11EZAAA9HD45A3N763QZDJ3BQ3VMJER5AXA7YRJ
'SP11GJVQTMN2ECK740M36Q7TR8JPCGPGE4MSB3EDZ
'SP1293BDR2HFT5SS1MET8Y1QNCAPM2Q171C0H1GP4
'SP12B127ZFK123WNKMZ7CYP8S42BV4T3SQ2TVYVGX
'SP12Q5VPEFGG0307Z88DQMQ4NNWG4CDNYNQXYP0MZ
'SP1308DQKXZK593BES4GV419HMM3X94MM3TSVFA88
'SP13NXPSHAQ5PHS4EZ55DEF0HCXVF263B72G8NKQR
'SP15RF9ZKWJARCMMYDN26Z54X5ZX96AHABTV7QTNC
'SP1688J09PXA3NFCEAMFSPQDT4QEHP8KJH7SB7DF6
'SP17DGYKZ8GKW8TRKE53WE6B0MVEZGXZQWRGS6SGM
'SP17PF38015BBJ5YZ8B2PR3BV8HVDTG1A6QXFXM6S
'SP17RJTW2FERBBRBC0HQH70BDQETKT76C2QRCAAS4
'SP18DC9K6VVB5XV33G122M2GHM208129TWJGZHR6H
'SP1A86KRVMMXD3QFXRWHWKNAEW07A6KTDX21SK40F
'SP1A8V2HEF1AT2J9V2WR9TX1YYVC35AR72H8BP3ND
'SP1A967GSS8V1HCGQWTWDHFRQP51K1Z7S8CA4YJYR
'SP1B8HKPVCTYS6C1G24F0EJDSCJWQXHX1PE174DNS
'SP1B9JYW7Y85HN0P3N9RV3YFEFVTS86HHH3NCERKR
'SP1BAX9KPKTC3RQ9ESACK2R5G63F23FDRQS1ZXQTH
'SP1C0J8MDSQ67N2AADXTTDKM8SAR1JV3VY8DS25RG
'SP1CMQEFW3QSJDYWFH3SG0K874CM2QDGEM5A9V1XC
'SP1D2P4A6EV88CNSKFN9JHXMZ5PN9YQRKBNXBEKA8
'SP1DM5S40X3N3HEK00HB3CJN67SY4HDPR2KDE13G4
'SP1E5KVXXSSBT5D3ZRBPCT33PNR9EDEN5341XGQ70
'SP1E7GSFHYDKGT41M68CQQWR73WDERJTNRFCC7T53
'SP1E8WR5K6N2JQ8QCP8R6R3QBK976SM8NDF03W5W8
'SP1FGAMEV4EMJF4T0PNZQPK3KRPYTFW66C5T9KS00
'SP1FHYQG70GCZNGQ23X43KBQZ5WJE1Y3XKZGQAK8P
'SP1FPS1V79YTKQ770V3BG18SC8FHQKTV64M70AKNA
'SP1FSM1D5VE0P232KCZZMN939BDFVRXK69VQTE02K
'SP1FVCEX9N4DPMKMC36H3ND70ECA3ZQ1WFN649R58
'SP1FVKRANHMSTZ21V69MVBTMBFSV9MK8SBFQTR5YV
'SP1GJHYSBB9NK9AKRXY1KH50F92N7KVJ27P0EBBMT
'SP1HC79YHX9FT5RF4BSJ2GC9X8KE1P9BGWWX4M1E
'SP1HHSDYJ0SGAM6K2W01ZF5K7AJFKWMJNH365ZWS9
'SP1HSYYPNP7T5KHB77A0WTTVGJHC437P3S9JSCT7Y
'SP1JDEDC843A9TV7D8QQAXDHZPFMNDFB4RPDAF2Y1
'SP1JKSPWGTVNPG9F1MTSPECP41DX0VZJ1PARRHAHV
'SP1JX2RYKPR0G7H81SQHZQ187H50RR6QSM8GX839X
'SP1K7DH646HPNRG8K4S5PJDCVDYTBHN94M9PCJVZ4
'SP1KNEK5YSG6802NXPYJMPH95F3F8SBXBFB5P9KHE
'SP1KWF0R26EJ73WNAPD5STZJ5V2WK1W5C0S946HS7
'SP1M1ATHN7NP5ZNFKE4Q53JR7P6FAZT76AJ2VVYXX
'SP1MPA5WC328JC7A0YRA3VJ7MMYBE8TDPRKG70KXM
'SP1NB012JS7TR1QNS03G3VC2CEWRFTYC96QCKBSDC
'SP1NQ5AS213JFGAS78MF6BPRZ4Z6TENR59K96M67W
'SP1NZMY10ARMS3GNFF4SPQ7G54HVG0SCEP8QY5VQ3
'SP1QKTT2VZ7HF8P1BCPGA1KR2AJT4QY5YRP35DP4E
'SP1R17F8XGZHTDEF4FZYFRG31DWXCENQZDJ7FB58N
'SP1RNGRKSRP8ZQ1BGQ2K5PZKJZHC7MBSQ8GTYNTTV
'SP1RTKESDRGCMMPQAW15RSYSTRJW16PB0M2RNVA58
'SP1RVFT87PV10WKF2Y5TV1MBC12PV7FK736MNX93K
'SP1RW26AHWCMHS21T3AZ6HVSQGNVMHZY8H1VSAQMC
'SP1S4C6Q6Z89EEVG84M1NG51M1W2A4FTMAK2XNBQ2
'SP1SMP58BHC80PKVRKPYDB6JSGKQDG8XKTAYSZWX9
'SP1SNJK0KQGTTJ14HQC0CJHRVDWDEFXYMN5QY7JNC
'SP1SYCZ2V2EKJCDTS5HBDR1ZJNSYFFPW00EJ1BBPM
'SP1T0NKGCAZZKCKNVMAW60DDZ9QC5XAD8C4QDD3PP
'SP1VDP51TS04PWRK4DBPY64T8M1GY85Q1QX8WDVFN
'SP1VSF9NRDSDN4TNZH592D10TNNSDG46NKMYMS8D6
'SP1VV9EB6Y90MJXTM7TRMNPDDE8D4ST44RCHMR325
'SP1WYA0HCHQWBEDQK7XEJ16ZZQQTP8AQ15A9ER89S
'SP1X8BQY6X6CPX1EKYCH2P0BB7TDFDWP79GV5KKAF
'SP1Y5XE7M77F51NQ1497BCAX34DF2ZHB77E1QK4NQ
'SP1YT9M182DVK1VEZ66490TYFN7XMAD0Z9XX8JCPW
'SP1YVF9EWSK6HM0JZR4B3KCM7V3NKVE18VVNFSQV5
'SP20B4E0WVN52BR33XHEB27RS5P2PEA4FSYYD2SZM
'SP20YBF80C3TZ2YRMF3833WZ8RSPHVBVVNNG1GKKN
'SP218FDH2QJS7E0FM6VC6RNW8QWYPBDNEXQ5MBEES
'SP21EDJ8H8DZMJNW4X807BZHK4V45391N986YSHQ7
'SP21SKQASJP2QZPHRNTA78Z80JHS449FAFRD63HKA
'SP222A8XAM81EF2ZZQ0RKNDR7VVHH7Q8XT85CH0VJ
'SP230QYRFBT9JFB92PKVH85CVRX6CFVZ30JSJF3DC
'SP23E1ZQAFFASNS8XT39E8Z3J41066J7772FWMQ9M
'SP23FQFEZFPXM2Z5W2G35BRSH35V0F7GK1D687YE3
'SP24N8JGBX4K92CMNAX7GWK9EVRNWZXDR86RRA31F
'SP24NWB63GRT2ZP7M5Z2RNTVM684VBZTK5JV71R8F
'SP24PGY8669GS60DZ2W1FNPVNVF7AZC61PJ8K5A77
'SP24SXE40FCBG37KJ7C538XVX1H7TG17EGVWAV175
'SP25477FQ84PAGZREMN49B3074GV8JP7M8MG3DP0C
'SP25PQFXE65NYFF5NA8DMT4VAF553NGSWQW3PPYXX
'SP25QK8T5PS6J8YJYTYX5FEMP6TRPKRYDSMCK0QH3
'SP25TW9BZNNBW1MQX5NHNCGSXEFBP98B2R320V4SF
'SP25X4TZBD3GFAZ6ER897QXJ318SBEPT9RCTM03BS
'SP261E27GD1WXDESWE8MDVZJBT42623FP21DXA3TK
'SP28KBPAWDP4R892MWPVNF481XSS46EZ8REK3ZTA6
'SP28MCFE8VCD903NTJXSE4QY6EQNVXKDBVMV3NC09
'SP294GG6MJJCHZ2BDV5PTMPK93MGYB2CY9VV5GG6D
'SP29BSG7A2R7M9KA6FCHBCWPSX9WXVDY4FATDCRY2
'SP29M8K1E5TRG6MVKYC5MT6QDN9AWY7DQ82EM1AS
'SP2A82Q7YZJBKKT6BHD5JXPVZZ9WDRA9AAFTNZGE1
'SP2A8WC1GJAZYC5BPYDAYXJHYVNQ12AQZC3TSN4DF
'SP2AFGFVV2TY4BXTJV1BTNJSD43DR636FBDYB8P5N
'SP2AGMMPZNA8RHQZ93GQJVBA33W1HX4SXJSYV1HQN
'SP2ANHK7PQDGRMT6XRCPMFD8HHYJFVN797SCBHCTH
'SP2ATAXKC65DVKB3M8VY21XXT72PEBX32V0ZKVBW3
'SP2B3CVHPVWAPDGE7ZF4329QY2RNJC2W88WVN95P7
'SP2B4M6D4NBEJDDAX22SS34MEPJPPJ3T920V7RHYE
'SP2BJMEZZCQ287AGFSA4F4JMQ3ZT8XWJ1K8MT169C
'SP2C2070RGTNA22MNQ5S2GDWJYRMJ4F14MVVE0D9Z
'SP2CXVC7F2XKS03MZA5R8J5EQVWNJHHKDARHVKM6G
'SP2DR2WX4965VHW718QJ4PVAEQACC5TJ91MZXM4DN
'SP2DSNT2MEDDYGH1N2824R7N46K2BGJR0QD4QNS4W
'SP2DVH2MW7PR0Y4KF13SR1MMB6J25HTXPYZ5E8EAT
'SP2FEMNG1BR42KJZQAV6Z46ZZYSWBRJDR2RGG76SP
'SP2FF97QHVJPRPVJ7D067Q666DHS05AJT3N2F3MY3
'SP2FJ3GKA3KGTDZG27QGSFATKFVXQWQN01Z49W1Q7
'SP2G9DKTV27XF0BWK23BRR6RPRA9KDJCZFTWQSBA6
'SP2GA0B2HMKNV9GKFGGPTKWJHJ8TEYFBVMTC9FX6W
'SP2GVFTC6NVTQK00CV01WXR7YVEVCD49VS7RY0779
'SP2H95PWNF5W2RY4902DF6X1RRW50KHJMXJK41T2P
'SP2J5R9HKKSK6QSGFYZJABQ02P8NC62HVBG97V8D5
'SP2JBZAZZEXKVZF9XWZ5FGS6BHFA4SC13E69EHFVT
'SP2JD4PPMC1BCAMBPZT8F3DF51CGW4VA9FAE5T3JG
'SP2KDXW27EKC5TFFDTDY06NDH8JZJXAYJBGNJB5CM
'SP2KQAENGPF9C7NM3QQVT7CBEZTGGKBW3KPKWBK93
'SP2MANB3ZJ6BE6QC6YK6A8ASMR5ADBSW4SWP066RZ
'SP2MDDJF88RW6HSNXT2P30QMWQBDQRT0GT031N9ES
'SP2MGBYR5XYZMKYG8JSY9JZKTW8XAVEWBK1JF3CKV
'SP2MQG70XKAA4JJEAH7TT3WD49PQ7278MF6KBKAYB
'SP2NWGMBV60XJRMTCDBCSE5C6AZWT1RYP1FT192E8
'SP2R5V3KWB8589GTKQMG090XTJ6FS3DMPA51FW5NE
'SP2R5W6WZP7JA5HRMVWKW23081HT346DJ5ZZ7XKX9
'SP2R8C36A8KVBBWYC4ASD6V36S2E9VJ0FXWV2T4CP
'SP2S8CB3STYS096T0DH8RYYWJ7GD182485XP6DRTD
'SP2S9BEQWMJG3HQ3BENRZ53FJ8Z9SXR7JTJ4JFP61
'SP2SGP77FTP6K2TR6P76D6FEY95448SG7RB69WWFA
'SP2TDGJZAGJWFSJAWQN2WBGR0TNEVV4CNWJBZ1SNC
'SP2V54K1P1QV3H5KSBZ9732VRYFNES47ERV1GBSZW
'SP2V9AVJT11RVQYM7G9KWEYHSJP6ANHBMBN47ZSB9
'SP2VA0B2KCABAYRS8KB6HFRD3PHK03K245KZFR7D5
'SP2VFSR9S69GEN8V7007ENAK9G0Y60EDFEF15BH7D
'SP2W0HDFAZJ9V96ERRXMYCPHS7TR5J43GV3WVRNW6
'SP2W4DY4ZEG6FFYGX7W8X11TA59BXHFHEZKF3GH35
'SP2WTPFD0DMEHKZA185CA4F9F8BFB2SDHVAJ3C8JD
'SP2XY8VVH3JX65M8XQXCNVN8T2K4820V28TXYXF47
'SP2Z6NHHAPK2EQX749P3E7Q57W5EBEQQD2C8ND64J
'SP2ZRAWGZXYXRKR4QT6NP56JMETFQNEASHBD0AGZV
'SP2ZSTSSE61NZTRGWVB18MEQ26AMQ0Z7R70Z2ND36
'SP31RCGY1X1TJ1FMEJS19MGPQ3H9YX00XF9Q862FF
'SP31VE6HPV8HW93YZG10S15SGZV3FVRJD33KTVKP8
'SP31WY87X4BNKJ9N39BW4E0KGR17FRJMB3VFF4ETH
'SP33D930AY0ACGATM7SE991YJQDT9HZERCCS9JZCD
'SP33NZPWEK5VJNP0E87NM6WYTCV7ANBY43V77568G
'SP34E2X0SVPDS18SKRR4MJSQ0ZNWFYYVF0AJ3DX53
'SP34GC8SK4TG93SZQ2P9YM9JKFX25YJ3J27RQNMKZ
'SP34Q0WDWGA6EHFXS7Y2JHJ0H9XY4P2KKXMSYJ8JK
'SP36C9KQ8JTF3PFAKWKV13KEQSQSZJDSNYDQQAFSS
'SP36JZA0YQGF0AQHV70QJHHX2CEC7DRGEE9XZ8C4X
'SP37PHFTKBS4KENAQ5YFB8G6G86R2X0ZKTDRVQ2Y1
'SP37PPTXJH6KCBJWGTJMZN4MEV7NZG8Q0ABN1DTAD
'SP37SJ9A2JRQ92YGTC6AK6362YCG31HVFEYJSQM73
'SP380FT3ZSQQKN1CTA81SAF9WPHHZZ3YXM9CPHER5
'SP3878KDYPJC2WHZSHY5N33B379B95W6X5D0TCYMP
'SP38BKTZXG02RYZX1J952AQSQRHHQQMMF56ZWXCSP
'SP38PEYV4JAVBA0E3AY6KJWB5RB9T7T0GK95B2BQZ
'SP39122CXXX9G0A940XJ1M1Y8Y24TT07A2F1JY7CA
'SP39J255HZFVJPBCB2NN72CER1XPJ93M2XJRYZKEX
'SP39JNECYKJ8S8JBF2A1R058K7DRNQ282W5X5VAY7
'SP39RBC1PYD2FAGSP589F7ZZSYBWVSWZQTNCH3FM1
'SP3AQK4YGWEPJX24ZJ2635SQJHYT3XYQE8KNVMWXP
'SP3BB8RW1GWMCAPDDXQ6CX2HJC7KKSFN43Z8QAGAJ
'SP3C08QQD5XPBAHG7DK0MZ4CV228Q0MD0BQKBHKZ4
'SP3C5N5QZCWW2JR0Q48CF26V72GG18Z22ZH6RVQ7E
'SP3C9DTK0WQHF711EADMZ1SAYC5J0D6JKNH7NQTXW
'SP3CBJH1HXYEVF3GMRHSC3F7Y2V3ZY24EFM4FBZMH
'SP3CZJ441MRGANK3AMY9B4Y094V75KTZMA3Z1BJJW
'SP3DQXPBJE50V6MPNJPCF8ZQZPTFW45PRKRPZ0RDJ
'SP3E13ZCYW2ZQQCFN6YEN6NXK56HNFRAY3MJ6PGB0
'SP3EM588P7KEHSJ20Y5Y9TYRJHBHST3TCQ4SSQYTF
'SP3F0JBNR6K9DE26R9N6PTRWMKQ80FDW7TEWDDPSR
'SP3G5AH22FQC5TX8N7GYMZRBVXZ4198402ZWE6FG8
'SP3G5PYB0NJNS1DGCXQ438F1A7HVAXNRYZTAY8XTY
'SP3HVG0704NNCN0DHYJ0SFHE87XPJWMVTXG4B30BD
'SP3HYJAVJVBPJGK6W84YTQWFBBM0MN4YAH3HG54YX
'SP3JG25CPVAE1119AKPD2MD2YVFE5WGPX60EZ3D21
'SP3JGAN3WPH64ZMNSB8DC1E8RMZS043W4Y3KGWJFW
'SP3K736DGG3FTMBXYRDX1XJAFZH106ZM0DPB703TY
'SP3KGJHCN8V9YBXX0AGNN7RH4H4KSAN4NR2BRQRX9
'SP3M7K8GEZ8FCDW922R6P7YZYFMD7C4HJJ5K0R4D3
'SP3N28J0GJXN91GMJB1X7EWBRX977S6N7XC5EFMG5
'SP3N66YX3QECQDPKKY2D15T0DNSSVW4TRY0H79EWY
'SP3NYWC8VD73RCF5XPBDYZ8REHTSTRJSC4ZC50TS2
'SP3P23KESVHSRXX73RXTM2VV1KJY4434KAC0J8NSH
'SP3QTDQ6ENKKYB6VP1EQ98P277V96669S0QQ2K32E
'SP3R6JQPJMGNZ49YWB4ZCD9T4SQZCSTQF0YYN8XF1
'SP3RVD6FMPEWN79JA3ZXA2XG8NHB12YEVGCDXB9GX
'SP3S6218VZJ64KRE8ZVWGB2DWTNY2YF2998G2VTCR
'SP3TYHM2T0CEJ7DH0G19SJNHE7J4ADVAF6DGXHQN
'SP3V7QAMNVSP8G42ETZ6MB1A4C1ZZ60FYGS341HPC
'SP3VBME5VPZJ16G7KFA2VFTNHD7924RNE4G4J46ZZ
'SP3W1A04QMJN64CEXA7YQJ3Z0HQKYAD7PZPVFXQ5B
'SP3W5F6NAPY2PX8J6REW530BXE63R4S0BNPY06QJ8
'SP3WN3C0HQNVS70AWXFGW7QSDXRJBCR39W04D79V4
'SP3X0Q1CKTJXXW8ARX5GAHE0SVD7D17KTBAYKENHC
'SP3X91TZJ7KK9JZF4Y9GY8TK416YB501PW0DYTN0W
'SP3YXTCXE1T49B72CAFF6192QF2J2TR3E24YMWQKP
'SP3ZQXZ6MZD3FPPFTQ9V04P715572SCKXF78XGGBH
'SP4G8XQYESG0S50TS60NW5XMBS408ZWNJQZZ8YFV
'SP65TF2CPDY6WQ9FJM7KJK7862DWXMAXAF452YZG
'SP6ZSYZ9F28C80KW9QGASQ8SQY4K0RFVRM5YM2C4
'SP79JMAGQVWMVWRXG2AE5GF8Z27VF1W4KZ3J03WG
'SP79YX144B1ATGCT64CX3S4KWRNPWP2GTZ0E2W52
'SP7VNC3QJQD446ZRZF2K9TRWE02YFZ2VYM5VRH3H
'SP7ZFQWWHTVKTE34XC2NYHP8M4Y81P16YVP596RD
'SP8ANKJ57KH74WX7WJ50EDSGEM73P1AMB8ERB8E0
'SP8HNZBEEB72CWPXJHHRTWFS8PXATHK67ZT7Y7QA
'SP92C75TCAQ6G940GCR024ZEW53MV35DSKR9328B
'SP95KMAB3Y1MXDJMHP7ZA6WSKA9M1XSJQZ2VRDJJ
'SPADCG71NGRGY0ZG6NV0VV3AWCCBSPGK6AY9HKHZ
'SPAF8MV9S2W718QMAJ2WKT10R3VEZ5X6CT9ZV591
'SPB24SCJC8HYWWWECG35RCFFH8CJ6XTD937PEZ5D
'SPBBCE9BXRQ79Q3BBFJC5JM7WN0HH7FYYH6APFQ2
'SPCQJHKAEDC6MHFT2V5HCSF9PSXSK0H4MJ46TTBW
'SPD63E5WQMR9B2ART8M8HADE7WCW99B12EPSR91F
'SPDHP2V80W5HFEFPMB04W9TJT54WF7JXDA4BPGX0
'SPDMT7JY32FDEG7Q5WKJ5VG1MQMK32NZAG37E4MP
'SPDPK90G0EY4ADP5P5Y1Z9MTZPASQZJ8VMVAGKA3
'SPE3RJ12X2SEW1JEDM86E061TKE1A7WK4MNF51HE
'SPEJ62RX5K168230D86XS24BB1ZB0XYZC9075Z8X
'SPEN8FV6KGHYHN4VPZQSHRHVG7AKGXPY5GQYSFEZ
'SPGJRZJ6X49Q5X8NNQEYDMFAK9DYKPEJZB465QSR
'SPGQYHH67ANXHGV9NEF6H77Y1905T0NJSXXS7AQG
'SPGR13361HQZAFMJXH68QEJMYF5X6XPQS5Z07CPR
'SPH55PT9NCAWFX8A2J4BRNCCE7M5H5D1R5J67TPV
'SPHBYY7924D6PWN6V9CTRG6N0841KKYXTMSMXDE9
'SPHQWKF9P6F8WSB4ND472Y3JZ00B5PDEV08ZKJPG
'SPHTWPGNH6Q9KX04K42PGR6XQD1FTJR4Q5FWKMK9
'SPHXTH74K0CA558J1D9DZJ1YJ8SCH3T4C7J1F45G
'SPJYE321XPCZ73EKM5GHZGC5ACBPS4KHGB4E4GGJ
'SPN0JJGCSQH7E8CFFJVXQPPK5JRCE4AW4VHXWH7Q
'SPP0Y3K42J9B578PKCBKW1SS52J48PPATFYH1EQ7
'SPQ77MRW36WA4K26V4AGXYDH42KXTGZ0Z021YQ1G
'SPQ7YDT8P32ZNASZ31C35N9PT6DRJJ4WV9A72AGG
'SPQ8VA0WJ93A8PYPTEQK6TH87E6Z7AXBJWEB7TGD
'SPQGJQNN6MJJVG1EH410ZH2BTF174316ZD651G1X
'SPQTYN6A30ZY70WRRC7FFR5JQ448387C0ZHRKRE6
'SPRSNP97S0V51DCC4HM6PVW2GNDATY3P58R1689N
'SPSVHHZZSE310772B91QFVCJY9CTFTJ7AGT1PN4A
'SPTCAQ1GC5E9T63C3QVW38WZBEMZ6W74PKNVAASS
'SPTKTERHWQ3G4RFRK6YA1ZXNMNM4ET5T1SFE0PDV
'SPVBNHN55AZQEPGJZ8FV46N4ZP6941TYWZM04WG9
'SPVS56JVDJJMJCFCC2A8EWQCF9RDPHXVM6G5SHS1
'SPVX6QNDK0KG2QYPAN4WC2P0MG8SXV0EVQQ8ZEWS
'SPVXWPY3CV52WE3QP6K4KMB0CTR5KHQRCDTW411H
'SPWE4ZR7WHPG80DZ49RBPWMYK9Q8VCJW6PV8XDNQ
'SPXM7BVFGJWYBVEJNBX0ENHFW7KDJNYQAQX9A9YH
'SPXN4THK2N60AC2AWQ4N7NAQ1EMTCESX30X19R76
'SPYJ64M7872D8FB0NDBH01MKV45KN0RXA8SG67XK
'SPYMKCJG1H72TEGNY1ET9JFY2VJKZZ54NBX7BXZ4
'SPZEQ4ZWBMZPTCP3SJ2MDYWEB26A6YZAR6EQANGA
'SPZRHHRX2GA28TJ1BTXDDF3G3WYBVF5D0M5PMCN5
'SPZTJ6XGAQ7VB12JTTPS8ZACFPCG1KDG9ZPTBJD8
'SP1048EY7VW9MKV6CGE4MNAGQGTEKB0DS1W7F7N4H
'SP10QVTFJQF27YJ9QFFSVGBD07ZFCB1XN1EW9M7WC
'SP10Y8P3RXNK32045JA5V7RDY5J7TNCKSGT9TYTZ4
'SP15F5TG1BZ10CC60YVGNJJNRVDK2848KKFF758XV
'SP160TXFF7E884VYFBP58N2N8XYP0ZB9BV6N0160M
'SP186MRS2HQKYGSNZC9519QCD59WGRTHTZ67ET8AD
'SP1933R6G2N0TDY215TBFFA93EVC5A7ZATND5M9XF
'SP19JZ7FSBE6B8AFV44TPH0YDQ32RDZK0YFVEBXYZ
'SP1A9XRECJ93C2120EEGZ4TS9D4N9B3N7CWY8FNSS
'SP1BHMEG20ZEVAH3SG7577EDJJ5S9RXMAQXCGH455
'SP1CM3RBT8MZ4M7R2D58EZ6487MB4025NB8C3VN5W
'SP1CMCMPGC7BR5T80CWKNRB6357RGC7X8XA4F1K33
'SP1F49BMRMJA83VF5ER4A9BBBENWE6NJFS2PTS5F5
'SP1G32VX0G5Z3A67XYQR2VWFJ6DKZ7XGD9QRHFEMJ
'SP1GS8D16PJ373QKPDWN3VJVHAS9N58HCT98F7TZS
'SP1HB7779C8GNDQ4VT7CTN9APSKK48XJ8PJAKTGFT
'SP1JAVCPB9WYCQYXD1R005P1X9ZXFARQCYJNBQE89
'SP1KY2RGKBWTEFBAJWS0SX0P1PHXTXTHB9X528WXX
'SP1ME1TS4Z46T83K4HPQHGV3Q3VX2NF758FFCBWPW
'SP1MMN6JXP0RYHZ762QZGKAQHNQFKVHEBZ9XAM0FP
'SP1PWR60CHQV67E6Y78GZZVTNPYB5EJGZT8JMJTV4
'SP1Q8WYVFN5W2YWAYZWBVW8KABWTGP159NQ6M5KDP
'SP1R17D8PRB38QABDFJHVECSMHNXZMNYG08PDK4NW
'SP1R3G88QNQNYNTXSD1WRJ8K5R10KDPVDYR05096Z
'SP1R7KSGMKEBPJZZ6RV88VEQRWJ2F52W7XTM4ZE4X
'SP1V7NRPKG7XHGNBZ5HGQ42SM90VNF2Y5YXY0RDA7
'SP1VEXZMSMQ93D93W742F2ES4ZGPZX3DNJP8DP9Q9
'SP1X95Y5JVD7KXTQHJF6A2BRGEKY27BH7BWGYJR6D
'SP234PQ03KV02KSJ1338AQVAHXR83QXSTG58W3HPS
'SP2352J7NJSVE840Q193A1TQXYA060YY17MSQBYCD
'SP246HMXWGY3WF7VRZB3E5E2YPTM0ZRXXMFTTVZ5S
'SP27YT7KEJVM3857RCQKCQBHHEEMP0TFEFNC46SY4
'SP287WSB9DMKVWND9JQKZ3H9TY9MSDV9QEQ8SJ3TP
'SP29RR6QP0ND9A732J7HNT1KCH2WG3FY2P7EYY5NJ
'SP2BQ782SESAYXACWCWDYP0Y4YVYVW0FBRQ384XX4
'SP2C7EE8T80AHDCYD1HPZMJJXNMCFXGXDK7ME0M4G
'SP2D0014X0P181GCR07TJ532NFHXN73NF4JZ95TMH
'SP2D71SFBCAX1VE664GKQP2Y7YMRDW6YJGVQVXB1T
'SP2EDRYCPGTS32HZAGWV54RAVA2GTW0WPBP4HGCXR
'SP2F2NYNDDJTAXFB62PJX351DCM4ZNEVRYJSC92CT
'SP2G12HF582SHKYVE5HP5BA1SWG06W572S5E8Z48A
'SP2GYXCMY2VKMDJWN30SHA6BBG6SWZH0E5AP4TFT7
'SP2H0DVKACPTJV3A5ERQ9MQ9MVZSRR0ZQHWFJDGC2
'SP2M7R24J80SZZ34CNQ1SCGFWE3WFF5HRXGRRTGBK
'SP2N2PKM9X9BY9PZVDT9MRT1HQMZFBGNP8JMZ7EKR
'SP2NRHX4WTVTEEC0VSJAZ56GPEK8387WN7Z73B0HT
'SP2NRS6W0F3QZZDXNBPPKEQJ5NBQRV6RF76QA030J
'SP2NV3SGKPRAMHXXSNDGSK0X6Q8C96XNK4BFFSQA2
'SP2P0S3TJZX3EGZP5564XSPFCNADRQVB5ZKCZBWQD
'SP2P8QYQX5PMKVBXQ9FWK8F96J8DJXXW7NB7AA5DT
'SP2V5BZFYCM6BFMANKFENWKTRNK04J42GE8QZMJAM
'SP2W6D4CV6WKXMTTCJ9480KFBXQPHD5RHGBJK7PHM
'SP2ZST2JXM4B79703DJ0N9F3Z2WMG6ZHV76FA50NA
'SP30S5RMTXQWJ9W5XXP2GJ87RGNSBQ7QCPFP35ZAV
'SP31AJM5WD8N9WB3HRCN5M2MA5QB14RF4ZYGEY9D7
'SP325DAYKWK2AST79G24TTJ9E28CBEESGRG9XWCAF
'SP344KKNJ86Q7H592V9VTY4KG2V5QS1CGQFNRP3QZ
'SP36JS5NZVCS1D04ZGRRFFHB9SCDGB6JSJ6RJ3DVZ
'SP37C6HQRQ4GYP1EMEK7KW31HG7G5JNZ5ZPFQMP57
'SP37JRGQ4P7CCW1MVQBD5G4EDDMYB3P23AXR759Z0
'SP38PZX3BKRRTG3950PSHYMJRVZ5PBC9Y57GKYNS8
'SP3910KBW2WAXNDM5VXWGH0JR3JFD245YWM9BA5HE
'SP39GGVC3NVBM9DDZSA79JB0Z3VT4V99701FM3GY6
'SP39K85BYDZ9D34BRBKE60X622MA0JKQAS1NB27S8
'SP3BK1NNSWN719Z6KDW05RBGVS940YCN6X84STYPR
'SP3CM7FQPGXDH8V23J29QZ025RVR1RBY1BK0BNM82
'SP3CYWDC99E17A7HA65CX6T1HDY9DW6728EXBQHHX
'SP3DBY9K5TMBY6SNS6RHPJEGJWDWQ7PVNM0QBETDQ
'SP3DRKFMS38DN51X5PYJ23VVVJRXYVH4E09J0DAB
'SP3E5ERX12X3J83GG6M8Y36S5J6VKTR3Z3ZZKZS4E
'SP3ENJNNJC3JR0EJQJ7A0P243ZSD1P8JZ8JH2Y2VB
'SP3G2WTTSKNEGZJC6RGS1SBBR65DKKKQ8AY78KRTZ
'SP3HE17BGF7JGZKZEXH2CKTQN94HJK246BA4697KD
'SP3JG2MJG7VW2E5YYNZAFDMKX3QSFQ6JATPJ7MX6A
'SP3JZ4CDBEWNZEA8EXXNWFQ98FQ0VMZS453VJB2TF
'SP3K264JEZ5C3QRZ51GE167G8X520CCV0M7G08PFV
'SP3M5G0HTX7FWZ4ZMX4YQ46XDGS9PVHKY23VP545G
'SP3N1Q8S314HQRZNVY7E4FDESDYXS1NGVDQC63APK
'SP3NFT3HYSABSFX42HMRQ0J6A0FE47X7AXADQCVTM
'SP3PEHCWSEZ6D1M3950ZTY71EK8DAK4A5ZQ0B3DTR
'SP3PGB46DX8M0M679J4Z1AETEGMCK7ZJDYJV7MEM9
'SP3Q3NDMNJAPTY7YH27MBG1NTYND696GDVDW3XRK5
'SP3VY6TRVN6B9ZBH3YC47V0QKG2N7Q4T2QMC2TEH9
'SP3W7P3S6HEHR9ZJ91DZEC683WFYCDACNHVWSAN5K
'SP3WAYE5954JD70844M7Q1WT2KBVY1TEY042X4RBY
'SP3X76KP5BM2RYAQ4XRB0QBTH959MXN2KJ5R0W63K
'SP3XBDJ3GFXM4Z8V9A45CSTA4B6J97XP0XMMCDKZ1
'SP3XMSJSV1TYRP69PAC0751P483QZ3E17R5GTV4CX
'SP3Y32YBHK0M3QNWP0ACA0EVDJYCTPS62W5281SEF
'SP3Z4XXFH7RT69JYKVZWKRZ0TYM8M22ZT1P9HTXX8
'SP3Z8QJH6CVGJ0JK163HZN2N9WYPZGRW1F79KD7B7
'SP3ZJEHK68Y2XB5TRX6ADP17NWRMBEA6KVKD1M0JV
'SP3ZTBD1RZXFZ3JPTC9BWXEVXWV4NTCVDHX15YJET
'SP451EFFVGJ6AWFAQJ135N9G9FE5RWPGXEV7RJ2F
'SP4K41TRAPW02VJHSX5ZFVVG2E7DHDNGX4D8XTPD
'SP936DGKWEEZ6CC100FCSZ18PPG9GCXQMMFBQ79T
'SP9FBRFC028FW65C6CB8ZWQG2C62Z9DVQGX0DPVD
'SPB4APH5MRYWJY4FQH821QTYVDQ80CYHRSXBRJXK
'SPB8AQRQEQBQJACHKA7GRQ2ET0ECMH9ZA263Q7HH
'SPBRMYM12MZKGRBJWBP3VPT845FGXP58041M7H63
'SPFTRJPNBYMARVTGHPMJGANNWGE3RJ1S6KDCXQ0X
'SPFY12M55M6BJ4VRKJ58Q4N9TV0P3MPQG460N0FV
'SPGMF8QX45FMB20TAN8YHNYFMZAQWWAD0X2WNX6F
'SPGQ19RPJ60FD20MRRYJJ5WTPADHACJEGBWTH33M
'SPH3Z6V35EXH7M26HDFW7X6JVK40ET61FJWM7XBQ
'SPHC5BHG1PMB6AKH1CCVS1M7824Y4E01P17CJ4VS
'SPM97MPV98TWEKPXS8X5FTVHXY5CJQC24X30SFJV
'SPPW1RX5YQKVNFXHKWS27RBS1HAVZGH1HX5HWNA2
'SPVNN29HEMCFMF7GRHT0CNFT4XD7TV4ET59C9T5P
'SPW4KNVH5F7MVDFX1DV79DSC0TMWW90J19D6AJ3P
'SPW88YG19W24JK0ZWANM1BM609EMYN00J7EXXP2R
'SPXJ32593DZD5H0EHQJ0JHQ16Z6P9F8GA7AH8NKR
'SPY1BSPJZYBZH3K6QJA3XYS8GQKZDKSFDDQH7ZS5
'SPYCBWGFNH829GDE0F20ZDD30P58YZBJP18Z0ETF
'SPZ7PNAV29ZPTVYM9ZEAC2BY5R3C7P6Y451W8600
'SPZWKC7GN140C3GVPXHW4JXT2CD51HAFQRJ63MNK
'SPZX7DMGEHBBEN7FD7T3FZVS8P7WAYKB04531877))
