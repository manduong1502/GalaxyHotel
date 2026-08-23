const https = require('https');
const fs = require('fs');

async function getPage(url) {
  return new Promise(resolve => {
    https.get(url, { rejectUnauthorized: false, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function main() {
  const pages = [
    'https://galaxyhotel269.com/',
    'https://galaxyhotel269.com/rooms/phong-a/',
    'https://galaxyhotel269.com/rooms/phong-a-2/',
    'https://galaxyhotel269.com/rooms/phong-b/',
    'https://galaxyhotel269.com/rooms/phong-c/',
    'https://galaxyhotel269.com/rooms/phong-d/',
    'https://galaxyhotel269.com/rooms/phong-e/'
  ];
  const allImages = new Set();
  for (const p of pages) {
    const html = await getPage(p);
    const matches = html.match(/https:\/\/[^\"\'\s]+\.(?:jpg|jpeg|png|webp|JPG|PNG)/g) || [];
    matches.forEach(m => {
      if (m.includes('galaxyhotel269.com/wp-content/')) {
        allImages.add(m);
      }
    });
  }
  console.log('Found ' + allImages.size + ' unique images:');
  Array.from(allImages).forEach(img => console.log(img));
}
main();
