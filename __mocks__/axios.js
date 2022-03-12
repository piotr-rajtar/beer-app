/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const beerPayloadFirstPage = [
  {
    abv: 4.5,
    attenuation_level: 75,
    boil_volume: { value: 25, unit: 'litres' },
    brewers_tips:
      'The earthy and floral aromas from the hops can be overpowering. Drop a little Cascade in at the end of the boil to lift the profile with a bit of citrus.',
    contributed_by: 'Sam Mason <samjbmason>',
    description:
      'A light, crisp and bitter IPA brewed with English and American hops. A small batch brewed only once.',
    ebc: 20,
    first_brewed: '09/2007',
    food_pairing: [
      'Spicy chicken tikka masala',
      'Grilled chicken quesadilla',
      'Caramel toffee cake',
    ],
    ibu: 60,
    id: 1,
    image_url: 'https://images.punkapi.com/v2/keg.png',
    ingredients: { hops: [], malt: [], yeast: 'yeast' },
    method: {
      fermentation: { temp: { value: 19, unit: 'celsius' } },
      twist: null,
      mash_temp: [{ temp: { value: 64, unit: 'celsius' }, duration: 75 }],
    },
    name: 'Buzz',
    ph: 4.4,
    srm: 10,
    tagline: 'A Real Bitter Experience.',
    target_fg: 1010,
    target_og: 1044,
    volume: { value: 20, unit: 'litres' },
  },
  {
    abv: 6.1,
    attenuation_level: 70.1,
    boil_volume: { value: 25, unit: 'litres' },
    brewers_tips:
      'Mash in at a higher temperature to leave more unfermentable sugars in the wort. This gives the beer a sweeter porter profile.',
    contributed_by: 'Sam Mason <samjbmason>',
    description:
      'An avalanche of cross-continental hop varieties give this porter a complex spicy, resinous and citrusy aroma, with a huge malt bill providing a complex roasty counterpoint. Digging deeper into the flavour draws out cinder toffee, bitter chocolate and hints of woodsmoke.',
    ebc: 219,
    first_brewed: '01/2012',
    food_pairing: [
      'Blue cheese beef burger',
      'Glazed short ribs',
      'Chocolate cake',
    ],
    ibu: 45,
    id: 16,
    image_url: 'https://images.punkapi.com/v2/16.png',
    ingredients: { hops: [], malt: [], yeast: 'yeast' },
    method: {
      fermentation: { temp: { value: 18, unit: 'celsius' } },
      twist: null,
      mash_temp: [{ temp: { value: 68, unit: 'celsius' }, duration: 35 }],
    },
    name: 'Libertine Porter',
    ph: 4.4,
    srm: 109.5,
    tagline: 'Dry-Hopped Aggressive Porter.',
    target_fg: 1020,
    target_og: 1067,
    volume: { value: 20, unit: 'litres' },
  },
];

const beerPayloadSecondPage = [
  {
    abv: 8,
    attenuation_level: 86,
    boil_volume: { value: 25, unit: 'litres' },
    brewers_tips: 'Some brewers tip',
    contributed_by: 'Sam Mason <samjbmason>',
    description: 'Some description',
    ebc: 12,
    first_brewed: '12/2007',
    food_pairing: ['Oysters', 'Hickory smoked ham', 'Rocky Road'],
    ibu: 60,
    id: 23,
    image_url: 'https://images.punkapi.com/v2/23.png',
    ingredients: { hops: [], malt: [], yeast: 'yeast' },
    method: {
      fermentation: { temp: { value: 19, unit: 'celsius' } },
      twist: null,
      mash_temp: [{ temp: { value: 65, unit: 'celsius' }, duration: 75 }],
    },
    name: 'Storm',
    ph: 4.4,
    srm: 6,
    tagline: 'Islay Whisky Aged IPA.',
    target_fg: 1010,
    target_og: 1082,
    volume: { value: 20, unit: 'litres' },
  },
];

const axios = {
  get: (url) =>
    new Promise((res) => {
      const urlParams = url.split('?')[1];
      const searchParams = new URLSearchParams(urlParams);
      if (searchParams.has('page')) {
        res({ data: beerPayloadSecondPage });
      } else {
        res({ data: beerPayloadFirstPage });
      }
    }),
};
export default axios;
