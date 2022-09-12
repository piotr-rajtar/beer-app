import { Beer, BeerSimplified } from '@/types/typings';

//MOCKED DATA USED IN BEER TABLE BODY TESTS

export const simplifiedBeers: BeerSimplified[] = [
  {
    id: 1,
    name: 'Buzz',
    first_brewed: '09/2007',
    abv: 4.5,
    ibu: 60,
    ebc: 20,
    ph: 4.4,
  },
  {
    id: 16,
    name: 'Libertine Porter',
    first_brewed: '01/2012',
    abv: 6.1,
    ibu: 45,
    ebc: 219,
    ph: 4.4,
  },
  {
    id: 24,
    name: 'The End Of History',
    first_brewed: '06/2011',
    abv: 55,
    ibu: null,
    ebc: null,
    ph: 4.4,
  },
];

//MOCKED DATA USED IN STORE TESTS

export const beerPayload: Beer[] = [
  {
    abv: 999,
    attenuation_level: 999,
    boil_volume: { value: 999, unit: 'litres' },
    brewers_tips: 'Some brewers tip',
    contributed_by: 'Contributor',
    description: 'Some description',
    ebc: 999,
    first_brewed: '01/1900',
    food_pairing: [],
    ibu: 999,
    id: 999,
    image_url: '',
    ingredients: { hops: [], malt: [], yeast: 'yeast' },
    method: {
      fermentation: { temp: { value: 999, unit: 'celsius' } },
      twist: null,
      mash_temp: [{ temp: { value: 999, unit: 'celsius' }, duration: 999 }],
    },
    name: 'Infinity',
    ph: 999,
    srm: 999,
    tagline: 'Infinity',
    target_fg: 999,
    target_og: 999,
    volume: { value: 999, unit: 'litres' },
  },
];

export const duplicatedBeerPayload = [
  {
    abv: 4.5,
    attenuation_level: 75,
    boil_volume: { value: 25, unit: 'litres' },
    brewers_tips:
      'The earthy and floral aromas from the hops can be overpowering. Drop a little Cascade in at the end of the boil to lift the profile with a bit of citrus.',
    contributed_by: 'Sam Mason <samjbmason>',
    description: 'A light, crisp and bitter IPA brewed with English and American hops. A small batch brewed only once.',
    ebc: 20,
    first_brewed: '09/2007',
    food_pairing: ['Spicy chicken tikka masala', 'Grilled chicken quesadilla', 'Caramel toffee cake'],
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
];
