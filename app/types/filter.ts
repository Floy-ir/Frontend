// Filter-related type definitions

export interface FilterState {
  ticketType: { 
    charter: boolean; 
    system: boolean 
  };
  cabinClass: { 
    economy: boolean; 
    business: boolean; 
    premiumEconomy: boolean
  };
  airlines: Record<string, boolean>;
  agencies: Record<string, boolean>;
}

export interface RouteParams {
  params: Promise<{
    route: string
  }>;
  searchParams: Promise<{
    adult?: string;
    child?: string;
    infant?: string;
    departing?: string;
  }>;
}

export type SortKey = "cheapest" | "mostExpensive" | "earliest" | "latest";

export interface DrawerContentRefType {
  getLocalState: () => {
    localFilters: FilterState;
    localPriceRange: [number, number];
    localFlightTimeRange: [number, number];
  };
}

export interface FilterDrawerContentProps {
  title: string;
  activeFiltersCount: number;
  clearFilters: () => void;
  activeSection: string;
  filters: FilterState;
  updateFilter: (category: string, key: string, value: boolean) => void;
  flightTimeRange: [number, number];
  setFlightTimeRange: (range: [number, number]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

export interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  count?: number;
  isOpen?: boolean;
  isLast?: boolean;
}

export interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  logo?: string;
  extraText?: string;
} 