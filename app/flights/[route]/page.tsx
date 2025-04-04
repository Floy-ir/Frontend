import React from 'react'
import { getCityByCode } from '@/config/cities'
import { formatDate } from '@/utils/dateUtils'
import { FlightSearchHeader } from '@/components/FlightSearchHeader/FlightSearchHeader'
import { FlightResultsList } from './FlightResultsList'
import { Button } from '@/components/ui/button'
import { FlightFilters } from '@/components/FlightFilters'

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

export default function FlightResults({ params, searchParams }: RouteParams) {
  // Parse route from URL (format: THR-MHD)
  const [originCode, destinationCode] = params.route.split('-')
  // Get city names from codes
  const originCity = getCityByCode(originCode || '')?.label || originCode
  const destinationCity = getCityByCode(destinationCode || '')?.label || destinationCode
  
  // Get passenger counts and date from URL
  const adult = parseInt(searchParams.adult || '1')
  const child = parseInt(searchParams.child || '0')
  const infant = parseInt(searchParams.infant || '0')
  const passengerCount = adult + child + infant
  const departureDate = searchParams.departing || formatDate(new Date())

  // Sample flight data for demonstration
  const sampleFlights = [
    {
      id: '1',
      departureTime: '۱۱:۳۰',
      arrivalTime: '۰۹:۳۰',
      duration: { hours: 1, minutes: 30 },
      airline: {
        name: 'آتا',
        logo: '/images/logo.webp'
      },
      flightInfo: {
        aircraft: 'Boeing 737-300',
        baggage: '۲۰ kg',
        ticketType: 'سیستمی',
        cabinClass: 'اکونومی'
      },
      price: {
        amount: 3534678,
        formattedAmount: '3,534,678',
        agency: 'علی بابا',
        agencyLogo: '/images/logo.webp',
        label: 'ارزان‌ترین'
      },
      otherSellersCount: 3
    },
    {
      id: '2',
      departureTime: '۱۳:۴۵',
      arrivalTime: '۱۵:۱۵',
      duration: { hours: 1, minutes: 30 },
      airline: {
        name: 'ایران ایر',
        logo: '/images/logo.webp'
      },
      flightInfo: {
        aircraft: 'Airbus A320',
        baggage: '۲۵ kg',
        ticketType: 'چارتری',
        cabinClass: 'اکونومی'
      },
      price: {
        amount: 3689000,
        formattedAmount: '3,689,000',
        agency: 'فلای تودی',
        agencyLogo: '/images/logo.webp',
        label: 'ارزان‌ترین'
      },
      otherSellersCount: 5
    },
    {
      id: '3',
      departureTime: '۱۷:۲۰',
      arrivalTime: '۱۸:۵۰',
      duration: { hours: 1, minutes: 30 },
      airline: {
        name: 'آسمان',
        logo: '/images/logo.webp'
      },
      flightInfo: {
        aircraft: 'Boeing 737-400',
        baggage: '۲۰ kg',
        ticketType: 'سیستمی',
        cabinClass: 'بیزینس'
      },
      price: {
        amount: 4150000,
        formattedAmount: '4,150,000',
        agency: 'مستر بلیط',
        agencyLogo: '/images/logo.webp',
        label: 'ارزان‌ترین'
      },
      otherSellersCount: 2
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-Gray/N100">
      {/* Search header */}
      <FlightSearchHeader
        originCity={originCity || ''}
        destinationCity={destinationCity || ''}
        date={departureDate}
        passengerCount={passengerCount}
        originCode={originCode}
        destinationCode={destinationCode}
        adult={adult}
        child={child}
        infant={infant}
      />

      {/* Main content */}
      <div className="container max-w-266 mx-auto px-4 py-6">
        <div className="flex flex-row items-center justify-between mb-8">
          <p className="text-Gray-N800 text-sm font-semibold text-right">
            ۳ نتیجه
          </p>
          <div className="flex flex-row items-center gap-2">
            <Button variant="outline" size="sm" className="self-stretch">
              گرانترین
            </Button>
            <Button variant="outline" size="sm" className="self-stretch">
              ارزانترین
            </Button>
            <Button variant="outline" size="sm" className="self-stretch">
              دیرترین
            </Button>
            <Button variant="outline" size="sm" className="self-stretch">
              نزدیک ترین
            </Button>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          {/* Flight filters sidebar */}
          <div className="hidden md:block">
            <FlightFilters />
          </div>

          {/* Flight results list */}
          <div className="flex-1">
            <FlightResultsList flights={sampleFlights} />
          </div>
        </div>
      </div>
    </div>
  )
} 