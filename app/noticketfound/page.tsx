"use client";

export default function NoTicketFound() {
  return (
    <div className="max-w-[432px] p-4 rounded-2xl inline-flex flex-col justify-center items-center gap-4">
      <div className="self-stretch text-center justify-center text-Primary-P500main text-base font-bold leading-7">
        پروازی یافت نشد
      </div>
      <div className="self-stretch h-px relative bg-Gray-N200" />
      <div className="self-stretch text-right justify-center text-Gray-N600 text-base font-normal leading-7">
        در صورتی که میخواهید از موجودی پرواز در این روز مطلع شوید شماره موبایل خود را وارد کنید
      </div>
      <div className="self-stretch flex flex-col justify-center items-end gap-2">
        <div className="self-stretch text-right justify-center text-Gray-N600 text-sm font-medium leading-normal">
          شماره موبایل
        </div>
        <div className="self-stretch h-14 px-4 rounded-xl outline-1 outline-offset-[-1px] outline-Gray-N300 flex flex-col justify-center items-end overflow-hidden">
          <div className="self-stretch flex-1 py-3 rounded-lg inline-flex justify-end items-center gap-3">
            <div className="flex-1 h-6 flex justify-end items-center gap-px overflow-hidden">
              <input
                type="text"
                placeholder="شماره موبایل"
                className="w-full text-right text-Gray-N400 text-base font-medium leading-7 placeholder:text-Gray-N400 bg-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <button className="self-stretch px-5 py-3.5 bg-Primary-P500main rounded-xl inline-flex justify-center items-center gap-1">
        <span className="text-right justify-center text-Shade-White text-[13px] font-semibold leading-none">
          ثبت‌
        </span>
      </button>
    </div> 
  );
}
