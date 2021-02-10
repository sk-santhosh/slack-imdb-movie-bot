require = require("esm")(module /*, options*/);
module.exports = require("./app.js");

const server = require("http").createServer();

server.listen(process.env.PORT || 3000, () =>
  console.log(`Server started in port ${process.env.PORT || 5000}`)
);
