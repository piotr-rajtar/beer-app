interface Volume {
  unit: 'litres' | 'grams' | 'kilograms' | 'celsius';
  value: number;
}

interface Hop {
  add: 'start' | 'middle' | 'end';
  amount: Volume;
  attribute: string;
  name: string;
}

interface Malt {
  amount: Volume;
  name: string;
}

interface Ingredients {
  hops: Hop[];
  malt: Malt[];
  yeast: string;
}

interface Fermentation {
  temp: Volume;
}

interface MashTemp {
  duration: number;
  temp: Volume;
}

interface Method {
  fermentation: Fermentation;
  mash_temp: MashTemp[];
  twist: null | string;
}

export interface Beer {
  abv: number;
  attenuation_level: number;
  boil_volume: Volume;
  brewers_tips: string;
  contributed_by: string;
  description: string;
  ebc: number;
  first_brewed: number;
  food_pairing: string[];
  ibu: number;
  id: number;
  image_url: string;
  ingredients: Ingredients;
  method: Method;
  name: string;
  ph: number;
  srm: number;
  tagline: string;
  target_fg: number;
  target_og: number;
  volume: Volume;
}

export interface State {
  beers: Beer[];
}
