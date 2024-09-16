"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const logsDir = './logs';
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir);
}
// Define the time format
function getTime() {
    const now = new Date();
    return now.toLocaleString('he');
}
function isError(e) {
    return e instanceof Error;
}
function doLog(level, ...args) {
    const strs = args.map(arg => typeof arg === 'string' || isError(arg) ? arg : JSON.stringify(arg));
    let line = strs.join(' | ');
    line = `${getTime()} - ${level} - ${line}\n`;
    console.log(line);
    fs_1.default.appendFile('logs/backend.log', line, err => {
        if (err)
            console.log('FATAL: cannot write to log file', err);
    });
}
exports.logger = {
    debug(...args) {
        if (process.env.NODE_ENV === 'production')
            return; // Fixed typo NODE_NEV -> NODE_ENV
        doLog('DEBUG', ...args);
    },
    info(...args) {
        doLog('INFO', ...args);
    },
    warn(...args) {
        doLog('WARN', ...args);
    },
    error(...args) {
        doLog('ERROR', ...args);
    },
};
