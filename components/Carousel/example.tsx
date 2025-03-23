"use client"

export default function Example() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-800">
      <div className="relative flex h-full snap-x snap-mandatory gap-6 overflow-x-auto pb-14">
        <div className="w-40 shrink-0 snap-center">
          <div className="w-48 shrink-0"></div>
        </div>
        <div className="w-40 shrink-0 snap-center">
          <div className="w-48 shrink-0"></div>
        </div>
        <div className="w-40 shrink-0 snap-center">
          <div className="w-48 shrink-0"></div>
        </div>

        <figure className="w-96 shrink-0 snap-center">
          <img className="h-full w-full rounded-md object-cover" src="../../public/image1.png" alt="" />
        </figure>

        <figure className="w-96 shrink-0 snap-center">
          <img className="h-full w-full rounded-md object-cover" src="vegetables.jpg" alt="" />
        </figure>

        <figure className="w-96 shrink-0 snap-center">
          <img className="h-full w-full rounded-md object-cover" src="steak.jpg" alt="" />
        </figure>

        <figure className="w-96 shrink-0 snap-center">
          <img className="h-full w-full rounded-md object-cover" src="healthy-food.jpg" alt="" />
        </figure>

        <figure className="w-96 shrink-0 snap-center">
          <img className="h-full w-full rounded-md object-cover" src="exotic-fruits.jpg" alt="" />
        </figure>

        <figure className="w-96 shrink-0 snap-center">
          <img className="h-full w-full rounded-md object-cover" src="brain-food.jpg" alt="" />
        </figure>

        <div className="w-40 shrink-0 snap-center">
          <div className="w-48 shrink-0"></div>
        </div>
        <div className="w-40 shrink-0 snap-center">
          <div className="w-48 shrink-0"></div>
        </div>
        <div className="w-40 shrink-0 snap-center">
          <div className="w-48 shrink-0"></div>
        </div>
      </div>
    </div>
  )
}
