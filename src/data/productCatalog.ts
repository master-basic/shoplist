export interface CatalogProduct {
  name: string;
  category: string;
  typicalPrice: number;
  unit: string;
  store: string;
}

export const PRODUCT_CATALOG: CatalogProduct[] = [
  // ============ PRODUCE ============
  { name: 'Alma (Apple)', category: 'produce', typicalPrice: 1.50, unit: 'kg', store: 'Araz' },
  { name: 'Alma (Apple) 1kq', category: 'produce', typicalPrice: 1.35, unit: 'kg', store: 'Bravo' },
  { name: 'Banana 1kq', category: 'produce', typicalPrice: 2.99, unit: 'kg', store: 'Bravo' },
  { name: 'Pomidor (Tomato) 1kq', category: 'produce', typicalPrice: 1.59, unit: 'kg', store: 'Bravo' },
  { name: 'Xiyar (Cucumber)', category: 'produce', typicalPrice: 1.25, unit: 'kg', store: 'Bravo' },
  { name: 'Kartof (Potato) 1kq', category: 'produce', typicalPrice: 0.85, unit: 'kg', store: 'Bravo' },
  { name: 'Soğan (Onion) 1kq', category: 'produce', typicalPrice: 0.69, unit: 'kg', store: 'Bravo' },
  { name: 'Nar (Pomegranate) 1kq', category: 'produce', typicalPrice: 3.19, unit: 'kg', store: 'Bravo' },
  { name: 'Limon 1kq', category: 'produce', typicalPrice: 1.99, unit: 'kg', store: 'Bravo' },
  { name: 'Kələm (Cabbage)', category: 'produce', typicalPrice: 0.79, unit: 'kg', store: 'Bravo' },
  { name: 'Armud (Pear)', category: 'produce', typicalPrice: 2.50, unit: 'kg', store: 'Araz' },
  { name: 'Portağal (Orange)', category: 'produce', typicalPrice: 2.00, unit: 'kg', store: 'Araz' },
  { name: 'Banana', category: 'produce', typicalPrice: 2.80, unit: 'kg', store: 'Araz' },
  { name: 'Üzüm (Grape)', category: 'produce', typicalPrice: 3.00, unit: 'kg', store: 'Araz' },
  { name: 'Çiyələk (Strawberry)', category: 'produce', typicalPrice: 4.50, unit: 'kg', store: 'Araz' },
  { name: 'Limon', category: 'produce', typicalPrice: 1.80, unit: 'kg', store: 'Araz' },
  { name: 'Nar (Pomegranate)', category: 'produce', typicalPrice: 3.50, unit: 'kg', store: 'Araz' },
  { name: 'Kivi', category: 'produce', typicalPrice: 3.20, unit: 'kg', store: 'Araz' },
  { name: 'Manqo', category: 'produce', typicalPrice: 5.00, unit: 'pcs', store: 'Araz' },
  { name: 'Pomidor (Tomato)', category: 'produce', typicalPrice: 1.80, unit: 'kg', store: 'Araz' },
  { name: 'Xiyar (Cucumber)', category: 'produce', typicalPrice: 1.20, unit: 'kg', store: 'Araz' },
  { name: 'Kartof (Potato)', category: 'produce', typicalPrice: 0.80, unit: 'kg', store: 'Araz' },
  { name: 'Soğan (Onion)', category: 'produce', typicalPrice: 0.60, unit: 'kg', store: 'Araz' },
  { name: 'Kələm (Cabbage)', category: 'produce', typicalPrice: 0.70, unit: 'kg', store: 'Araz' },
  { name: 'Yerkökü (Carrot)', category: 'produce', typicalPrice: 0.90, unit: 'kg', store: 'Araz' },
  { name: 'Badımcan (Eggplant)', category: 'produce', typicalPrice: 1.50, unit: 'kg', store: 'Araz' },
  { name: 'Bolqar bibəri (Bell pepper)', category: 'produce', typicalPrice: 2.50, unit: 'kg', store: 'Araz' },
  { name: 'Sarımasaq (Garlic)', category: 'produce', typicalPrice: 4.00, unit: 'kg', store: 'Araz' },
  { name: 'Göyərti (Herbs mix)', category: 'produce', typicalPrice: 0.50, unit: 'pack', store: 'Araz' },
  { name: 'İspanaq (Spinach)', category: 'produce', typicalPrice: 1.50, unit: 'pack', store: 'Araz' },
  { name: 'Kahı (Lettuce)', category: 'produce', typicalPrice: 1.00, unit: 'pcs', store: 'Araz' },

  // ============ DAIRY ============
  { name: 'Süd (Milk) 1L', category: 'dairy', typicalPrice: 2.00, unit: 'l', store: 'Araz' },
  { name: 'Süd (Milk) 1L', category: 'dairy', typicalPrice: 2.19, unit: 'l', store: 'Bravo' },
  { name: 'Qatıq (Yogurt) 500g', category: 'dairy', typicalPrice: 1.35, unit: 'pcs', store: 'Bravo' },
  { name: 'Kərə yağı (Butter) 200g', category: 'dairy', typicalPrice: 2.89, unit: 'pcs', store: 'Bravo' },
  { name: 'Toyuq yumurtası (Eggs) 10lu', category: 'dairy', typicalPrice: 2.39, unit: 'pack', store: 'Bravo' },
  { name: 'Golden Cow Pendir 125 q', category: 'dairy', typicalPrice: 1.50, unit: 'pcs', store: 'Bravo' },
  { name: 'Golden Cow Pendir 250 q', category: 'dairy', typicalPrice: 2.55, unit: 'pcs', store: 'Bravo' },
  { name: 'Golden Cow Pendir 500 q', category: 'dairy', typicalPrice: 4.45, unit: 'pcs', store: 'Bravo' },
  { name: 'Sab Kənd Dovğası 180 q', category: 'dairy', typicalPrice: 0.89, unit: 'pcs', store: 'Bravo' },
  { name: 'Qatıq (Yogurt) 500g', category: 'dairy', typicalPrice: 1.50, unit: 'pcs', store: 'Araz' },
  { name: 'Xama (Sour cream) 200g', category: 'dairy', typicalPrice: 1.20, unit: 'pcs', store: 'Araz' },
  { name: 'Kərə yağı (Butter) 200g', category: 'dairy', typicalPrice: 3.00, unit: 'pcs', store: 'Araz' },
  { name: 'Pendir (Cheese) 300g', category: 'dairy', typicalPrice: 4.50, unit: 'pcs', store: 'Araz' },
  { name: 'Mozzarella pendiri 200g', category: 'dairy', typicalPrice: 3.50, unit: 'pcs', store: 'Araz' },
  { name: 'Şor (Cottage cheese) 400g', category: 'dairy', typicalPrice: 2.50, unit: 'pcs', store: 'Araz' },
  { name: 'Kefir 1L', category: 'dairy', typicalPrice: 1.80, unit: 'l', store: 'Araz' },
  { name: 'Ryajenka 500ml', category: 'dairy', typicalPrice: 1.40, unit: 'pcs', store: 'Araz' },
  { name: 'Qaymaq (Cream) 200ml', category: 'dairy', typicalPrice: 2.00, unit: 'pcs', store: 'Araz' },
  { name: 'Süzmə (Strained yogurt) 500g', category: 'dairy', typicalPrice: 2.80, unit: 'pcs', store: 'Araz' },
  { name: 'İçməli qatıq (Drinkable yogurt) 1L', category: 'dairy', typicalPrice: 2.20, unit: 'l', store: 'Araz' },
  { name: 'Toyuq yumurtası (Eggs) 10lu', category: 'dairy', typicalPrice: 2.50, unit: 'pack', store: 'Araz' },
  { name: 'Marqarin 200g', category: 'dairy', typicalPrice: 1.00, unit: 'pcs', store: 'Araz' },

  // ============ MEAT ============
  { name: 'Toyuq döş filesi (Chicken breast)', category: 'meat', typicalPrice: 8.00, unit: 'kg', store: 'Araz' },
  { name: 'Toyuq budu (Chicken leg)', category: 'meat', typicalPrice: 5.50, unit: 'kg', store: 'Araz' },
  { name: 'Mal əti (Beef) qıyma', category: 'meat', typicalPrice: 10.00, unit: 'kg', store: 'Araz' },
  { name: 'Mal əti (Beef) döş', category: 'meat', typicalPrice: 12.00, unit: 'kg', store: 'Araz' },
  { name: 'Quzu əti (Lamb)', category: 'meat', typicalPrice: 14.00, unit: 'kg', store: 'Araz' },
  { name: 'Hinduşka əti (Turkey)', category: 'meat', typicalPrice: 9.00, unit: 'kg', store: 'Araz' },
  { name: 'Kolbasa (Sausage) 500g', category: 'meat', typicalPrice: 4.00, unit: 'pcs', store: 'Araz' },
  { name: 'Sosiska 400g', category: 'meat', typicalPrice: 3.00, unit: 'pack', store: 'Araz' },
  { name: 'Vetçina (Ham) 300g', category: 'meat', typicalPrice: 4.50, unit: 'pcs', store: 'Araz' },
  { name: 'Balıq filesi (Fish fillet)', category: 'meat', typicalPrice: 7.00, unit: 'kg', store: 'Araz' },
  { name: 'Kartof kotleti 500g', category: 'meat', typicalPrice: 3.00, unit: 'pack', store: 'Araz' },

  // ============ BAKERY ============
  { name: 'Çörək (Bread) standart', category: 'bakery', typicalPrice: 0.50, unit: 'pcs', store: 'Araz' },
  { name: 'Çörək (Bread)', category: 'bakery', typicalPrice: 0.59, unit: 'pcs', store: 'Bravo' },
  { name: 'Lavaş', category: 'bakery', typicalPrice: 0.70, unit: 'pcs', store: 'Bravo' },
  { name: 'Tendir çörəyi', category: 'bakery', typicalPrice: 0.80, unit: 'pcs', store: 'Araz' },
  { name: 'Lavaş', category: 'bakery', typicalPrice: 0.60, unit: 'pcs', store: 'Araz' },
  { name: 'Qara çörək (Rye bread)', category: 'bakery', typicalPrice: 0.70, unit: 'pcs', store: 'Araz' },
  { name: 'Tost çörəyi 400g', category: 'bakery', typicalPrice: 1.50, unit: 'pack', store: 'Araz' },
  { name: 'Kruassan (Croissant)', category: 'bakery', typicalPrice: 1.20, unit: 'pcs', store: 'Araz' },
  { name: 'Piroq (Meat/Cheese pastry)', category: 'bakery', typicalPrice: 1.00, unit: 'pcs', store: 'Araz' },
  { name: 'Keks (Cupcake)', category: 'bakery', typicalPrice: 1.50, unit: 'pcs', store: 'Araz' },
  { name: 'Paxlava (Pakhlava)', category: 'bakery', typicalPrice: 5.00, unit: 'kg', store: 'Araz' },
  { name: 'Simit', category: 'bakery', typicalPrice: 1.00, unit: 'pcs', store: 'Araz' },
  { name: 'Pişməniyə', category: 'bakery', typicalPrice: 3.00, unit: 'kg', store: 'Araz' },
  { name: 'Qoğal (Gogal)', category: 'bakery', typicalPrice: 0.80, unit: 'pcs', store: 'Araz' },

  // ============ FROZEN ============
  { name: 'Dondurulmuş toyuq ətraf', category: 'frozen', typicalPrice: 6.00, unit: 'kg', store: 'Araz' },
  { name: 'Dondurulmuş balıq filesi', category: 'frozen', typicalPrice: 5.50, unit: 'kg', store: 'Araz' },
  { name: 'Dondurulmuş tərəvəz qarışığı 400g', category: 'frozen', typicalPrice: 2.00, unit: 'pack', store: 'Araz' },
  { name: 'Dondurulmuş brokoli 400g', category: 'frozen', typicalPrice: 2.50, unit: 'pack', store: 'Araz' },
  { name: 'Pelmen 500g', category: 'frozen', typicalPrice: 3.00, unit: 'pack', store: 'Araz' },
  { name: 'Dondurma (Ice cream) 1L', category: 'frozen', typicalPrice: 4.00, unit: 'l', store: 'Araz' },
  { name: 'Pizza dondurulmuş 350g', category: 'frozen', typicalPrice: 4.50, unit: 'pcs', store: 'Araz' },
  { name: 'Dondurulmuş meyvə (Mixed fruit)', category: 'frozen', typicalPrice: 3.50, unit: 'pack', store: 'Araz' },
  { name: 'Dondurulmuş kartof fri 1kg', category: 'frozen', typicalPrice: 2.50, unit: 'pack', store: 'Araz' },

  // ============ PANTRY ============
  { name: 'Düyü (Rice) 1kg', category: 'pantry', typicalPrice: 2.50, unit: 'kg', store: 'Araz' },
  { name: 'Makaron (Pasta) 500g', category: 'pantry', typicalPrice: 1.20, unit: 'pack', store: 'Araz' },
  { name: 'Un (Flour) 2kg', category: 'pantry', typicalPrice: 2.00, unit: 'kg', store: 'Araz' },
  { name: 'Şəkər (Sugar) 1kg', category: 'pantry', typicalPrice: 1.80, unit: 'kg', store: 'Araz' },
  { name: 'Duz (Salt) 750g', category: 'pantry', typicalPrice: 0.50, unit: 'pack', store: 'Araz' },
  { name: 'Bitki yağı (Oil) 1L', category: 'pantry', typicalPrice: 3.50, unit: 'l', store: 'Araz' },
  { name: 'Zeytun yağı (Olive oil) 500ml', category: 'pantry', typicalPrice: 7.00, unit: 'pcs', store: 'Araz' },
  { name: 'Noxud (Chickpea) 500g', category: 'pantry', typicalPrice: 2.00, unit: 'pack', store: 'Araz' },
  { name: 'Mərci (Lentil) 500g', category: 'pantry', typicalPrice: 1.80, unit: 'pack', store: 'Araz' },
  { name: 'Pomidor pastası 500g', category: 'pantry', typicalPrice: 2.00, unit: 'pcs', store: 'Araz' },
  { name: 'Konservləşdirilmiş qarğıdalı 300g', category: 'pantry', typicalPrice: 1.50, unit: 'can', store: 'Araz' },
  { name: 'Konservləşdirilmiş noxud 400g', category: 'pantry', typicalPrice: 1.20, unit: 'can', store: 'Araz' },
  { name: 'Mayonez 400g', category: 'pantry', typicalPrice: 2.00, unit: 'pcs', store: 'Araz' },
  { name: 'Ketçup 500g', category: 'pantry', typicalPrice: 2.50, unit: 'pcs', store: 'Araz' },
  { name: 'Xardal (Mustard) 200g', category: 'pantry', typicalPrice: 1.50, unit: 'pcs', store: 'Araz' },
  { name: 'Sirkə (Vinegar) 500ml', category: 'pantry', typicalPrice: 1.00, unit: 'pcs', store: 'Araz' },
  { name: 'Bal (Honey) 300g', category: 'pantry', typicalPrice: 5.00, unit: 'pcs', store: 'Araz' },
  { name: 'Mürəbbə (Jam) 300g', category: 'pantry', typicalPrice: 3.00, unit: 'pcs', store: 'Araz' },
  { name: 'Narşərab (Pomegranate sauce) 500ml', category: 'pantry', typicalPrice: 4.00, unit: 'pcs', store: 'Araz' },
  { name: 'Çay (Tea) 100 q', category: 'pantry', typicalPrice: 3.00, unit: 'pack', store: 'Araz' },
  { name: 'Armudu Earl Grey Qara Cay 225 Qr', category: 'pantry', typicalPrice: 5.99, unit: 'pack', store: 'Bravo' },
  { name: 'Qəhvə (Coffee) 200g', category: 'pantry', typicalPrice: 8.00, unit: 'pack', store: 'Araz' },

  // ============ BEVERAGES ============
  { name: 'Su (Water) 1.5L', category: 'beverages', typicalPrice: 0.70, unit: 'bottle', store: 'Araz' },
  { name: 'Coca-Cola 2L', category: 'beverages', typicalPrice: 2.00, unit: 'bottle', store: 'Araz' },
  { name: 'Coolsy Cola 2L', category: 'beverages', typicalPrice: 1.99, unit: 'bottle', store: 'Bravo' },
  { name: 'Fanta Portağal 2L', category: 'beverages', typicalPrice: 2.00, unit: 'bottle', store: 'Araz' },
  { name: 'Sprite 2L', category: 'beverages', typicalPrice: 2.00, unit: 'bottle', store: 'Araz' },
  { name: 'Meyvə şirəsi (Juice) 1L', category: 'beverages', typicalPrice: 2.50, unit: 'pack', store: 'Araz' },
  { name: 'Soyuq çay (Ice tea) 1L', category: 'beverages', typicalPrice: 2.00, unit: 'bottle', store: 'Araz' },
  { name: 'Enerji içkisi (Energy drink) 250ml', category: 'beverages', typicalPrice: 2.50, unit: 'can', store: 'Araz' },
  { name: 'Mineral su (Mineral water) 500ml', category: 'beverages', typicalPrice: 0.80, unit: 'bottle', store: 'Araz' },
  { name: 'Soyuq qəhvə (Iced coffee) 250ml', category: 'beverages', typicalPrice: 2.50, unit: 'can', store: 'Araz' },
  { name: 'Ayran 1L', category: 'beverages', typicalPrice: 1.50, unit: 'pack', store: 'Araz' },
  { name: 'Kompot 1L', category: 'beverages', typicalPrice: 2.00, unit: 'pack', store: 'Araz' },

  // ============ SNACKS ============
  { name: 'Çipsi (Chips) 150g', category: 'snacks', typicalPrice: 2.00, unit: 'pack', store: 'Araz' },
  { name: 'Pecenye (Cookie) 200g', category: 'snacks', typicalPrice: 2.00, unit: 'pack', store: 'Araz' },
  { name: 'Şokolad (Chocolate) 90g', category: 'snacks', typicalPrice: 3.00, unit: 'pcs', store: 'Araz' },
  { name: 'Kreker 200g', category: 'snacks', typicalPrice: 1.50, unit: 'pack', store: 'Araz' },
  { name: 'Vafli 150g', category: 'snacks', typicalPrice: 1.50, unit: 'pack', store: 'Araz' },
  { name: 'Qoz (Walnut) 200g', category: 'snacks', typicalPrice: 4.00, unit: 'pack', store: 'Araz' },
  { name: 'Fındıq (Hazelnut) 200g', category: 'snacks', typicalPrice: 5.00, unit: 'pack', store: 'Araz' },
  { name: 'Badam (Almond) 200g', category: 'snacks', typicalPrice: 5.50, unit: 'pack', store: 'Araz' },
  { name: 'Püstə (Pistachio) 200g', category: 'snacks', typicalPrice: 6.00, unit: 'pack', store: 'Araz' },
  { name: 'Quru meyvə qarışığı 300g', category: 'snacks', typicalPrice: 4.00, unit: 'pack', store: 'Araz' },
  { name: 'Günəbaxan toxumu 100g', category: 'snacks', typicalPrice: 1.00, unit: 'pack', store: 'Araz' },
  { name: 'Saqqız (Gum)', category: 'snacks', typicalPrice: 0.50, unit: 'pcs', store: 'Araz' },
  { name: 'Marmelad 200g', category: 'snacks', typicalPrice: 2.00, unit: 'pack', store: 'Araz' },
  { name: 'Draje şirniyyat 150g', category: 'snacks', typicalPrice: 2.50, unit: 'pack', store: 'Araz' },

  // ============ HOUSEHOLD ============
  { name: 'Tualet kağızı (Toilet paper) 8 li', category: 'household', typicalPrice: 4.00, unit: 'pack', store: 'Araz' },
  { name: 'Sleepy Easy Clean Təmizlik Salfet 30əd', category: 'household', typicalPrice: 6.49, unit: 'pack', store: 'Bravo' },
  { name: 'Kağız dəsmal (Paper towel) 3lü', category: 'household', typicalPrice: 3.50, unit: 'pack', store: 'Araz' },
  { name: 'Salfet (Napkin) 100lü', category: 'household', typicalPrice: 1.50, unit: 'pack', store: 'Araz' },
  { name: 'Zibil torbası (Trash bag) 20li', category: 'household', typicalPrice: 2.00, unit: 'pack', store: 'Araz' },
  { name: 'Yuyucu toz (Laundry powder) 2kg', category: 'household', typicalPrice: 8.00, unit: 'pack', store: 'Araz' },
  { name: 'Yuyucu maye (Liquid detergent) 1L', category: 'household', typicalPrice: 6.00, unit: 'bottle', store: 'Araz' },
  { name: 'Qabyuyan maye (Dish soap) 500ml', category: 'household', typicalPrice: 2.50, unit: 'bottle', store: 'Araz' },
  { name: 'Təmizlik spreyi (Cleaner) 500ml', category: 'household', typicalPrice: 3.00, unit: 'bottle', store: 'Araz' },
  { name: 'Hava təravətləndirici (Air freshener)', category: 'household', typicalPrice: 3.50, unit: 'pcs', store: 'Araz' },
  { name: 'Süngər (Sponge) 5li', category: 'household', typicalPrice: 1.50, unit: 'pack', store: 'Araz' },
  { name: 'Yapışqan lent (Tape)', category: 'household', typicalPrice: 1.00, unit: 'pcs', store: 'Araz' },

  // ============ PERSONAL CARE ============
  { name: 'Şampun (Shampoo) 400ml', category: 'personal_care', typicalPrice: 5.00, unit: 'bottle', store: 'Araz' },
  { name: 'Sabun (Soap) 100g', category: 'personal_care', typicalPrice: 1.00, unit: 'pcs', store: 'Araz' },
  { name: 'Diş məcunu (Toothpaste) 100ml', category: 'personal_care', typicalPrice: 3.50, unit: 'pcs', store: 'Araz' },
  { name: 'Dezodorant (Deodorant) 150ml', category: 'personal_care', typicalPrice: 5.00, unit: 'pcs', store: 'Araz' },
  { name: 'Üz kremi (Face cream) 50ml', category: 'personal_care', typicalPrice: 8.00, unit: 'pcs', store: 'Araz' },
  { name: 'Saç balzamı (Conditioner) 400ml', category: 'personal_care', typicalPrice: 5.00, unit: 'bottle', store: 'Araz' },
  { name: 'Duş geli (Shower gel) 400ml', category: 'personal_care', typicalPrice: 4.50, unit: 'bottle', store: 'Araz' },
  { name: 'Ülgüc (Razor) tək', category: 'personal_care', typicalPrice: 2.00, unit: 'pcs', store: 'Araz' },
  { name: 'Pambıq çubuq (Cotton swab) 100lü', category: 'personal_care', typicalPrice: 1.50, unit: 'pack', store: 'Araz' },
  { name: 'Yaş salfet (Wet wipe) 50li', category: 'personal_care', typicalPrice: 2.00, unit: 'pack', store: 'Araz' },

  // ============ OTHER ============
  { name: 'Bayram şamı (Candle)', category: 'other', typicalPrice: 2.00, unit: 'pack', store: 'Araz' },
  { name: 'Kibrit (Matches)', category: 'other', typicalPrice: 0.30, unit: 'pack', store: 'Araz' },
  { name: 'Şarj cihazı (Charger)', category: 'other', typicalPrice: 5.00, unit: 'pcs', store: 'Araz' },
  { name: 'Kitab (Notebook)', category: 'other', typicalPrice: 3.00, unit: 'pcs', store: 'Araz' },
  { name: 'Plastik qab (Container)', category: 'other', typicalPrice: 2.50, unit: 'pcs', store: 'Araz' },
];

export function getProductsByCategory(category: string): CatalogProduct[] {
  return PRODUCT_CATALOG.filter(p => p.category === category);
}

export function searchProducts(query: string): CatalogProduct[] {
  const q = query.toLowerCase();
  return PRODUCT_CATALOG.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}
