const fs = require('fs');
const path = require('path');

const logDir = path.resolve(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function timestamp() {
  return new Date().toISOString();
}

function writeLog(level, message, meta) {
  const line = `[${timestamp()}] [${level}] ${message}${meta ? ' ' + JSON.stringify(meta) : ''}\n`;
  const file = path.join(logDir, `${level.toLowerCase()}.log`);
  fs.appendFileSync(file, line);
  if (level === 'ERROR') {
    fs.appendFileSync(path.join(logDir, 'all.log'), line);
  }
}

const logger = {
  info: (msg, meta) => {
    console.log(`[${timestamp()}] [INFO] ${msg}`, meta || '');
    writeLog('INFO', msg, meta);
  },
  warn: (msg, meta) => {
    console.warn(`[${timestamp()}] [WARN] ${msg}`, meta || '');
    writeLog('WARN', msg, meta);
  },
  error: (msg, meta) => {
    console.error(`[${timestamp()}] [ERROR] ${msg}`, meta || '');
    writeLog('ERROR', msg, meta);
  },
};

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION', { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED REJECTION', { reason: reason?.message || String(reason) });
});

module.exports = logger;
