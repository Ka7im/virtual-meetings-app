"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const WSServer = (0, express_ws_1.default)(app);
const server = WSServer.app;
const aWss = WSServer.getWss();
const PORT = process.env.PORT || 5000;
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.ws('/paint', (ws, req) => {
    ws.on('message', (msg) => {
        const message = JSON.parse(msg);
        switch (message.method) {
            case "connection":
                connectionHandler(ws, message);
                break;
            case "draw":
                broadcastConnection(ws, message);
                break;
        }
    });
});
server.post('/paint/image', (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '');
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64');
        return res.status(200).json({ message: "Загружено" });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('error');
    }
});
server.get('/paint/image', (req, res) => {
    try {
        const file = fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'files', `${req.query.id}.jpg`));
        const data = `data:image/png;base64,` + file.toString('base64');
        res.json(data);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('error');
    }
});
server.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
const connectionHandler = (ws, msg) => {
    ws.id = msg.id;
    broadcastConnection(ws, msg);
};
const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach((client) => {
        const sending = (client) => {
            if (client.id === msg.id) {
                client.send(JSON.stringify(msg));
            }
        };
        sending(client);
    });
};
