export interface TipItem {
  label?: string;
  text?: string;
  // Exact `name` values from regions.geojson; makes the item clickable
  regions?: string[];
}

export interface TipSection {
  id: string;
  title: string;
  description?: string;
  items: TipItem[];
}

export interface CountryTips {
  country_code: string;
  title: string;
  summary?: string;
  sections: TipSection[];
}
