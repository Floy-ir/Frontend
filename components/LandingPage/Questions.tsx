import * as React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqData = [
  {
    question: "فرق بین رزرو و اجاره در فلوی در چیست؟",
    answer:
      "برخی مواقع به‌ویژه در ایام پرسفر بلیط‌های هواپیما به سرعت تکمیل ظرفیت می‌شوند که فرآیند رزرو بلیط را بسیار سخت می‌کند. در این مواقع قابلیت رزرو خودکار مستربلیط می‌تواند این مشکل را برایتان حل کند. امکانی که برای روزهایی که ظرفیت بلیط‌های هواپیما تکمیل می‌شوند، طراحی شده است تا در صورت موجود شدن به صورت اتوماتیک بلیط را خریداری کند.",
  },
  {
    question: "فرق بین رزرو و اجاره در فلوی در چیست؟",
    answer:
      "برخی مواقع به‌ویژه در ایام پرسفر بلیط‌های هواپیما به سرعت تکمیل ظرفیت می‌شوند که فرآیند رزرو بلیط را بسیار سخت می‌کند. در این مواقع قابلیت رزرو خودکار مستربلیط می‌تواند این مشکل را برایتان حل کند. امکانی که برای روزهایی که ظرفیت بلیط‌های هواپیما تکمیل می‌شوند، طراحی شده است تا در صورت موجود شدن به صورت اتوماتیک بلیط را خریداری کند.",
  },
  {
    question: "فرق بین رزرو و اجاره در فلوی در چیست؟",
    answer:
      "برخی مواقع به‌ویژه در ایام پرسفر بلیط‌های هواپیما به سرعت تکمیل ظرفیت می‌شوند که فرآیند رزرو بلیط را بسیار سخت می‌کند. در این مواقع قابلیت رزرو خودکار مستربلیط می‌تواند این مشکل را برایتان حل کند. امکانی که برای روزهایی که ظرفیت بلیط‌های هواپیما تکمیل می‌شوند، طراحی شده است تا در صورت موجود شدن به صورت اتوماتیک بلیط را خریداری کند.",
  },
  {
    question: "فرق بین رزرو و اجاره در فلوی در چیست؟",
    answer:
      "برخی مواقع به‌ویژه در ایام پرسفر بلیط‌های هواپیما به سرعت تکمیل ظرفیت می‌شوند که فرآیند رزرو بلیط را بسیار سخت می‌کند. در این مواقع قابلیت رزرو خودکار مستربلیط می‌تواند این مشکل را برایتان حل کند. امکانی که برای روزهایی که ظرفیت بلیط‌های هواپیما تکمیل می‌شوند، طراحی شده است تا در صورت موجود شدن به صورت اتوماتیک بلیط را خریداری کند.",
  },
]

const Questions = () => {
  return (
    <div className="items-right mx-1 flex w-full flex-col justify-center bg-white px-4 pb-8 lg:px-38">
      <h2 className="text-Gray-N600 my-8 text-xl leading-loose font-bold text-right">سوالات متداول</h2>
      <Accordion type="single" collapsible className="space-y-3">
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="outline-Gray-N200 data-[state=open]:outline-Primary-P500main data-[state=open]:outline-1 data-[state=open]:outline-offset-[-1px] flex flex-col items-stretch justify-center self-stretch rounded-xl outline-2 outline-offset-[-2px]"
          >
            <AccordionTrigger className="p-5 -mb-2 text-right text-lg leading-7 font-medium data-[state=open]:text-Primary-P500main text-Gray-N600 flex items-center justify-between">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-Gray-N600 text-right px-5 py-3 mb-1 text-base leading-7 font-normal">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default Questions
