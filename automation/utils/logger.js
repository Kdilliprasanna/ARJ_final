const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logDir = 'reports/Logs') {
    this.logDir = logDir;
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    this.logFile = path.join(this.logDir, 'execution.log');
  }

  log(level, message, meta = null) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}${meta ? ' | ' + JSON.stringify(meta) : ''}\n`;
    process.stdout.write(formatted);
    try {
      fs.appendFileSync(this.logFile, formatted, 'utf8');
    } catch {
      // Fallback
    }
  }

  info(msg, meta) { this.log('INFO', msg, meta); }
  warn(msg, meta) { this.log('WARN', msg, meta); }
  error(msg, meta) { this.log('ERROR', msg, meta); }
  debug(msg, meta) { this.log('DEBUG', msg, meta); }
  test(testId, name, status, durationMs, errorMsg = '') {
    const symbol = status === 'PASSED' ? '✓' : status === 'FAILED' ? '✗' : '○';
    this.log('TEST', `${symbol} [${testId}] ${name} -> ${status} (${durationMs}ms)${errorMsg ? ' - Error: ' + errorMsg : ''}`);
  }
}

module.exports = new Logger();
