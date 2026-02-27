"use client"

import { ChevronLeft } from "lucide-react"

type BreadcrumbItem = {
  label: string
  onClick?: () => void
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-2 ${className}`} dir="rtl" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-Primary-P500main focus:ring-Primary-P500main rounded font-anjoman-max text-sm transition-colors hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-Gray-N600 font-anjoman-max text-sm">{item.label}</span>
            )}

            {index < items.length - 1 && (
              <ChevronLeft className="text-Gray-N400 h-4 w-4 rotate-180" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
