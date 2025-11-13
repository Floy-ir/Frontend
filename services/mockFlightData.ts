import type { FlightCardProps } from "@/components/FlightsPage/FlightCard/flight-card"

export type MockFlightData = Omit<FlightCardProps, "onBuy" | "className" | "intent">

export const mockFlightData: MockFlightData[] = [
  {
    departureTime: "08:30",
    arrivalTime: "09:45",
    origin: "تهران",
    destination: "مشهد",
    duration: {
      hours: 1,
      minutes: 15,
    },
    airline: {
      name: "ایران ایر",
      logo: "/images/airlines/iran-air.png",
    },
    flightInfo: {
      baggage: "20",
      cabinClass: "اکونومی",
    },
    price: {
      amount: 2800000,
      formattedAmount: "2,800,000",
      agency: "علی‌بابا",
      agencyLogo: "/images/agencies/alibaba.png",
      label: "بهترین قیمت",
      base_redirect_url: "https://alibaba.ir/flight/booking",
      one_adult_redirect_url: "https://alibaba.ir/flight/booking/1adult",
      two_adults_redirect_url: "https://alibaba.ir/flight/booking/2adults",
    },
    websites: [
      {
        adult_price: 2800000,
        base_redirect_url: "https://alibaba.ir/flight/booking",
        child_price: 2100000,
        detail: {
          uid: "alibaba-1",
          name: "Alibaba",
          name_fa: "علی‌بابا",
          image: "/images/agencies/alibaba.png",
        },
        infant_price: 280000,
        one_adult_redirect_url: "https://alibaba.ir/flight/booking/1adult",
        remaining_seat: 8,
        two_adult_redirect_url: "https://alibaba.ir/flight/booking/2adults",
      },
      {
        adult_price: 2950000,
        base_redirect_url: "https://snapptrip.com/flight/booking",
        child_price: 2200000,
        detail: {
          uid: "snapptrip-1",
          name: "SnappTrip",
          name_fa: "اسنپ تریپ",
          image: "/images/agencies/snapptrip.png",
        },
        infant_price: 295000,
        one_adult_redirect_url: "https://snapptrip.com/flight/booking/1adult",
        remaining_seat: 5,
        two_adult_redirect_url: "https://snapptrip.com/flight/booking/2adults",
      },
    ],
    otherSellersCount: 2,
  },
  {
    departureTime: "10:15",
    arrivalTime: "11:30",
    origin: "تهران",
    destination: "مشهد",
    duration: {
      hours: 1,
      minutes: 15,
    },
    airline: {
      name: "ماهان",
      logo: "/images/airlines/mahan.png",
    },
    flightInfo: {
      baggage: "30",
      cabinClass: "بیزنس",
    },
    price: {
      amount: 4200000,
      formattedAmount: "4,200,000",
      agency: "اسنپ تریپ",
      agencyLogo: "/images/agencies/snapptrip.png",
      base_redirect_url: "https://snapptrip.com/flight/booking",
      one_adult_redirect_url: "https://snapptrip.com/flight/booking/1adult",
      two_adults_redirect_url: "https://snapptrip.com/flight/booking/2adults",
    },
    websites: [
      {
        adult_price: 4200000,
        base_redirect_url: "https://snapptrip.com/flight/booking",
        child_price: 3150000,
        detail: {
          uid: "snapptrip-2",
          name: "SnappTrip",
          name_fa: "اسنپ تریپ",
          image: "/images/agencies/snapptrip.png",
        },
        infant_price: 420000,
        one_adult_redirect_url: "https://snapptrip.com/flight/booking/1adult",
        remaining_seat: 3,
        two_adult_redirect_url: "https://snapptrip.com/flight/booking/2adults",
      },
      {
        adult_price: 4350000,
        base_redirect_url: "https://alibaba.ir/flight/booking",
        child_price: 3260000,
        detail: {
          uid: "alibaba-2",
          name: "Alibaba",
          name_fa: "علی‌بابا",
          image: "/images/agencies/alibaba.png",
        },
        infant_price: 435000,
        one_adult_redirect_url: "https://alibaba.ir/flight/booking/1adult",
        remaining_seat: 2,
        two_adult_redirect_url: "https://alibaba.ir/flight/booking/2adults",
      },
    ],
    otherSellersCount: 2,
  },
  {
    departureTime: "14:20",
    arrivalTime: "15:35",
    origin: "تهران",
    destination: "مشهد",
    duration: {
      hours: 1,
      minutes: 15,
    },
    airline: {
      name: "کیش ایر",
      logo: "/images/airlines/kish-air.png",
    },
    flightInfo: {
      baggage: "20",
      cabinClass: "اکونومی",
    },
    price: {
      amount: 2650000,
      formattedAmount: "2,650,000",
      agency: "فلای تودی",
      agencyLogo: "/images/agencies/flytoday.png",
      base_redirect_url: "https://flytoday.ir/flight/booking",
      one_adult_redirect_url: "https://flytoday.ir/flight/booking/1adult",
      two_adults_redirect_url: "https://flytoday.ir/flight/booking/2adults",
    },
    websites: [
      {
        adult_price: 2650000,
        base_redirect_url: "https://flytoday.ir/flight/booking",
        child_price: 1990000,
        detail: {
          uid: "flytoday-1",
          name: "FlyToday",
          name_fa: "فلای تودی",
          image: "/images/agencies/flytoday.png",
        },
        infant_price: 265000,
        one_adult_redirect_url: "https://flytoday.ir/flight/booking/1adult",
        remaining_seat: 12,
        two_adult_redirect_url: "https://flytoday.ir/flight/booking/2adults",
      },
    ],
    otherSellersCount: 1,
  },
  {
    departureTime: "16:45",
    arrivalTime: "18:00",
    origin: "تهران",
    destination: "مشهد",
    duration: {
      hours: 1,
      minutes: 15,
    },
    airline: {
      name: "آسمان",
      logo: "/images/airlines/aseman.png",
    },
    flightInfo: {
      baggage: "20",
      cabinClass: "اکونومی",
    },
    price: {
      amount: 2750000,
      formattedAmount: "2,750,000",
      agency: "علی‌بابا",
      agencyLogo: "/images/agencies/alibaba.png",
      base_redirect_url: "https://alibaba.ir/flight/booking",
      one_adult_redirect_url: "https://alibaba.ir/flight/booking/1adult",
      two_adults_redirect_url: "https://alibaba.ir/flight/booking/2adults",
    },
    websites: [
      {
        adult_price: 2750000,
        base_redirect_url: "https://alibaba.ir/flight/booking",
        child_price: 2060000,
        detail: {
          uid: "alibaba-3",
          name: "Alibaba",
          name_fa: "علی‌بابا",
          image: "/images/agencies/alibaba.png",
        },
        infant_price: 275000,
        one_adult_redirect_url: "https://alibaba.ir/flight/booking/1adult",
        remaining_seat: 6,
        two_adult_redirect_url: "https://alibaba.ir/flight/booking/2adults",
      },
      {
        adult_price: 2850000,
        base_redirect_url: "https://snapptrip.com/flight/booking",
        child_price: 2140000,
        detail: {
          uid: "snapptrip-3",
          name: "SnappTrip",
          name_fa: "اسنپ تریپ",
          image: "/images/agencies/snapptrip.png",
        },
        infant_price: 285000,
        one_adult_redirect_url: "https://snapptrip.com/flight/booking/1adult",
        remaining_seat: 4,
        two_adult_redirect_url: "https://snapptrip.com/flight/booking/2adults",
      },
    ],
    otherSellersCount: 2,
  },
  {
    departureTime: "19:30",
    arrivalTime: "20:45",
    origin: "تهران",
    destination: "مشهد",
    duration: {
      hours: 1,
      minutes: 15,
    },
    airline: {
      name: "زاگرس",
      logo: "/images/airlines/zagros.png",
    },
    flightInfo: {
      baggage: "20",
      cabinClass: "اکونومی",
    },
    price: {
      amount: 2900000,
      formattedAmount: "2,900,000",
      agency: "اسنپ تریپ",
      agencyLogo: "/images/agencies/snapptrip.png",
      base_redirect_url: "https://snapptrip.com/flight/booking",
      one_adult_redirect_url: "https://snapptrip.com/flight/booking/1adult",
      two_adults_redirect_url: "https://snapptrip.com/flight/booking/2adults",
    },
    websites: [
      {
        adult_price: 2900000,
        base_redirect_url: "https://snapptrip.com/flight/booking",
        child_price: 2175000,
        detail: {
          uid: "snapptrip-4",
          name: "SnappTrip",
          name_fa: "اسنپ تریپ",
          image: "/images/agencies/snapptrip.png",
        },
        infant_price: 290000,
        one_adult_redirect_url: "https://snapptrip.com/flight/booking/1adult",
        remaining_seat: 9,
        two_adult_redirect_url: "https://snapptrip.com/flight/booking/2adults",
      },
    ],
    otherSellersCount: 1,
  },
]

// Helper function to get mock flights for a specific route
export function getMockFlights(origin: string, destination: string): MockFlightData[] {
  // For now, return all mock data. In the future, this could filter based on route
  return mockFlightData.map((flight) => ({
    ...flight,
    origin,
    destination,
  }))
}
