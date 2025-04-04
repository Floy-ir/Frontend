'use client'

import React from 'react'

export default function FlightSearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">خطا در جستجوی پرواز</h2>
      <p className="text-gray-600 mb-6">
        متأسفانه در جستجوی پرواز مشکلی رخ داده است. لطفاً مجدداً تلاش کنید.
      </p>
      <p className="text-gray-500 text-sm mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition"
      >
        تلاش مجدد
      </button>
      <button
        onClick={() => window.history.back()}
        className="mr-4 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition"
      >
        بازگشت
      </button>
    </div>
  )
} 