const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DB_DIR = path.join(ROOT, "data");
const DB_FILE = path.join(DB_DIR, "db.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const PRODUCT_CATALOG = [
  {"id":"A060103727","name":"GEMUK PTM SGX-NL MIN NLG1 2 PL2 12X0,5KG","uom":"BOTOL","volume":0.5,"segment":"RETAIL"},
  {"id":"A060103760","name":"GEMUK PTM SGX-NL MIN NLGI 2 PL1 16KG","uom":"PAIL","volume":16.0,"segment":"RETAIL"},
  {"id":"A060103765","name":"GEMUK PTM SGX-NL Min NLGI 2 DR 178KG","uom":"DRUM","volume":178.0,"segment":"RETAIL"},
  {"id":"A070101018","name":"FASTRON DIESEL 15W-40 API CI4, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070101040","name":"FASTRON DIESEL 15W-40 API CI4, 6 X 4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070101525","name":"FASTRON TECHNO 15W-50 API SL, 20 X 1 L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070101618","name":"FASTRON GOLD 5W-30 API SN/CF, 6 X 1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070101640","name":"FASTRON GOLD 5W-30 API SN/CF, 6 X 4 L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070102075","name":"MESRAN MIN 10W SE/CC DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070102175","name":"MESRAN Min 20W SE/CC DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070102275","name":"MESRAN Min 30 SE/CC DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070102324","name":"MESRAN MIN 40 SE/CC PL1 SCRTY, 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070102340","name":"MESRAN MIN 40 SE/CC PL1 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070102375","name":"MESRAN Min 40 SE/CC DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070102475","name":"MESRAN MIN 50 SE/CC DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070102615","name":"MESRAN SUPER 20W-50 SG/CD PL1 24X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070102641","name":"MESRAN SPR Min 20W-50 SG/CD PL1 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070102675","name":"MESRAN SPR Min 20W-50 SG/CD DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070102825","name":"MESRAN SPR Min 20W-50 SG/CD SCRTY 20x1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070102915","name":"MESRAN SUPER MOTOR 20W-50 SG/MA, 24X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070102919","name":"MESRAN SPR MTR 20W-50 SG/MA,24X0,8L RED","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070103330","name":"MESRAN B MIN 40 CD/SF PL 1 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070103340","name":"MESRAN B MIN 40 CD/SF PL1 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070103347","name":"MESRAN B Min 40 CD/SF PL1 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070103355","name":"MESRAN B MIN 40 CD/SF PL1 2X10L","uom":"BOTOL","volume":10.0,"segment":"RETAIL"},
  {"id":"A070103375","name":"MESRAN B MIN 40 CD/ SF DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070103475","name":"MESRAN B Min 50 CD/SF DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070103913","name":"MESRAN MARINE 2T SAE 20 TC-W3, 6X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070103915","name":"MESRAN MARINE 2T Min 20 TC-W3, 24 X 0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070103940","name":"MESRAN MARINE 2T MIN 20 TC-W3 PL3, 6X4 L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070103961","name":"MESRAN MARINE 2T Min 20 TC-W3, PAIL 18 L","uom":"PAIL","volume":18.0,"segment":"RETAIL"},
  {"id":"A070103975","name":"MESRAN MARINE 2T MIN 20 TC-W3, DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070104040","name":"MESRAN MARINE 4T MIN 10W-40 SL PL3,6X4 L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070105016","name":"PRIMA XP MIN 10W-40 API SL PL2 12X1","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070105140","name":"PRIMA XP Min 10W-40 SL/CF PL2 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070105918","name":"PRIMA XP 10W-40 API SM, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070105925","name":"PRIMA XP 10W-40 API SM, 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070105940","name":"PRIMA XP 10W-40 API SM, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070105975","name":"PRIMA XP 10W-40 API SM, DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070106018","name":"PRIMA XP 20W-50 API SL, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070106025","name":"PRIMA XP 20W-50 API SL, 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070106040","name":"PRIMA XP 20W-50 API SL, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070106075","name":"PRIMA XP 20W-50 API SL, DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070106716","name":"RORED EPA MIN 90 GL-4 PL1 12X1 L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070106740","name":"RORED EPA MIN 90 GL-4 PL1 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070106741","name":"RORED EPA Min 90 GL-4 PL1 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070106775","name":"RORED EPA Min 90 GL-4 DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070106840","name":"RORED EPA Min 140 GL-4 PL1 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070106841","name":"RORED EPA Min 140 GL-4 PL1 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070106875","name":"RORED EPA Min 140 GL-4 DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070107340","name":"RORED HDA MIN 90 GL-5 PL1 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070107341","name":"RORED HDA MIN 90 GL-5 PL1 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070107375","name":"RORED HDA Min 90 GL-5 DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070107440","name":"RORED HDA MIN 140 GL-5 PL1 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070107441","name":"RORED HDA MIN 140 GL-5 PL1 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070107475","name":"RORED HDA Min 140 GL-5 DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070107916","name":"RORED MTF,12 X 1 LTR","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070107918","name":"RORED MTF, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070108875","name":"MEDITRAN SV 40, DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070108975","name":"MEDITRAN SXV 15W-40, DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070109175","name":"MEDITRAN MIN 30 CC DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070109275","name":"MEDITRAN Min 40 CC DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070109375","name":"MEDITRAN Min 50 CC DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070109475","name":"MEDITRAN S MIN 10W CF-2/SF,DR 209 L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070109575","name":"MEDITRAN S.30 DR 209 L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070109625","name":"MEDITRAN S Min 40 CF-2/SF PL1 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070109641","name":"MEDITRAN S Min 40 CF-2/SF PL1 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070109655","name":"MEDITRAN S MIN 40 CF-2/SF PL1 2X10L","uom":"BOTOL","volume":10.0,"segment":"RETAIL"},
  {"id":"A070109661","name":"MEDITRAN S 40, PAIL 18 LTR","uom":"PAIL","volume":18.0,"segment":"RETAIL"},
  {"id":"A070109675","name":"MEDITRAN S Min 40 CF-2/SF DRUM 209 LTR","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070109775","name":"MEDITRAN S Min 50 CF-2/SF DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070110025","name":"MEDITRAN SC Min 15W-40 CF4 PL1 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070110041","name":"MEDITRAN SC Min 15W-40 CF4 PL1 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070110055","name":"MEDITRAN SC Min 15W-40 CF4 PL1 2X10L","uom":"BOTOL","volume":10.0,"segment":"RETAIL"},
  {"id":"A070110075","name":"MEDITRAN SC Min 15W-40 CF4 DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070110825","name":"MEDITRAN SX MIN 15W-40 CH4 PL1 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070110840","name":"MEDITRAN SX Min 15W-40 CH4 PL1 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070110855","name":"MEDITRAN SX Min 15W-40 CH4 PL1 2X10L","uom":"BOTOL","volume":10.0,"segment":"RETAIL"},
  {"id":"A070110875","name":"MEDITRAN SX MIN 15W-40 CH4 DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070110962","name":"MEDITRAN SX 15W-40 CI4 PLUS, PAIL 20 L","uom":"PAIL","volume":20.0,"segment":"RETAIL"},
  {"id":"A070111070","name":"MEDITRAN SX PLUS MIN 15W-40 CI4,DR 200L","uom":"DRUM","volume":200.0,"segment":"RETAIL"},
  {"id":"A070111418","name":"MEDITRAN SX BIO SAE 15W-40 CH4, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070111425","name":"MEDITRAN SX BIO SAE 15W-40 CH4, 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070111440","name":"MEDITRAN SX BIO SAE 15W-40 CH4, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070112913","name":"ENDURO 4T RACING 10W-40 API SL, 6X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070112918","name":"ENDURO 4T RACING 10W-40 API SL 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070113015","name":"ENDURO 4T MIN 20W-50 JASO MA PL1 24X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070113218","name":"ENDURO MATIC, 6 X 1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070113233","name":"ENDURO MATIC, 6 X 0.8 LTR","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070113315","name":"ENVIRO 2T Min 20 JASO FC PL1 24X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070113316","name":"ENVIRO 2T Min 20 JASO FC PL1 24X0,8L RED","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070113512","name":"ENDURO GEAR MATIC, 24 X 120ML","uom":"BOTOL","volume":0.12,"segment":"RETAIL"},
  {"id":"A070113918","name":"ENDURO 4TSPORT 5W-30 JASOMA2 APISL ,6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070114513","name":"ENDURO MATIC S 10W-30, 6X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070114618","name":"ENDURO MATIC V 10W-40 API SN 6X1","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070115125","name":"MESRANIA2T OB Min 30 JASO FB PL1 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070115175","name":"MESRANIA2T OB Min 30 JASO FB DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070115425","name":"MESRANIA2T SPR Min 20 TC-W PL1 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070115475","name":"MESRANIA2T SPR Min 20 TC-W DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070115725","name":"MESRANIA2T SPR X MIN 20 TC-W3 PL1 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070132018","name":"PERTAMINA ATF  ISOVG 220 PL1, 6 X 1","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070132025","name":"PERTAMINA ATF ISOVG 220 PL1 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070132161","name":"PERTAMINA 2T SUPER OUTBOND, PAIL 18L","uom":"PAIL","volume":18.0,"segment":"RETAIL"},
  {"id":"A070135175","name":"TURALIK 43 Min 32 DRUM 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070135375","name":"TURALIK 48 MIN 46 DRUM 209 L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070135475","name":"TURALIK 52 MIN 68 DRUM 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070135575","name":"TURALIK 69 Min 100 DRUM 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070156103","name":"PERTAMINA BRAKE FLUID DOT 3 PLUS, 24X300","uom":"BOTOL","volume":0.3,"segment":"RETAIL"},
  {"id":"A070156518","name":"PERTAMINA COOLANT 5% CONCENTRATE, 6X1 L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070156540","name":"PERTAMINA COOLANT 5% CONCENTRATE, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070156541","name":"PERTAMINA COOLANT 5%, 6X4L RED","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070156618","name":"PERTAMINA COOLANT 30% CONCENTRATE, 6X1 L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070156640","name":"PERTAMINA COOLANT 30% CONCENTRATE, 6X4 L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070156642","name":"PERTAMINA COOLANT 30%, 6X4L RED","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070173783","name":"SPREEZE, 6x400mL","uom":"BOTOL","volume":0.4,"segment":"RETAIL"},
  {"id":"A070200025","name":"FASTRON TECHNO 10W-40 API SM, 20 X 1 L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070200618","name":"FASTRON TECHNO 10W-40 API SN, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070200625","name":"FASTRON TECHNO 10W-40 API SN, 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070200640","name":"FASTRON TECHNO 10W-40 API SN, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070200675","name":"FASTRON TECHNO 10W-40 API SN, DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070201318","name":"FASTRON GOLD SAE 5W-40 SN/CF ACEA, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070201340","name":"FASTRON GOLD SAE 5W-40 SN/CF ACEA, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070201618","name":"FASTRON GOLD SAE 0W-20 SN/GF-5, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070201640","name":"FASTRON GOLD SAE 0W-20 SN/GF-5, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070201718","name":"FASTRON TECHNO 15W-50 API SN, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070201725","name":"FASTRON TECHNO 15W-50 API SN, 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070201740","name":"FASTRON TECHNO 15W-50 API SN, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070201818","name":"FASTRON TECHNO 10W-30 API SN/GF5, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070201825","name":"FASTRON TECHNO 10W-30 SN/GF5, 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070201840","name":"FASTRON TECHNO 10W-30 SNGF5, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070201918","name":"FASTRON PLATINUM RACING 10W-60 SN, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070201940","name":"FASTRON PLATINUM RACING 10W-60, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070202118","name":"FASTRON GOLD 5W-30 API SN/CF ACEA, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070202140","name":"FASTRON GOLD 5W-30 API SN/CF ACEA, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070202218","name":"FASTRON PLATINUM FULLY SYN 0W-40 SN,6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070202240","name":"FASTRON PLATINUM FULLY SYN 0W-40 SN,6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070202325","name":"FASTRON TECHNO 10W-40 SN LAMBO, 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070202340","name":"FASTRON TECHNO 10W-40 SN LAMBO, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070202416","name":"FASTRON DIESEL 15W-40 CI4 (LAM), 12X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070202425","name":"FASTRON DIESEL 15W-40 CI4 (LAM), 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070202440","name":"FASTRON DIESEL 15W-40 CI4 (LAM), 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070202640","name":"FASTRON DIESEL GOLD 5W-30 SN/CJ4, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070205025","name":"RORED EPA MIN 90 GL-4  PL1 20X1 L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070205518","name":"FASTRON DIESEL 15W-40 API CI-4(LAM),6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070206175","name":"TURALIK V 52","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070206475","name":"TURALIK V 69","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070207413","name":"ENDURO 4T 20W-50 API SL JASO MA, 6X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070207415","name":"ENDURO 4T 20W-50 API SL JASO MA, 24X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070207418","name":"ENDURO 4T 20W-50 API SL JASO MA, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070207425","name":"ENDURO 4T 20W-50 API SL JASO MA, 20X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070207513","name":"ENDURO MATIC G 20W-40 SL/JASO MB, 6X0,8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070207518","name":"ENDURO MATIC G 20W-40 SL/JASO MB, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070209040","name":"FASTRON TECHNO 15W-40 API SN/CF, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070209119","name":"FASTRON ECOGREEN 5W-30 API SN, 6X3,5L","uom":"BOTOL","volume":3.5,"segment":"RETAIL"},
  {"id":"A070209219","name":"FASTRON ECOGREEN 0W-20 API SN, 6X3,5L","uom":"BOTOL","volume":3.5,"segment":"RETAIL"},
  {"id":"A070209918","name":"FASTRON TECHNO 10W-40 API SN (LAM), 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070113313","name":"Enviro 2T Min 20 JASO FC 6 x 0.8L","uom":"BOTOL","volume":0.8,"segment":"RETAIL"},
  {"id":"A070173780","name":"SPREEZE, 6x250mL","uom":"BOTOL","volume":0.25,"segment":"RETAIL"},
  {"id":"A070101075","name":"FASTRON DIESEL 15W-40 CI 4, DRUM 209 L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070106340","name":"RORED HDA 80W-90 GL5, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070106345","name":"RORED HDA 80W-90 GL5, 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070106440","name":"RORED EPA 80W-90 GL4, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070106445","name":"RORED EPA 80W-90 GL4, 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070107840","name":"RORED HDA 85W-140 GL5, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070107846","name":"RORED HDA 85W-140 GL5, 4X5L","uom":"BOTOL","volume":5.0,"segment":"RETAIL"},
  {"id":"A070111055","name":"MEDITRAN SX PLUS 15W-40 CI4, 2X10L","uom":"BOTOL","volume":10.0,"segment":"RETAIL"},
  {"id":"A070111455","name":"MEDITRAN SX BIO SAE 15W-40 CH4, 2X10L","uom":"BOTOL","volume":10.0,"segment":"RETAIL"},
  {"id":"A070113375","name":"ENVIRO 2T Min 20 JASO FC DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070115761","name":"MESRANIA 2T SUPER X,PAIL 18 LTR","uom":"PAIL","volume":18.0,"segment":"RETAIL"},
  {"id":"A070115775","name":"MESRANIA2T SPR X Min 20 TC-W3 DR 209L","uom":"DRUM","volume":209.0,"segment":"RETAIL"},
  {"id":"A070156525","name":"PERTAMINA COOLANT 5%, 20X1 L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070156625","name":"PERTAMINA COOLANT 30%, 20X1 L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070202740","name":"FASTRON DIESEL TECHNO 10W-40 SL/CI4,6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070206940","name":"FASTRON DIESEL TECHNO 10W-30 SL/CI4, 6X4L","uom":"BOTOL","volume":4.0,"segment":"RETAIL"},
  {"id":"A070209018","name":"FASTRON TECHNO 15W-40 API SN/CF, 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070209118","name":"FASTRON ECOGREEN 5W-30 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070209218","name":"FASTRON ECOGREEN 0W-20 6X1L","uom":"BOTOL","volume":1.0,"segment":"RETAIL"},
  {"id":"A070111270","name":"MEDITRAN SX 20W-50 API CH-4, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070112370","name":"MEDITRAN SXCI4 PLUS ELDI, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070112670","name":"MEDITRAN SX ULTRA 15W-40 CI4 PLUS, 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070110661","name":"MEDITRAN SZ SAE 10W-40 PAIL 18 LITER","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070134375","name":"TRANSLIK HD 10W Min 10W DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070134075","name":"TRANSLIK HD 30 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070134175","name":"TRANSLIK HD 50 MIN 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070134275","name":"TRANSLIK HD 60 Min 60 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070134470","name":"TRANSLIK FD 1 SAE 60,DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070132070","name":"PERTAMINA ATF, ISO VG 220 DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070108375","name":"RORED EPA MIN 80W GL-4, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070106975","name":"RORED EPA Min 80W-90 GL-4 DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070107575","name":"RORED HDA MIN 80W-90 GL-5 DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070107775","name":"RORED HDA MIN 85W-90 GL-5 DR 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070107875","name":"RORED HDA MIN 85W-140 GL-5 DR 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070107975","name":"RORED MTF MIN 80W-90 GL-4 PL1 DR 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070112575","name":"DILOKA 448 X MIN 40,DR 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070124375","name":"MEDRIPAL 307, DR 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122975","name":"MEDRIPAL 311 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123075","name":"MEDRIPAL 312 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123175","name":"MEDRIPAL 320 MIN 30,DR @ 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123275","name":"MEDRIPAL 330 MIN 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123475","name":"MEDRIPAL 408 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123575","name":"MEDRIPAL 411 MIN 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123675","name":"MEDRIPAL 412 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123775","name":"MEDRIPAL 420 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123875","name":"MEDRIPAL 430 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123975","name":"MEDRIPAL 440 MIN 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070124075","name":"MEDRIPAL 512 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070124175","name":"MEDRIPAL 540 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070124275","name":"MEDRIPAL 570 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070124575","name":"MEDRIPAL 5040, 209L,DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125075","name":"SALYX 308 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125175","name":"SALYX 312 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125475","name":"SALYX 330 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125775","name":"SALYX 412 MIN 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125875","name":"SALYX 415 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125975","name":"SALYX 420 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070126075","name":"SALYX 430 MIN 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070126175","name":"SALYX 440 MIN 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070126775","name":"SALYX 570 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070110275","name":"MEDITRAN SMX 40 MIN 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070110375","name":"MEDITRAN SMX 15W-40 DR 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070111575","name":"MEDITRAN P 10W MIN 10W DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070111775","name":"MEDITRAN P 40 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070112475","name":"MEDITRAN GEO 15W-40 API CF DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070116071","name":"NG LUBE 30 Min 30 DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070116171","name":"NG LUBE 40 Min 40 DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070116370","name":"NG LUBE 40 LONG LIFE API CF, 200L/DR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070116270","name":"NG LUBE 40 ASHLESS,DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146070","name":"GC LUBE M 32, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146170","name":"GC LUBE M 46, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146270","name":"GC LUBE M 68, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146370","name":"GC LUBE M 100, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146470","name":"GC LUBE M 150, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146570","name":"GC LUBE SYN 100, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146670","name":"GC LUBE SYN 150, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070147270","name":"GC LUBE SYN PO 150, 200L,DRUM","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146161","name":"GC LUBE M 46 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070146261","name":"GC LUBE M 68 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070146361","name":"GC LUBE M 100 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070146561","name":"GC LUBE SYN 100 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070147163","name":"GC LUBE SYN PO 32, PAIL 18,9L,PAIL","uom":"PL","volume":18.9,"segment":"INDUSTRY"},
  {"id":"A070146963","name":"GC LUBE SYN PO 46, PAIL 18,9L  ,PAIL","uom":"PL","volume":18.9,"segment":"INDUSTRY"},
  {"id":"A070180170","name":"MASRI FLG 68, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070131770","name":"MASRI FLG 100, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070130470","name":"MASRI FLG 150, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070130070","name":"MASRI FLG 220,DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070130270","name":"MASRI FLG 320, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070130170","name":"MASRI FLG 460, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070130370","name":"MASRI FLG 680, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070130575","name":"MASRI RG 68 Min 68 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070130675","name":"MASRI RG 100 Min 100 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070130775","name":"MASRI RG 150 Min 150 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070130875","name":"MASRI RG 220 Min 220 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070130975","name":"MASRI RG 320 Min 320 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070131075","name":"MASRI RG 460 Min 460 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070131175","name":"MASRI RG 680 Min 680 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070131275","name":"MASRI RG 1000,DRUM 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070131375","name":"MASRI SMG 5, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070131475","name":"MASRI SMG 6,DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070180470","name":"MASRI SYN HD 320, DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070131570","name":"MASRI SYN HD 680 , DRUM 200 LTR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070180766","name":"MASRI TXG 5, DR 180 KG,DRUM","uom":"DR","volume":180.0,"segment":"INDUSTRY"},
  {"id":"A070133070","name":"STEELO B 100 DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070133170","name":"STEELO B 220, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070133470","name":"STEELO B 460, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070130861","name":"MASRI RG 220 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070135075","name":"TURALIK 41 Min 22 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070135275","name":"TURALIK 45 Min 37 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070137270","name":"TURALIK XT 46, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070137370","name":"TURALIK XT 68, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070136175","name":"TURALIK C 10 Min 10 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070136275","name":"TURALIK C 22 Min 22 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070136675","name":"TURALIK C 68 Min 68 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070136775","name":"TURALIK C 100 MIN 100 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070136875","name":"TURALIK C 150 Min 150 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070137075","name":"TURALIK C 220 Min 220 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070137175","name":"TURALIK C 320 Min 320 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070204670","name":"TURALIK CX 46, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070204870","name":"TURALIK CX 100, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070204570","name":"TURALIK T 15, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070204170","name":"TURALIK T 32, drum 200 liter","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070204270","name":"TURALIK T 46, drum 200 liter","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070204370","name":"TURALIK T 68, drum 200 liter","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070204470","name":"TURALIK T 100, drum 200 liter","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070134970","name":"TURALIK HE ISO VG 32 DRUM 200 LITER","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070135970","name":"TURALIK HE ISO VG 46 DRUM 200 LITER","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070135870","name":"TURALIK HE ISO VG 68 DRUM 200 LITER","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070135461","name":"TURALIK 52,PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070137571","name":"TURBOLUBE 32 Min 32 DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070137771","name":"TURBOLUBE 46 MIN 46 DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070137970","name":"TURBOLUBE 68 Min 68 DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070138170","name":"TURBOLUBE 100 Min 100 DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070138370","name":"TURBOLUBE 220,DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070138270","name":"TURBOLUBE 150 DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070138470","name":"TURBOLUBE XT 32, DRUM 200 LT","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070138570","name":"TURBOLUBE XT 46, DRUM 200 LT","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070138670","name":"TURBOLUBE XT 68, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070137961","name":"TURBOLUBE 68 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070113775","name":"GANDAR 800 Min 460 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122375","name":"MEDRIPAL 4 Min 150 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122576","name":"MEDRIPAL 5 MIN 220 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122775","name":"MEDRIPAL 6 Min 320 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118275","name":"SEBANA P 22 Min 22 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118375","name":"SEBANA P 32 Min 32 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118475","name":"SEBANA P 46 Min 46 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118575","name":"SEBANA P 68 MIN 68 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118675","name":"SEBANA P 100 Min 100 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118775","name":"SEBANA P 150 Min 150 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118975","name":"SEBANA P 220 Min 220 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070119075","name":"SEBANA P 320 Min 320 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070119175","name":"SEBANA P 460 Min 460 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070120075","name":"SILINAP 160M Min 460 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070120175","name":"SILINAP 220M Min 1000 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070120275","name":"SILINAP 280M MIN 1500 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070114175","name":"KOMPEN 32 MIN 32 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070114275","name":"KOMPEN 46 MIN 46 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070114375","name":"KOMPEN 68 Min 68 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070114475","name":"KOMPEN 100 MIN 100 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070177262","name":"REFRO PE 46 PAIL 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070177362","name":"REFRO PE 68 PAIL 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070121170","name":"TERMO 32, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070121275","name":"TERMO 150 Min 150 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070121375","name":"TERMO XT 32, DRUM 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070170061","name":"KNITTO TX - 22 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070176070","name":"MAX COOL WS 01, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070176170","name":"MAX COOL WS 01 EP, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070176470","name":"PERTAMINA MAXCOOL HD 01,DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070176061","name":"PERTAMINA MAXCOOL WS 01 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070176161","name":"PERTAMINA MAXCOOL WS 01 EP PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070132970","name":"PERTAMINA SLIDE WAY DRUM 200 LITER","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070133570","name":"PERTAMINA SLIDE WAY 220 DRUM 200 LITER","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070133561","name":"PERTAMINA SLIDEWAY 220","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070172070","name":"RUBBSOL 30, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070173070","name":"RUSGUARD LUBE 10, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070156170","name":"TRAFOLUBE A, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070182074","name":"PERTAMINA FG-HO 46, DR 208L,DRUM","uom":"DR","volume":208.0,"segment":"INDUSTRY"},
  {"id":"A070182064","name":"PERTAMINA FG-HO 46,PAIL 19L","uom":"PL","volume":19.0,"segment":"INDUSTRY"},
  {"id":"A070182164","name":"PERTAMINA FG-GO 150,PAIL 19L","uom":"PL","volume":19.0,"segment":"INDUSTRY"},
  {"id":"A070182264","name":"PERTAMINA FG-GO 220,PAIL 19L","uom":"PL","volume":19.0,"segment":"INDUSTRY"},
  {"id":"A070182464","name":"PERTAMINA FG-GO 460,PAIL 19L","uom":"PL","volume":19.0,"segment":"INDUSTRY"},
  {"id":"A070184070","name":"PERTAMINA TRACTOR OIL SAE 10W-30,DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070157070","name":"PERTAMINA HD COOLANT EG, 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070157065","name":"PERTAMINA HD COOLANT EG,, CAN 25L","uom":"PL","volume":25.0,"segment":"INDUSTRY"},
  {"id":"A070156970","name":"PERTAMINA HD COOLANT PG DRUM 200 LITER","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070156965","name":"PERTAMINA HD COOLANT PG CAN 25 LITER","uom":"PL","volume":25.0,"segment":"INDUSTRY"},
  {"id":"A070156870","name":"PERTAMINA HD COOLANT WB, 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070156865","name":"PERTAMINA HD COOLANT WB, 25L,CAN","uom":"PL","volume":25.0,"segment":"INDUSTRY"},
  {"id":"A070157570","name":"PERTAMINA HD TIRE COOLANT, 200L,DRUM","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070157565","name":"PERTAMINA HD TIRE COOLANT, 25L,CAN","uom":"PL","volume":25.0,"segment":"INDUSTRY"},
  {"id":"A070179070","name":"PERTAMINA GRISKLIN, 200L,DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070179067","name":"PERTAMINA GRISKLIN, 30L,CAN 30L","uom":"PL","volume":30.0,"segment":"INDUSTRY"},
  {"id":"A060102565","name":"GREASE PTM EPX-NL 1 DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060102665","name":"GREASE PTM EPX-NL 2 DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060105065","name":"GREASE PTM X-NL 2 DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060105165","name":"GREASE PTM X-NL 3 DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060106065","name":"GREASE WR-NL DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060102865","name":"GREASE SUPER EPX-2 DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060103065","name":"GREASE HDX-2 DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060104065","name":"GREASE SUPER HDX-2 DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060130065","name":"GREASE LI CX-2 DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060102560","name":"GREASE PTM EPX-NL 1 PAIL 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A060102660","name":"GREASE PTM EPX-NL 2 PAIL 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A060105160","name":"GREASE PTM X-NL 3 PAIL 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A060106060","name":"GREASE WR-NL PAIL 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A060102860","name":"GREASE SUPER EPX-2 PAIL 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A060130060","name":"GREASE LI CX-2 PAIL 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A060130160","name":"GREASE PERTAMINA LI CX 3, PAIL 16","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A060105560","name":"PERTAMINA GREASE EM2,PAIL 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A070179570","name":"PERTADEM B-02, 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070215065","name":"PERTASURF, 25L","uom":"PL","volume":25.0,"segment":"INDUSTRY"},
  {"id":"A070176870","name":"PERTAFLOW 07, DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070112070","name":"MEDITRAN E 40, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070111261","name":"MEDITRAN SX 20W-50 CH4 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070132370","name":"PERTAMINA ATF DEXTRON VI, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070107075","name":"RORED EPA 85W-90 GL4, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123375","name":"MEDRIPAL 340,DRUM @ 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070124475","name":"MEDRIPAL 450 MIN 40, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125275","name":"SALYX 315 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125375","name":"SALYX 320 MIN 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125575","name":"SALYX 340 MIN 340 DR 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070125675","name":"SALYX 408 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070126275","name":"SALYX 450 MIN 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070126375","name":"SALYX 530 MIN 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070126475","name":"SALYX 540 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070126575","name":"SALYX 550 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127175","name":"SALYX C 430,DRUM 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127275","name":"SALYX C 435,DRUM 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127475","name":"SALYX DF 312 , DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127775","name":"SALYX DF 408, DRUM 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127875","name":"SALYX DF 412 , DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127575","name":"SALYX DF 415,DRUM 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127975","name":"SALYX DF 420 , DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127675","name":"SALYX DF 430,DRUM 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070111675","name":"MEDITRAN P 30 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070111875","name":"MEDITRAN P 50 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070116470","name":"NG LUBE 30 ASHLESS, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070116570","name":"NG LUBE HSG SAE 40 API CF, DR 200L,DRUM","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146801","name":"GC LUBE M 220 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146770","name":"GC LUBE SYN 68, DRUM 200 LTR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146061","name":"GC LUBE M 32 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070146461","name":"GC LUBE M 150 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070146761","name":"GC LUBE SYN 68 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070146661","name":"GC LUBE SYN 150 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070147170","name":"GC LUBE SYN PO 32, 200L,DRUM","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070146970","name":"GC LUBE SYN PO 46, 200L,DRUM","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070147070","name":"GC LUBE SYN PO 68, 200L,DRUM","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070147063","name":"GC LUBE SYN PO 68, PAIL 18,9L,PAIL","uom":"PL","volume":18.9,"segment":"INDUSTRY"},
  {"id":"A070147263","name":"GC LUBE SYN PO 150, PAIL 18,9L,PAIL","uom":"PL","volume":18.9,"segment":"INDUSTRY"},
  {"id":"A070180275","name":"MASRI SMG 2, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070180375","name":"MASRI SMG 3, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070131975","name":"MASRI SMG 9, DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070133270","name":"STEELO B 320, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070133370","name":"STEELO B 680 DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070130761","name":"MASRI RG 150 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070136075","name":"TURALIK C 5 Min 5 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070136375","name":"TURALIK C 32,DRUM @ 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070204070","name":"TURALIK T 22 drum 200 liter","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070138161","name":"TURBOLUBE 100 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070138461","name":"TURBOLUBE XT 32 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070138661","name":"TURBOLUBE XT 68 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070122075","name":"MEDRIPAL 2 Min 68 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122175","name":"MEDRIPAL 3 Min 100 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118175","name":"SEBANA P 9 Min 9 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070114075","name":"KOMPEN 15 Min 15 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070114361","name":"KOMPEN 68 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070177162","name":"REFRO PE 32 PAIL 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070177462","name":"REFRO PE 100 PAIL 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070170070","name":"KNITTO TX 22, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070176270","name":"MAX COOL SM 01, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070176370","name":"MAX COOL SYN 01, DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070176261","name":"PERTAMINA MAXCOOL SM 01 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070176361","name":"PERTAMINA MAXCOOL SYN 01 PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070132861","name":"PERTAMINA MAXCOOL NC PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070176461","name":"PERTAMINA MAXCOOL HD 01,PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070132961","name":"PERTAMINA SLIDE WAY PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070158070","name":"PERTAMINA RINSOL, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070182364","name":"PERTAMINA FG-GO 320,PAIL 19L","uom":"PL","volume":19.0,"segment":"INDUSTRY"},
  {"id":"A060105565","name":"PERTAMINA GREASE EM2,DRUM 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060105060","name":"GREASE PTM X-NL 2 PAIL 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A070109101","name":"MEDITRAN 30 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109201","name":"MEDITRAN 40 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109301","name":"MEDITRAN 50 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109401","name":"MEDITRAN S10W BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109501","name":"MEDITRAN S30 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109601","name":"MEDITRAN S40 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109701","name":"MEDITRAN S50 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070110001","name":"MEDITRAN SC 15W-40 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070110801","name":"MEDITRAN SX 15W-40 CH4 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111201","name":"MEDITRAN SX 20W-50 CH4 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111001","name":"MEDITRAN SX PLUS 15W-40 CI4 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070112301","name":"MEDITRAN SX CI4 PLUS ELDI BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070112601","name":"MEDITRAN SX ULTRA 15W-40 CI4 PLUS BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070134301","name":"TRANSLIK HD 10W BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070134001","name":"TRANSLIK HD 30 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070134101","name":"TRANSLIK HD 50 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070134201","name":"TRANSLIK HD 60 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070132001","name":"PERTAMINA ATF BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070108301","name":"RORED EPA 80W BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070106701","name":"RORED EPA 90 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070106801","name":"RORED EPA 140 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070106901","name":"RORED EPA 80W-90 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107301","name":"RORED HDA 90 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107401","name":"RORED HDA 140 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107501","name":"RORED HDA 80W-90 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107701","name":"RORED HDA 85W-90 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107801","name":"RORED HDA 85W -140 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107901","name":"RORED MTF 80W-90 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070112501","name":"DILOKA 448 X BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070124301","name":"MEDRIPAL 307 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070122901","name":"MEDRIPAL 311 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123001","name":"MEDRIPAL 312 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123101","name":"MEDRIPAL 320 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123201","name":"MEDRIPAL 330 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123401","name":"MEDRIPAL 408 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123501","name":"MEDRIPAL 411 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123601","name":"MEDRIPAL 412 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123701","name":"MEDRIPAL 420 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123801","name":"MEDRIPAL 430 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123901","name":"MEDRIPAL 440 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070124001","name":"MEDRIPAL 512 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070124101","name":"MEDRIPAL 540 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070124201","name":"MEDRIPAL 570 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125001","name":"SALYX 308 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125101","name":"SALYX 312 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125401","name":"SALYX 330 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125701","name":"SALYX 412 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125801","name":"SALYX 415 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125901","name":"SALYX 420 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070126001","name":"SALYX 430 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070126101","name":"SALYX 440 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070126701","name":"SALYX 570 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070110201","name":"MEDITRAN SMX-40 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070110301","name":"MEDITRAN SMX 15W-40 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111501","name":"MEDITRAN P10W BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111701","name":"MEDITRAN P40 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070112401","name":"MEDITRAN GEO 15W-40 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070116001","name":"NG-LUBE 30 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070116101","name":"NG-LUBE 40 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070116301","name":"NG-LUBE LONG LIFE SAE 40 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070116201","name":"NG LUBE 40 ASHLESS BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146001","name":"GC LUBE M 32 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146101","name":"GC LUBE M 46 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146201","name":"GC LUBE M 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146301","name":"GC LUBE M 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146401","name":"GC LUBE M 150 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146501","name":"GC LUBE SYN 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146601","name":"GC LUBE SYN 150 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070180101","name":"MASRI FLG 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070131701","name":"MASRI FLG 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130401","name":"MASRI FLG 150 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130001","name":"MASRI FLG 220 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130201","name":"MASRI FLG 320 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130101","name":"MASRI FLG 460 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130301","name":"MASRI FLG 680 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130501","name":"MASRI RG 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130601","name":"MASRI RG 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130701","name":"MASRI RG 150 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130801","name":"MASRI RG 220 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070130901","name":"MASRI RG 320 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070131001","name":"MASRI RG 460 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070131101","name":"MASRI RG 680 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070131201","name":"MASRI RG 1000 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070131301","name":"MASRI SMG 5 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070131401","name":"MASRI SMG 6 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070180401","name":"MASRI SYN HD 320 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070133001","name":"STEELO B 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070133101","name":"STEELO B 220 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070133401","name":"STEELO B 460 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070135001","name":"TURALIK 41 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070135101","name":"TURALIK 43 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070135201","name":"TURALIK 45 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070135301","name":"TURALIK 48 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070135401","name":"TURALIK 52 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070135501","name":"TURALIK 69 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070137201","name":"TURALIK XT 46 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070137301","name":"TURALIK XT 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136101","name":"TURALIK C 10 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136201","name":"TURALIK C 22 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136601","name":"TURALIK C 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136701","name":"TURALIK C 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136801","name":"TURALIK C 150 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070137001","name":"TURALIK C 220 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070137101","name":"TURALIK C 320 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070204601","name":"TURALIK CX 46 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070204801","name":"TURALIK CX 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070204501","name":"TURALIK T 15 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070204101","name":"TURALIK T 32 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070204201","name":"TURALIK T 46 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070204301","name":"TURALIK T 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070204401","name":"TURALIK T 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070137501","name":"TURBOLUBE 32 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070137701","name":"TURBOLUBE 46 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070137901","name":"TURBOLUBE 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070138101","name":"TURBOLUBE 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070138201","name":"TURBOLUBE 150 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070138301","name":"TURBOLUBE 220 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070138401","name":"TURBOLUBE XT 32 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070138501","name":"TURBOLUBE XT 46 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070138601","name":"TURBOLUBE XT 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113701","name":"GANDAR 800 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070122301","name":"MEDRIPAL 4 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070122501","name":"MEDRIPAL 5 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070122701","name":"MEDRIPAL 6 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118201","name":"SEBANA P22 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118301","name":"SEBANA P32 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118401","name":"SEBANA P46 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118501","name":"SEBANA P68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118601","name":"SEBANA P100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118701","name":"SEBANA P150 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118901","name":"SEBANA P220 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119001","name":"SEBANA P320 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119101","name":"SEBANA P460 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070120001","name":"SILINAP 160M BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070120101","name":"SILINAP 220M BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070120201","name":"SILINAP 280M BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070114101","name":"KOMPEN 32 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070114201","name":"KOMPEN 46 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070114301","name":"KOMPEN 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070114401","name":"KOMPEN 100 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070121101","name":"TERMO 32 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070121201","name":"TERMO 150 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070121301","name":"TERMO XT 32 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070176001","name":"PERTAMINA MAXCOOL WS 01 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070176101","name":"PERTAMINA MAXCOOL WS 01 EP BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070172001","name":"RUBBSOL 30 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070179101","name":"RUBBSOL NAFRA 30, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070173001","name":"RUSGUARD LUBE 10 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070157001","name":"PERTAMINA HD COOLANT EG, BULK,BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107001","name":"RORED EPA 85W-90 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123301","name":"MEDRIPAL 340 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070124401","name":"MEDRIPAL 450 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125201","name":"SALYX 315 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125301","name":"SALYX 320 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125501","name":"SALYX 340 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125601","name":"SALYX 408 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070126201","name":"SALYX 450 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070126301","name":"SALYX 530 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070126401","name":"SALYX 540 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070126501","name":"SALYX 550 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070127101","name":"SALYX C 430 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070127201","name":"SALYX C 435 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070127401","name":"SALYX DF 312 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070127701","name":"SALYX DF 408 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070127801","name":"SALYX DF 412 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070127501","name":"SALYX DF 415 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070127901","name":"SALYX DF 420 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070127601","name":"SALYX DF 430 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111601","name":"MEDITRAN P30 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111801","name":"MEDITRAN P50 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070116401","name":"NG LUBE 30 ASHLESS BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146701","name":"GC LUBE SYN 68 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070180201","name":"MASRI SMG 2 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070180301","name":"MASRI SMG 3 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070131901","name":"MASRI SMG 9 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070133201","name":"STEELO B 320 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070133301","name":"STEELO B 680 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136001","name":"TURALIK C 5 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136301","name":"TURALIK C 32 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070204001","name":"TURALIK T 22 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070122001","name":"MEDRIPAL 2 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070122101","name":"MEDRIPAL 3 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118101","name":"SEBANA P9 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070114001","name":"KOMPEN 15 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070170001","name":"KNITTO TX - 22 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070176201","name":"PERTAMINA MAX COOL SM 01 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070176301","name":"PERTAMINA MAXCOOL SYN 01 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070158001","name":"PERTAMINA RINSOL BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060100065","name":"GEMUK PERTAMINA 2,DRUM 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060100165","name":"GEMUK PERTAMINA 2 NL,DRUM 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060100265","name":"GEMUK PERTAMINA 3,DRUM 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060100268","name":"GEMUK PERTAMINA 3, DR=178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060100365","name":"GEMUK PERTAMINA 3 NL,DRUM 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060101565","name":"GEMUK PERTAMINA EP 1,DRUM 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060101665","name":"GEMUK PERTAMINA EP 1 NL,DRUM 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060101765","name":"GEMUK PERTAMINA EP 2,DRUM 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060101865","name":"GEMUK PERTAMINA EP 2 NL,DRUM 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060105105","name":"GEMUK PERTAMINA X-NL 3 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A070106575","name":"RORED EP- 90, 209L/DR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070106576","name":"RORED EP A-90, 209 LTR/DRUM","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070106675","name":"RORED EP-140,  209 L/DR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070107070","name":"RORED EPA MIN 85W-90 GL-4, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070107175","name":"RORED HD 90,DRUM 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070107275","name":"RORED HD 140,DRUM 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070107675","name":"RORED HDA  85W-140,DRUM  209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070107791","name":"RORED HDA MIN 85W-90 GL-5, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070107891","name":"RORED HDA MIN 85W-140 GL-5, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070108201","name":"DAIHATSU MANUAL TRANSMISSION FLUID","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070108370","name":"RORED HD-A XT 85W-140, DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070108870","name":"MEDITRAN SV 40, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070108970","name":"MEDITRAN SXV 15W-40, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070109075","name":"MEDITRAN 20W-20,DRUM 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070109470","name":"MEDITRAN S MIN 10W CF-2/SF, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070109570","name":"MEDITRAN S MIN 30 CF-2/SF DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070109670","name":"MEDITRAN S.40,DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070109676","name":"MEDITRAN S-40 SMX,DR OF 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070109770","name":"MEDITRAN S Min 50, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070110070","name":"MEDITRAN SC MIN 15W-40, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070110175","name":"MEDITRAN SMX, DRUM 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070110861","name":"MEDITRAN SX 15W-40 API CH-4, PAIL 18 L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070110870","name":"MEDITRAN SX MIN 15W-40 CH4, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070110970","name":"MEDITRAN SX MIN 15W-40 CI4 DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070110971","name":"MEDITRAN SX 15W-40 CI4+ SEWATAMA; DR200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070111091","name":"MEDITRAN SX CI4 (BO GROUP II),IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070111171","name":"MEDITRAN SX 20W-50 API CG-4, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070111175","name":"MEDITRAN SX 20W-50 API CG-4, DR 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070111275","name":"MEDITRAN SX 20W-50 API CH-4, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070111375","name":"MEDITRAN 20W50 CF/SF, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070112662","name":"MEDITRAN SX ULTRA 15W-40 CI4, PAIL 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070112862","name":"MEDITRAN HD PLUS 20W-50 API CF-4/ SG, BG 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070113875","name":"GANDAR 800 X, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070114370","name":"KOMPEN 68 MIN 68, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070115591","name":"MESRANIA 2T SPR SAE 20 JASO FB,IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070116070","name":"NG LUBE 30,DRUM 200 LTR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070117075","name":"SEBANA 90 Min 100 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070117175","name":"SEBANA 120 Min 220 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070117275","name":"SEBANA 170 Min 320 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070117370","name":"SEBANA 300,DRUM 200 LTR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070117375","name":"SEBANA 300 Min 680 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118470","name":"SEBANA P 46 Min 46 DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070118570","name":"SEBANA P 68 Min 68 DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070118770","name":"SEBANA P 150 MIN 150 DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070118875","name":"SEBANA P 150 MIN 150 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070118876","name":"SEBANA P 150 MIN 150 DRUM 209 L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070119675","name":"SEBANA PC 100B, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070119775","name":"SEBANA PC 32, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070120170","name":"SILINAP 220 M,DRUM 200 LTR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070121075","name":"TERMO 22 Min 22 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070121175","name":"TERMO 32, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122076","name":"MEDRIPAL 2, 209 LTR/DR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122170","name":"MEDRIPAL 3 DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070122370","name":"MEDRIPAL 4 DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070122575","name":"MEDRIPAL 5,DRUM 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122675","name":"MEDRIPAL 5D Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122875","name":"MEDRIPAL 308 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070123670","name":"MEDRIPAL 412 DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070126461","name":"SALYX 540, PAIL 18 L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070126875","name":"SALYX 412 ( PELNI ), DRUM 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127075","name":"SALYX 415 ( TNI AL ), DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070127375","name":"SALYX TP 420 MIN 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070130561","name":"MASRI RG 68, PAIL 18 L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070130791","name":"MASRI RG 150 MIN 150, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070130862","name":"MASRI RG 220, PAIL 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070130891","name":"MASRI RG 220 MIN 220, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131161","name":"MASRI RG 680, PAIL 18 L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070131561","name":"MASRI SYN HD 680, PAIL 18 L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070131575","name":"MASRI SYN HD 680,DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070131651","name":"MASRI SYN HD 680, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070131801","name":"MASRI RG 460 (KS) MIN 460, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070132262","name":"PERTAMINA ATF DEXTRON III H, PAIL 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070132270","name":"PERTAMINA ATF DEXRON III H, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070132470","name":"PERTAMINA ATF DEXTRON III, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070132661","name":"PERTAMINA MWF 09, PAIL 18 L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070132670","name":"PERTAMINA MWF 09, DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070132761","name":"PERTAMINA PMWF 09 W, PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070132770","name":"PERTAMINA PMWF 09 W, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070134061","name":"TRANSLIK HD 30, PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070134091","name":"TRANSLIK HD 30 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070134191","name":"TRANSLIK HD 50 MIN 50, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070134361","name":"TRANSLIK HD 10W, PAIL 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070135170","name":"TURALIK 43 DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070135370","name":"TURALIK 48 MIN 46 DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070135391","name":"TURALIK 48 MIN 46, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070135462","name":"TURALIK 52 MIN 68, PAIL 20 L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070135470","name":"TURALIK 52, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070135491","name":"TURALIK 52 MIN 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070136170","name":"TURALIK C 10 Min 10 , DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070136575","name":"TURALIK C 46 MIN 46, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070136691","name":"TURALIK C 68 MIN 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070137375","name":"TURALIK XT 68, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070137401","name":"TURALIK 69 INDOCEMENT, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070137570","name":"TURBO LUBE 32 MIN 32,DR 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070137670","name":"TURBOLUBE 32 (IMPORT),DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070137770","name":"TURBOLUBE 46,DRUM 200 LTR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070137870","name":"TURBOLUBE 46 (IMPORT),DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070137971","name":"TURBOLUBE 68,DRUM 200 LTR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070138070","name":"TURBOLUBE 68 MIN 68 (LOKAL) DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070156101","name":"TRAFOLUBE A BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070156270","name":"TRAFOLUBE B, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070156901","name":"PERTAMINA HD COOLANT PG BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070156991","name":"PERTAMINA HD COOLANT, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070157091","name":"PERTAMINA HD COOLANT EG, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070157591","name":"PERTAMINA HD TIRE COOLANT, IBC 1000L,BULK","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070171170","name":"MAXCOOL WS 01 EP AH, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070171565","name":"PROTECTO AP 1588, DR 198KG","uom":"DR","volume":198.0,"segment":"INDUSTRY"},
  {"id":"A070178101","name":"DSFK 10W-40 SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070180770","name":"MASRI TXG 5, 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070184062","name":"PERTAMINA TRACTOR OIL SAE 10W-30, 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070184540","name":"PERTAMINA WISSEL 100, 6X4L","uom":"BOX","volume":24.0,"segment":"INDUSTRY"},
  {"id":"A070184561","name":"PERTAMINA WISSEL 100, 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070185075","name":"MEDITRAN SC 20W-50 CF4/SG OVE, 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070185270","name":"MEDITRAN SX ULTRA 15W40 CIPTA KRIDA,200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070185561","name":"MEDITRAN SC 15W-40 TURBO CF4, 18L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070185870","name":"MEDITRAN LE ULTIMATE 15W-40 API CK4, 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070190801","name":"FASTRON GOLD SAE 0W-20 SP/GF-6, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070203975","name":"PERTAMINA MTF SAE 80W, 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070204375","name":"TURALIK T 68, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070206075","name":"TURALIK V 41 DRUM 209 LITER","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070206275","name":"TURALIK V 48 DRUM 209 LITER","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070206375","name":"TURALIK V 43 DRUM 209 LITER","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A072110862","name":"MEDITRAN SX 15W-40 CH4 AFR, PAIL 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A072185355","name":"MEDITRAN SXV SAE 15W-40 CI4 (AFR), 2X10L","uom":"BOX","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A077185970","name":"MEDITRAN SX PLUS 15W-40 AUS CI4/SL, 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A177130862","name":"MASRI RG 220 S, 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A177146562","name":"GC LUBE SYN 100 S, 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A177177362","name":"REFRO PE 68 S, 20L","uom":"PL","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A275137345","name":"TURALIK XT 68 BG, 4X5L","uom":"BOX","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A275137350","name":"TURALIK XT 68 BG, 2X10L","uom":"BOX","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070134401","name":"TRANSLIK FD 1 SAE 60, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060101001","name":"GEMUK PERTAMINA BG 300,BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060103702","name":"GEMUK PERTAMINA SGX-NL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060103701","name":"GEMUK PERTAMINA SGX-NL,BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070112491","name":"MEDITRAN GEO 15W-40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070116491","name":"NG LUBE 30 ASHLESS , IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070116091","name":"NG LUBE 30 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070116291","name":"NG LUBE 40 ASHLESS, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070116391","name":"NG LUBE 40 LONG LIFE CF, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070116191","name":"NG LUBE 40 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070116501","name":"NG LUBE HSG SAE 40 API CF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109001","name":"MEDITRAN 20W-20, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111301","name":"MEDITRAN 20W50 CF/SF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109181","name":"MEDITRAN MIN 30 CC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109191","name":"MEDITRAN MIN 30 CC, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070109291","name":"MEDITRAN MIN 40 CC, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070109391","name":"MEDITRAN MIN 50 CC, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070109491","name":"MEDITRAN S MIN 10W CF-2/SF, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070109591","name":"MEDITRAN S MIN 30 CF-2/SF, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070109681","name":"MEDITRAN S MIN 40 CF-2/SF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109691","name":"MEDITRAN S MIN 40 CF-2/SF, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070109791","name":"MEDITRAN S MIN 50 CF-2/SF, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070110091","name":"MEDITRAN SC MIN 15W-40 CF4, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070110701","name":"MEDITRAN SX 15W-40 API CG-4, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111101","name":"MEDITRAN SX 20W-50 API CG-4, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111291","name":"MEDITRAN SX 20W-50 API CH-4, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070110881","name":"MEDITRAN SX MIN 15W-40 CH4, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070110891","name":"MEDITRAN SX MIN 15W-40 CH4, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070110901","name":"MEDITRAN SX MIN 15W-40 CI4, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070110991","name":"MEDITRAN SX MIN 15W-40 CI4, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070103001","name":"MESRAN B 10W, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070103101","name":"MESRAN B 20W-40, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070103201","name":"MESRAN B 30, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070103301","name":"MESRAN B MIN 40 CD/SF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070103401","name":"MESRAN B MIN 50 CD/SF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070121291","name":"TERMO 150 MIN 150, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070121001","name":"TERMO 22 MIN 22, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070121091","name":"TERMO 22 MIN 22, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070121191","name":"TERMO 32, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070121391","name":"TERMO XT 32, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070132201","name":"PERTAMINA ATF DEXTRON III H, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070132301","name":"PERTAMINA ATF DEXTRON VI, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070132401","name":"PERTAMINA ATF DEXTRON III, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070132091","name":"PERTAMINA ATF ISO VG 220, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070134391","name":"TRANSLIK HD 10W MIN 10W, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070134291","name":"TRANSLIK HD 60 MIN 60, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070135601","name":"TURALIK 220 MIN 220, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070135091","name":"TURALIK 41 MIN 22, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070135191","name":"TURALIK 43 MIN 32, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070135291","name":"TURALIK 45 MIN 37, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070135591","name":"TURALIK 69 MIN 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070136191","name":"TURALIK C 10 MIN 10, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070136791","name":"TURALIK C 100 MIN 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070136891","name":"TURALIK C 150 MIN 150, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070136991","name":"TURALIK C 180 , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070136901","name":"TURALIK C 180 MIN 180, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136291","name":"TURALIK C 22 MIN 22, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070137091","name":"TURALIK C 220 MIN 220, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070136401","name":"TURALIK C 32 KS, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136491","name":"TURALIK C 32 KS, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070136391","name":"TURALIK C 32, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070137191","name":"TURALIK C 320 MIN 320, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070136501","name":"TURALIK C 46, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136091","name":"TURALIK C 5 MIN 5, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070204491","name":"TURALIK T 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070204091","name":"TURALIK T 22, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070204191","name":"TURALIK T 32, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070204291","name":"TURALIK T 46, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070204391","name":"TURALIK T 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070137291","name":"TURALIK XT 46, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070137391","name":"TURALIK XT 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070146391","name":"GC LUBE M 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070146491","name":"GC LUBE M 150, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070146891","name":"GC LUBE M 220, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070146861","name":"GC LUBE M 220, PAIL 18 L","uom":"PL","volume":18.0,"segment":"INDUSTRY"},
  {"id":"A070146091","name":"GC LUBE M 32, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070146191","name":"GC LUBE M 46, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070146291","name":"GC LUBE M 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070146591","name":"GC LUBE SYN 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070146691","name":"GC LUBE SYN 150, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070146791","name":"GC LUBE SYN 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131791","name":"MASRI FLG 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070130491","name":"MASRI FLG 150, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070130091","name":"MASRI FLG 220, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070130291","name":"MASRI FLG 320, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070130191","name":"MASRI FLG 460, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070130391","name":"MASRI FLG 680, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070130691","name":"MASRI RG 100 MIN 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131291","name":"MASRI RG 1000, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070130991","name":"MASRI RG 320 MIN 320, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131891","name":"MASRI RG 460 (KS) MIN 460, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131091","name":"MASRI RG 460 MIN 460, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070130591","name":"MASRI RG 68 MIN 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131191","name":"MASRI RG 680 MIN 680, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070180291","name":"MASRI SMG 2, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070180391","name":"MASRI SMG 3, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131391","name":"MASRI SMG 5, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131491","name":"MASRI SMG 6, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131991","name":"MASRI SMG 9, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131591","name":"MASRI SYN HD 680, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070107091","name":"RORED EPA 85W-90 , IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070106891","name":"RORED EPA MIN 140 GL-4, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070106981","name":"RORED EPA MIN 80W-90 GL-4, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070106991","name":"RORED EPA MIN 80W-90 GL-4, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070106791","name":"RORED EPA MIN 90 GL-4, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070107491","name":"RORED HDA MIN 140 GL-5, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070107581","name":"RORED HDA MIN 80W-90 GL-5, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107591","name":"RORED HDA MIN 80W-90 GL-5, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070107391","name":"RORED HDA MIN 90 GL-5, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070107902","name":"RORED MTF 80W-90 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107991","name":"RORED MTF MIN 80W-90 GL-4, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070108291","name":"RORED TRANSMISSION OIL 80W-DMTF,IBC1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A060102502","name":"GEMUK PERTAMINA EPX-NL 1 MIN 1, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060102602","name":"GEMUK PERTAMINA EPX-NL 2 MIN 2, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060103001","name":"GEMUK PERTAMINA HDX - 2 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060102802","name":"GEMUK PERTAMINA SUPER EPX - 2, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060104001","name":"GEMUK PERTAMINA SUPER HDX - 2,BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060104501","name":"GEMUK PERTAMINA TS 2 Min 2 BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060104565","name":"GEMUK PERTAMINA TS 2 Min 2 DRUM 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060106001","name":"GEMUK PERTAMINA WR-NL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060105002","name":"GEMUK PERTAMINA X-NL 2 MIN 2, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060105102","name":"GEMUK PERTAMINA X-NL 3 MIN 3, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070128575","name":"MARTRON 320 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070128501","name":"MARTRON 320 MIN 30, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070128675","name":"MARTRON 330 Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070128601","name":"MARTRON 330 MIN 30, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070128775","name":"MARTRON 420 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070128701","name":"MARTRON 420 MIN 40, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070128875","name":"MARTRON 430 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070128801","name":"MARTRON 430 MIN 40, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070128975","name":"MARTRON 440 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070128901","name":"MARTRON 440 MIN 40, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070129075","name":"MARTRON 450 Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070129001","name":"MARTRON 450 MIN 40, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070129175","name":"MARTRON 540 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070129101","name":"MARTRON 540 MIN 50, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070129275","name":"MARTRON 550 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070129201","name":"MARTRON 550 MIN 50, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070129375","name":"MARTRON 570 Min 50 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070129301","name":"MARTRON 570 MIN 50, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111510","name":"MEDITRAN P 10 W","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070111591","name":"MEDITRAN P 10W, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070111691","name":"MEDITRAN P 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070111791","name":"MEDITRAN P 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070111891","name":"MEDITRAN P 50, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070110391","name":"MEDITRAN SMX 15W-40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070110291","name":"MEDITRAN SMX 40 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070124391","name":"MEDRIPAL 307 , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070122801","name":"MEDRIPAL 308 MIN 30, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070122891","name":"MEDRIPAL 308 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070122991","name":"MEDRIPAL 311 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070123091","name":"MEDRIPAL 312 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070123191","name":"MEDRIPAL 320 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070123291","name":"MEDRIPAL 330 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070123391","name":"MEDRIPAL 340 , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070122270","name":"MEDRIPAL 3D , @200 LTR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070122275","name":"MEDRIPAL 3D Min 30 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122201","name":"MEDRIPAL 3D MIN 30, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070123491","name":"MEDRIPAL 408 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070123591","name":"MEDRIPAL 411 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070123691","name":"MEDRIPAL 412 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070123791","name":"MEDRIPAL 420 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070123891","name":"MEDRIPAL 430 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070123991","name":"MEDRIPAL 440 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070124491","name":"MEDRIPAL 450 , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070124091","name":"MEDRIPAL 512 MIN 50, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070124191","name":"MEDRIPAL 540 MIN 50, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070124291","name":"MEDRIPAL 570 MIN 50, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070125591","name":"SALYX  340 , IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070126391","name":"SALYX  530 , IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127491","name":"SALYX  DF 312 , IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127891","name":"SALYX  DF 412 , IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127991","name":"SALYX  DF 420 , IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070125091","name":"SALYX 308 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070125191","name":"SALYX 312 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070125291","name":"SALYX 315 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070125391","name":"SALYX 320 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070125491","name":"SALYX 330 MIN 30, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070125691","name":"SALYX 408 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070126801","name":"SALYX 412 ( PELNI ), BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125791","name":"SALYX 412 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127001","name":"SALYX 415 ( TNI AL ), BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070125891","name":"SALYX 415 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070125991","name":"SALYX 420 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070126091","name":"SALYX 430 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070126191","name":"SALYX 440 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070126291","name":"SALYX 450 MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070126491","name":"SALYX 540 MIN 50, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070126591","name":"SALYX 550 MIN 50, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070126791","name":"SALYX 570 MIN 50, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127191","name":"SALYX C 430, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127291","name":"SALYX C 435, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127791","name":"SALYX DF 408, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127591","name":"SALYX DF 415, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127691","name":"SALYX DF 430, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070127301","name":"SALYX TP 420 MIN 40, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070176191","name":"MAX COOL WS 01 EP, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070176091","name":"MAX COOL WS 01, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070105701","name":"PRIMA XP 25W/60 API SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113901","name":"ENDURO 4T SPORT 5W-30 JASOMA2 APISL,BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070153501","name":"BS 150/GANDAR 800 X, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113401","name":"ENDURO 2T, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113001","name":"ENDURO 4T MIN 20W-50 JASO MA, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113601","name":"ENDURO 4T PREMIUM, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113101","name":"ENDURO 4T RACING 10W-40 API SJ, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113501","name":"ENDURO GEAR MATIC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113201","name":"ENDURO MATIC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113301","name":"ENVIRO 2T MIN 20 JASO FC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070139101","name":"EO 10W-30 JASO MA, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100101","name":"FASTRON 10W-30 SM, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100201","name":"FASTRON 10W-40, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070101301","name":"FASTRON 10W-60 API SM, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070101501","name":"FASTRON 15W-50 API SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100001","name":"FASTRON 5W-30 SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070200101","name":"FASTRON DIESEL 10W-30 JASO DH2, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070101001","name":"FASTRON DIESEL 15W-40 CI4, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100701","name":"FASTRON DIESEL 15W-40 SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100601","name":"FASTRON FULLY SYN 0W-50 SM, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070101601","name":"FASTRON GOLD 5W-30 API SN/CF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070101401","name":"FASTRON GOLD A 5W-30 API SM, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100801","name":"FASTRON SEMI SYN 15W-40 CH4, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100301","name":"FASTRON SEMI SYN 20W-50 SJ/CF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100901","name":"FASTRON SPECIAL GO 10W-30 API SM, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100501","name":"FASTRON SYN 10W-40 SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070100401","name":"FASTRON SYN ENG 20W-50 SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070200001","name":"FASTRON TECHNO 10W-40 SM, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070113791","name":"GANDAR 800 MIN 460, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070113801","name":"GANDAR 800 X, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070170091","name":"KNITTO TX  22, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070112001","name":"MEDITRAN E 40, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070112091","name":"MEDITRAN E 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070122091","name":"MEDRIPAL 2 , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070122191","name":"MEDRIPAL 3 , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070122391","name":"MEDRIPAL 4 , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070122475","name":"MEDRIPAL 4D Min 40 DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070122401","name":"MEDRIPAL 4D MIN 40, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070122470","name":"MEDRIPAL 4D,DRUM @ 200 LTR","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070122591","name":"MEDRIPAL 5 , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070122601","name":"MEDRIPAL 5D MIN 50, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070122791","name":"MEDRIPAL 6 , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070102001","name":"MESRAN MIN 10W SE/CC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102101","name":"MESRAN MIN 20W SE/CC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102201","name":"MESRAN MIN 30 SE/CC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102301","name":"MESRAN MIN 40 SE/CC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102401","name":"MESRAN MIN 50 SE/CC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070103601","name":"MESRAN PRIMA 20W-50, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102801","name":"MESRAN SPR 20W-50 SG/CD 4T, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102501","name":"MESRAN SUPER 20W-50 SF/CC, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102701","name":"MESRAN SUPER XP 20W-50, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070115101","name":"MESRANIA 2T OB MIN 30 JASO FB, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070115301","name":"MESRANIA 2T SPORT TCA MIN 30 TC,BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070115401","name":"MESRANIA 2T SPR MIN 20 TC-W3,BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070132601","name":"PERTAMINA MWF 09, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070132701","name":"PERTAMINA PMWF 09 W, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070158091","name":"PERTAMINA RINSOL , IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070105201","name":"PRIMA XP MIN 10W-40 SJ/CF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070105001","name":"PRIMA XP MIN 10W-40 SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070105101","name":"PRIMA XP MIN 10W-40 SL/CF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070105301","name":"PRIMA XP MIN 15W-40 SJ/CF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070105401","name":"PRIMA XP MIN 20W-50 SJ/CF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070105501","name":"PRIMA X\'TREME MIN 10W-30 SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070171001","name":"PTFG, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070172091","name":"RUBBSOL 30,  IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070173091","name":"RUSGUARD LUBE 10, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070117101","name":"SEBANA 120 MIN 220, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070117201","name":"SEBANA 170 MIN 320, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070117301","name":"SEBANA 300 MIN 680, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070117001","name":"SEBANA 90 MIN 100, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070117501","name":"SEBANA A, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070117601","name":"SEBANA B, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070117701","name":"SEBANA C1, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070117801","name":"SEBANA C2, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070117901","name":"SEBANA C3, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118001","name":"SEBANA D, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118691","name":"SEBANA P 100 MIN 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070118791","name":"SEBANA P 150 MIN 150, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070118291","name":"SEBANA P 22 MIN 22, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070118991","name":"SEBANA P 220 MIN 220, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070118391","name":"SEBANA P 32 MIN 32, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070119091","name":"SEBANA P 320 MIN 320, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070118491","name":"SEBANA P 46 MIN 46, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070119191","name":"SEBANA P 460 MIN 460, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070118591","name":"SEBANA P 68 MIN 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070118191","name":"SEBANA P 9 MIN 9, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070115901","name":"SEBANA P CURAH 100","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070117401","name":"SEBANA P CURAH 32","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070118801","name":"SEBANA P CURAH 46","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070116701","name":"SEBANA PC 100 BP, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070116901","name":"SEBANA PC 100 V, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119901","name":"SEBANA PC 100, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119701","name":"SEBANA PC 32, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119801","name":"SEBANA PC 46, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119501","name":"SEBANA PL 32, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070116801","name":"SEBANA PV 100, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119401","name":"SEBANA PX 120, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119201","name":"SEBANA PX 20, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119301","name":"SEBANA PX 38, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070120091","name":"SILINAP 160M MIN 460, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070120191","name":"SILINAP 220M MIN 1000, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070120291","name":"SILINAP 280M MIN 1500, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070133091","name":"STEELO B 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070133191","name":"STEELO B 220, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070133291","name":"STEELO B 320, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070133491","name":"STEELO B 460, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070133391","name":"STEELO B 680, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070102601","name":"MESRAN SUPER 20W-50 SG/CD, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070119601","name":"SEBANA PC 100B, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102304","name":"MESRAN 40","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102404","name":"MESRAN 50 / MOTOR OIL 50","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070103875","name":"MESRAN SPECIAL","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070112591","name":"DILOKA 448 X MIN 40, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070112675","name":"DILOKA 448,DRUM @ 209 LTR","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070114491","name":"KOMPEN 100 MIN 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070114091","name":"KOMPEN 15 MIN 15, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070114191","name":"KOMPEN 32 MIN 32, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070114291","name":"KOMPEN 46 MIN 46, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070114391","name":"KOMPEN 68 MIN 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070156192","name":"TRAFOLUBE A, FLEXYBAG 20 KL","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070156191","name":"TRAFOLUBE A, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070138191","name":"TURBOLUBE 100 MIN 100, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070138291","name":"TURBOLUBE 150, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070138391","name":"TURBOLUBE 220, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070137591","name":"TURBOLUBE 32 MIN 32, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070137791","name":"TURBOLUBE 46 MIN 46, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070137991","name":"TURBOLUBE 68 MIN 68, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070138491","name":"TURBOLUBE XT 32, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070138591","name":"TURBOLUBE XT 46, IBC 1000 L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070138691","name":"TURBOLUBE XT 68, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070103901","name":"MESRAN MARINE 2T MIN 20 TC-W3, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070104001","name":"MESRAN MARINE 4T MIN 10W-40 SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070115701","name":"MESRANIA 2T SPR X MIN 20 TC-W3, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070152501","name":"EO40SE","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070152502","name":"EO40SEJ","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070152601","name":"EO50SE","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070152602","name":"EO50SEJ","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070152702","name":"EOS20-50SG","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070152701","name":"EOSSGJ","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070102901","name":"MESRAN SUPER MOTOR 20W-50 SG/MA, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070105901","name":"PRIMA XP 10W-40 API SM, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070106001","name":"PRIMA XP 20W-50 API SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070112901","name":"ENDURO 4T RACING 10W-40 API SL, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070207401","name":"ENDURO 4T 20W-50 API SL JASO MA, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070207501","name":"ENDURO MATIC G 20W-40 SL/JASO MB, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070114801","name":"SEBANA PX 8, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070178201","name":"DSFK SAE 15W-40 API CI4, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070107601","name":"RORED HDA 85W - 140,BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070200501","name":"FASTRON 5W-30 API SN EQ, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070109901","name":"MEDITRAN S 40 (HINO) , BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070104401","name":"MESRAN 40 (KAWASAKI) , BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070201301","name":"FASTRON GOLD SAE 5W-40 SN/CF, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070146901","name":"GC LUBE SYN PO 46, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070179001","name":"PERTAMINA GRISKLIN, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070156891","name":"PERTAMINA HD COOLANT WB, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070131501","name":"MASRI SYN HD 680, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070176401","name":"MAX COOL HD 01, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070150501","name":"HO 22, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070206001","name":"TURALIK V 41, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070206301","name":"TURALIK V 43, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070206201","name":"TURALIK V 48, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070206101","name":"TURALIK V 52, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070206401","name":"TURALIK V 69, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070170301","name":"KNITTO 32, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070173201","name":"RUSGUARD LUBE X, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060101066","name":"GEMUK PERTAMINA BG 300,DRUM @ 180 KG","uom":"DR","volume":180.0,"segment":"INDUSTRY"},
  {"id":"A060101065","name":"GEMUK PTM BG 300 Min NLGI 2 DR 178KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A060101060","name":"GEMUK PTM BG 300 Min NLGI 2 PL1 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A070150601","name":"HO 32, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A275137245","name":"TURALIK XT 46 BG, 4X5L","uom":"BOX","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A275137250","name":"TURALIK XT 46 BG, 2X10L","uom":"BOX","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070147201","name":"GC LUBE SYN PO 150, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070147101","name":"GC LUBE SYN PO 32, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070147001","name":"GC LUBE SYN PO 68, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070185525","name":"MEDITRAN SC 15W-40 CF4 TURBO, 20X1L","uom":"BOX","volume":20.0,"segment":"INDUSTRY"},
  {"id":"A070124501","name":"MEDRIPAL 5040, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070136670","name":"TURALIK C 68 Min 68, DR 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070134901","name":"TURALIK HE ISO VG 32, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070135901","name":"TURALIK HE ISO VG 46, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070135801","name":"TURALIK HE ISO VG 68, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070114975","name":"SEBANA HP, DR 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070173665","name":"ANTIFOAM AFRD-03, DR 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A070119291","name":"SEBANA PX 20, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070191001","name":"FASTRON GOLD SAE 0W-16 SP/GF-6, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A060104060","name":"GEMUK PERTAMINA SUPER HDX - 2, PAIL 16KG","uom":"PL","volume":16.0,"segment":"INDUSTRY"},
  {"id":"A070190791","name":"FASTRON TECHNO 5W-30 A5/B5, IBC 1000L","uom":"IBC","volume":1000.0,"segment":"INDUSTRY"},
  {"id":"A070186375","name":"MEDITRAN MIN 40 CD, DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070185475","name":"MEDITRAN S 40 HDPE, DRUM 209L","uom":"DR","volume":209.0,"segment":"INDUSTRY"},
  {"id":"A070155001","name":"MCO AHM 10W-30 API SL JASO MB, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A070178970","name":"PERTAFLOW S, DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A070176970","name":"PERTAFLOW G, DRUM 200L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
  {"id":"A080900171","name":"SPREEZE, CAN 0.4L","uom":"CAN","volume":0.4,"segment":"INDUSTRY"},
  {"id":"A070173666","name":"FILMING AMINE RDCI-07, DRUM 178 KG","uom":"DR","volume":178.0,"segment":"INDUSTRY"},
  {"id":"A080900172","name":"SPREEZE, BULK","uom":"L","volume":1.0,"segment":"INDUSTRY"},
  {"id":"A080900173","name":"SPREEZE, DRUM 200 L","uom":"DR","volume":200.0,"segment":"INDUSTRY"},
];

const seedData = {
  users: [
    { id: "master-001", name: "MASTER PL-DIOS", email: "master@pldios.local", password: "password123", role: "master", area: "Head Office" },
    { id: "admin-001", name: "ADMIN PERTAMINA", email: "admin@pldios.local", password: "password123", role: "admin_pertamina", area: "Pertamina Lubricants" },
    { id: "sam-retail-001", name: "SAM RETAIL", email: "samretail@pldios.local", password: "password123", role: "sam_retail", area: "Sales Region I" },
    { id: "sam-industri-001", name: "SAM INDUSTRI", email: "samindustri@pldios.local", password: "password123", role: "sam_industri", area: "Sales Region I" },
    { id: "dist-001", name: "PT. SUTAN KASIM", email: "sutankasim@pldios.local", password: "password123", role: "distributor", area: "TERRITORY ACEH BARAT", territories: ["TERRITORY ACEH BARAT", "TERRITORY INDUSTRI"] },
    { id: "dist-002", name: "PT. NUSANTARA INDO BERJAYA", email: "nusantaraindoberjaya@pldios.local", password: "password123", role: "distributor", area: "TERRITORY ACEH SELATAN", territories: ["TERRITORY ACEH SELATAN", "TERRITORY INDUSTRI"] },
    { id: "dist-003", name: "PT. CITRA BINTANG FAMILINDO", email: "citrabintangfamilindo@pldios.local", password: "password123", role: "distributor", area: "TERRITORY ACEH TIMUR TENGAH", territories: ["TERRITORY ACEH TIMUR TENGAH", "TERRITORY INDUSTRI"] },
    { id: "dist-005", name: "PT. POLA RAYA JAYA SAKTI", email: "polarayajayasakti@pldios.local", password: "password123", role: "distributor", area: "TERRITORY ASAHAN", territories: ["TERRITORY ASAHAN", "TERRITORY MEDAN TENGGARA", "TERRITORY SIMALUNGUN", "TERRITORY INDUSTRI"] },
    { id: "dist-006", name: "PT. KANDE AGUNG", email: "kandeagung@pldios.local", password: "password123", role: "distributor", area: "TERRITORY BANDA ACEH", territories: ["TERRITORY BANDA ACEH", "TERRITORY INDUSTRI"] },
    { id: "dist-009", name: "PT. SAMUDRA JAYA RAYA", email: "samudrajayaraya@pldios.local", password: "password123", role: "distributor", area: "TERRITORY BINJAI LANGKAT", territories: ["TERRITORY BINJAI LANGKAT", "TERRITORY INDUSTRI"] },
    { id: "dist-015", name: "PT. PUTRA BANGGA KIRANA", email: "putrabanggakirana@pldios.local", password: "password123", role: "distributor", area: "TERRITORY KARO", territories: ["TERRITORY KARO", "TERRITORY INDUSTRI"] },
    { id: "dist-016", name: "PT. SERDANG JAYA", email: "serdangjaya@pldios.local", password: "password123", role: "distributor", area: "TERRITORY LABUHAN BATU", territories: ["TERRITORY LABUHAN BATU", "TERRITORY MEDAN UTARA", "TERRITORY INDUSTRI"] },
    { id: "dist-017", name: "PT. LARIS SUMUT MAKMUR", email: "larissumutmakmur@pldios.local", password: "password123", role: "distributor", area: "TERRITORY MEDAN SELATAN", territories: ["TERRITORY MEDAN SELATAN", "TERRITORY INDUSTRI"] },
    { id: "dist-021", name: "PT. INDRA ANGKOLA LUB", email: "indraangkolalub@pldios.local", password: "password123", role: "distributor", area: "TERRITORY TAPANULI SELATAN", territories: ["TERRITORY TAPANULI SELATAN", "TERRITORY INDUSTRI"] },
    { id: "dist-022", name: "PT. EKA PRIMA SEMESTA", email: "ekaprimasemesta@pldios.local", password: "password123", role: "distributor", area: "TERRITORY TEBING TINGGI", territories: ["TERRITORY TEBING TINGGI", "TERRITORY INDUSTRI"] },
    { id: "dist-023", name: "PT. ARTA CIMANDIRI CEMERLANG", email: "artacimandiri@pldios.local", password: "password123", role: "distributor", area: "TERRITORY INDUSTRI", territories: ["TERRITORY INDUSTRI"] },
    { id: "dist-024", name: "PT POLA PELUMAS JAYA SAKTI", email: "polapelumas@pldios.local", password: "password123", role: "distributor", area: "TERRITORY INDUSTRI", territories: ["TERRITORY INDUSTRI"] },
    { id: "dist-025", name: "PT. LUBSINDOCIPTA BINAWARSA", email: "lubsindocipta@pldios.local", password: "password123", role: "distributor", area: "TERRITORY INDUSTRI", territories: ["TERRITORY INDUSTRI"] }
  ],
  roles: [
    { id: "master", name: "Master", description: "Mengelola seluruh fitur dan role." },
    { id: "admin_pertamina", name: "Admin Pertamina Lubricants", description: "Mengelola stok, alokasi, PO distributor, dan upload QT." },
    { id: "distributor", name: "Distributor", description: "Mengelola profil, membuat PO, dan upload bukti bayar." },
    { id: "sam_retail", name: "SAM Retail", description: "Melihat dashboard penjualan segmen retail." },
    { id: "sam_industri", name: "SAM Industri", description: "Melihat dashboard penjualan segmen industri." }
  ],
  distributorProfiles: [],
  products: [],
  allocations: [],
  stockIns: [],
  stockAdjustments: [],
  orders: [],
  territories: {
    "TERRITORY ACEH BARAT": ["PT. SUTAN KASIM"],
    "TERRITORY ACEH SELATAN": ["PT. NUSANTARA INDO BERJAYA"],
    "TERRITORY ACEH TIMUR TENGAH": ["PT. CITRA BINTANG FAMILINDO"],
    "TERRITORY ASAHAN": ["PT. POLA RAYA JAYA SAKTI"],
    "TERRITORY BANDA ACEH": ["PT. KANDE AGUNG"],
    "TERRITORY BINJAI LANGKAT": ["PT. SAMUDRA JAYA RAYA"],
    "TERRITORY KARO": ["PT. PUTRA BANGGA KIRANA"],
    "TERRITORY LABUHAN BATU": ["PT. SERDANG JAYA"],
    "TERRITORY MEDAN SELATAN": ["PT. LARIS SUMUT MAKMUR"],
    "TERRITORY MEDAN TENGGARA": ["PT. POLA RAYA JAYA SAKTI"],
    "TERRITORY MEDAN UTARA": ["PT. SERDANG JAYA"],
    "TERRITORY SIMALUNGUN": ["PT. POLA RAYA JAYA SAKTI"],
    "TERRITORY TAPANULI SELATAN": ["PT. INDRA ANGKOLA LUB"],
    "TERRITORY TEBING TINGGI": ["PT. EKA PRIMA SEMESTA"],
    "TERRITORY INDUSTRI": ["PT. SUTAN KASIM","PT. NUSANTARA INDO BERJAYA","PT. CITRA BINTANG FAMILINDO","PT. POLA RAYA JAYA SAKTI","PT. KANDE AGUNG","PT. SAMUDRA JAYA RAYA","PT. PUTRA BANGGA KIRANA","PT. SERDANG JAYA","PT. LARIS SUMUT MAKMUR","PT. INDRA ANGKOLA LUB","PT. EKA PRIMA SEMESTA","PT. ARTA CIMANDIRI CEMERLANG","PT POLA PELUMAS JAYA SAKTI","PT. LUBSINDOCIPTA BINAWARSA"]
  }
};

function ensureDatabase() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2));
  } else {
    // Migrate: add missing fields
    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    let changed = false;
    if (!db.stockIns) { db.stockIns = []; changed = true; }
    if (!db.stockAdjustments) { db.stockAdjustments = []; changed = true; }
    // Ensure SAM users exist
    const samRetail = db.users.find(u => u.role === "sam_retail");
    if (!samRetail) {
      db.users.push({ id: "sam-retail-001", name: "SAM RETAIL", email: "samretail@pldios.local", password: "password123", role: "sam_retail", area: "Sales Region I" });
      changed = true;
    }
    const samIndustri = db.users.find(u => u.role === "sam_industri");
    if (!samIndustri) {
      db.users.push({ id: "sam-industri-001", name: "SAM INDUSTRI", email: "samindustri@pldios.local", password: "password123", role: "sam_industri", area: "Sales Region I" });
      changed = true;
    }
    if (changed) fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }
}

function readDb() { return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")); }
function writeDb(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(data));
}

function parseUrl(req) {
  const base = `http://${req.headers.host || "localhost"}`;
  return new URL(req.url, base);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => { try { resolve(body ? JSON.parse(body) : {}); } catch { resolve({}); } });
    req.on("error", reject);
  });
}

function slugify(str) { return String(str || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function formatPoNumber(n) { return `PO-${new Date().getFullYear()}-${String(n + 1).padStart(3, "0")}`; }
function publicUser(u) { const { password, ...rest } = u; return rest; }
function getDistributorProfile(db, userId) { return db.distributorProfiles.find(p => p.userId === userId) || null; }
function isProfileComplete(p) { return p && p.distributorName && p.address; }
function findAllocation(db, distributorId, productId, territory, segment) {
  return db.allocations.find(a =>
    a.distributorId === distributorId &&
    a.productId === productId &&
    (!territory || a.territory === territory) &&
    (!segment || a.segment === segment)
  );
}
function findOrder(db, id) { return db.orders.find(o => o.id === id || o.poNumber === id); }
function statusClass(s) { if (["qt_uploaded","payment_uploaded","completed"].includes(s)) return "approved"; if (s === "expired") return "process"; return "pending"; }
function statusLabel(s) { const m = {pending_po:"Pending PO",qt_uploaded:"QT Uploaded",payment_uploaded:"Payment Uploaded",completed:"Completed",expired:"Expired",rejected:"Rejected"}; return m[s] || s; }

function publicOrder(db, order) {
  const profile = getDistributorProfile(db, order.distributorId);
  const user = db.users.find(u => u.id === order.distributorId);
  return {
    ...order,
    distributorName: profile?.distributorName || user?.name || order.distributorId,
    totalItem: (order.items || []).reduce((sum, i) => sum + Number(i.qty || 0), 0),
    statusClass: statusClass(order.status),
    statusLabel: statusLabel(order.status),
  };
}

function publicAllocation(db, alloc) {
  const product = db.products.find(p => p.id === alloc.productId);
  const user = db.users.find(u => u.id === alloc.distributorId);
  return {
    ...alloc,
    productName: product?.name || alloc.productId,
    distributorName: user?.name || alloc.distributorId,
    remaining: Math.max(Number(alloc.allocationQty || 0) - Number(alloc.usedQty || 0), 0),
  };
}

async function handleApi(req, res, pathname) {
  if (req.method === "OPTIONS") { sendJson(res, 200, {}); return; }

  // === LOGIN ===
  if (req.method === "POST" && pathname === "/api/login") {
    const body = await readBody(req);
    const db = readDb();
    const user = db.users.find(u => u.email === body.email && u.password === body.password);
    if (!user) { sendJson(res, 401, { message: "Email atau password salah." }); return; }
    sendJson(res, 200, { user: publicUser(user), token: crypto.randomUUID() });
    return;
  }

  // === MASTER DATA ===
  if (req.method === "GET" && pathname === "/api/master") {
    const db = readDb();
    sendJson(res, 200, {
      users: db.users.map(publicUser),
      roles: db.roles,
      products: db.products,
      allocations: db.allocations.map(a => publicAllocation(db, a)),
      orders: db.orders.map(o => publicOrder(db, o)),
    });
    return;
  }

  // === PRODUCT CATALOG ===
  if (req.method === "GET" && pathname === "/api/catalog") {
    sendJson(res, 200, { catalog: PRODUCT_CATALOG });
    return;
  }

  // === PRODUCTS (global stock) ===
  if (req.method === "GET" && pathname === "/api/products") {
    const db = readDb();
    const distributorId = new URL(`http://x${req.url}`).searchParams.get("distributorId");
    const products = db.products.map(p => {
      const alloc = distributorId ? db.allocations.find(a => a.distributorId === distributorId && a.productId === p.id) : null;
      return {
        ...p,
        allocationQty: alloc ? Number(alloc.allocationQty || 0) : p.monthlyAllocation,
        usedQty: alloc ? Number(alloc.usedQty || 0) : 0,
        remainingAllocation: alloc
          ? Math.max(Number(alloc.allocationQty || 0) - Number(alloc.usedQty || 0), 0)
          : p.remainingAllocation,
      };
    });
    sendJson(res, 200, { products });
    return;
  }

  if (req.method === "POST" && pathname === "/api/products") {
    const body = await readBody(req);
    const db = readDb();
    if (!body.name) { sendJson(res, 422, { message: "Nama produk wajib diisi." }); return; }
    const productId = body.id || slugify(body.name);
    if (db.products.some(p => p.id === productId)) { sendJson(res, 409, { message: "Produk sudah ada." }); return; }
    const stock = Number(body.stock || 0);
    const product = {
      id: productId,
      kode: body.kode || body.id || productId,
      name: body.name,
      uom: body.uom || "-",
      volume: Number(body.volume || 0),
      segment: body.segment || "RETAIL",
      category: body.category || "-",
      stock,
      monthlyAllocation: Number(body.monthlyAllocation || 0),
      remainingAllocation: Number(body.remainingAllocation ?? body.monthlyAllocation ?? 0),
      stockStatus: stock > 0 ? "Ready" : "Empty",
    };
    db.products.push(product);
    writeDb(db);
    sendJson(res, 201, { product });
    return;
  }

  if (req.method === "PATCH" && pathname.startsWith("/api/products/")) {
    const productId = decodeURIComponent(pathname.replace("/api/products/", ""));
    const body = await readBody(req);
    const db = readDb();
    const product = db.products.find(p => p.id === productId);
    if (!product) { sendJson(res, 404, { message: "Produk tidak ditemukan." }); return; }
    if (body.stock !== undefined) product.stock = Number(body.stock);
    if (body.monthlyAllocation !== undefined) product.monthlyAllocation = Number(body.monthlyAllocation);
    if (body.remainingAllocation !== undefined) product.remainingAllocation = Number(body.remainingAllocation);
    product.stockStatus = product.stock > 0 ? "Ready" : "Empty";
    writeDb(db);
    sendJson(res, 200, { product });
    return;
  }

  // === STOCK IN ===
  if (req.method === "POST" && pathname === "/api/stock-in") {
    const body = await readBody(req);
    const db = readDb();
    const updates = Array.isArray(body.items) ? body.items : [];
    const results = [];
    for (const item of updates) {
      if (!item.productId || !item.stockIn || Number(item.stockIn) <= 0) continue;
      let product = db.products.find(p => p.id === item.productId);
      if (!product) {
        // auto-create from catalog if not yet in products
        const cat = PRODUCT_CATALOG.find(c => c.id === item.productId);
        if (!cat) continue;
        product = {
          id: cat.id, kode: cat.id, name: cat.name, uom: cat.uom, volume: cat.volume,
          segment: cat.segment, category: cat.segment === "RETAIL" ? "Retail" : "Industry",
          stock: 0, monthlyAllocation: 0, remainingAllocation: 0, stockStatus: "Empty",
        };
        db.products.push(product);
      }
      const qty = Number(item.stockIn);
      product.stock = Number(product.stock || 0) + qty;
      product.remainingAllocation = Number(product.remainingAllocation || 0) + qty;
      product.stockStatus = product.stock > 0 ? "Ready" : "Empty";
      const stockInRecord = {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        qty,
        date: new Date().toISOString(),
        createdBy: body.createdBy || "master",
      };
      db.stockIns.push(stockInRecord);
      results.push(stockInRecord);
    }
    writeDb(db);
    sendJson(res, 200, { updated: results.length, items: results });
    return;
  }

  if (req.method === "GET" && pathname === "/api/stock-in") {
    const db = readDb();
    sendJson(res, 200, { stockIns: db.stockIns || [] });
    return;
  }

  // === ALLOCATIONS ===
  if (req.method === "GET" && pathname === "/api/allocations") {
    const db = readDb();
    const params = new URL(`http://x${req.url}`).searchParams;
    let allocs = db.allocations;
    if (params.get("distributorId")) allocs = allocs.filter(a => a.distributorId === params.get("distributorId"));
    if (params.get("territory")) allocs = allocs.filter(a => a.territory === params.get("territory"));
    if (params.get("segment")) allocs = allocs.filter(a => a.segment === params.get("segment"));
    sendJson(res, 200, { allocations: allocs.map(a => publicAllocation(db, a)) });
    return;
  }

  if (req.method === "POST" && pathname === "/api/allocations") {
    const body = await readBody(req);
    const db = readDb();
    if (!body.distributorId || !body.territory || !body.segment) {
      sendJson(res, 422, { message: "Distributor, territory, dan segment wajib dipilih." }); return;
    }
    const items = Array.isArray(body.items) ? body.items : [];
    const saved = [];
    for (const item of items) {
      if (!item.productId || Number(item.allocationQty) < 0) continue;
      const existing = db.allocations.find(a =>
        a.distributorId === body.distributorId &&
        a.productId === item.productId &&
        a.territory === body.territory &&
        a.segment === body.segment
      );
      if (existing) {
        existing.allocationQty = Number(item.allocationQty);
      } else {
        const alloc = {
          id: crypto.randomUUID(),
          distributorId: body.distributorId,
          territory: body.territory,
          segment: body.segment,
          productId: item.productId,
          allocationQty: Number(item.allocationQty),
          usedQty: 0,
        };
        db.allocations.push(alloc);
        saved.push(alloc);
      }
    }
    writeDb(db);
    sendJson(res, 200, { saved: saved.length });
    return;
  }

  if (req.method === "PATCH" && pathname.startsWith("/api/allocations/")) {
    const allocId = decodeURIComponent(pathname.replace("/api/allocations/", ""));
    const body = await readBody(req);
    const db = readDb();
    const alloc = db.allocations.find(a => a.id === allocId);
    if (!alloc) { sendJson(res, 404, { message: "Alokasi tidak ditemukan." }); return; }
    if (body.allocationQty !== undefined) alloc.allocationQty = Number(body.allocationQty);
    if (body.usedQty !== undefined) alloc.usedQty = Number(body.usedQty);
    writeDb(db);
    sendJson(res, 200, { allocation: publicAllocation(db, alloc) });
    return;
  }

  // === STOCK ADJUSTMENT ===
  if (req.method === "POST" && pathname === "/api/stock-adjustment") {
    const body = await readBody(req);
    const db = readDb();
    if (!body.distributorId || !body.territory || !body.customerName) {
      sendJson(res, 422, { message: "Distributor, territory, dan nama customer wajib diisi." }); return;
    }
    const items = Array.isArray(body.items) ? body.items : [];
    const saved = [];
    for (const item of items) {
      if (!item.productId || Number(item.qty) <= 0) continue;
      const product = db.products.find(p => p.id === item.productId);
      if (!product) continue;
      const alloc = db.allocations.find(a =>
        a.distributorId === body.distributorId &&
        a.productId === item.productId &&
        a.territory === body.territory
      );
      if (alloc) {
        alloc.usedQty = Number(alloc.usedQty || 0) + Number(item.qty);
      }
      product.stock = Math.max(0, Number(product.stock || 0) - Number(item.qty));
      product.remainingAllocation = Math.max(0, Number(product.remainingAllocation || 0) - Number(item.qty));
      product.stockStatus = product.stock > 0 ? "Ready" : "Empty";
      const adj = {
        id: crypto.randomUUID(),
        distributorId: body.distributorId,
        territory: body.territory,
        segment: item.segment || body.segment,
        customerName: body.customerName,
        productId: item.productId,
        productName: product.name,
        qty: Number(item.qty),
        date: new Date().toISOString(),
        createdBy: body.createdBy || "admin",
      };
      db.stockAdjustments.push(adj);
      saved.push(adj);
    }
    writeDb(db);
    sendJson(res, 200, { saved: saved.length, items: saved });
    return;
  }

  if (req.method === "GET" && pathname === "/api/stock-adjustment") {
    const db = readDb();
    const params = new URL(`http://x${req.url}`).searchParams;
    let adjs = db.stockAdjustments || [];
    if (params.get("distributorId")) adjs = adjs.filter(a => a.distributorId === params.get("distributorId"));
    if (params.get("territory")) adjs = adjs.filter(a => a.territory === params.get("territory"));
    sendJson(res, 200, { adjustments: adjs });
    return;
  }

  // === ROLES ===
  if (req.method === "POST" && pathname === "/api/roles") {
    const body = await readBody(req);
    const db = readDb();
    if (!body.name) { sendJson(res, 422, { message: "Nama role wajib diisi." }); return; }
    const role = { id: slugify(body.name), name: body.name, description: body.description || "" };
    if (db.roles.some(r => r.id === role.id)) { sendJson(res, 409, { message: "Role sudah ada." }); return; }
    db.roles.push(role);
    writeDb(db);
    sendJson(res, 201, { role });
    return;
  }

  // === USERS ===
  if (req.method === "POST" && pathname === "/api/users") {
    const body = await readBody(req);
    const db = readDb();
    if (!body.name || !body.email) { sendJson(res, 422, { message: "Nama dan email wajib diisi." }); return; }
    if (db.users.some(u => u.email === body.email)) { sendJson(res, 409, { message: "Email sudah terdaftar." }); return; }
    const user = {
      id: `user-${slugify(body.role)}-${crypto.randomUUID().slice(0, 8)}`,
      name: body.name,
      email: body.email,
      password: body.password || "password123",
      role: body.role || "distributor",
      area: body.area || "",
      outlet: body.outlet || "",
    };
    db.users.push(user);
    if (body.role === "distributor") {
      db.distributorProfiles.push({
        userId: user.id,
        distributorName: body.distributorName || body.name,
        address: body.address || "",
        logoName: "", logoDataUrl: "", stampName: "", stampDataUrl: "",
        updatedAt: new Date().toISOString(),
      });
    }
    writeDb(db);
    sendJson(res, 201, { user: publicUser(user) });
    return;
  }

  // === PROFILE ===
  if (req.method === "GET" && pathname === "/api/profile") {
    const userId = new URL(`http://x${req.url}`).searchParams.get("userId");
    const db = readDb();
    const profile = getDistributorProfile(db, userId);
    sendJson(res, 200, { profile, complete: isProfileComplete(profile) });
    return;
  }

  if (req.method === "PUT" && pathname === "/api/profile") {
    const body = await readBody(req);
    const db = readDb();
    if (!body.userId) { sendJson(res, 422, { message: "User wajib dipilih." }); return; }
    const existing = getDistributorProfile(db, body.userId);
    const profile = {
      userId: body.userId,
      distributorName: body.distributorName,
      address: body.address,
      logoName: body.logoName || existing?.logoName || "",
      logoDataUrl: body.logoDataUrl || existing?.logoDataUrl || "",
      stampName: body.stampName || existing?.stampName || "",
      stampDataUrl: body.stampDataUrl || existing?.stampDataUrl || "",
      updatedAt: new Date().toISOString(),
    };
    if (existing) { Object.assign(existing, profile); } else { db.distributorProfiles.push(profile); }
    writeDb(db);
    sendJson(res, 200, { profile, complete: isProfileComplete(profile) });
    return;
  }

  // === ORDERS ===
  if (req.method === "GET" && pathname === "/api/orders") {
    const db = readDb();
    const params = new URL(`http://x${req.url}`).searchParams;
    const userId = params.get("userId");
    const role = params.get("role");
    const segment = params.get("segment");
    let orders = role === "distributor" && userId
      ? db.orders.filter(o => o.distributorId === userId)
      : db.orders;
    if (segment) orders = orders.filter(o => o.segment === segment);
    sendJson(res, 200, { orders: orders.map(o => publicOrder(db, o)) });
    return;
  }

  if (req.method === "POST" && pathname === "/api/orders") {
    const body = await readBody(req);
    const db = readDb();
    const profile = getDistributorProfile(db, body.distributorId);
    if (!isProfileComplete(profile)) { sendJson(res, 422, { message: "Lengkapi profil distributor sebelum membuat PO." }); return; }
    const items = Array.isArray(body.items) ? body.items : [];
    const validItems = [];
    for (const item of items) {
      const qty = Number(item.qty || 0);
      const product = db.products.find(p => p.id === item.productId);
      if (!product || qty <= 0) continue;
      const alloc = findAllocation(db, body.distributorId, product.id, body.territory, body.segment);
      const remaining = alloc
        ? Math.max(Number(alloc.allocationQty || 0) - Number(alloc.usedQty || 0), 0)
        : Number(product.remainingAllocation || 0);
      if (remaining < qty || product.stockStatus !== "Ready") {
        sendJson(res, 422, { message: `${product.name} tidak mencukupi untuk qty ${qty}.` }); return;
      }
      validItems.push({ productId: product.id, productName: product.name, qty, allocationType: item.allocationType || body.segment });
    }
    if (validItems.length === 0) { sendJson(res, 422, { message: "Minimal pilih satu produk dan isi qty." }); return; }
    const order = {
      id: crypto.randomUUID(),
      distributorId: body.distributorId,
      territory: body.territory || "",
      segment: body.segment || "retail",
      poNumber: formatPoNumber(db.orders.length),
      orderDate: new Date().toISOString(),
      outlet: body.outlet || profile.distributorName,
      customerName: body.customerName || "",
      customerId: body.customerId || "",
      poCode: body.poCode || "",
      paymentMethod: body.paymentMethod || "",
      deliveryType: body.deliveryType || "Loco",
      status: "pending_po",
      items: validItems,
      quotation: null,
      paymentProof: null,
    };
    for (const item of validItems) {
      const product = db.products.find(p => p.id === item.productId);
      const alloc = findAllocation(db, body.distributorId, item.productId, body.territory, body.segment);
      if (alloc) alloc.usedQty = Number(alloc.usedQty || 0) + item.qty;
      product.remainingAllocation = Math.max(0, Number(product.remainingAllocation || 0) - item.qty);
      product.stock = Math.max(0, Number(product.stock || 0) - item.qty);
      if (product.remainingAllocation <= 0 || product.stock <= 0) product.stockStatus = "Empty";
    }
    db.orders.push(order);
    writeDb(db);
    sendJson(res, 201, { order: publicOrder(db, order) });
    return;
  }

  if (req.method === "POST" && pathname.match(/^\/api\/orders\/[^/]+\/quotation$/)) {
    const orderId = decodeURIComponent(pathname.split("/")[3]);
    const body = await readBody(req);
    const db = readDb();
    const order = findOrder(db, orderId);
    if (!order) { sendJson(res, 404, { message: "PO tidak ditemukan." }); return; }
    order.quotation = { fileName: body.fileName || `QT-${order.poNumber}.pdf`, amount: Number(body.amount || 0), notes: body.notes || "", uploadedAt: new Date().toISOString() };
    order.status = "qt_uploaded";
    writeDb(db);
    sendJson(res, 200, { order: publicOrder(db, order) });
    return;
  }

  if (req.method === "POST" && pathname.match(/^\/api\/orders\/[^/]+\/payment$/)) {
    const orderId = decodeURIComponent(pathname.split("/")[3]);
    const body = await readBody(req);
    const db = readDb();
    const order = findOrder(db, orderId);
    if (!order) { sendJson(res, 404, { message: "PO tidak ditemukan." }); return; }
    if (!order.quotation) { sendJson(res, 422, { message: "QT belum diupload oleh Admin Pertamina." }); return; }
    order.paymentProof = { fileName: body.fileName || `bukti-bayar-${order.poNumber}.png`, proofDataUrl: body.proofDataUrl || "", uploadedAt: new Date().toISOString() };
    order.status = "payment_uploaded";
    writeDb(db);
    sendJson(res, 200, { order: publicOrder(db, order) });
    return;
  }

  if (req.method === "PATCH" && pathname.match(/^\/api\/orders\/[^/]+\/status$/)) {
    const orderId = decodeURIComponent(pathname.split("/")[3]);
    const body = await readBody(req);
    const db = readDb();
    const order = findOrder(db, orderId);
    if (!order) { sendJson(res, 404, { message: "PO tidak ditemukan." }); return; }
    order.status = body.status || order.status;
    writeDb(db);
    sendJson(res, 200, { order: publicOrder(db, order) });
    return;
  }

  // === DASHBOARD ===
  if (req.method === "GET" && pathname === "/api/dashboard") {
    const db = readDb();
    const params = new URL(`http://x${req.url}`).searchParams;
    const userId = params.get("userId");
    const role = params.get("role");
    const segment = params.get("segment");
    let orders = role === "distributor" && userId
      ? db.orders.filter(o => o.distributorId === userId)
      : db.orders;
    if (segment) orders = orders.filter(o => o.segment === segment);
    sendJson(res, 200, {
      summary: {
        totalPo: orders.length,
        pendingPo: orders.filter(o => o.status === "pending_po").length,
        approvedPo: orders.filter(o => ["qt_uploaded","payment_uploaded","completed"].includes(o.status)).length,
        expiredPo: orders.filter(o => o.status === "expired").length,
      },
      recentOrders: orders.slice(-5).reverse().map(o => publicOrder(db, o)),
    });
    return;
  }

  // === SAM DASHBOARD ===
  if (req.method === "GET" && pathname === "/api/sam-dashboard") {
    const db = readDb();
    const params = new URL(`http://x${req.url}`).searchParams;
    const segment = params.get("segment") || "retail";
    const filteredOrders = db.orders.filter(o => o.segment === segment);
    const distributors = db.users.filter(u => u.role === "distributor");
    // Sales per distributor
    const byDistributor = distributors.map(d => {
      const orders = filteredOrders.filter(o => o.distributorId === d.id);
      const totalQty = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + Number(i.qty || 0), 0), 0);
      const profile = getDistributorProfile(db, d.id);
      return {
        distributorId: d.id,
        distributorName: profile?.distributorName || d.name,
        territories: d.territories || [],
        totalOrders: orders.length,
        totalQty,
        completedOrders: orders.filter(o => o.status === "completed").length,
      };
    }).filter(d => d.totalOrders > 0 || d.totalQty >= 0);
    // Allocations remaining per distributor
    const allocSummary = db.allocations
      .filter(a => a.segment === segment)
      .map(a => publicAllocation(db, a));
    sendJson(res, 200, { byDistributor, allocSummary, totalOrders: filteredOrders.length });
    return;
  }

  sendJson(res, 404, { message: "API endpoint tidak ditemukan." });
}

function serveStatic(req, res, pathname) {
  const defaultFile = pathname === "/" ? "/LOGIN.html" : pathname;
  const decodedPath = decodeURIComponent(defaultFile);
  const filePath = path.normalize(path.join(ROOT, decodedPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.readFile(filePath, (error, content) => {
    if (error) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); res.end("File tidak ditemukan."); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(content);
  });
}

ensureDatabase();

const server = http.createServer(async (req, res) => {
  const url = parseUrl(req);
  try {
    if (url.pathname.startsWith("/api/")) { await handleApi(req, res, url.pathname); return; }
    serveStatic(req, res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { message: error.message || "Terjadi kesalahan server." });
  }
});

server.listen(PORT, () => {
  console.log(`PL-DIOS backend running at http://localhost:${PORT}`);
});
