const fs = require('fs');
const path = require('path');

const filesToClean = [
  'job-database.js',
  'real-jobs-db.js',
  'expanded-jobs-db-250.js'
];

for (const file of filesToClean) {
  const filepath = path.join(__dirname, 'server', file);
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Replace string dates like '2024-01-15'
    content = content.replace(/posted:\s*'2024-\d\d-\d\d'/g, "posted: 'Just now'");
    content = content.replace(/posted:\s*"\d{4}-\d{2}-\d{2}"/g, "posted: 'Just now'");
    
    // Replace remaining new Date()
    content = content.replace(/posted:\s*new Date\([^)]*\)/g, "posted: 'Just now'");

    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`Cleaned dates in ${file}`);
  }
}
