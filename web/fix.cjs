const fs = require('fs');
let c = fs.readFileSync('server/expanded-jobs-db-250.js', 'utf8');
c = c.replace(/posted:\s*'Just now'[^,]*,/g, "posted: 'Just now',");
fs.writeFileSync('server/expanded-jobs-db-250.js', c);
console.log('Fixed syntax error');
