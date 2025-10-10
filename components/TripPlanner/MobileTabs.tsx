"use client"

import { MessageCircle, MapIcon } from "lucide-react"
import { useState } from "react"

type MobileTabsProps = {
  chatContent: React.ReactNode
  tripContent: React.ReactNode
}

export function MobileTabs({ chatContent, tripContent }: MobileTabsProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "trip">("chat")

  return (
    <div className="flex h-screen flex-col">
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" ? chatContent : tripContent}
      </div>

      {/* Bottom Tab Bar */}
      <div className="flex border-t border-gray-200 bg-white" dir="rtl">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
            activeTab === "chat"
              ? "text-Primary-P500main"
              : "text-Gray-N600 hover:bg-gray-50"
          }`}
          aria-label="چت"
          aria-current={activeTab === "chat" ? "page" : undefined}
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="font-anjoman-max text-xs font-medium">چت</span>
        </button>

        <button
          onClick={() => setActiveTab("trip")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
            activeTab === "trip"
              ? "text-Primary-P500main"
              : "text-Gray-N600 hover:bg-gray-50"
          }`}
          aria-label="برنامه سفر"
          aria-current={activeTab === "trip" ? "page" : undefined}
        >
          <MapIcon className="h-5 w-5" aria-hidden="true" />
          <span className="font-anjoman-max text-xs font-medium">برنامه سفر</span>
        </button>
      </div>
    </div>
  )
}

