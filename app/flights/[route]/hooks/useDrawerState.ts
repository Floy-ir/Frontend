import { useState, useRef } from 'react'
import { DrawerContentRefType } from '@/app/types'

export function useDrawerState() {
  // Track which drawer has uncommitted changes
  const [dirtyDrawers, setDirtyDrawers] = useState<Record<string, boolean>>({
    all: false,
    ticketType: false,
    cabinClass: false,
    airlines: false,
    agencies: false,
    flightTime: false,
    priceRange: false,
  })

  // Track drawer changes that need to be applied
  const drawerChangesRef = useRef<Record<string, unknown>>({})

  // Add state to control drawer open states
  const [openDrawers, setOpenDrawers] = useState<Record<string, boolean>>({
    sort: false,
    all: false,
    ticketType: false,
    cabinClass: false,
    airlines: false,
    agencies: false,
    flightTime: false,
    priceRange: false,
  })

  // Track which filter section is active in the drawer
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null)

  // Create a drawer content ref to communicate with the FilterDrawerContent
  const drawerContentRef = useRef<DrawerContentRefType>(null)

  // Helper function to mark a drawer as having changes
  const markDrawerDirty = (drawer: string, isDirty: boolean) => {
    setDirtyDrawers((prev) => ({
      ...prev,
      [drawer]: isDirty,
    }))
  }

  // Store changes to be applied when a drawer closes
  const storeDrawerChanges = (drawer: string, changes: unknown) => {
    drawerChangesRef.current[drawer] = changes
    markDrawerDirty(drawer, true)
  }

  // Helper function to open a specific drawer
  const openDrawer = (drawer: string) => {
    setOpenDrawers((prev) => ({
      ...prev,
      [drawer]: true,
    }))
  }

  // Helper function to close a specific drawer
  const closeDrawer = (drawer: string) => {
    setOpenDrawers((prev) => ({
      ...prev,
      [drawer]: false,
    }))
  }

  return {
    dirtyDrawers,
    drawerChangesRef,
    openDrawers,
    activeFilterSection,
    drawerContentRef,
    setActiveFilterSection,
    markDrawerDirty,
    storeDrawerChanges,
    openDrawer,
    closeDrawer,
    setOpenDrawers
  }
} 