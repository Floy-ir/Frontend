import Image from "next/image"
export default function Companies() {
  return (
    <div className="my-6 w-full overflow-x-auto lg:flex lg:items-center lg:justify-center">
      <div className="flex w-full min-w-max shrink-0 snap-x snap-mandatory flex-col items-center justify-center gap-2 px-2 py-6">
        <div className="flex items-center justify-start gap-6 lg:justify-center">
        <div className="mx-5 flex flex-row items-center justify-center gap-10 md:mx-0 md:gap-20 lg:gap-33">
            <Image className="" src="/images/alibaba.png" alt="Alibaba" width={100} height={10} />
            {/* </div> */}

            <Image className="" src="/images/safarmarket.png" alt="safarmarket" width={100} height={10} />

            {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image className="" src="/images/flightio.png" alt="Flightio" width={100} height={100} />
            {/* </div> */}

            {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image className="" src="/images/flytoday.png" alt="Felanito" width={100} height={33} />
            {/* </div> */}

            {/* <div className="flex flex-1 flex-col items-start justify-start gap-2 h-4"> */}
            <Image className="" src="/images/dudee.png" alt="SnappTrip" width={60} height={10} />
          </div>
        </div>
      </div>
    </div>
  )
}
