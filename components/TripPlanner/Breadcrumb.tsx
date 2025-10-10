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
                className="font-anjoman-max text-sm text-Primary-P500main hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-Primary-P500main focus:ring-offset-2 rounded transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="font-anjoman-max text-sm text-Gray-N600">
                {item.label}
              </span>
            )}
            
            {index < items.length - 1 && (
              <ChevronLeft 
                className="h-4 w-4 text-Gray-N400 rotate-180" 
                aria-hidden="true" 
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

