require("crypto").randomBytes(8, function (err, buffer) {
  var token = new Date().getTime().toString()+buffer.toString("base64");
  console.log(typeof(token));
});
