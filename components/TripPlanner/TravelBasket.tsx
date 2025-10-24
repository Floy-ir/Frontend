"use client"

import { ShoppingCart } from "lucide-react"
import React from "react"

import type { BasketFlightItem } from "@/app/types/basket"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { englishToFarsiNumber } from "@/utils/numbers"

import { BasketFlightCard } from "./BasketFlightCard"

type TravelBasketProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  items: BasketFlightItem[]
  onRemoveItem: (id: string) => void
  onRedirect: (url: string) => void
}

const EmptyBasket = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12" dir="rtl">
    <div className="bg-Gray-N100 flex size-20 items-center justify-center rounded-full">
      <ShoppingCart className="text-Gray-N400 size-10" />
    </div>
    <div className="flex flex-col items-center gap-2">
      <p className="text-Gray-N700 font-anjoman-max text-lg font-semibold">سبد سفر شما خالی است</p>
      <p className="text-Gray-N500 font-anjoman-max text-sm">هنوز پروازی به سبد خود اضافه نکرده‌اید</p>
    </div>
  </div>
)

const BasketHeader = ({ itemCount }: { itemCount: number }) => (
  <div className="flex items-center justify-between" dir="rtl">
    <div className="flex items-center gap-2">
      <ShoppingCart className="text-Primary-P500main size-6" />
      <h2 className="text-Gray-N800 font-anjoman-max text-xl font-bold">سبد سفر</h2>
    </div>
    {itemCount > 0 && (
      <div className="bg-Primary-P100 text-Primary-P600 font-anjoman-max rounded-full px-3 py-1 text-sm font-semibold">
        {englishToFarsiNumber(itemCount)} مورد
      </div>
    )}
  </div>
)

const BasketList = ({
  items,
  onRemoveItem,
  onRedirect,
}: {
  items: BasketFlightItem[]
  onRemoveItem: (id: string) => void
  onRedirect: (url: string) => void
}) => (
  <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-4">
    {items.map((item) => (
      <BasketFlightCard key={item.id} item={item} onRemove={onRemoveItem} onRedirect={onRedirect} />
    ))}
  </div>
)

export function TravelBasket({ isOpen, onOpenChange, items, onRemoveItem, onRedirect }: TravelBasketProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const content = (
    <>
      {items.length === 0 ? (
        <EmptyBasket />
      ) : (
        <BasketList items={items} onRemoveItem={onRemoveItem} onRedirect={onRedirect} />
      )}
    </>
  )

  // Desktop: Use Sheet
  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>
              <BasketHeader itemCount={items.length} />
            </SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  // Mobile: Use Drawer
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col p-0">
        <div className="border-b border-gray-200 px-6 py-4">
          <DrawerTitle>
            <BasketHeader itemCount={items.length} />
          </DrawerTitle>
        </div>
        {content}
      </DrawerContent>
    </Drawer>
  )
}

