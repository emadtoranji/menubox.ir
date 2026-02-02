import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Users
const users = [
  {
    email: 'emadtoranji6@gmail.com',
    emailVerified: true,
    username: 'emadtoranji',
    accessibility: 'developer',
    status: 'active',
  },
];

// Locations (country + province combined)
const locations = [
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'tehran',
    provinceEn: 'Tehran',
    provinceLocal: 'تهران',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'karaj',
    provinceEn: 'Karaj',
    provinceLocal: 'کرج',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'qazvin',
    provinceEn: 'Qazvin',
    provinceLocal: 'قزوین',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'rasht',
    provinceEn: 'Rasht',
    provinceLocal: 'رشت',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'sari',
    provinceEn: 'Sari',
    provinceLocal: 'ساری',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'gorgan',
    provinceEn: 'Gorgan',
    provinceLocal: 'گرگان',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'urmia',
    provinceEn: 'Urmia',
    provinceLocal: 'ارومیه',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'tabriz',
    provinceEn: 'Tabriz',
    provinceLocal: 'تبریز',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'ardabil',
    provinceEn: 'Ardabil',
    provinceLocal: 'اردبیل',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'zanjan',
    provinceEn: 'Zanjan',
    provinceLocal: 'زنجان',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'hamedan',
    provinceEn: 'Hamadan',
    provinceLocal: 'همدان',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'sanandaj',
    provinceEn: 'Sanandaj',
    provinceLocal: 'سنندج',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'kermanshah',
    provinceEn: 'Kermanshah',
    provinceLocal: 'کرمانشاه',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'ilam',
    provinceEn: 'Ilam',
    provinceLocal: 'ایلام',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'khorramabad',
    provinceEn: 'Khorramabad',
    provinceLocal: 'خرم‌آباد',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'ahvaz',
    provinceEn: 'Ahvaz',
    provinceLocal: 'اهواز',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'yasuj',
    provinceEn: 'Yasuj',
    provinceLocal: 'یاسوج',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'bushehr',
    provinceEn: 'Bushehr',
    provinceLocal: 'بوشهر',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'shiraz',
    provinceEn: 'Shiraz',
    provinceLocal: 'شیراز',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'bandar-abbas',
    provinceEn: 'Bandar Abbas',
    provinceLocal: 'بندرعباس',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'kerman',
    provinceEn: 'Kerman',
    provinceLocal: 'کرمان',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'zahedan',
    provinceEn: 'Zahedan',
    provinceLocal: 'زاهدان',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'birjand',
    provinceEn: 'Birjand',
    provinceLocal: 'بیرجند',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'mashhad',
    provinceEn: 'Mashhad',
    provinceLocal: 'مشهد',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'bojnord',
    provinceEn: 'Bojnord',
    provinceLocal: 'بجنورد',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'isfahan',
    provinceEn: 'Isfahan',
    provinceLocal: 'اصفهان',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'arak',
    provinceEn: 'Arak',
    provinceLocal: 'اراک',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'qom',
    provinceEn: 'Qom',
    provinceLocal: 'قم',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'yazd',
    provinceEn: 'Yazd',
    provinceLocal: 'یزد',
  },
  {
    countrySlug: 'iran',
    countryEn: 'Iran',
    countryLocal: 'ایران',
    provinceSlug: 'shahrekord',
    provinceEn: 'Shahrekord',
    provinceLocal: 'شهرکرد',
  },
];

export async function main() {
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  await prisma.location.createMany({
    data: locations,
    skipDuplicates: true,
  });

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
