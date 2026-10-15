export type Listing = {
  title: string;
  price: string;
  oos: boolean;
  url: string;
  rating: string;
  reviews: string;
  why: string;
};

export type Blueprint = {
  card: string;
  title: string;
  price: string;
  note: string;
};

export type OosModel = {
  host: string;
  rules: string[];
  neg: string[];
};

export type ScrapeResult = {
  platform: string;
  blueprint: Blueprint | null;
  items: Listing[];
  soldOut: number;
  skippedZone: number;
  model: OosModel | null;
  learned: string[];
};
