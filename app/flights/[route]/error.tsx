"use client"

import React from "react"

export default function FlightSearchError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="mb-4 text-2xl font-bold text-red-600">خطا در جستجوی پرواز</h2>
      <p className="mb-6 text-gray-600">متأسفانه در جستجوی پرواز مشکلی رخ داده است. لطفاً مجدداً تلاش کنید.</p>
      <p className="mb-6 text-sm text-gray-500">{error.message}</p>
      <button onClick={reset} className="bg-primary hover:bg-primary-dark rounded-md px-6 py-2 text-white transition">
        تلاش مجدد
      </button>
      <button
        onClick={() => window.history.back()}
        className="mr-4 rounded-md border border-gray-300 px-6 py-2 transition hover:bg-gray-50"
      >
        بازگشت
      </button>
    </div>
  )
}
