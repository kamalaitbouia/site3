import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Generate pixels
  const rawScanlines = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawScanlines[offset++] = 0; // Filter byte: None
    const ny = y / height;

    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient: Teal/Slate
      let r = Math.round(14 + (4 - 14) * ny);
      let g = Math.round(116 + (47 - 116) * ny);
      let b = Math.round(144 + (46 - 144) * ny);
      let a = 255;

      // Inner icon area (box & spark)
      if (dist < 0.28) {
        // Center box emblem: bright teal & gold
        if (dy > -0.05 && Math.abs(dx) < 0.2) {
          r = 20; g = 184; b = 166;
        } else if (dy <= -0.05 && dist < 0.22) {
          r = 45; g = 212; b = 191;
        }
      }

      // Profit badge in bottom corner
      const bdx = nx - 0.72;
      const bdy = ny - 0.72;
      const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
      if (bdist < 0.16) {
        if (bdist < 0.14) {
          r = 245; g = 158; b = 11; // Amber
        } else {
          r = 255; g = 255; b = 255; // White border
        }
      }

      // If not maskable, round corners
      if (!isMaskable) {
        const cornerR = 0.22;
        const cx = nx < 0.5 ? nx : 1 - nx;
        const cy = ny < 0.5 ? ny : 1 - ny;
        if (cx < cornerR && cy < cornerR) {
          const cdist = Math.sqrt((cornerR - cx) ** 2 + (cornerR - cy) ** 2);
          if (cdist > cornerR) {
            a = 0; // Transparent outside corner
          }
        }
      }

      rawScanlines[offset++] = r;
      rawScanlines[offset++] = g;
      rawScanlines[offset++] = b;
      rawScanlines[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawScanlines);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));

console.log('Successfully generated all PWA PNG icons in public directory!');
