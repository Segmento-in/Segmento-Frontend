const fs = require('fs');
const path = require('path');

function fixTests(srcDir) {
  const testDir = path.join(srcDir, 'test');
  if (!fs.existsSync(testDir)) return;
  
  const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));
  
  for (const file of files) {
    const filePath = path.join(testDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // The component name is usually the filename without .test.tsx/.test.ts
    const componentName = file.replace(/\.test\.(tsx|ts)$/, '');
    
    // Replace `from '../../ComponentName'` with `from '../ComponentName'`
    const regex = new RegExp(`from\\s+['"]\\.\\.\\/\\.\\.\\/${componentName}['"]`, 'g');
    content = content.replace(regex, `from '../${componentName}'`);
    
    // Also, if there is a default export import that got messed up (e.g., page)
    if (componentName === 'page') {
      content = content.replace(/from\s+['"]\.\.\/\.\.\/page['"]/g, "from '../page'");
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
  }
}

fixTests('components/model-lab/tabs');
fixTests('hooks');
fixTests('app/model-lab/connectors');
