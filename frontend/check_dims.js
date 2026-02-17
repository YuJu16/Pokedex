
const fs = require('fs');
const path = require('path');

const files = ['cursornrml.png', 'cursorpointe.png'];
const dir = path.join(__dirname, 'public');

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        // PNG width is at offset 16 (4 bytes), height at 20 (4 bytes)
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        console.log(`${file}: ${width}x${height}`);
    } else {
        console.log(`${file}: not found`);
    }
});
