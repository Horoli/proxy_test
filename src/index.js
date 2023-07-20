const Fastify = require('fastify');
const Cors = require('@fastify/cors');
const Proxy = require('@fastify/http-proxy');

const Fs = require("fs");
const Path = require("path");


class WebServer {
    constructor(opts) {
        this.$opts = opts;
        this.$webServer = Fastify();

        this.$_initRoutes();
    }

    $_initRoutes() {
        const routesPath = Path.join(__dirname, "./routes");
        const routeFiles = Fs.readdirSync(routesPath);

        console.log('routeFiles', routeFiles);

        for (const fileName of routeFiles) {
            const routePath = Path.join(routesPath, fileName);
            const routes = require(routePath);
            // done();
        }
    }





    start() {

        // this.$webServer.addHook('onRequest', (req, reply) => {
        //     console.log('onRequest', req.raw.method, req.raw.url);
        //     console.log(req.headers);
        // });

        this.$webServer.addHook('onResponse', (req, reply) => {
            console.log('onResponse', req.raw.url, reply.statusCode);
        });


        this.$webServer.register(Cors, { origin: "*" })

        this.$webServer.register(
            Proxy, {
            upstream: 'https://api.commerce.naver.com',
            prefix: '/naver',
        });

        this.$webServer.register(
            Proxy, {
            upstream: 'https://goodcareshop.cafe24api.com',
            prefix: '/cafe24',
        });

        this.$webServer.register(
            Proxy, {
            upstream: 'https://api-gateway.coupang.com',
            prefix: '/coupang',
            // replyOptions: {
            //     onResponse: (req, reply, res) => {
            //         console.log('onResponse', req);

            //     }

            // }
        });

        this.$webServer.listen({
            host: this.$opts.host,
            port: this.$opts.port,
        })
    }
}

module.exports = WebServer;