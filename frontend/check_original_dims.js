
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'img');
const files = ['cursornrml.png', 'cursorpointe.png'];

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        // PNG height/width are at specific offsets
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        console.log(`${file}: ${width}x${height} (Ratio: ${(width / height).toFixed(2)})`);
    } else {
        console.log(`${file}: not found`);
    }
});
