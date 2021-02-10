require = require("esm")(module /*, options*/);
module.exports = require("./app.js");

const server = require("http").createServer();

server.listen(3000, () => console.log("Server started in port 3000"));
