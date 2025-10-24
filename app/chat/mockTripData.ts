import type { TripPlan } from "@/app/types/trip"

export const mockMashhadTrip: TripPlan = {
  id: "trip-mashhad-001",
  title: "برنامه سفر ۳ روزه زیارتی و گردشگری مشهد",
  startDate: "۱۰ آبان",
  endDate: "۱۲ آبان",
  travelerCount: 2,
  mainLocation: {
    lat: 36.2974,
    lng: 59.6059,
    name: "مشهد",
  },
  days: [
    {
      date: "۱۰ آبان",
      dayName: "دوشنبه",
      activities: [
        {
          id: "activity-1",
          type: "transportation",
          mode: "flight",
          origin: "تهران",
          destination: "مشهد",
          duration: "۱ ساعت و ۱۵ دقیقه",
          departureTime: "۸:۳۰ صبح",
          recommendedFlight: {
            airline: "ایران ایر",
            airlineLogo: "https://cdn.alibaba.ir/h2/desktop/assets/images/airlines/W5-3f6c6303.svg",
            price: {
              amount: 2800000,
              formattedAmount: "2,800,000",
              agency: "علی‌بابا",
              agencyLogo: "https://cdn.alibaba.ir/h2/desktop/assets/images/safarmarket/alibaba-01e161d1.svg",
              label: "ارزان‌ترین",
            },
            departureTime: "۸:۳۰",
            arrivalTime: "۹:۴۵",
            duration: {
              hours: 1,
              minutes: 15,
            },
            flightInfo: {
              baggage: "20",
              cabinClass: "اکونومی",
            },
            base_redirect_url: "https://www.alibaba.ir/flights",
          },
        },
        {
          id: "activity-2",
          type: "destination",
          name: "مشهد",
          description:
            "مشهد، دومین شهر بزرگ ایران و پایتخت معنوی کشور، به خاطر حرم مطهر امام رضا (ع) و جاذبه‌های تاریخی و فرهنگی فراوان مشهور است...",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mashhad_towers_view.jpg",
          location: {
            lat: 36.2974,
            lng: 59.6059,
            name: "مشهد",
          },
        },
        {
          id: "activity-3",
          type: "accommodation",
          name: "هتل درویشی",
          rating: 8.4,
          reviewCount: 2850,
          guestCount: 2,
          nightCount: 2,
          pricePerNight: "از ۲،۵۰۰،۰۰۰ تومان در هر شب",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Darvishi_hotel.png",
          location: {
            lat: 36.2925,
            lng: 59.6142,
            name: "هتل درویشی",
          },
        },
      ],
    },
    {
      date: "۱۱ آبان",
      dayName: "سه‌شنبه",
      activities: [
        {
          id: "activity-4",
          type: "attraction",
          name: "حرم مطهر امام رضا (ع)",
          description: "بارگاه منور امام هشتم شیعیان و بزرگترین مسجد جهان از نظر مساحت",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/RezaShrine.jpg",
          location: {
            lat: 36.2908,
            lng: 59.6158,
            name: "حرم مطهر امام رضا (ع)",
          },
          estimatedDuration: "۳-۴ ساعت",
        },
        {
          id: "activity-5",
          type: "attraction",
          name: "موزه آستان قدس رضوی",
          description: "موزه‌ای غنی با مجموعه‌ای ارزشمند از فرش، قرآن‌های خطی، و آثار تاریخی",
          image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mehrab%2C_Collections_of_Astan_Quds_Razavi_Museum_%282%29.jpg",
          location: {
            lat: 36.2915,
            lng: 59.6165,
            name: "موزه آستان قدس رضوی",
          },
          estimatedDuration: "۲-۳ ساعت",
        },
        {
          id: "activity-6",
          type: "attraction",
          name: "بازار رضا",
          description: "بازار سنتی و پرجنب‌وجوش با طیف وسیعی از سوغات، زعفران، و صنایع دستی",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bazaar_reza_mashhad.jpg",
          location: {
            lat: 36.2895,
            lng: 59.6175,
            name: "بازار رضا",
          },
          estimatedDuration: "۱-۲ ساعت",
        },
      ],
    },
    {
      date: "۱۲ آبان",
      dayName: "چهارشنبه",
      activities: [
        {
          id: "activity-7",
          type: "attraction",
          name: "آرامگاه فردوسی",
          description: "مقبره حکیم ابوالقاسم فردوسی، شاعر بزرگ ایران و سراینده شاهنامه",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tomb_of_Ferdowsi_%283%29.jpg",
          location: {
            lat: 36.4073,
            lng: 59.4941,
            name: "آرامگاه فردوسی، توس",
          },
          estimatedDuration: "۱-۲ ساعت",
        },
        {
          id: "activity-8",
          type: "attraction",
          name: "مقبره نادرشاه افشار",
          description: "آرامگاه نادرشاه، یکی از مشهورترین پادشاهان ایران با معماری منحصر به فرد",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tomb_of_Nader_Shah.JPG",
          location: {
            lat: 36.2847,
            lng: 59.5989,
            name: "مقبره نادرشاه افشار",
          },
          estimatedDuration: "۱ ساعت",
        },
        {
          id: "activity-9",
          type: "transportation",
          mode: "flight",
          origin: "مشهد",
          destination: "تهران",
          duration: "۱ ساعت و ۲۰ دقیقه",
          departureTime: "۸:۰۰ شب",
          recommendedFlight: {
            airline: "کیش ایر",
            airlineLogo: "https://cdn.alibaba.ir/h2/desktop/assets/images/airlines/Y9-11a2fb8a.svg",
            price: {
              amount: 2650000,
              formattedAmount: "2,650,000",
              agency: "فلای تودی",
              agencyLogo: "https://www.flytoday.ir/images/logo.svg",
              label: "ارزان‌ترین",
            },
            departureTime: "۲۰:۰۰",
            arrivalTime: "۲۱:۲۰",
            duration: {
              hours: 1,
              minutes: 20,
            },
            flightInfo: {
              baggage: "20",
              cabinClass: "اکونومی",
            },
            base_redirect_url: "https://www.flytoday.ir/",
          },
        },
      ],
    },
  ],
}
