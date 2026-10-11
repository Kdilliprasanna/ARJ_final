const fs = require('fs');
const path = require('path');

const categories = [
  { id: 'AUTH', name: 'Authentication', count: 40, prefix: 'TC_AUTH' },
  { id: 'AUTHZ', name: 'Authorization', count: 40, prefix: 'TC_AUTHZ' },
  { id: 'NAV', name: 'Navigation', count: 30, prefix: 'TC_NAV' },
  { id: 'UI', name: 'UI Validation', count: 50, prefix: 'TC_UI' },
  { id: 'FORM', name: 'Forms', count: 50, prefix: 'TC_FORM' },
  { id: 'CRUD', name: 'CRUD Operations', count: 50, prefix: 'TC_CRUD' },
  { id: 'VAL', name: 'Input Validation', count: 40, prefix: 'TC_VAL' },
  { id: 'ERR', name: 'Error Handling', count: 20, prefix: 'TC_ERR' },
  { id: 'SESS', name: 'Session Management', count: 20, prefix: 'TC_SESS' },
  { id: 'FILE', name: 'File Upload', count: 20, prefix: 'TC_FILE' },
  { id: 'A11Y', name: 'Accessibility', count: 20, prefix: 'TC_A11Y' },
  { id: 'RESP', name: 'Responsive Design', count: 20, prefix: 'TC_RESP' },
  { id: 'PERF', name: 'Performance Smoke Tests', count: 20, prefix: 'TC_PERF' },
  { id: 'REGR', name: 'Regression', count: 50, prefix: 'TC_REGR' }
];

const priorityMap = ['P0', 'P1', 'P2', 'P3'];

const testCases = [];

categories.forEach(cat => {
  for (let i = 1; i <= cat.count; i++) {
    const num = String(i).padStart(3, '0');
    const testId = `${cat.prefix}_${num}`;
    const priority = i <= 5 ? 'P0' : i <= 20 ? 'P1' : i <= 35 ? 'P2' : 'P3';
    
    let testName = `${cat.name} Scenario #${i}`;
    let preconditions = 'Application is deployed and live at BASE_URL';
    let steps = [
      'Navigate to BASE_URL',
      `Execute ${cat.name.toLowerCase()} operation #${i}`,
      'Verify DOM response and state persistence'
    ];
    let expected = `${cat.name} scenario #${i} completes successfully without errors or layout shifts`;

    if (cat.id === 'AUTH') {
      if (i === 1) testName = 'Verify user login with valid registered credentials';
      else if (i === 2) testName = 'Verify login rejection on unregistered email';
      else if (i === 3) testName = 'Verify password masking and unmasking toggle';
      else if (i === 4) testName = 'Verify direct email password reset request';
      else testName = `Verify authentication boundary and token handling #${i}`;
    } else if (cat.id === 'UI') {
      if (i === 1) testName = 'Verify dark theme root background #090d16 applied';
      else if (i === 2) testName = 'Verify ARJ tie logo branding renders cleanly';
      else if (i === 3) testName = 'Verify navigation bar responsive layout';
      else testName = `Verify visual parity and CSS design token #${i}`;
    } else if (cat.id === 'NAV') {
      testName = `Verify routing and navigation transition to section #${i}`;
    } else if (cat.id === 'PERF') {
      testName = `Measure first contentful paint and interaction responsiveness #${i}`;
    }

    testCases.push({
      testCaseId: testId,
      module: cat.name,
      moduleId: cat.id,
      priority,
      name: testName,
      preconditions,
      testSteps: steps,
      expectedResult: expected
    });
  }
});

const outputPath = path.join(__dirname, 'testCasesDefinition.json');
fs.writeFileSync(outputPath, JSON.stringify(testCases, null, 2), 'utf8');
console.log(`Generated ${testCases.length} test case definitions in ${outputPath}`);
