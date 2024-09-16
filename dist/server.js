"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const logger_service_1 = require("./services/logger.service");
const schema_1 = require("./graphql/schema");
const context_1 = require("./graphql/context");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.resolve('public')));
}
else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:8080',
            'http://localhost:8080',
        ],
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));
}
const server = new server_1.ApolloServer({
    ...schema_1.schema,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
});
app.get('/**', (_, res) => {
    res.sendFile(path_1.default.resolve('public/index.html'));
});
initServer();
async function initServer() {
    await server.start();
    app.use((0, cookie_parser_1.default)());
    app.use(body_parser_1.default.json());
    app.use((0, express4_1.expressMiddleware)(server, { context: context_1.context }));
    const port = process.env.PORT || 4000;
    httpServer.listen({ port });
    logger_service_1.logger.info(`Server ready at http://localhost:${port}`);
}
