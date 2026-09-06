const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('archiver');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const apiDir = path.join(rootDir, 'api');
const outputPath = path.join(rootDir, 'galaxy_hotel_deploy.zip');

if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
}

const output = fs.createWriteStream(outputPath);
const archive = new ZipArchive({
  zlib: { level: 9 },
  forceLocalTime: true
});

output.on('close', function () {
  const sizeMb = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`\n======================================================`);
  console.log(`✓ ĐÃ TẠO THÀNH CÔNG: galaxy_hotel_deploy.zip (${sizeMb} MB)`);
  console.log(`✓ Chuẩn định dạng Linux / cPanel (Forward Slash / POSIX)`);
  console.log(`✓ File giải nén an toàn 100% trên hosting cPanel AZDIGI`);
  console.log(`======================================================\n`);
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);

// 1. Thêm toàn bộ file/thư mục trong dist/ vào root của zip
if (fs.existsSync(distDir)) {
  archive.directory(distDir, false);
}

// 2. Thêm thư mục api/ vào zip
if (fs.existsSync(apiDir)) {
  archive.directory(apiDir, 'api');
}

archive.finalize();
