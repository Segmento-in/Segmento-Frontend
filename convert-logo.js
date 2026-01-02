const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgPath = path.join(__dirname, 'public', 'images', 'logo-compact.svg');
const outputPath = path.join(__dirname, 'public', 'images', 'logo.png');

// Convert SVG to PNG
sharp(svgPath)
    .resize(800, 200)
    .png()
    .toFile(outputPath)
    .then(() => {
        console.log('✅ Logo converted to PNG successfully!');
        console.log(`   Output: ${outputPath}`);
    })
    .catch(err => {
        console.error('❌ Error converting logo:', err);
    });
