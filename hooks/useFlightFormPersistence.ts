import { StorageService } from "@/services/storage/StorageService"
import { PassengerCount } from "@/components/PassengerSelector/PassengerSelector"
import { useCallback } from "react"

// Define the structure of our stored form data
interface FlightFormData {
  origin: string
  destination: string
  departureDate: string | null // Store as ISO string
  passengers: PassengerCount
}

// Create a storage service instance for flight form data
const flightFormStorage = new StorageService<{
  flightForm: FlightFormData
}>("flightForm", "local")

// Default values for the form
const defaultFormData: FlightFormData = {
  origin: "",
  destination: "",
  departureDate: null,
  passengers: { adult: 1, child: 0, infant: 0 },
}

export function useFlightFormPersistence() {
  /**
   * Loads the persisted form data from storage
   */
  const loadFormData = useCallback((): FlightFormData => {
    return flightFormStorage.getItem("flightForm", defaultFormData)
  }, [])

  /**
   * Saves form data to storage
   */
  const saveFormData = useCallback((data: FlightFormData): void => {
    flightFormStorage.setItem("flightForm", data)
  }, [])

  /**
   * Clears stored form data
   */
  const clearFormData = useCallback((): void => {
    flightFormStorage.removeItem("flightForm")
  }, [])

  return {
    loadFormData,
    saveFormData,
    clearFormData,
  }
}
