const WebServer = require("./src");

const server = new WebServer({
    host: "0.0.0.0",
    port: 56000,
});

server.start();