import { apiFetch } from "@/services/api";

export interface CityOption {
  value: string;    // City name in Persian (same as label for this implementation)
  label: string;     // Display name
  code: string;      // Airport code (IATA)
}
export interface CityOption2 {
  name: string;
  value: string;
  destinations?: { name: string; value: string }[];
}

// Central city configuration



let Cities: CityOption[];
let results: CityOption2[];

async function loadCities(): Promise<CityOption[]> {
 
  if (!results) {
    const response = await apiFetch<{ count: number; results: CityOption2[] }>("/flight-city");

    if (!response || !response.results) {
      // Handle the case where response or response.results is undefined
      throw new Error("Failed to load cities data");
    }

    results = response.results;
  }
  Cities = results.map(city => ({
    value: city.name,
    label: city.name,
    code: city.value
  }));
  return Cities;
}

// Helper functions
export function getCityByName(name: string): CityOption | undefined {
  return Cities.find(city => city.value === name || city.label === name);
}

export function getCityByCode(code: string): CityOption | undefined {
  // Map CityOption2 to CityOption and find by code (which is CityOption2.value)
  const city = Cities.find(city => city.value === code);
  if (!city) return undefined;
  return city
}

// For ComboboxSelect, we need options in {value, label} format
export async function getCityOptions(): Promise<Pick<CityOption, 'value' | 'label'>[]> {
  const cities = await loadCities();
  return cities.map(({ value, label }) => ({ value, label }));
}