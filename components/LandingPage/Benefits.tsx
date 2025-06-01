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
    <div className="w-full overflow-x-auto pb-2 md:flex md:items-center md:justify-center md:pb-0">
      <div className="mt-8 mb-4 inline-flex h-[54px] min-w-max shrink-0 snap-x snap-mandatory items-center justify-center gap-18 px-4 md:px-0">
        {/*Title */}
        <div className="hidden flex-col items-end justify-end gap-1 md:inline-flex">
          <div className="text-Gray-N700 w-full text-end text-[25px] leading-10 font-bold lg:mr-0">فلوی</div>
          <Image src={line} width={100} height={100} alt="underline" className="h-[9.19px] w-[49px] text-start" />
        </div>

        {/* Benefits */}
        <div className="flex items-center justify-start gap-3 sm:gap-5 md:mx-5 md:gap-8">
          {/* Benefit 1 */}
          <div className="flex items-center justify-end gap-3 sm:gap-3.5 md:gap-4">
            <div className="relative size-7 sm:size-9 md:size-[39.02px]">
              <div className="bg-Primary-P100 absolute top-[4.78px] left-[4.78px] size-[21.85px] rounded-[20.07px] sm:top-[6px] sm:left-[6px] sm:size-[26px] md:hidden"></div>
              <Image
                src={flashBg}
                alt="flash-bg"
                width={39}
                height={39}
                className="absolute top-0 left-0 hidden md:block"
              />
              <Image
                src={flashOutline}
                alt="flash-outline"
                width={27}
                height={27}
                className="absolute top-0 left-0 size-[27.32px] sm:size-9 md:hidden"
              />
              <Image
                src={flashOutline}
                alt="flash-outline"
                width={35}
                height={35}
                className="absolute top-[-1.5px] left-[1px] hidden md:block"
              />
            </div>
            <span className="text-Gray-N700 text-right text-[13px] leading-normal font-medium sm:text-[15px] md:text-base md:leading-7">
              <span className="md:hidden">سریع‌ترین روش خرید!</span>
              <span className="hidden md:inline">سریع‌ترین روش خرید</span>
            </span>
          </div>

          {/* Divider */}
          <div className="bg-Gray-N200 w-px self-stretch sm:mx-2 md:mx-4 md:h-12 md:self-auto md:bg-slate-200" />

          {/* Benefit 2 */}
          <div className="flex items-center justify-end gap-3 sm:gap-3.5 md:gap-4">
            <div className="relative size-7 sm:size-9 md:size-[39.02px]">
              <Image
                src={lampBg}
                alt="lamp-bg"
                width={27}
                height={27}
                className="absolute top-[1.37px] left-[2.73px] sm:top-[2px] sm:left-[3px] sm:size-9 md:hidden"
              />
              <Image
                src={lampBg}
                alt="lamp-bg"
                width={39}
                height={39}
                className="absolute top-0 left-0 hidden md:block"
              />
              <Image
                src={lampOutline}
                alt="lamp-outline"
                width={27}
                height={27}
                className="absolute top-0 left-0 sm:size-9 md:hidden"
              />
              <Image
                src={lampOutline}
                alt="lamp-outline"
                width={34.96}
                height={34.96}
                className="absolute top-[1.5px] left-[-1px] hidden md:block"
              />
            </div>
            <span className="text-Gray-N700 text-right text-[13px] leading-normal font-medium sm:text-[15px] md:text-base md:leading-7">
              ارزان‌ترین قیمت
            </span>
          </div>

          {/* Divider */}
          <div className="bg-Gray-N200 w-px self-stretch sm:mx-2 md:mx-4 md:h-12 md:self-auto md:bg-slate-200" />

          {/* Benefit 3 */}
          <div className="flex items-center justify-end gap-3 sm:gap-3.5 md:gap-4">
            <div className="relative size-7 sm:size-9 md:size-[39.02px]">
              <Image
                src={crownBg}
                alt="crown-bg"
                width={27}
                height={27}
                className="absolute top-[1.37px] left-[2.73px] sm:top-[2px] sm:left-[3px] sm:size-9 md:hidden"
              />
              <Image
                src={crownBg}
                alt="crown-bg"
                width={39}
                height={39}
                className="absolute top-0 left-0 hidden md:block"
              />
              <Image
                src={crownOutline}
                alt="crown-outline"
                width={27}
                height={27}
                className="absolute top-0 left-0 sm:size-9 md:hidden"
              />
              <Image
                src={crownOutline}
                alt="crown-outline"
                width={34.96}
                height={34.96}
                className="absolute top-[2.5px] left-[-1px] hidden md:block"
              />
            </div>
            <span className="text-Gray-N700 text-right text-[13px] leading-normal font-medium sm:text-[15px] md:text-base md:leading-7">
              بهترین برای مقایسه
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
