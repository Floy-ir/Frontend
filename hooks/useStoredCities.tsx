import { useState, useEffect, useCallback } from "react"
import { CitiesStorageService } from "@/services/storage/CitiesStorageService"

// Check if we're running in the browser
const isBrowser = typeof window !== "undefined"

/**
 * Hook for accessing and managing city selections with localStorage
 */
export function useStoredCities() {
  const [recentSelections, setRecentSelections] = useState<Array<{ value: string; label: string }>>([])

  // Load data on mount, only if in browser
  useEffect(() => {
    if (isBrowser) {
      setRecentSelections(CitiesStorageService.getRecentSelections())
    }
  }, [])

  // Add a new recent selection
  const addRecentSelection = useCallback((value: string, label: string, code: string) => {
    CitiesStorageService.addRecentSelection(value, label, code)
    setRecentSelections(CitiesStorageService.getRecentSelections())
  }, [])

  // Add a new search
  const saveSearch = useCallback((origin: string, destination: string, date: string) => {
    CitiesStorageService.addLastSearch(origin, destination, date)
  }, [])

  return {
    recentSelections,
    addRecentSelection,
    saveSearch,
    lastSearches: CitiesStorageService.getLastSearches(),
  }
}
