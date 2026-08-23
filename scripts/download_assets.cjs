const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const images = [
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/logo-6.png',
    dest: 'public/images/logo.png'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/SON06807.JPG',
    dest: 'public/images/hero-1.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/SON06824.JPG',
    dest: 'public/images/hero-2.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/uploads/2026/07/DSC06997.jpg',
    dest: 'public/images/rooms/phong-a.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/uploads/2026/07/DSC06958.jpg',
    dest: 'public/images/rooms/phong-ad.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/uploads/2026/07/SON06845.jpg',
    dest: 'public/images/rooms/phong-b.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/uploads/2026/07/z3904767960943_c474bb9f92848f832420c3d34a1ef5be.jpg',
    dest: 'public/images/rooms/phong-c.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/uploads/2026/07/SON06896.jpg',
    dest: 'public/images/rooms/phong-d.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/img-05.jpg',
    dest: 'public/images/welcome-1.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/img-06.jpg',
    dest: 'public/images/welcome-2.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/img-02.jpg',
    dest: 'public/images/facility-1.jpg'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/03/towels-1024x837.png',
    dest: 'public/images/towels.png'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/icn1.png',
    dest: 'public/images/icons/icn1.png'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/icn2.png',
    dest: 'public/images/icons/icn2.png'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/icn3.png',
    dest: 'public/images/icons/icn3.png'
  },
  {
    url: 'https://galaxyhotel269.com/wp-content/themes/galaxy-hotel/assets/clone/www.nicdarkthemes.com/themes/hotel-booking/wp/demo/bedandbreakfast/wp-content/uploads/sites/6/2022/05/icn4.png',
    dest: 'public/images/icons/icn4.png'
  }
];

const downloadFile = (url, dest) => {
  return new Promise((resolve) => {
    const fullDest = path.join(__dirname, '..', dest);
    const dir = path.dirname(fullDest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { rejectUnauthorized: false, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        console.warn(`! Skipped ${url}: status code ${res.statusCode}`);
        return resolve();
      }
      const fileStream = fs.createWriteStream(fullDest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded: ${dest}`);
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error(`✗ Error downloading ${url}:`, err.message);
      resolve();
    });
  });
};

async function run() {
  console.log('Downloading assets from galaxyhotel269.com...');
  for (const item of images) {
    await downloadFile(item.url, item.dest);
  }
  console.log('All downloads completed!');
}

run();
