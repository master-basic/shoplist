export interface BravoProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  unit_info: string | null;
  barcode_gtin: string | null;
  category: string;
  image_url: string | null;
}

export interface VenueAssortment {
  assortment_id: string;
  loading_strategy: string;
  primary_language: string;
  selected_language: string;
  available_languages: Array<{
    autotranslated: boolean;
    language: string;
    name: string;
  }>;
  compliance_info: {
    badges: any[];
    disclaimers: any;
    how_search_works: any;
    lowest_price_calculation_interval_in_days: number;
    should_display_original_price_for_unit_price: boolean;
    should_display_price_by_subtracting_deposit: boolean;
  };
  categories: any[];
}

export const venueAssortment: VenueAssortment = {
  "assortment_id": "672b2063a6c24d27db115384",
  "loading_strategy": "partial",
  "primary_language": "az",
  "selected_language": "az",
  "available_languages": [
    {
      "autotranslated": false,
      "language": "az",
      "name": "azərbaycan"
    },
    {
      "autotranslated": true,
      "language": "en",
      "name": "ingilis"
    },
    {
      "autotranslated": true,
      "language": "ru",
      "name": "rus"
    }
  ],
  "compliance_info": {
    "badges": [],
    "disclaimers": null,
    "how_search_works": null,
    "lowest_price_calculation_interval_in_days": 30,
    "should_display_original_price_for_unit_price": false,
    "should_display_price_by_subtracting_deposit": false
  },
  "categories": [
    {
      "id": "714ba0578249ff248305af7e",
      "description": "Kateqriyadaki 3 eyni məshulu səbətə əlavə edin və yalnız 2 məhsulun dəyərini ödəyin.\nŞərtlər və qaydalar tədbiq olunur.",
      "images": [
        {
          "url": "https://imageproxy.wolt.com/assets/6a44bdcabbd7dc9c5f625e88",
          "blurhash": null
        }
      ],
      "name": "🎁 3 AL 2 ÖDƏ 🎁",
      "slug": "3-al-2-od-1",
      "subcategories": [],
      "item_ids": []
    },
    {
      "id": "f49b9519d05d282aa463c88c",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/fa2d0df0-4d8c-11ef-9e77-924e35c1ef8d_321_photoroom__1_.png",
          "blurhash": "j2rkUO;s014P0iPa;Jpn0195;:NH"
        }
      ],
      "name": "Meyvə və Tərəvəzlər",
      "slug": "meyv-v-trvzlr-3",
      "subcategories": [
        {
          "id": "33a630f9cc0937558981552b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/50522bfc-0927-11ef-aec3-16088b406a15_235405.jpg",
              "blurhash": null
            }
          ],
          "name": "Tərəvəzlər",
          "slug": "trvzlr-4",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "7c9cc4e9c06be27306740e1f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/4919c036-0920-11ef-92c2-72c92ebe6cd4_350074.jpg",
              "blurhash": null
            }
          ],
          "name": "Meyvələr",
          "slug": "meyvlr-5",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "94995c7de95a40e3341d1bea",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/3e415fee-4d94-11ef-b150-6a00104ebbed_321_photoroom__1_.png",
          "blurhash": "j6rQh3Pc0hcPhqKGBBhl0hh4;uTd"
        }
      ],
      "name": "Təzə Ət və Toyuq Məhsulları",
      "slug": "tz-t-v-toyuq-mhsullar-7",
      "subcategories": [
        {
          "id": "c685b7f8fde67e0f747cb5f5",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/4438d0b2-b305-11f0-aca7-2afa17d2987d_soyutmaliq_dana_eti.png",
              "blurhash": null
            }
          ],
          "name": "Təzə Ət Məhsulları",
          "slug": "tz-t-mhsullar-8",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "e58e9d8f2f6d6d4d73934b38",
      "description": "",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/a3c3f9e6-0927-11ef-9e10-2ee000feb432_247272.jpg",
          "blurhash": "j6;vHVGGT;BCPtxVkPCDPKtCgyGG"
        }
      ],
      "name": "Toyuq Məhsulları",
      "slug": "toyuq-mhsullar-9",
      "subcategories": [],
      "item_ids": []
    },
    {
      "id": "bb9062436af6c5f9f4dc1b9a",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/8d0f441e-4e5d-11ef-a9e9-5eadbdcd49df_image_photoroom.png",
          "blurhash": null
        }
      ],
      "name": "Yumurtalar",
      "slug": "yumurtalar-10",
      "subcategories": [],
      "item_ids": []
    },
    {
      "id": "c05252caefd8c5284ffbd301",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/f1b3d326-79c2-11f0-995e-da8f76985ef5_transparent_photoroom__1_.jpg",
          "blurhash": "jfUZTrlGX;Tt;;l4h4h4TuLch3GG"
        }
      ],
      "name": "Çörəklər və Un Məmulatları",
      "slug": "corklr-v-un-mmulatlar-11",
      "subcategories": [
        {
          "id": "8239e3af82693a3a6b85d63b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d2026e52-1d84-11ef-a6ff-a6b2b71c06af_11111.png",
              "blurhash": null
            }
          ],
          "name": "Un Məmulatları",
          "slug": "un-mmulatlar-12",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "57eb98178b73a4851336b050",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/8f44dabc-79b5-11f0-af26-1ab1e37b15f7_baton_kp_kli_photoroom.jpg",
              "blurhash": null
            }
          ],
          "name": "Çörəklər",
          "slug": "corklr-13",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "78555466e74c05e578626237",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/05ab62ea-4e5e-11ef-bfff-3ee56cfb0fef_image_photoroom__1_.png",
          "blurhash": "j5q5BecQ01;Kh5h4KFPc00Ts;:8z"
        }
      ],
      "name": "Çaylar",
      "slug": "caylar-14",
      "subcategories": [
        {
          "id": "44904ed22f082da3dee05655",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/e6d6a88c-a2c3-11f0-b5f9-de270011e2fa_wmx_s_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Qara Çaylar",
          "slug": "qara-caylar-15",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "c8fb93bce192dcfd5a63f00e",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66f6a23f86a34ceec78687fc/91db999a-9208-11ef-b4d6-c2f11956d8a3_211023.jpg",
              "blurhash": null
            }
          ],
          "name": "Yaşıl Çaylar",
          "slug": "yasl-caylar-16",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "c001503ceeff2424a9b96b2b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/10383520-0927-11ef-9ee4-1acd5b5fc077_227060.jpg",
              "blurhash": null
            }
          ],
          "name": "Bitki Çayları",
          "slug": "bitki-caylar-17",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "bea6148c76c04d82ea2afaa0",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/42e530b8-0ba7-11ef-9839-d28da8849022_297099.jpg",
              "blurhash": null
            }
          ],
          "name": "Sallama Çaylar",
          "slug": "sallama-caylar-18",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "8f373fc293edd2826f1be3e1",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/44fb7a86-4f1a-11ef-a8b0-f60248f8624f_image_photoroom.png",
          "blurhash": null
        }
      ],
      "name": "Dəniz Məhsulları və Hisə Verilmiş Balıqlar",
      "slug": "dniz-mhsullar-v-his-verilmis-balqlar-19",
      "subcategories": [],
      "item_ids": []
    },
    {
      "id": "12732d8b41d33185c2ded79e",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://imageproxy.wolt.com/assets/6979cec28d71993ce33006df",
          "blurhash": null
        }
      ],
      "name": "Qəhvə və Kakaolar",
      "slug": "qhv-v-kakaolar-20",
      "subcategories": [
        {
          "id": "7a82d4005b725e80908244a7",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/6beb7e00-0926-11ef-8882-6e137a3e0c5f_223595.jpg",
              "blurhash": null
            }
          ],
          "name": "3-ü 1-də Qəhvələr",
          "slug": "3-u-1-d-qhvlr-21",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "82607aad77fb26d9e38b3949",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/e5f09f78-0926-11ef-b51f-2ee000feb432_225126.jpg",
              "blurhash": null
            }
          ],
          "name": "Həll Olunan Qəhvələr",
          "slug": "hll-olunan-qhvlr-22",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "4ed603d20d52511a11a6158b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/9b2350d4-6619-11f0-8739-c2f942925077_747169.jpg",
              "blurhash": "j8ZLnRmG;;ODGXgPBlXK;;KG8yhl"
            }
          ],
          "name": "Kapsullar",
          "slug": "kapsullar-24",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "279d98e1658fa4111010d5ad",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/17be8d84-0923-11ef-bde4-326848cc3a34_606903.jpg",
              "blurhash": null
            }
          ],
          "name": "Kakaolar",
          "slug": "kakaolar-25",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "2e94f99ccfeb45725feb26ef",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/16b9d6ec-79ce-11f0-9d42-6294a84b2978_123_photoroom.jpg",
          "blurhash": "jdZuLlLuTLN5TLpkl3pBTLl4l3qW"
        }
      ],
      "name": "Duru Yağlar və Sirkələr",
      "slug": "duru-yaglar-v-sirklr-26",
      "subcategories": [
        {
          "id": "1b4b5dc2127bebeaa303057c",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/2d13c058-0925-11ef-a993-6e137a3e0c5f_210692.jpg",
              "blurhash": null
            }
          ],
          "name": "Günəbaxan Yağları",
          "slug": "gunbaxan-yaglar-27",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "6f8bf3e90e018db8b13fdf8e",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/25f3b4fe-0925-11ef-994e-ee9392124a88_210634.jpg",
              "blurhash": null
            }
          ],
          "name": "Qarğıdalı Yağı",
          "slug": "qargdal-yag-28",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "a811db3c09371ed832943373",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/52bdfe3a-0c55-11ef-8151-16b22f2d7a01_498753.jpg",
              "blurhash": null
            }
          ],
          "name": "Zeytun Yağları",
          "slug": "zeytun-yaglar-29",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "73efa0c7e1e9bbdba5f41179",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/ba9c6bfa-4d8b-11ef-93cb-5a975eae6e27_321_photoroom__2_.png",
          "blurhash": "j3n50:gP00X;kOPcHe8z0jLb;ZkP"
        }
      ],
      "name": "Spirtsiz İçkilər",
      "slug": "spirtsiz-ickilr-30",
      "subcategories": [
        {
          "id": "ed6ad2efdc31c470ced1e0a2",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/2b9971d6-0921-11ef-9ab8-3a32cd81e906_447415.jpg",
              "blurhash": null
            }
          ],
          "name": "Cola və Sodalar",
          "slug": "cola-v-sodalar-31",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "fd78f1a0d37ea0ef86ea6d7c",
          "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d8bf76fc-0927-11ef-8cd5-e6f3dc9c4ab3_257761.jpg",
              "blurhash": null
            }
          ],
          "name": "Şirə və Nektarlar",
          "slug": "sir-v-nektarlar-32",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "d67325d5190dbf47e9c14eee",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/98496378-0925-11ef-b44d-ee12eac5ee60_213733.jpg",
              "blurhash": "j4;fPXGG;;GGBHC8KVu8XLtT8yCp"
            }
          ],
          "name": "Kompotlar",
          "slug": "kompotlar-33",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "5392a464f4e5563dd68e270c",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/7ce8624a-3567-11f0-9ea3-da9ccc425a69_220495.jpg",
              "blurhash": null
            }
          ],
          "name": "Energetik və Sport İçkilər",
          "slug": "energetik-v-sport-ickilr-34",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "d253803a33eb5bc860b181f4",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/2e7c66f8-79a8-11f0-869d-f676f3435467_ulusu_qazsiz_su_pl_0.5lt_photoroom.jpg",
              "blurhash": null
            }
          ],
          "name": "Qazsız Sular",
          "slug": "qazsz-sular-35",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "d809057ab355d0d6e333dad9",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/0f176ffe-2bd5-11f0-899a-8e7eee58366e_208449.jpg",
              "blurhash": null
            }
          ],
          "name": "Qazlı Sular",
          "slug": "qazl-sular-36",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ea783b23ce50338ee1cc42a7",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/e3b60f12-0408-11f0-bcf6-0e8057a544b5_663014.jpg",
              "blurhash": "jbZfnQGG;;GGTtu7d4C9Pcy8h4u9"
            }
          ],
          "name": "Sağlam Sular",
          "slug": "saglam-sular-37",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "22e079e45e267f4de61d1454",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/70b3096e-79a8-11f0-93ee-76ff00361984_ulusu_qazsiz_su_pl_10lt_photoroom.jpg",
              "blurhash": null
            }
          ],
          "name": "XXL Sular",
          "slug": "xxl-sular-38",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "3140739c7b55bbce03d920c0",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/24d2a7ea-0922-11ef-9cf4-7629791318e1_544329.jpg",
              "blurhash": null
            }
          ],
          "name": "Soyuq Çaylar, Kofelər və Digər Şirin İçkilər",
          "slug": "soyuq-caylar-kofelr-v-digr-sirin-ickilr-39",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "f7e435d3956023cd73888405",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/7171e7a0-0927-11ef-9811-7e5f9bc1047e_240159.jpg",
              "blurhash": null
            }
          ],
          "name": "Limonadlar",
          "slug": "limonadlar-40",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "719069a71f646ca2f1df1708",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/ef2ef954-4d96-11ef-affd-924e35c1ef8d_321_photoroom__4_.png",
          "blurhash": "j7uCVCOV00hH4zh5OlTb00OX;;h4"
        }
      ],
      "name": "Süd Məhsulları",
      "slug": "sud-mhsullar-41",
      "subcategories": [
        {
          "id": "ec63b53413a12c896bd72085",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/504bc772-6857-11f0-a7d4-0ec65cdb3235_wmx_s_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Kərə Yağı və Bitki Tərkibli Yağlar",
          "slug": "kr-yag-v-bitki-trkibli-yaglar-42",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "7dc1127690246698bda42a0c",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/390be9b0-6129-11ef-8b56-f619db729f0d_11111.png",
              "blurhash": null
            }
          ],
          "name": "Pendirlər",
          "slug": "pendirlr-43",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "9e4451175cca3b5a7d0cb53f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/ceec600a-0ba6-11ef-8b53-8a86b91cb192_218812.jpg",
              "blurhash": null
            }
          ],
          "name": "Mayonezlər",
          "slug": "mayonezlr-44",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "80218500769d39506f526a9c",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/f645b9b2-0ba6-11ef-aff2-de73be42a0a1_251068.jpg",
              "blurhash": null
            }
          ],
          "name": "Qaymaqlar",
          "slug": "qaymaqlar-45",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "4f0b02bc6da6b0fbf790daf3",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/0016db18-1120-11f0-8272-d60615bb4011_image_photoroom.jpg",
              "blurhash": null
            }
          ],
          "name": "Kəsmik, Şor və Labne Pendirlər",
          "slug": "ksmik-sor-v-labne-pendirlr-46",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "fe655e777d883d29e9cf5582",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/1aacddaa-0c54-11ef-8587-be174af9d6f8_284287.jpg",
              "blurhash": null
            }
          ],
          "name": "Yoqurt və Kokteyllər",
          "slug": "yoqurt-v-kokteyllr-47",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "0a8629c2a267aea069b61467",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/shared/f7429b50-24c4-11ef-a4ac-5e4503ea9f14_smetana_svalya_litouwen_cre_me_fraiche_22_vet_200gr._1000x1000.jpg",
              "blurhash": null
            }
          ],
          "name": "Xamalar",
          "slug": "xamalar-48",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "34bb820e8a4b4b1ab7533d76",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/10855f54-0926-11ef-9a79-8a92e9e5950d_218786.jpg",
              "blurhash": null
            }
          ],
          "name": "Qatıqlar",
          "slug": "qatqlar-49",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "b22c9cd7f4e418843489346a",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/c5d8783c-0921-11ef-876b-623377adb5c6_510763.jpg",
              "blurhash": null
            }
          ],
          "name": "Sıroklar və Donmuş Qəlyanaltılar",
          "slug": "sroklar-v-donmus-qlyanaltlar-50",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "efaa6f6d6540ff4429f20eba",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/0cc2d9dc-0926-11ef-aa5e-22d6e8de5ca5_218776.jpg",
              "blurhash": null
            }
          ],
          "name": "Südlər",
          "slug": "sudlr-51",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "a1dc99d87ebe33dcf2c87491",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/5c3e0306-3567-11f0-a40d-f29304fba88b_208830.jpg",
              "blurhash": null
            }
          ],
          "name": "Ayran, Kefir və Dovğalar",
          "slug": "ayran-kefir-v-dovgalar-52",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "cd21f6c50326dec863f46a95",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/b93a8496-b6f8-11ef-9712-1e6105afa658_screenshot_2024_12_10_at_16.49.32.png",
          "blurhash": "jrZtXfLsT;kAJ4DcmGp4LupqB3KS"
        }
      ],
      "name": "Çips, Çərəz və Qəlyanaltılar",
      "slug": "cips-crz-v-qlyanaltlar-53",
      "subcategories": [
        {
          "id": "174cd36e2162de36563a9367",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/eb005d0a-0926-11ef-949c-62737365a3a3_225311.jpg",
              "blurhash": null
            }
          ],
          "name": "Çipslər",
          "slug": "cipslr-54",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ac70265f87f3f72b07bd3d34",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/8df1f190-0927-11ef-b753-36667e319bf5_244819.jpg",
              "blurhash": null
            }
          ],
          "name": "Tumlar",
          "slug": "tumlar-55",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ce52594bd0ce3b87fcc279e2",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/f92de560-0920-11ef-a074-f6ce40ed4f4d_423072.jpg",
              "blurhash": null
            }
          ],
          "name": "Qəlyanaltılar",
          "slug": "qlyanaltlar-56",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "71aa75f6ca7faeeea09c6f22",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/5ecb0470-0921-11ef-aa4c-623377adb5c6_471309.jpg",
              "blurhash": null
            }
          ],
          "name": "Quru Meyvə və Çərəzlər Ədəd ilə",
          "slug": "quru-meyv-v-crzlr-dd-il-57",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "830a489a9dcd928bb1287782",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/14f1c468-111f-11f0-ac0b-c6effcaf89c0_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Quru Meyvə və Çərəzlər Çəki ilə",
          "slug": "quru-meyv-v-crzlr-cki-il-58",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "b2abe8de0e27d26870067dab",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/7faca11a-4d8e-11ef-81e1-f28836589d34_321_photoroom.png",
          "blurhash": "j2mzQPmH01NV0ihl;sTb0hJl;JiY"
        }
      ],
      "name": "Spirtli İçkilər",
      "slug": "spirtli-ickilr-59",
      "subcategories": [
        {
          "id": "32088c67b7cbe53c0f257b5f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/49ae7c88-0927-11ef-bcb3-6e137a3e0c5f_234422.jpg",
              "blurhash": null
            }
          ],
          "name": "Pivələr",
          "slug": "pivlr-60",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "01757856fe25c98c0235d483",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d9c387cc-0ba8-11ef-a7ea-a25cba9de1b3_669047.jpg",
              "blurhash": null
            }
          ],
          "name": "Spirtsiz Pivələr",
          "slug": "spirtsiz-pivlr-61",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "0ffe92342252eabdf2bf74a8",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/f0cb3b7c-0923-11ef-a3e2-3ee8389cf23c_637104.jpg",
              "blurhash": null
            }
          ],
          "name": "Araqlar",
          "slug": "araqlar-62",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "13fd0b199f30f4f6dc927f27",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/dd91f1c6-0c53-11ef-be3e-aa82fad979df_257809.jpg",
              "blurhash": null
            }
          ],
          "name": "Viskilər",
          "slug": "viskilr-63",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "cb1ee5d31f4a492fb54a6770",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/b2bcd4d4-0c53-11ef-b7d4-e229d835f0fd_234240.jpg",
              "blurhash": null
            }
          ],
          "name": "Elit İçkilər (Digər)",
          "slug": "elit-ickilr-digr-64",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "3d054bf306970b74f785ff42",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/shared/d57b66c8-1452-11ef-bbc5-3ac232b0e2fe_4760019801819.jpg",
              "blurhash": null
            }
          ],
          "name": "Qırmızı Şərablar",
          "slug": "qrmz-srablar-65",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "e9a924f64089eaa4a0f9d926",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/0b89929e-3568-11f0-851c-b2ea051e1b6e_398815.jpg",
              "blurhash": null
            }
          ],
          "name": "Ağ Şərablar",
          "slug": "ag-srablar-66",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "58f84bb072d6c3cd65603474",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66f6a23f86a34ceec78687fc/c29f0be0-920b-11ef-b535-3ad446b89788_608789.jpg",
              "blurhash": null
            }
          ],
          "name": "Çəhrayı Şərablar",
          "slug": "chray-srablar-67",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "fbcc2fd62736177b3120c04c",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/e2b82b5c-0c53-11ef-89ea-5e3c7770ec18_264594.jpg",
              "blurhash": null
            }
          ],
          "name": "Oynaq Şərablar",
          "slug": "oynaq-srablar-68",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "5ffcabc23928d5c3cc11787c",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/c82ae592-0922-11ef-85b5-8e2a2e5ec958_593006.jpg",
              "blurhash": null
            }
          ],
          "name": "Spirtli kokteyllər",
          "slug": "spirtli-kokteyllr-69",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "21912ac93b88f6c106cf7c67",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/d417646a-4d8e-11ef-9890-de460a20715f_321_photoroom.png",
          "blurhash": "j4pl0PuB02KH0lKn;HlG01lq;ZKR"
        }
      ],
      "name": "Sous və Ədviyyat Məhsulları",
      "slug": "sous-v-dviyyat-mhsullar-70",
      "subcategories": [
        {
          "id": "39b69dbf1e9d157f05d072d4",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/22986d86-0925-11ef-866c-4e28d3d2207b_210619.jpg",
              "blurhash": null
            }
          ],
          "name": "Duz",
          "slug": "duz-71",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "9db7d8f2af8ab42aa7273e32",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/3e3b2d2c-0924-11ef-910c-766703b1d227_663866.jpg",
              "blurhash": "j9:LvRGG;;pVKXBTlCqqTLtTcxCp"
            }
          ],
          "name": "Ketçuplar",
          "slug": "ketcuplar-72",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "37d7920642a31194b771bef6",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/409daec0-0ba7-11ef-9caf-4adcb3ccf9f7_292117.jpg",
              "blurhash": "j6:;HVGG;;GGPcCplktTXLCp8xtT"
            }
          ],
          "name": "Xardal, Sirkə və Narşərab",
          "slug": "xardal-sirk-v-narsrab-73",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "f59ef049e76e0831739bec4b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/9dfa31be-0ba8-11ef-b2ba-a25cba9de1b3_628774.jpg",
              "blurhash": null
            }
          ],
          "name": "Digər Souslar",
          "slug": "digr-souslar-74",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "d5c2586532678dc6124f41b3",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/1f3a4680-0927-11ef-94aa-ee53159dff14_229056.jpg",
              "blurhash": null
            }
          ],
          "name": "Ədviyyatlar",
          "slug": "dviyyatlar-75",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "a429999cf9808d1d4269d347",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/0dfb9d80-5d75-11f0-b792-ca8b8794d9a0_5898ca84_0925_11ef_b52a_326848cc3a34_211455.jpg",
          "blurhash": "j7:LrSLc;;kPrtGpJ4pCX;pl8yLd"
        }
      ],
      "name": "Şirniyyatlar",
      "slug": "sirniyyatlar-76",
      "subcategories": [
        {
          "id": "608986b00f9b09304420a80a",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/7898da38-0ba8-11ef-8e8b-b2df45e4422c_612771.jpg",
              "blurhash": null
            }
          ],
          "name": "Şokoladlar",
          "slug": "sokoladlar-77",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "f7f1b23da92db4e4ddeec65e",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/afeea88e-0926-11ef-81dd-ee53159dff14_224037.jpg",
              "blurhash": null
            }
          ],
          "name": "Uşaqlar üçün Şokoladlar",
          "slug": "usaqlar-ucun-sokoladlar-78",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "a5416be3639d8349f91a1d8c",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/ca534d16-0920-11ef-bfd2-7629791318e1_406284.jpg",
              "blurhash": null
            }
          ],
          "name": "Plitka şokolad",
          "slug": "plitka-sokolad-79",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "8a5dc036d7b270233ba60e02",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/5603cbfc-0925-11ef-acfa-7e5f9bc1047e_211443.jpg",
              "blurhash": null
            }
          ],
          "name": "Qutuda Şokoladlar",
          "slug": "qutuda-sokoladlar-80",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "307b683b824b397366e67ce2",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/99daa7e6-0c5a-11ef-8849-626f334c3376_211466.jpg",
              "blurhash": null
            }
          ],
          "name": "Nanəli və Meyvəli Konfetlər",
          "slug": "nanli-v-meyvli-konfetlr-81",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "95c841508d819b03582f6dea",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/df716c40-0926-11ef-b43a-62737365a3a3_225081.jpg",
              "blurhash": null
            }
          ],
          "name": "Keks və Kruassanlar",
          "slug": "keks-v-kruassanlar-82",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "74d8c153e888df2fa1d755c6",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/8288d798-0926-11ef-a6ee-e6f3dc9c4ab3_223786.jpg",
              "blurhash": null
            }
          ],
          "name": "Vafli və Kurabiyələr",
          "slug": "vafli-v-kurabiylr-83",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "38aa64d058ca6bd9f54e1870",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/0931c778-b87b-11f0-80be-4232331bb078_321747_0_0.png",
              "blurhash": null
            }
          ],
          "name": "Çəki Şirniyyatlar",
          "slug": "cki-sirniyyatlar-85",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "41cc367bf92f252d7dcc0c38",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/43fb541a-4d91-11ef-b3d8-5a1cfa4482e9_321_photoroom__1_.png",
          "blurhash": "j1g3wZKC00hq8yOYXth400hm;;OW"
        }
      ],
      "name": "Şirin Ləzzətlər",
      "slug": "sirin-lzztlr-86",
      "subcategories": [
        {
          "id": "9ce883c2b7af88037c693623",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/c72b1c02-8636-11ef-b909-e2402135271f_11111.jpg",
              "blurhash": null
            }
          ],
          "name": "Halvalar",
          "slug": "halvalar-87",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "b07e44124479d0b15240fa3c",
          "description": "",
          "images": [
            {
              "url": "https://imageproxy.wolt.com/assets/69a17d1eea4a83292ef03454",
              "blurhash": null
            }
          ],
          "name": "Lokumlar",
          "slug": "lokumlar-88",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "47b25754f83353245e9327f9",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/8b2899f6-4d96-11ef-a2b4-422e1ceef055_321_photoroom__3_.png",
          "blurhash": "j5okcWSX0195PdpDh4GV0hhm;KSX"
        }
      ],
      "name": "Delikates Məhsulları",
      "slug": "delikates-mhsullar-89",
      "subcategories": [
        {
          "id": "8c870ef4d8bbb7d8fd00b61d",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/dea50324-0923-11ef-823a-3ee8389cf23c_632663.jpg",
              "blurhash": null
            }
          ],
          "name": "Kolbasalar",
          "slug": "kolbasalar-90",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "a639e5b5b3fd73830861ba88",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/bdd660b8-0ba6-11ef-8edd-86252ba41d68_216394.jpg",
              "blurhash": null
            }
          ],
          "name": "Sosislər",
          "slug": "sosislr-91",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ac14d6bdfff2ea9db393cf78",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/96032198-cdc0-11ef-91e4-fe12ab1e8a9c_216457.jpg",
              "blurhash": null
            }
          ],
          "name": "Hisə Verilmiş Ət Məhsulları",
          "slug": "his-verilmis-t-mhsullar-92",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "51880d8d43cf74443c60b816",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/2b6d0a50-4d97-11ef-b533-924e35c1ef8d_321_photoroom.png",
          "blurhash": "j2uRQRXs018z02pl;ZPc02h5;ITb"
        }
      ],
      "name": "Makaron, Düyü və Bakliyyat Məhsulları",
      "slug": "makaron-duyu-v-bakliyyat-mhsullar-93",
      "subcategories": [
        {
          "id": "0c8fa5cbbac0969d739350c5",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/ebd9bf6e-0ba6-11ef-957c-568f05d8de61_223826.jpg",
              "blurhash": null
            }
          ],
          "name": "Makaronlar",
          "slug": "makaronlar-94",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ac7ffbc9cf72a4a06baf5b72",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/38ce5232-0925-11ef-ae65-16b5d6efcecb_210783.jpg",
              "blurhash": null
            }
          ],
          "name": "Düyülər",
          "slug": "duyulr-95",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "68640845e900fdbf88482a2f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/shared/c2b9bc04-ccff-11ef-bc20-26dd0426e9df_kasze_bulgur_photoroom.jpg",
              "blurhash": null
            }
          ],
          "name": "Digər Bakaleya",
          "slug": "digr-bakaleya-96",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "e3d2cd4ebdbdff4a8540960c",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/54063d0a-4d8e-11ef-8ab7-a23b12bd6133_321_photoroom__6_.png",
          "blurhash": "j4qmFwdc00;lcPqYTtNj00SQ;:9c"
        }
      ],
      "name": "Səhər Yeməkləri",
      "slug": "shr-yemklri-97",
      "subcategories": [
        {
          "id": "39bc1d6aab3b281c78a7d5f8",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/3bd9257e-0925-11ef-93c0-36667e319bf5_210857.jpg",
              "blurhash": null
            }
          ],
          "name": "Qatılaşdırılmış Südlər",
          "slug": "qatlasdrlms-sudlr-98",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "de827fe3130ebe26687fd42e",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/0dfba110-0923-11ef-9f25-7629791318e1_605633.jpg",
              "blurhash": null
            }
          ],
          "name": "Taxıl Məhsulları və Müslilər",
          "slug": "taxl-mhsullar-v-muslilr-99",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "0a9c2c56b218bf0758c6b6d5",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/5cfaafea-0ba8-11ef-94ec-2a0bd6f69991_601111.jpg",
              "blurhash": null
            }
          ],
          "name": "Sıyıqlar",
          "slug": "syqlar-100",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "8cb5fddb90da4b2f635cb2cd",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/63e9d224-3567-11f0-9832-b2f5d7b59c86_211447.jpg",
              "blurhash": null
            }
          ],
          "name": "Krem Pastalar və Şokolad Yağları",
          "slug": "krem-pastalar-v-sokolad-yaglar-101",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "1b891f29ca560c2cd57e5b89",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/6196d30a-3567-11f0-a623-e20bb4f83ece_210566.jpg",
              "blurhash": null
            }
          ],
          "name": "Bal, Cem və Mürəbbələr",
          "slug": "bal-cem-v-murbblr-102",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "94cdc0f2c9661ab618011557",
      "description": "",
      "images": [
        {
          "url": "https://imageproxy.wolt.com/assets/6a4cd197c5d5e1acbbc68750",
          "blurhash": "LRRo,2?wjYDh.8a0MxyD.8Rix]V@"
        }
      ],
      "name": "IQOS Terea",
      "slug": "iqos-terea-103",
      "subcategories": [],
      "item_ids": []
    },
    {
      "id": "c6f771ffd7d0a17ae22d6b2c",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/67f9b9b4-4d97-11ef-9cf0-62d62dad6f8b_321_photoroom__2_.png",
          "blurhash": null
        }
      ],
      "name": "Ağız Təravətləndiriciləri",
      "slug": "agz-travtlndiricilri-104",
      "subcategories": [],
      "item_ids": []
    },
    {
      "id": "708024b37f2680ae4c99ad50",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/1366a89e-564c-11f0-a128-569755a9c76a_8b1e902a_4e97_11f0_bc93_aef12176d38c_680907.jpg",
          "blurhash": "jhMbqWmYX;JChzGCGrpC;;JBgPmG"
        }
      ],
      "name": "Sağlam Qida Məhsulları",
      "slug": "saglam-qida-mhsullar-105",
      "subcategories": [
        {
          "id": "6ee519ecdab9c897e998f8d8",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/ff5e8b32-0ba6-11ef-812b-2a0bd6f69991_254790.jpg",
              "blurhash": null
            }
          ],
          "name": "Dietik Məhsullar",
          "slug": "dietik-mhsullar-106",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "c5e3416ea83b59103e4a56e2",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/c7ff6f94-5958-11ef-a7fa-ee8934cd483b_11111.png",
              "blurhash": "ji:eXCl4PLKXl4GYGYpkT;LcgOll"
            }
          ],
          "name": "Diabetik Məhsullar",
          "slug": "diabetik-mhsullar-107",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ec122da52b766beb7b6c7ff2",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/c0a8df5a-0926-11ef-99cc-06cc02b97407_224463.jpg",
              "blurhash": "jcY;fMFr;;H5lBGqKHlBXLqB8xJH"
            }
          ],
          "name": "Qlutensiz Məhsullar",
          "slug": "qlutensiz-mhsullar-108",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "691919ea69c5f4e9ba0ca053",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/5ce872e4-4d98-11ef-bd43-929bc485a876_321_photoroom__2_.png",
          "blurhash": null
        }
      ],
      "name": "Hazır Qidalar",
      "slug": "hazr-qidalar-110",
      "subcategories": [],
      "item_ids": []
    },
    {
      "id": "84f92f9ef49ee6feec9d2ffb",
      "description": "",
      "images": [
        {
          "url": "https://imageproxy.wolt.com/assets/6979ce6af6ee27217dc05168",
          "blurhash": null
        }
      ],
      "name": "Turşu Məhsulları",
      "slug": "tursu-mhsullar-111",
      "subcategories": [
        {
          "id": "513d7309d8921dc5edeeab91",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/076f2ca0-0c6f-11ef-b888-c65d02318eee_4823006801794.jpg",
              "blurhash": null
            }
          ],
          "name": "Turşular",
          "slug": "tursular-112",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "ddb1d5c68611d7fdaa756cda",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/e3e9fc40-4d98-11ef-b41c-3a39ddd77442_321_photoroom__3_.png",
          "blurhash": "j2uSRwNp00jp00mC;;Tc04Lc;Acz"
        }
      ],
      "name": "Konservlər və Suplar",
      "slug": "konservlr-v-suplar-113",
      "subcategories": [
        {
          "id": "074b77ef3cce07d999547cb6",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/0a3c7fea-0ba8-11ef-b06a-f2a986b53070_559701.jpg",
              "blurhash": null
            }
          ],
          "name": "Tərəvəzlər",
          "slug": "trvzlr-114",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "eb027bfd5e47ce9324bfea2f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/106bffd0-0ba8-11ef-9e1f-dab86841debb_562688.jpg",
              "blurhash": null
            }
          ],
          "name": "Ət və Balıq Məhsulları",
          "slug": "t-v-balq-mhsullar-115",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "5cbcecdd0e5a6e0fe3568d88",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/05b059e6-0929-11ef-b47b-dea2ea2cbc41_330548.jpg",
              "blurhash": null
            }
          ],
          "name": "Zeytunlar",
          "slug": "zeytunlar-116",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "aba5be76e3bae3edca82ea0f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/b9e5951c-0ba8-11ef-acdc-6ea935bd3b5a_645171.jpg",
              "blurhash": null
            }
          ],
          "name": "Pastalar",
          "slug": "pastalar-117",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "f63407f5213a3b97fb7fdf0b",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/5af71692-4d99-11ef-921b-fa6e1fee8994_321_photoroom__5_.png",
          "blurhash": "j5Em8XPc02cQkPdlPcSY03OG;Idl"
        }
      ],
      "name": "Dondurulmuş Məhsullar",
      "slug": "dondurulmus-mhsullar-119",
      "subcategories": [
        {
          "id": "feff2fdbba48936869eae0a5",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d8500764-0921-11ef-a4b0-32183569e48f_518900.jpg",
              "blurhash": null
            }
          ],
          "name": "Tərəvəzlər və Meyvələr",
          "slug": "trvzlr-v-meyvlr-120",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "19a139db0bc0a02ff51cd61b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/e19b236c-0921-11ef-b1d7-be732d6986ba_520431.jpg",
              "blurhash": null
            }
          ],
          "name": "Ət və Toyuq Məhsulları",
          "slug": "t-v-toyuq-mhsullar-121",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "b84794e45593f36394baf4aa",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/ca4c759c-0ba8-11ef-9c1d-5277cd96fd07_658503.jpg",
              "blurhash": "jlUZXslC;;KGGGCnpCpD;;Km8xmG"
            }
          ],
          "name": "Dəniz Məhsulları",
          "slug": "dniz-mhsullar-122",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "07e64b776b8671777101f78b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/5aefa67e-0923-11ef-b6b8-9adc7dc22caf_612665.jpg",
              "blurhash": null
            }
          ],
          "name": "Xəmir Məhsulları",
          "slug": "xmir-mhsullar-123",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "5aba2bc165747ff57ab18731",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/7fa8acaa-0927-11ef-9d14-8e2a2e5ec958_241606.jpg",
              "blurhash": null
            }
          ],
          "name": "Dondurmalar",
          "slug": "dondurmalar-124",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "d1c0f4b5d788b74d49557142",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/cab5634e-4d99-11ef-96f6-7a8e2af63bdb_321_photoroom__1_.png",
          "blurhash": "j2m4E;iY00R39bFlh3nc00Xr;;4A"
        }
      ],
      "name": "Şəkər və Un Məhsulları",
      "slug": "skr-v-un-mhsullar-126",
      "subcategories": [
        {
          "id": "adffc5e0f89e3fcd1acf35e7",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/fcb7d018-7a14-11f0-a7de-320e93f3371b_wmx_s_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Un Məhsulları",
          "slug": "un-mhsullar-127",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "3d1c2428ad4f6aa9689bf0e4",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/1edef3f8-7a18-11f0-954d-867a1daf2ebd_wmx_s_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Şəkər Məhsulları",
          "slug": "skr-mhsullar-128",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "f8517487a9f536a48dafc184",
      "description": "",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/37aeb6f2-9237-11f0-a761-165076a7823f_wmx_s_111111.jpg",
          "blurhash": "jcYfjQOX;;h4TtlCcPKX;Kpm8PKX"
        }
      ],
      "name": "Kağız Məhsulları",
      "slug": "kagz-mhsullar-130",
      "subcategories": [
        {
          "id": "daa11b9ef863424c2a76ad1d",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/ff3da602-9236-11f0-b6d9-726937e45680_wmx_s_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Salfetlər",
          "slug": "salfetlr-131",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "b762963f2efb4458099de69f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/3618cfe2-0928-11ef-bd39-ee9392124a88_278372.jpg",
              "blurhash": null
            }
          ],
          "name": "Nəm Salfetlər",
          "slug": "nm-salfetlr-132",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ad6bdbd60e6c623c7b5328d4",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/37aeb6f2-9237-11f0-a761-165076a7823f_wmx_s_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Mətbəx kağızları",
          "slug": "mtbx-kagzlar-133",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "edca297eb8f172cc9c948560",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d8a79524-0ba6-11ef-984c-9addb7935a9f_223151.jpg",
              "blurhash": null
            }
          ],
          "name": "Tualet Kağızları",
          "slug": "tualet-kagzlar-134",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "c26889109ec17b54308710b4",
      "description": "",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/2c9beb16-79cf-11f0-9726-12e76554a067_wmx_s_111111.jpg",
          "blurhash": "jeYf7RKX;;l5PctSh4CGPstSh4CG"
        }
      ],
      "name": "Yuyucu Vasitələr",
      "slug": "yuyucu-vasitlr-135",
      "subcategories": [
        {
          "id": "7c0ac7415bb9a6d01066d432",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/2c9beb16-79cf-11f0-9726-12e76554a067_wmx_s_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Yuyucu Tozlar",
          "slug": "yuyucu-tozlar-136",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "99d664ef48f263432ec30625",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/389802da-0926-11ef-815a-ceaf381bb64c_221659.jpg",
              "blurhash": null
            }
          ],
          "name": "Yuyucu Mayelər",
          "slug": "yuyucu-mayelr-137",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "a2e372e5185b4ba379183623",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/914c551a-ab2e-11f0-9b7b-b2c448b39776_8700216101318.jpg",
              "blurhash": "jhUebyuW;;J6lkpSKHKq;;Fm8yqW"
            }
          ],
          "name": "Yuyucu Tabletlər",
          "slug": "yuyucu-tabletlr-138",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "80fc190e3adc67d519e5be4f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/46066e56-79ce-11f0-934e-d69c7428a070_wmx_s_111111.jpg",
              "blurhash": "j4:;LWKX;;llTdpSd3GGTtpCcPGH"
            }
          ],
          "name": "Ağardıcı Vasitələr",
          "slug": "agardc-vasitlr-139",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "b08deec48e88c5dc2a05410f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/6343fee8-79ce-11f0-96a6-6e4e44b9eb30_wmx_s_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Yumşaldıcı Vasitələr",
          "slug": "yumsaldc-vasitlr-140",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "d9fefcfe4ca00830eae67084",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/3b0708b4-79d1-11f0-be56-7eb79b4b0aa3_321_photoroom.jpg",
          "blurhash": "jbPbKYXi55fL;;LbTcTd;;TcPcOT"
        }
      ],
      "name": "Təmizlik və Məişət Məhsulları",
      "slug": "tmizlik-v-mist-mhsullar-142",
      "subcategories": [
        {
          "id": "d74c987435069ac0849557b9",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/9404bfae-79ce-11f0-883d-aa133a5b954f_wmx_s_111111.jpg",
              "blurhash": null
            }
          ],
          "name": "Duş Otağı və Mətbəx Təmizləyici Vasitələr",
          "slug": "dus-otag-v-mtbx-tmizlyici-vasitlr-143",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "2be2c43fc15398984ae0f37a",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/9a44b0d8-0920-11ef-81d2-36667e319bf5_380281.jpg",
              "blurhash": "j6:;DUGG;;BCPttCgPGGPKpCgOGX"
            }
          ],
          "name": "Mebel Parıldadıcısı və Cilası Məhsulları",
          "slug": "mebel-parldadcs-v-cilas-mhsullar-144",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "909a68e9c34e82ac9f0fd6cd",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/shared/59b13cde-270d-11ef-8bfa-4e4bf25e8c8a_image_photoroom___2024_06_10t133933.511.jpg",
              "blurhash": null
            }
          ],
          "name": "Təmizləyici Tozlar",
          "slug": "tmizlyici-tozlar-145",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "69f6e557a6445eab41887877",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/ba4dd9be-3240-11f0-914f-ca436f331f30_241511.jpg",
              "blurhash": null
            }
          ],
          "name": "Şüşə və Pəncərə Təmizləyici Vasitələr",
          "slug": "sus-v-pncr-tmizlyici-vasitlr-146",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "e1b2e608328ed84c7a0b8635",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/cb07af98-0922-11ef-9de3-8e2a2e5ec958_593154.jpg",
              "blurhash": null
            }
          ],
          "name": "Qabyuyan Maye və Tabletlər",
          "slug": "qabyuyan-maye-v-tabletlr-147",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "2487644ba59a9476e7f8a8a2",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d6c0c392-0922-11ef-aa1e-16b5d6efcecb_594212.jpg",
              "blurhash": null
            }
          ],
          "name": "Hava Təravətləndiriciləri",
          "slug": "hava-travtlndiricilri-148",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "585622a50d0734967e255329",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/7181ca8e-0928-11ef-b233-0a673973543d_285971.jpg",
              "blurhash": "jgXL7NCG;;GnGGtTpSGGXuCp8PpC"
            }
          ],
          "name": "Həşərat Məhv Edici Vasitələr",
          "slug": "hsrat-mhv-edici-vasitlr-149",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "9fb1f718b4d3c98ff7b8f3b2",
      "description": "",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/8c45f4d8-4d9a-11ef-8a77-a23055682a51_100af719_cc97_40c9_bdcf_e04ef986a0c5.png",
          "blurhash": "j2l5hkll00KXTtpCcPKX00GG;;ll"
        }
      ],
      "name": "Tütün Məhsulları",
      "slug": "tutun-mhsullar-150",
      "subcategories": [
        {
          "id": "dfcadcdf855539e6f22bed85",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/shared/3b2f3122-1424-11ef-9d83-667682c5f3a6_772e3e8a_53cb_11ee_b6a0_feb983cdf19a_4032900153551.png",
              "blurhash": null
            }
          ],
          "name": "Siqaretlər",
          "slug": "siqaretlr-151",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "087867ebd8a25060e450c358",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/33ab1182-d26f-11ef-a620-1aae7b70549a_716368.jpg",
              "blurhash": null
            }
          ],
          "name": "Alışqanlar",
          "slug": "alsqanlar-153",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "9c5f0c95eaea980605a9970e",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır və fərqlənə bilər\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/6c96cab2-4d9b-11ef-934d-9af1e7c67c2b_321_photoroom__1_.png",
          "blurhash": "j5xUpTJZ00XH01lk;IJG00qzX;cX"
        }
      ],
      "name": "Üz və Bədən Baxımı Məhsulları",
      "slug": "uz-v-bdn-baxm-mhsullar-154",
      "subcategories": [
        {
          "id": "ecdeca16698559ff4304cb3d",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/43560e10-0926-11ef-a9d3-f6ce40ed4f4d_222866.jpg",
              "blurhash": null
            }
          ],
          "name": "Dezodarantlar",
          "slug": "dezodarantlar-155",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "4bf5d42cf3828330b200e15e",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/b77d648c-0ba6-11ef-83ce-e26de682dd74_216101.jpg",
              "blurhash": null
            }
          ],
          "name": "Ətir və Kaloniyalar",
          "slug": "tir-v-kaloniyalar-156",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ab8df013f8b19eb9404cf5b4",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d2965606-0927-11ef-a394-cafcb8bb5ae0_255971.jpg",
              "blurhash": null
            }
          ],
          "name": "Sabunlar",
          "slug": "sabunlar-157",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "de5a75f4f21a18d7e280b96b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d2f0fc5a-0922-11ef-ba99-9eb1cdb29cc5_594199.jpg",
              "blurhash": null
            }
          ],
          "name": "Duş Gelləri",
          "slug": "dus-gellri-158",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "91021675daa714c771e19761",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/8a1fbce2-0921-11ef-9de0-766703b1d227_480534.jpg",
              "blurhash": null
            }
          ],
          "name": "Qadınlar üçün Gigiyenik Məhsullar ",
          "slug": "qadnlar-ucun-gigiyenik-mhsullar-159",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "25057e5cda32153754c1f5c7",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/68120656-0925-11ef-8f7c-a2400595d414_212140.jpg",
              "blurhash": null
            }
          ],
          "name": "Diş Baxımı Məhsulları",
          "slug": "dis-baxm-mhsullar-160",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "372450fbb7659366948540d2",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/945f46a4-edd3-11ef-be5a-b2d1904c4ff5_4006000004273.jpg",
              "blurhash": null
            }
          ],
          "name": "Dəri Təmizləmə Məhsulları",
          "slug": "dri-tmizlm-mhsullar-161",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "57f1bd7d283f543acc06500f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/6e5a9a40-dd6a-11ef-a5dd-7ebd7e26de78_42163190.jpg",
              "blurhash": null
            }
          ],
          "name": "Dəri Baxımı Məhsulları",
          "slug": "dri-baxm-mhsullar-162",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "1d257b1f98ff43ece121dcf7",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/86cf7b8c-0920-11ef-9ec2-1acd5b5fc077_374637.jpg",
              "blurhash": null
            }
          ],
          "name": "Kişilər üçün Təraş Məhsulları",
          "slug": "kisilr-ucun-tras-mhsullar-163",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "1c0847da4510152af5910960",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/1e646e56-0ba8-11ef-b005-7248709ff226_578094.jpg",
              "blurhash": null
            }
          ],
          "name": "Kosmetik Məhsullar",
          "slug": "kosmetik-mhsullar-164",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "0287b8efc43869fc3925f5db",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/723a197c-0923-11ef-83e4-16b5d6efcecb_618042.jpg",
              "blurhash": null
            }
          ],
          "name": "Qadınlar üçün Təraş Məhsulları",
          "slug": "qadnlar-ucun-tras-mhsullar-165",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "24157c597cb614471d764b47",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/ede7f5ba-0925-11ef-8176-7e5f9bc1047e_217045.jpg",
              "blurhash": null
            }
          ],
          "name": "Manikür və Pedikür Məhsulları",
          "slug": "manikur-v-pedikur-mhsullar-166",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "6eb90a355cd5f888671a5c65",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/416fb78a-72b2-11f0-b8b0-7a535e3bfe0f_216764.jpg",
              "blurhash": "j9ZfrTGG;;GGJCtTqXCpTcCpd4tT"
            }
          ],
          "name": "Günəş Kremi və SPF-lər",
          "slug": "guns-kremi-v-spf-lr-168",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "b5312fdd3806dc3259ddeec4",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/2b234ed4-3099-11f0-b300-5603c6bb6b77_459598.jpg",
              "blurhash": null
            }
          ],
          "name": "Hamam Aksesuarları",
          "slug": "hamam-aksesuarlar-169",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "9f6cad64036f59906db022fd",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır və fərqlənə bilər",
      "images": [
        {
          "url": "https://imageproxy.wolt.com/assets/69fcce08c47358e7ca1f8571",
          "blurhash": null
        }
      ],
      "name": "Uşaq Məhsulları",
      "slug": "usaq-mhsullar-170",
      "subcategories": [
        {
          "id": "0bac631eb215d9cbe3b0c370",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/e1e2a616-0920-11ef-ba55-b63f55152359_417229.jpg",
              "blurhash": null
            }
          ],
          "name": "Uşaq qidası",
          "slug": "usaq-qidas-171",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "61a7a5ba8f0c5d65793ab725",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d3bdfb66-0ba6-11ef-a84b-ee7dfef0e6c5_221719.jpg",
              "blurhash": null
            }
          ],
          "name": "Uşaq baxımı",
          "slug": "usaq-baxm-172",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "8567ffd48f6cc86cc6f210cc",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/4a524e7c-0926-11ef-a3eb-7637bfe16087_223038.jpg",
              "blurhash": null
            }
          ],
          "name": "Pampers",
          "slug": "pampers-173",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "961199668616d97ac1c66182",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/680a4844-0925-11ef-bbd5-dea2ea2cbc41_212142.jpg",
              "blurhash": "jkY:rCJ4PKqXKXGXpTpCX;qXgPFl"
            }
          ],
          "name": "Diş baxımı",
          "slug": "dis-baxm-174",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "dccaf9721db04f32d1a863d2",
          "description": "",
          "images": [
            {
              "url": "https://imageproxy.wolt.com/assets/69467fa13f46dc35e6ef9d3f",
              "blurhash": null
            }
          ],
          "name": "Sabun",
          "slug": "sabun-175",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "c6457c6fb9d1c099d5668391",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/d045343c-0925-11ef-9541-8a92e9e5950d_216285.jpg",
              "blurhash": "jhUKjxOX;;hlPcFSlluG;;lC8yKH"
            }
          ],
          "name": "Salfet",
          "slug": "salfet-176",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "4253d6b3591ce1b170ad27fb",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66f6a23f86a34ceec78687fc/dddcd174-9208-11ef-8bf7-d652bf04085c_216918.jpg",
              "blurhash": "j8UebztS;;KXlrGGL6pC;KGG8PpC"
            }
          ],
          "name": "Krem",
          "slug": "krem-178",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "06741e04b41650637687f17b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/cb38c266-5a73-11ef-b698-725af1f99900_11111.png",
              "blurhash": "j8Z;vTKX;;h4LdtSl3yrTKpCcyKW"
            }
          ],
          "name": "Digər",
          "slug": "digr-179",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "655ca4bf509fcbf8f538ecec",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır və fərqlənə bilər\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/c0ee8ebe-4d9c-11ef-92b3-5265cbb04827_321_photoroom__4_.png",
          "blurhash": "j3mSNN;K01cO004yXJTd4hTtXKGI"
        }
      ],
      "name": "Saç Baxımı Məhsulları",
      "slug": "sac-baxm-mhsullar-180",
      "subcategories": [
        {
          "id": "533c9b2c7a8f5cd135118ee3",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/bd75f2d6-0922-11ef-9e53-ee12eac5ee60_592457.jpg",
              "blurhash": null
            }
          ],
          "name": "Şampunlar",
          "slug": "sampunlar-181",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "346ce40018ce1981d06e26f3",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/97d6970e-beb9-11ef-80cc-ae9571e24916_4015100185133.jpg",
              "blurhash": null
            }
          ],
          "name": "Saç Boyaları",
          "slug": "sac-boyalar-182",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "62ff5fba533eafdba58c7235",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/cf129368-0928-11ef-a5bf-22d6e8de5ca5_312062.jpg",
              "blurhash": null
            }
          ],
          "name": "Saça Qulluq Məhsulları",
          "slug": "saca-qulluq-mhsullar-183",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "1344a6501894471c30b0bcb3",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/8c075e78-7c4f-11f0-ac3e-c63d01837e08_d6120416_6870_11f0_a050_d6d7ed7e486b_wmx_s_111111.jpg",
          "blurhash": "jeX:XHpC;;PcPcllllPc;;pB8yGG"
        }
      ],
      "name": "Birdəfə İstifadəlik Məhsullar",
      "slug": "birdf-istifadlik-mhsullar-185",
      "subcategories": [
        {
          "id": "a7dc0a922a2ac6dc0197d59b",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/dc2d1ea2-cdc1-11ef-b36f-7a5f8f0a0376_8691262708173.jpg",
              "blurhash": "j4:;LYGG;;GGhcCpP5tSOZCphjtS"
            }
          ],
          "name": "Birdəfəlik Məhsullar",
          "slug": "birdflik-mhsullar-186",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "b40940e0d40c46f2bbf08154",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/2dfa4e66-0924-11ef-8e62-1acd5b5fc077_660465.jpg",
              "blurhash": null
            }
          ],
          "name": "Zibil torbaları",
          "slug": "zibil-torbalar-187",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "6a680d784653518bbede6079",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/984a3f40-cc21-11ef-a64d-de60d2e84642_4760167820014.jpg",
              "blurhash": null
            }
          ],
          "name": "Hədiyyə və Dekorasiya",
          "slug": "hdiyy-v-dekorasiya-189",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "9890b4a40d2bc7e768bd26e1",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/c18ce650-cc21-11ef-aaa2-9679d685a855_5903355071204.jpg",
              "blurhash": null
            }
          ],
          "name": "Paltar Yuma Aksesuarları",
          "slug": "paltar-yuma-aksesuarlar-191",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ebb70d66e9533b6fb1c7f559",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/fd6656de-cc21-11ef-beac-9688019b0fab_8697422822932.jpg",
              "blurhash": "jdX:XKtC;;KXOXKXllh4;;yG4hBC"
            }
          ],
          "name": "Ayaqqabı Təmizləmə Məhsulları",
          "slug": "ayaqqab-tmizlm-mhsullar-192",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "2244ba06eeeb57ac9b36a526",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/f887ec72-cc21-11ef-972b-9a9a485d8f23_8696287302122.jpg",
              "blurhash": null
            }
          ],
          "name": "Saxlama və Təşkilat – Ev üçün",
          "slug": "saxlama-v-tskilat-ev-ucun-193",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "745c9b38691ee75423171f3a",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/106fa2c4-72b4-11f0-bd0d-5aa9d94b21f4_669908.jpg",
              "blurhash": null
            }
          ],
          "name": "Digər",
          "slug": "digr-201",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "493538f37f55db8d435177ab",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/e9cd05d2-cc21-11ef-9aba-3e721dbc2505_8690982011921.jpg",
          "blurhash": "jpT:fFKX;;lkhlCnKWCpgRtCPbGG"
        }
      ],
      "name": "Bişirmə Məhsulları",
      "slug": "bisirm-mhsullar-202",
      "subcategories": [
        {
          "id": "4f625214d0de5f654f362331",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66f6a23f86a34ceec78687fc/095d3ebc-920c-11ef-83e5-06f57bd16678_629105.jpg",
              "blurhash": "j7Z;DThA;LSZlmOYKWh4;;OY8ydj"
            }
          ],
          "name": "Streclər",
          "slug": "streclr-203",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "8703795262e665c6d54ba560",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/shared/6e1f1512-27ec-11ef-afed-c6b4c56184d9_10_1000x1000.jpg",
              "blurhash": "jbZLnPKFOlCDBStCBTCn;;pGibCq"
            }
          ],
          "name": "Alimunium Folqalar",
          "slug": "alimunium-folqalar-204",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "7b5768224b70ab9eb1f2e4b9",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır və fərqlənə bilər\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/666847e69fa74ad78bef2996/3b6dc592-4d9d-11ef-9db4-da1581b3e1a2_321_photoroom__6_.png",
          "blurhash": "j3nkB0mH00h300SW;;driHlFNBOm"
        }
      ],
      "name": "Ev Heyvanları üçün Məhsullar",
      "slug": "ev-heyvanlar-ucun-mhsullar-206",
      "subcategories": [
        {
          "id": "241290a05a75a30254fe161c",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/7691b298-0926-11ef-912c-ee9392124a88_223728.jpg",
              "blurhash": null
            }
          ],
          "name": "Pişiklər üçün Yem 🐱",
          "slug": "pisiklr-ucun-yem-207",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "1a99927e4459b2c8d0f62ba3",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66348f21f221b23d85139cf6/07c03dfa-0924-11ef-9176-b63f55152359_650067.jpg",
              "blurhash": null
            }
          ],
          "name": "İtlər üçün Yem 🐶",
          "slug": "itlr-ucun-yem-208",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "7a55ca9efa66ae6837833642",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/d8a07956-cc21-11ef-a124-fa4d59891bbe_8681030129552.jpg",
              "blurhash": "jeZLfMKY;;h3TspCd4KXPdpCl3GH"
            }
          ],
          "name": "Qulluq",
          "slug": "qulluq-209",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "d628653414cae281229448c5",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/667938d09800f17d2912c9d0/4669abfc-0326-11f0-b736-4e89f11221cf_579814.jpg",
              "blurhash": null
            }
          ],
          "name": "Aksesuar",
          "slug": "aksesuar-210",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "8f64781d832bceed6b64aa4f",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/2f9300c8-7c51-11f0-aad7-46b057887190_wmx_s_111111.jpg",
          "blurhash": "jeY;3JKX;;llTullcOPcXKpWcPFB"
        }
      ],
      "name": "Xırdavat və Kiçik Ev Əşyaları ",
      "slug": "xrdavat-v-kicik-ev-syalar-211",
      "subcategories": [
        {
          "id": "7b1098315d93e5321cf01fb2",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/66f6a23f86a34ceec78687fc/ed12eab4-920a-11ef-afc9-a26203f3661e_500217.jpg",
              "blurhash": null
            }
          ],
          "name": "Xırdavat Ləvazimatları",
          "slug": "xrdavat-lvazimatlar-212",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "ec5b193eb7a784533d011cc1",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/18309dd6-d270-11ef-8174-be827587888d_641365.jpg",
              "blurhash": null
            }
          ],
          "name": "Şamlar",
          "slug": "samlar-213",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "359ac85c74a382a09d3698f5",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/1ae1f5d4-d270-11ef-ad36-36e2cda0572c_643913.jpg",
              "blurhash": "jbZv7KgPX;TLTcllLcPtndLcF3p3"
            }
          ],
          "name": "Aromatik Difüzor",
          "slug": "aromatik-difuzor-214",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "01045cacfc5ea50107277fb7",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/d87e63d4-cc21-11ef-b9da-aa43ae97752a_8681554625349.jpg",
              "blurhash": null
            }
          ],
          "name": "Mətbəx Ləvazimatları",
          "slug": "mtbx-lvazimatlar-215",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "5dbb99d3dc3f33dfb6aac1c2",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/88984c48-55a8-11f0-95bf-82193052c73a_wmx_s_111111.jpg",
          "blurhash": "j2;fPYpC;;PcKXllGqPcTtGGcPll"
        }
      ],
      "name": "Su Filtrləri və Aksesuar",
      "slug": "su-filtrlri-v-aksesuar-220",
      "subcategories": [],
      "item_ids": []
    },
    {
      "id": "55433d9bce55b04fe13418e8",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/f1ce7dc2-7c4f-11f0-97bd-5adecf1f9d7a_f137b660_f821_11ef_9ad9_3a1d5010c2c0_5702017424743.jpg",
          "blurhash": "jlUe3wh4;;Ttl4h4KXPcTtllh4Pc"
        }
      ],
      "name": "Oyuncaqlar",
      "slug": "oyuncaqlar-221",
      "subcategories": [
        {
          "id": "775b47d75f7f5be0239c65c1",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/938de5b4-d271-11ef-9ab7-da9b365d7fbb_716357.jpg",
              "blurhash": "jlOsz98y;;OXcPh4PcKX;;Pc8PuG"
            }
          ],
          "name": "İnkişafedici Oyuncaqlar",
          "slug": "inkisafedici-oyuncaqlar-222",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "c188bcbe888ddf225af8aa36",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/2bcc4f4e-d26f-11ef-9673-4a7bf78ac137_682233.jpg",
              "blurhash": null
            }
          ],
          "name": "Çöl Oyuncaqları",
          "slug": "col-oyuncaqlar-224",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "3261ce3f843f5e2f25bcce0f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/acf1ea4a-e302-11ef-93ae-ba553528852c_544022.jpg",
              "blurhash": null
            }
          ],
          "name": "Oğlanlar üçün Oyuncaqlar",
          "slug": "oglanlar-ucun-oyuncaqlar-225",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "3957805f25b7b7c3819b510d",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/8ff2c2b6-e302-11ef-b0b9-dea762d919d4_497730.jpg",
              "blurhash": null
            }
          ],
          "name": "Qızlar üçün Oyuncaqlar",
          "slug": "qzlar-ucun-oyuncaqlar-226",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "982fa89f756ad7891a8fafe8",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/993f57fa-dd6a-11ef-bab3-4261c799adc1_2000000454870.jpg",
              "blurhash": "jeYvfIKq;;iVdcFBT5qYTulDh3KC"
            }
          ],
          "name": "Çimərlik üçün Oyuncaqlar",
          "slug": "cimrlik-ucun-oyuncaqlar-227",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "2bc3aa90d0559076dd2b2d83",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/c8f58c88-7c4f-11f0-a76f-c6b40a380285_52210754_62e1_11f0_8b15_ca356ae02407_621182.jpg",
          "blurhash": "jpYK7vqGX;JSLcFSl4qHLctVl4Gm"
        }
      ],
      "name": "Kanselyariya",
      "slug": "kanselyariya-228",
      "subcategories": [
        {
          "id": "c23c15790a0d2a68ef9314e6",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/c3f35708-cc21-11ef-b841-9688019b0fab_6953675319028.jpg",
              "blurhash": "jfXeXLPc;;d4hlKGOXlm;;ll4hPc"
            }
          ],
          "name": "Kağız Məhsulları",
          "slug": "kagz-mhsullar-234",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "c801a1fdfa40166fef25a00e",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/92c8cf96-cc21-11ef-a996-ba373417312e_4760162400037.jpg",
              "blurhash": "j7:fzUtT;;KXh4tTPcGGXKtT8yGq"
            }
          ],
          "name": "Qələmlər, Karandaşlar və Düzəliş Vasitələri",
          "slug": "qlmlr-karandaslar-v-duzlis-vasitlri-236",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "67b53be30d2f9d33b064953e",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/39b38e5c-beb9-11ef-8b5d-22e2043a294c_8699435059947.jpg",
              "blurhash": "jjW:DEKG;;hCKHGnlSpVXKpDcPKG"
            }
          ],
          "name": "Məktəb Ləvazimatları və Tədris Vasitələri",
          "slug": "mktb-lvazimatlar-v-tdris-vasitlri-239",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "76554b6eedd08416796a2cc6",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/b38dff4c-7c4f-11f0-a3d4-0a2577d32331_bfb8aace_e302_11ef_80be_6a9e5d497d77_569034.jpg",
          "blurhash": "jjVunFll;;PcXKPccPcPXKllcPPc"
        }
      ],
      "name": "Maşın üçün Aksesuarlar",
      "slug": "masn-ucun-aksesuarlar-242",
      "subcategories": [
        {
          "id": "7eebcdf2708fc9a933574cd8",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/e6b2f2f0-d26e-11ef-961d-ae54ad97c6b2_514433.jpg",
              "blurhash": "j6:vDVGG;;CpXKCp8ytTKXy7llC9"
            }
          ],
          "name": "Maşın Təmizləməsi",
          "slug": "masn-tmizlmsi-244",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    },
    {
      "id": "c0c520290944536a4b7251f4",
      "description": "❗️Qeyd: Şəkillər təsviri xarakter daşıyır.\n",
      "images": [
        {
          "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/a70c69dc-3098-11f0-baaf-76f6388d71dc_351711.jpg",
          "blurhash": "jkMZ7wFB;;lWd58PplXs;;hnd4FB"
        }
      ],
      "name": "Açıq Hava və Kempinq üçün",
      "slug": "acq-hava-v-kempinq-ucun-246",
      "subcategories": [
        {
          "id": "3582172440a22ce4415f905f",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/7e94ed7e-fb3e-11ef-bc8d-da6fdcb014a9_8719202360905.jpg",
              "blurhash": null
            }
          ],
          "name": "Barbekyu",
          "slug": "barbekyu-247",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "d685739da58cc6870c5f3797",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/667938d09800f17d2912c9d0/466a683a-0326-11f0-8ce9-56c7fd8b1c6f_585289.jpg",
              "blurhash": null
            }
          ],
          "name": "Kömür",
          "slug": "komur-249",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "d103cf7288f8db19b45530d5",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/a70c69dc-3098-11f0-baaf-76f6388d71dc_351711.jpg",
              "blurhash": "jkMZ7wFB;;lWd58PplXs;;hnd4FB"
            }
          ],
          "name": "Soyuducu Maddələr",
          "slug": "soyuducu-maddlr-250",
          "subcategories": [],
          "item_ids": []
        },
        {
          "id": "159ce9b0817564151bf7510d",
          "description": "",
          "images": [
            {
              "url": "https://wolt-menu-images-cdn.wolt.com/menu-images/672b2063a6c24d27db115384/7dd41048-309c-11f0-a73d-ee4a3484a86b_624685.jpg",
              "blurhash": null
            }
          ],
          "name": "Açıq Hava üçün Aksesuarlar",
          "slug": "acq-hava-ucun-aksesuarlar-253",
          "subcategories": [],
          "item_ids": []
        }
      ],
      "item_ids": []
    }
  ],
  "items": [],
  "options": [],
  "variant_groups": []
};

export const bravoProducts: BravoProduct[] = [];

export const bravoProductNames: string[] = [];
