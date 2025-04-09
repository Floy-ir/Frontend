export interface CityOption {
  value: string;    // City name in Persian (same as label for this implementation)
  label: string;     // Display name
  code: string;      // Airport code (IATA)
}

// Central city configuration
export const CITIES: CityOption[] = [
  { value: "تهران", label: "تهران", code: "THR" },
  { value: "مشهد", label: "مشهد", code: "MHD" },
  { value: "کیش", label: "کیش", code: "KIH" },
  { value: "تبریز", label: "تبریز", code: "TBZ" },
];

// Helper functions
export function getCityByName(name: string): CityOption | undefined {
  return CITIES.find(city => city.value === name || city.label === name);
}

export function getCityByCode(code: string): CityOption | undefined {
  return CITIES.find(city => city.code === code);
}

// For ComboboxSelect, we need options in {value, label} format
export function getCityOptions(): Pick<CityOption, 'value' | 'label'>[] {
  return CITIES.map(({ value, label }) => ({ value, label }));
}