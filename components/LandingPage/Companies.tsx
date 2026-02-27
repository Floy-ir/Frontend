import Image from "next/image"
export default function Companies() {
  return (
    <div className="my-4 w-full overflow-x-auto md:my-6 lg:flex lg:items-center lg:justify-center">
      <div className="flex w-full min-w-max shrink-0 snap-x snap-mandatory flex-col items-center justify-center gap-2 px-2 py-6">
        <div className="flex items-center justify-start gap-6 lg:justify-center">
          <div className="mx-5 flex flex-row items-center justify-center gap-8 sm:gap-10 md:mx-0 md:gap-14 lg:gap-26 xl:gap-33">
            {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image
              className="h-7 object-contain sm:h-9"
              src="/images/alibaba.png"
              alt="Alibaba"
              width={100}
              height={36}
            />
            {/* </div> */}

            {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image
              className="h-7 object-contain sm:h-9"
              src="/images/MrBilit.png"
              alt="safarmarket"
              width={100}
              height={36}
            />
            {/* </div> */}

            {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image
              className="h-7 object-contain sm:h-9"
              src="/images/flightio.png"
              alt="Flightio"
              width={100}
              height={36}
            />
            {/* </div> */}

            {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image
              className="h-7 object-contain sm:h-9"
              src="/images/flytoday.png"
              alt="Felanito"
              width={100}
              height={36}
            />
            {/* </div> */}

            {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image
              className="h-7 object-contain sm:h-9"
              src="/images/snapptrip.png"
              alt="SnappTrip"
              width={100}
              height={36}
            />
            {/* </div> */}
          </div>
          {/*  todo : add other websites */}
        </div>
      </div>
    </div>
  )
}
