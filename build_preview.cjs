const fs = require('fs');
const path = require('path');

console.log('Starting preview compiler...');

// File paths
const indexPath = path.join(__dirname, 'public', 'index.html');
const cssPath = path.join(__dirname, 'public', 'style.css');
const jsPath = path.join(__dirname, 'public', 'app.js');
const outputPath = path.join(__dirname, 'public', 'preview.html');

// Read core assets
let html = fs.readFileSync(indexPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// Inline CSS
console.log('Inlining CSS...');
const cssLinkRegex = /<link rel="stylesheet" href="style\.css\?v=2\.0" \/>/;
html = html.replace(cssLinkRegex, `<style>\n${css}\n</style>`);

// Inline JS
console.log('Inlining JavaScript...');
const jsScriptRegex = /<script src="app\.js"><\/script>/;
html = html.replace(jsScriptRegex, `<script>\n${js}\n</script>`);

// Inline Base64 images
const imageMap = {
  'images/logo_fmipa.png': 'logo_fmipa_b64.txt',
  'images/makara_fmipa.png': 'makara_fmipa_b64.txt',
  'images/family_3d.png': 'family_3d_b64.txt',
  'images/prize_3d.png': 'prize_3d_b64.txt',
  'images/feast_3d.png': 'feast_3d_b64.txt',
  'images/camera_3d.png': 'camera_3d_b64.txt'
};

for (const [imgSrc, txtFile] of Object.entries(imageMap)) {
  const txtPath = path.join(__dirname, 'public', txtFile);
  if (fs.existsSync(txtPath)) {
    console.log(`Inlining ${imgSrc} from ${txtFile}...`);
    const b64 = fs.readFileSync(txtPath, 'utf8').trim();
    // Replace src="images/..." or src="images/..."
    const regex = new RegExp(`src="${imgSrc}"`, 'g');
    html = html.replace(regex, `src="data:image/png;base64,${b64}"`);
  } else {
    console.warn(`Warning: ${txtFile} not found!`);
  }
}

// Replace the large group photo with a high quality public URL so the HTML stays under 3MB
console.log('Replacing large group photo with Unsplash URL...');
html = html.replace('src="images/math09.png"', 'src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"');

// Save preview
fs.writeFileSync(outputPath, html, 'utf8');
console.log('Successfully compiled preview.html! File size:', (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2), 'MB');
