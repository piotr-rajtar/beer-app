/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const beerPayload = [
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
];

const axios = {
  get: () => new Promise((res) => res({ data: beerPayload })),
};
export default axios;
