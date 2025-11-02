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
            "مشهد، دومین شهر بزرگ ایران و پایتخت معنوی کشور، به خاطر حرم مطهر امام رضا (ع) و جاذبه‌های تاریخی و فرهنگی فراوان مشهور است. این شهر با بیش از ۳ میلیون نفر جمعیت، یکی از مهم‌ترین مراکز زیارتی جهان اسلام محسوب می‌شود. حرم مطهر امام رضا (ع) بزرگترین مسجد جهان از نظر مساحت است و سالانه میلیون‌ها زائر از سراسر جهان را به خود جذب می‌کند. مشهد همچنین دارای جاذبه‌های گردشگری متنوعی مانند بازارهای سنتی، موزه‌های غنی، و رستوران‌های محلی است که تجربه‌ای منحصر به فرد از فرهنگ و تاریخ ایران را ارائه می‌دهند.",
          descriptionImages: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mashhad_towers_view.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mashhad_skyline.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mashhad_street.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mashhad_bazaar.jpg",
          ],
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
          description:
            "هتل مجلل درویشی مشهد یکی از بهترین هتل‌های ۵ ستاره شهر است که در نزدیکی حرم مطهر امام رضا (ع) واقع شده است. این هتل با معماری سنتی ایرانی و امکانات مدرن، شامل بیش از ۳۵۰ اتاق و سوئیت لوکس، رستوران‌های متنوع با غذاهای ایرانی و بین‌المللی، استخر، سونا، جکوزی، سالن‌های کنفرانس، و خدمات ۲۴ ساعته است. هتل درویشی با موقعیت مکانی عالی، دسترسی آسان به مراکز خرید و جاذبه‌های گردشگری، و خدمات با کیفیت، انتخابی ایده‌آل برای زائران و گردشگران است.",
          descriptionImages: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Darvishi_hotel.png",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Hotel_room_interior.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Hotel_lobby.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Hotel_restaurant.jpg",
          ],
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
          description:
            "بارگاه منور امام هشتم شیعیان و بزرگترین مسجد جهان از نظر مساحت که سالانه بیش از ۳۰ میلیون زائر را به خود جذب می‌کند. این مجموعه عظیم شامل حرم اصلی، صحن‌های متعدد، رواق‌ها، و بناهای تاریخی است. معماری اسلامی فوق‌العاده، گنبد طلایی، مناره‌های بلند، و کاشی‌کاری‌های نفیس از ویژگی‌های این مکان مقدس است. زائران می‌توانند از موزه‌های حرم، کتابخانه‌های غنی، و خدمات رفاهی متنوع استفاده کنند. فضای معنوی و آرامش‌بخش حرم، تجربه‌ای عمیق از عبادت و زیارت را برای بازدیدکنندگان فراهم می‌کند.",
          descriptionImages: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/RezaShrine.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Imam_Reza_Shrine_interior.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Imam_Reza_golden_dome.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Imam_Reza_courtyard.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Imam_Reza_minarets.jpg",
          ],
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
          description:
            "موزه‌ای غنی با مجموعه‌ای ارزشمند از فرش، قرآن‌های خطی، و آثار تاریخی که بخشی از مجموعه عظیم آستان قدس رضوی است. این موزه شامل گنجینه‌های نفیسی مانند فرش‌های دستباف نادر، قرآن‌های خطی با قدمت بیش از هزار سال، سکه‌های تاریخی، و آثار هنری اسلامی است. معماری موزه با الهام از معماری سنتی ایرانی، فضایی آرام و فرهنگی را ایجاد کرده است. بازدیدکنندگان می‌توانند از نمایشگاه‌های مختلف دیدن کنند و با تاریخ و هنر اسلامی ایران آشنا شوند. این موزه یکی از مهم‌ترین مراکز فرهنگی مشهد و ایران محسوب می‌شود.",
          descriptionImages: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mehrab%2C_Collections_of_Astan_Quds_Razavi_Museum_%282%29.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Astan_Quds_museum_carpets.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Astan_Quds_museum_qurans.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Astan_Quds_museum_coins.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Astan_Quds_museum_interior.jpg",
          ],
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
          description:
            "بازار سنتی و پرجنب‌وجوش با طیف وسیعی از سوغات، زعفران، و صنایع دستی که یکی از بهترین مکان‌ها برای خرید در مشهد است. این بازار با معماری سنتی ایرانی و بیش از ۲۰۰۰ مغازه، شامل فروشگاه‌های زعفران، خشکبار، ادویه‌جات، لباس‌های سنتی، و صنایع دستی است. عطر زعفران و هل در فضای بازار پیچیده و فروشندگان محلی با مهمان‌نوازی ایرانی از بازدیدکنندگان استقبال می‌کنند. بازار رضا همچنین دارای رستوران‌های سنتی، چایخانه‌ها، و مراکز تفریحی است که تجربه‌ای کامل از فرهنگ ایرانی را ارائه می‌دهد.",
          descriptionImages: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Bazaar_reza_mashhad.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Bazaar_reza_entrance.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Bazaar_reza_interior.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Bazaar_reza_saffron.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Bazaar_reza_crafts.jpg",
          ],
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
          description:
            "مقبره حکیم ابوالقاسم فردوسی، شاعر بزرگ ایران و سراینده شاهنامه که در شهر توس واقع شده است. این آرامگاه با معماری باشکوه و الهام‌گرفته از معماری هخامنشی، شامل بنای اصلی، موزه شاهنامه، و باغ‌های زیبا است. فردوسی با خلق شاهنامه، حماسه ملی ایران، نقش مهمی در حفظ زبان و فرهنگ فارسی داشته است. بازدیدکنندگان می‌توانند از موزه آثار فردوسی، تندیس‌های شخصیت‌های شاهنامه، و فضای آرام و فرهنگی این مجموعه دیدن کنند. این مکان یکی از مهم‌ترین جاذبه‌های فرهنگی خراسان و ایران محسوب می‌شود.",
          descriptionImages: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Tomb_of_Ferdowsi_%283%29.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Ferdowsi_statue.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Ferdowsi_museum.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Ferdowsi_garden.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Ferdowsi_tomb_interior.jpg",
          ],
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
          description:
            "آرامگاه نادرشاه، یکی از مشهورترین پادشاهان ایران با معماری منحصر به فرد که در میدان شیر مشهد واقع شده است. نادرشاه افشار، بنیانگذار سلسله افشاریه، یکی از بزرگترین فاتحان تاریخ ایران است که هندوستان را فتح کرد و توپ‌های مشهور خود را از دهلی به ایران آورد. این آرامگاه با معماری سنگی و الهام‌گرفته از آرامگاه کوروش، شامل موزه‌ای از سلاح‌های نادرشاه، تندیس‌های برنزی، و توپ‌های جنگی است. فضای باز میدان و معماری باشکوه آرامگاه، یادآور قدرت و شکوه دوران افشاریه است.",
          descriptionImages: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Tomb_of_Nader_Shah.JPG",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Nader_Shah_statue.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Nader_Shah_museum.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Nader_Shah_cannons.jpg",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Nader_Shah_field.jpg",
          ],
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
