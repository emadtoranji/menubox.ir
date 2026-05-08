import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const users = [
  {
    id: "3c98ddbc-9151-4462-b00b-fce55650063f",
    email: "emadtoranji6@gmail.com",
    emailVerified: true,
    username: "emadtoranji",
    balance: "0.000000",
    currency: "irt",
    accessibility: "developer",
    status: "active",
    createdAt: "2026-02-03T00:00:00+00:00",
    lastLogin: "2026-02-03T00:00:00+00:00",
    updatedAt: "2026-02-03T00:00:00+00:00",
  },
];

const locations = [
  {
    id: "c159769a-ec41-4562-96c7-f5fed89160ef",
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "tehran",
    provinceEn: "Tehran",
    provinceLocal: "تهران",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "karaj",
    provinceEn: "Karaj",
    provinceLocal: "کرج",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "qazvin",
    provinceEn: "Qazvin",
    provinceLocal: "قزوین",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "rasht",
    provinceEn: "Rasht",
    provinceLocal: "رشت",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "sari",
    provinceEn: "Sari",
    provinceLocal: "ساری",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "gorgan",
    provinceEn: "Gorgan",
    provinceLocal: "گرگان",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "urmia",
    provinceEn: "Urmia",
    provinceLocal: "ارومیه",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "tabriz",
    provinceEn: "Tabriz",
    provinceLocal: "تبریز",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "ardabil",
    provinceEn: "Ardabil",
    provinceLocal: "اردبیل",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "zanjan",
    provinceEn: "Zanjan",
    provinceLocal: "زنجان",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "hamedan",
    provinceEn: "Hamadan",
    provinceLocal: "همدان",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "sanandaj",
    provinceEn: "Sanandaj",
    provinceLocal: "سنندج",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "kermanshah",
    provinceEn: "Kermanshah",
    provinceLocal: "کرمانشاه",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "ilam",
    provinceEn: "Ilam",
    provinceLocal: "ایلام",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "khorramabad",
    provinceEn: "Khorramabad",
    provinceLocal: "خرم‌آباد",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "ahvaz",
    provinceEn: "Ahvaz",
    provinceLocal: "اهواز",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "yasuj",
    provinceEn: "Yasuj",
    provinceLocal: "یاسوج",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "bushehr",
    provinceEn: "Bushehr",
    provinceLocal: "بوشهر",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "shiraz",
    provinceEn: "Shiraz",
    provinceLocal: "شیراز",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "bandar-abbas",
    provinceEn: "Bandar Abbas",
    provinceLocal: "بندرعباس",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "kerman",
    provinceEn: "Kerman",
    provinceLocal: "کرمان",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "zahedan",
    provinceEn: "Zahedan",
    provinceLocal: "زاهدان",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "birjand",
    provinceEn: "Birjand",
    provinceLocal: "بیرجند",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "mashhad",
    provinceEn: "Mashhad",
    provinceLocal: "مشهد",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "bojnord",
    provinceEn: "Bojnord",
    provinceLocal: "بجنورد",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "isfahan",
    provinceEn: "Isfahan",
    provinceLocal: "اصفهان",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "arak",
    provinceEn: "Arak",
    provinceLocal: "اراک",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "qom",
    provinceEn: "Qom",
    provinceLocal: "قم",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "yazd",
    provinceEn: "Yazd",
    provinceLocal: "یزد",
  },
  {
    countrySlug: "iran",
    countryEn: "Iran",
    countryLocal: "ایران",
    provinceSlug: "shahrekord",
    provinceEn: "Shahrekord",
    provinceLocal: "شهرکرد",
  },
];

const stores = [
  {
    id: "9757dde7-298c-4b6b-88cd-23e8a761b78d",
    userId: "3c98ddbc-9151-4462-b00b-fce55650063f",
    name: "تست",
    slug: "test",
    locationId: "c159769a-ec41-4562-96c7-f5fed89160ef",
    address: "میدان تجریش",
    phone: "0000000000",
    currency: "irt",
    taxEnabled: true,
    taxIncluded: true,
    taxPercent: 10,
    isActive: true,
    description:
      "این فروشگاه صرفا جهت تست و نمایش اطلاعات در وبسایت ایجاد شده است",
  },
];

const storeCategories = [
  {
    id: 4,
    storeId: "9757dde7-298c-4b6b-88cd-23e8a761b78d",
    key: "restaurant",
  },
  {
    id: 5,
    storeId: "9757dde7-298c-4b6b-88cd-23e8a761b78d",
    key: "cafe",
  },
];

const storeItems = [
  {
    id: "0eb33bf9-44a0-4754-9aa2-038ef9d8bdb2",
    storeId: "9757dde7-298c-4b6b-88cd-23e8a761b78d",
    title: "نوشابه",
    description: "نوشابه لیوانی سرو میشود",
    price: 100000,
    imageUrl: null,
    isAvailable: true,
    isActive: true,
    createdAt: "2026-02-03T00:00:00+00:00",
    updatedAt: "2026-02-03T00:00:00+00:00",
    category: "coldDrink",
    userId: "3c98ddbc-9151-4462-b00b-fce55650063f",
    discountPercent: 0,
  },
  {
    id: "5305325e-7532-4ede-9971-9c62470d91d0",
    storeId: "9757dde7-298c-4b6b-88cd-23e8a761b78d",
    title: "املت",
    description: "تخم مرغ گوجه فرنگی و کمی ادویه",
    price: 250000,
    imageUrl: null,
    isAvailable: true,
    isActive: true,
    createdAt: "2026-02-03T00:00:00+00:00",
    updatedAt: "2026-02-03T00:00:00+00:00",
    category: "breakfast",
    userId: "3c98ddbc-9151-4462-b00b-fce55650063f",
    discountPercent: 0,
  },
  {
    id: "9f001519-f467-49f9-9f5e-5970e6cff50c",
    storeId: "9757dde7-298c-4b6b-88cd-23e8a761b78d",
    title: "پپرونی",
    description: "گوشت ادویه دار فلفل قرمز پاپریکا",
    price: 500000,
    imageUrl: null,
    isAvailable: true,
    isActive: true,
    createdAt: "2026-02-03T00:00:00+00:00",
    updatedAt: "2026-02-03T00:00:00+00:00",
    category: "pizza",
    userId: "3c98ddbc-9151-4462-b00b-fce55650063f",
    discountPercent: 0,
  },
  {
    id: "e771c674-6c39-4d03-816c-999dcb6cb1f7",
    storeId: "9757dde7-298c-4b6b-88cd-23e8a761b78d",
    title: "کوبیده",
    description: "گوشت چرخ کرده پیاز رنده شده و نمک",
    price: 999000,
    imageUrl: null,
    isAvailable: true,
    isActive: true,
    createdAt: "2026-02-03T00:00:00+00:00",
    updatedAt: "2026-02-03T00:00:00+00:00",
    category: "kebab",
    userId: "3c98ddbc-9151-4462-b00b-fce55650063f",
    discountPercent: 10,
  },
];

const storeItemOptions = [
  {
    id: "24d08f74-4c4d-4cb4-beea-6fc66ecd56cb",
    itemId: "5305325e-7532-4ede-9971-9c62470d91d0",
    title: "نمک",
    isRequired: true,
    minSelect: 1,
    maxSelect: 1,
    createdAt: "2026-02-03T00:00:00+00:00",
    updatedAt: "2026-02-03T00:00:00+00:00",
    isActive: true,
    userId: "3c98ddbc-9151-4462-b00b-fce55650063f",
    price: 0,
    discountPercent: 0,
  },
  {
    id: "8df68fd4-5f77-421c-b0e8-1b57b4fd138f",
    itemId: "9f001519-f467-49f9-9f5e-5970e6cff50c",
    title: "نمک",
    isRequired: false,
    minSelect: 0,
    maxSelect: 1,
    createdAt: "2026-02-03T00:00:00+00:00",
    updatedAt: "2026-02-03T00:00:00+00:00",
    isActive: true,
    userId: "3c98ddbc-9151-4462-b00b-fce55650063f",
    price: 0,
    discountPercent: 0,
  },
  {
    id: "a00c5386-eced-4871-b74a-ac41a93a091b",
    itemId: "5305325e-7532-4ede-9971-9c62470d91d0",
    title: "فلفل تند",
    isRequired: false,
    minSelect: 0,
    maxSelect: 1,
    createdAt: "2026-02-03T00:00:00+00:00",
    updatedAt: "2026-02-03T00:00:00+00:00",
    isActive: true,
    userId: "3c98ddbc-9151-4462-b00b-fce55650063f",
    price: 10000,
    discountPercent: 50,
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

  await prisma.store.createMany({
    data: stores,
    skipDuplicates: true,
  });

  await prisma.storeCategory.createMany({
    data: storeCategories,
    skipDuplicates: true,
  });

  await prisma.storeItem.createMany({
    data: storeItems,
    skipDuplicates: true,
  });

  await prisma.storeItemOption.createMany({
    data: storeItemOptions,
    skipDuplicates: true,
  });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
