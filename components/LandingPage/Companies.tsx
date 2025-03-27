import Image from "next/image"
export default function Companies() {
  return (
    <div className="w-full overflow-x-auto lg:flex lg:items-center lg:justify-center my-6">
      <div className="flex w-full min-w-max shrink-0 snap-x snap-mandatory flex-col items-center justify-center gap-2 px-2 py-6">
        <div className="flex  items-center justify-start lg:justify-center gap-6">
          <div className="flex flex-row items-center justify-center gap-20 lg:gap-33">
            <Image className="" src="/alibaba.png" alt="Alibaba" width={100} height={10} />
          {/* </div> */}

          {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image className="" src="/safarmarket.svg" alt="Safar Market" width={150} height={20} />
          {/* </div> */}

          {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image className="" src="/flightio.png" alt="Flightio" width={100} height={100} />
          {/* </div> */}

          {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image className="" src="/flytoday.png" alt="Felanito" width={100} height={33} />
          {/* </div> */}

          {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image className="" src="/dudee.png" alt="SnappTrip" width={60} height={10} />
          </div>
        </div>
      </div>
    </div>
  )
}
