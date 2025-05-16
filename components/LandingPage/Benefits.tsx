import Image from "next/image"
import crownBg from "../../public/images/crown-bg.svg"
import crownOutline from "../../public/images/crown-outline.svg"
import flashBg from "../../public/images/flash-circle-bg.png"
import flashOutline from "../../public/images/flash-circle-outline.svg"
import lampBg from "../../public/images/lamp-bg.svg"
import lampOutline from "../../public/images/lamp-outline.svg"
import line from "../../public/images/Underline_06_small.svg"

export default function Benefits() {
  return (
    <div className="w-full justify-start overflow-x-auto md:flex md:items-center md:justify-center">
      <div className="mt-17 mb-16 inline-flex h-[54px] min-w-max shrink-0 snap-x snap-mandatory items-center justify-center gap-18">
        {/*Title */}
        <div className="hidden flex-col items-end justify-end gap-1 md:inline-flex">
          <div className="text-Gray-N700 w-full text-end text-[25px] leading-10 font-bold lg:mr-0">فلوی</div>
          <Image src={line} width={100} height={100} alt="underline" className="h-[9.19px] w-[49px] text-start" />
        </div>

        {/* Benefits */}
        <div className="mx-5 flex items-center justify-start gap-8 md:mx-0">
          {/* Benefit 1 */}
          <div className="flex items-center justify-end gap-4">
            <div className="relative size-[39.02px]">
              <Image src={flashBg} alt="flash-bg" width={39} height={39} className="absolute top-0 left-0" />
              <Image
                src={flashOutline}
                alt="flash-outline"
                width={35}
                height={35}
                className="absolute top-[-1.5px] left-[1px]"
              />
            </div>
            <span className="text-Gray-N700 text-right text-base leading-7 font-medium">سریع‌ترین روش خرید</span>
          </div>

          {/* Divider */}
          <div className="mx-4 h-12 w-px bg-slate-200" />

          {/* Benefit 2 */}
          <div className="flex items-center justify-end gap-4">
            <div className="relative size-[39.02px]">
              <Image src={lampBg} alt="lamp-bg" width={39} height={39} className="absolute top-0 left-0" />
              <Image
                src={lampOutline}
                alt="lamp-outline"
                width={34.96}
                height={34.96}
                className="absolute top-[1.5px] left-[-1px]"
              />
            </div>
            <span className="text-Gray-N700 text-right text-base leading-7 font-medium">ارزان‌ترین قیمت</span>
          </div>

          {/* Divider */}
          <div className="mx-4 h-12 w-px bg-slate-200" />

          {/* Benefit 3 */}
          <div className="flex items-center justify-end gap-4">
            <div className="relative size-[39.02px]">
              <Image src={crownBg} alt="crown-bg" width={39} height={39} className="absolute top-0 left-0" />
              <Image
                src={crownOutline}
                alt="crown-outline"
                width={34.96}
                height={34.96}
                className="absolute top-[2.5px] left-[-1px]"
              />
            </div>
            <span className="text-Gray-N700 text-right text-base leading-7 font-medium">بهترین برای مقایسه</span>
          </div>
        </div>
      </div>
    </div>
  )
}
