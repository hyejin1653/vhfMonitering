var express = require("express");
var router = express.Router();
const fs = require("fs");
const wav = require("wav");

router.get("/", function (req, res, next) {
  res.status(200).send("ok");
});

router.post("/play", (req, res, next) => {
  const fileNm = req.body.fileNm;
  let file = fs.readFileSync(fileNm);
  //console.log(JSON.stringify(file));
  res.status(200).send(JSON.stringify(file));
});

module.exports = router;
