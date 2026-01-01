import pino from 'pino';
// import fs from 'fs';
// import path from 'path';

// const logDir = './logs';
// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir);
// }

const pinoConfig = process.env.NODE_ENV === "development"
  ? {
      level: process.env.LOG_LEVEL ?? "info",
      transport: { target: "pino-pretty", options: { translateTime: "HH:MM:ss" } },
    }
  : {
      level: process.env.LOG_LEVEL ?? "info",
      transport: {
        targets: [
          // { target: 'pino/file', options: { destination: path.join(logDir, 'app.log') } },
          { target: 'pino-loki', options: { host: 'http://loki:3100', labels: { job: 'trend-taste' } } }, // Loki
        ]
      }
    };

export const logger = pino(pinoConfig);