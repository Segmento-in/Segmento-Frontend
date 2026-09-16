const fs = require('fs');
const path = require('path');

function moveTests(srcDir) {
  if (!fs.existsSync(srcDir)) return;
  const testDir = path.join(srcDir, 'test');
  
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));
  if (files.length === 0) return;
  
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
  
  for (const file of files) {
    const oldPath = path.join(srcDir, file);
    const newPath = path.join(testDir, file);
    let content = fs.readFileSync(oldPath, 'utf8');
    
    // Update component import: from './Component' to '../Component'
    content = content.replace(/from\s+['"]\.\/([^'"]+)['"]/g, "from '../$1'");
    
    // Update relative mocks and imports: from '../Component' to '../../Component'
    content = content.replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, "from '../../$1'");
    content = content.replace(/mock\(['"]\.\.\/([^'"]+)['"]/g, "mock('../../$1'");
    
    fs.writeFileSync(newPath, content, 'utf8');
    fs.unlinkSync(oldPath);
    console.log(`Moved ${oldPath} to ${newPath}`);
  }
}

moveTests('components/model-lab/tabs');
moveTests('hooks');
moveTests('app/model-lab/connectors');
