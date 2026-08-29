const fs = require('fs');

const content = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

console.log('--- AUDITING BATCH PARENT ROW VS CHILD ITEM BUTTONS ---');

// Search for all occurrences of Compare Quotes / Compare Rates
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('Compare Quotes') || line.includes('Compare Rates') || line.includes('setSelectedRequestForComparison')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
