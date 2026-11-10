const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native',
  'Libraries',
  'Utilities',
  'warnOnce.js'
);

try {
  if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');
    if (!content.includes('image-background-deprecated')) {
      content = content.replace(
        'function warnOnce(key: string, message: string) {',
        'function warnOnce(key: string, message: string) {\n  if (key === "image-background-deprecated" || key === "safe-area-view-deprecated" || warnedKeys[key]) return;'
      );
      fs.writeFileSync(targetFile, content, 'utf8');
      console.log('✓ Successfully silenced deprecated React Native warnings.');
    }
  }
} catch (e) {
  // Fail silently
}
