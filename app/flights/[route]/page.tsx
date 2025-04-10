import React from 'react'
import { getCityByCode } from '@/config/cities'
import { formatDate } from '@/utils/dateUtils'
import { SearchNormal } from 'iconsax-react'
import Link from 'next/link'
import { FlightSearchHeader } from '@/components/FlightSearchHeader/FlightSearchHeader'
import Timeline from '@/app/time-line/scratch'
type RouteParams = {
  params: {
    route: string
  }
  searchParams: {
    adult?: string
    child?: string
    infant?: string
    departing?: string
  }
}

export default function FlightResultsPage({ params, searchParams }: RouteParams) {
  // Parse route parameter (e.g., "THR-MHD")
  const { route } = params
  const routeParts = route.split('-')
  const originCode = routeParts[0] || ''
  const destinationCode = routeParts[1] || ''
  
  // Get city details
  const originCity = getCityByCode(originCode)
  const destinationCity = getCityByCode(destinationCode)
  
  // Parse search parameters
  const { adult = '1', child = '0', infant = '0', departing = '' } = searchParams
  
  // Calculate total passengers
  const totalPassengers = Number(adult) + Number(child) + Number(infant)
  
  // Format date for display
  const departureDate = departing ? new Date(departing) : null
  
  // Format date for header - this would need localization in a real app
  const dateDisplay = departureDate ? 'جمعه - ۴ اسفند' : 'تاریخ نامشخص'
  
  return (
    <div className='flex flex-col justify-center'>
      {/* Search header summary bar */}
      <FlightSearchHeader
        originCity={originCity?.label || originCode}
        destinationCity={destinationCity?.label || destinationCode}
        date={departureDate ? formatDate(departureDate) : 'تاریخ نامشخص'}
        passengerCount={totalPassengers}
        originCode={originCode}
        destinationCode={destinationCode}
        adult={parseInt(adult || '1')}
        child={parseInt(child || '0')}
        infant={parseInt(infant || '0')}
      />
      <div className="flex flex-col mt-0 lg:mt-6 items-center mx-0 lg:mx-[376px]">
    <Timeline/>
    </div>
    </div>
  )
} 