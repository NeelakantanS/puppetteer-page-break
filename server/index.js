const express = require("express");
const path = require("path");
const cors = require("cors");
const dotEnv = require("dotenv");
const http = require("http");
const indexRouter = require("./routes/index");

class app {
    constructor() {
        dotEnv.config();

        this.configureApp().then((app) => {
            return this.startServer(app)
        })
    }

    configureApp = () => {
        return new Promise((resolve, _) => {
            const app = express();
            app.use(cors());
            app.use(express.json());
            app.use(express.urlencoded({ extended: false }));
            app.use(express.static(path.join(__dirname, "../public")));

            app.use("/", indexRouter);

            // 404
            app.use((req, res, next) => {
                return res.status(404).send({
                    error: `Not found: ${req.url}`,
                });
            });

            // 500
            app.use((err, req, res, next) => {
                console.log("err", err); // write to pm2 logs
                const statusCode = err.status || 500;
                const { message, ...rest } = err;
                let error =
                    Object.keys(rest).length && err.status ? rest : { error: message };
                return res.status(statusCode).send(error);
            });
            global.rootDir = path.resolve(__dirname);

            resolve(app);
        });
    };

    startServer = (app) => {
        return new Promise((resolve, _) => {
            // set port
            const port = process.env.PORT || "8008";
            app.set("port", port);
            // create HTTP server
            const server = http.createServer(app);
            // attach handler
            server.on("listening", () => {
                const bind = server.address().port;
                console.log("Generate Report Pdf API listening on " + `[ http://localhost:${bind}/ ]`);
                resolve(server);
            });
            // listen on provided port, on all network interfaces
            server.listen(port);
        });
    };
}

module.exports = new app()
