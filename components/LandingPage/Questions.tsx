import * as React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqData = [
  {
    question: "فلوی چیست؟",
    answer:
      "فلوی یک پلتفرم آنلاین برای جستجو و مقایسه قیمت‌های بلیط هواپیما، هتل و اقامتگاه است که به شما کمک می‌کند بهترین گزینه‌ها را پیدا کرده و به سایت‌های معتبر برای خرید هدایت شوید.",
  },
  {
    question: "موتور جستجوی فلوی چگونه کار می‌کند؟",
    answer:
      "موتور جستجوی فلوی با جمع‌آوری اطلاعات پروازها، هتل ها و اقامتگاه های مختلف از ارائه دهندگان معتبر  به شما این امکان را می‌دهد که بهترین گزینه‌ها را برای سفر خود انتخاب کنید.",
  },
  {
    question: "فرق فلوی با سایر وبسایت‌ها چیست؟",
    answer:
      "فلوی برخلاف سایر وبسایت‌ها که مستقیماً بلیط هواپیما را می‌فروشند، فقط داده‌ها را جمع‌آوری کرده، امکان مقایسه بین قیمت‌ها و خدمات را فراهم می‌کند و شما را به وبسایت‌های معتبر برای خرید هدایت می‌کند."
  },
  {
    question: "آیا در فلوی می‌توان بلیط هواپیما را رزرو کرد یا خرید؟",
    answer:
      "خیر، فلوی تنها داده‌ها را جمع‌آوری کرده و به شما کمک می‌کند تا بهترین قیمت‌ها و پروازها را بیابید و شما را به سایت‌های معتبر برای خرید یا رزرو هدایت می‌کند.",
  },
]

const Questions = () => {
  return (
    <div className="items-right flex w-full flex-col justify-center bg-white px-4 pb-8 lg:px-38">
      <h2 className="text-Gray-N600 my-8 text-xl leading-loose font-bold text-right">سوالات متداول</h2>
      <Accordion type="single" collapsible className="space-y-3">
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="outline-Gray-N200 data-[state=open]:outline-Primary-P500main data-[state=open]:outline-1 data-[state=open]:outline-offset-[-1px] flex flex-col items-stretch justify-center self-stretch rounded-xl outline-2 outline-offset-[-2px]"
          >
            <AccordionTrigger className="p-5 -mb-2 text-right text-base md:text-lg leading-7 font-medium data-[state=open]:text-Primary-P500main text-Gray-N600 flex items-center justify-between">
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
