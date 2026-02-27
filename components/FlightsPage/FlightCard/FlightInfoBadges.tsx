import { cva } from "class-variance-authority"
import { FlightCardProps } from "./flight-card"

// Badge styles
const badgeStyles = cva(
  "px-1.5 py-1 bg-Gray-N50 rounded-sm outline-[1.18px] outline-offset-[-1.18px] outline-Gray-N100 flex justify-center items-center gap-1.5 overflow-hidden",
  {
    variants: {
      intent: {
        default: "",
        highlighted: "bg-Primary-P50 outline-Primary-P100",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
)

// Badge component for flight info items
const InfoBadge = ({ text }: { text: string }) => (
  <div className={badgeStyles()}>
    <div className="text-Gray-N600 justify-center text-right text-[10px] font-normal leading-3">{text}</div>
  </div>
)

// Badge with icon for baggage
const BaggageBadge = ({ text }: { text: string }) => (
  <div className={badgeStyles()}>
    <div className="text-Gray-N600 justify-center text-right text-[10px] font-normal leading-3">{text}</div>
    <div className="relative size-3 overflow-hidden">
      <div className="bg-Gray-N700 absolute left-[2.67px] top-[1px] h-[9.89px] w-[6.45px]" />
      <div className="bg-Gray-N700 absolute left-[4.14px] top-[3.63px] h-[5.25px] w-[3.52px]" />
    </div>
  </div>
)

export const FlightInfoBadges = ({ flightInfo }: { flightInfo: FlightCardProps["flightInfo"] }) => (
  <div className="inline-flex flex-wrap content-start items-start justify-start gap-1 self-stretch">
    {flightInfo.cabinClass && <InfoBadge text={flightInfo.cabinClass} />}
    {flightInfo.baggage && <BaggageBadge text={flightInfo.baggage} />}
  </div>
)

export { badgeStyles }
