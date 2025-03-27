import Image from "next/image";
import frame from "../../public/images/Frame 4402.svg"
import instagram from "../../public/images/instagram.svg"
import linkdin from "../../public/images/linkedin-svgrepo-com 1.svg"
import send from "../../public/images/send-2.svg"
import youtube from "../../public/images/youtube.svg"


const Footer: React.FC = () => {
  return (
    <footer className="w-full text-gray-600 flex flex-col items-center justify-center">
      {/* Main footer container */}
      <div className="bg-white container flex flex-col justify-between w-full px-28">
        
        <div className="flex flex-row justify-between w-full mb-9 mt-10">
        
        {/* First Grid */}
        <div className="grid grid-cols-3 my-2 text-right gap-10">
          <div className="flex flex-col gap-6">
            <h3 className="text-gray-600 text-lg font-medium"> فلوی </h3>
            <div className="flex flex-col gap-4 text-gray-500 text-sm">
              <span>تماس با ما</span>
              <span>درباره ما</span>
              <span>قوانین و مقررات</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-gray-600 text-lg font-medium"> خدمات </h3>
            <div className="flex flex-col gap-4 text-gray-500 text-sm">
              <span>بلیط پرواز</span>
              <span>هتل</span>
              <span>اقامتگاه</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-gray-600 text-lg font-medium"> خدمات مشتریان</h3>
            <div className="flex flex-col gap-4 text-gray-500 text-sm">
              <span>راهنما</span>
              <span>سوالات متداول</span>
              <span>وبلاگ</span>
              <span>پشتیبانی</span>
            </div>
          </div>
        </div>
        
        {/* Second Grid */}
        <div className="flex flex-col items-end justify-end gap-8.5">
          <h1 className="text-[#4641fb] text-5xl font-semibold leading-[87px] ">فلوی</h1>
          <h3 className="text-[#748297] text-sm">تلفن پشتیبانی: ۰۲۱۱۲۳۴۵۶۷۸</h3>
          <div className="flex gap-8">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center ">
              <Image src={instagram} alt="LinkedIn" width={24} height={24} />
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Image src={send} alt="YouTube" width={24} height={24} />
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Image src={youtube} alt="Send" width={24} height={24} />
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Image src={linkdin} alt="Instagram" width={24} height={24} />
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Image src={frame} alt="Instagram" width={24} height={24} />
            </div>
          </div>

          </div>
        </div>

        {/* divider */}
        <div className=" w-full h-0 outline-1 outline-offset-[-0.50px] outline-Gray-N200" />
        
        {/* Third Grid */}
        <div className="flex flex-col my-6">
          <div className="text-right justify-center text-Gray-N600 text-lg font-medium leading-loose mb-1"> فلوی </div>
          <p className="text-right justify-start text-Gray-N500 text-[13px] leading-normal">
  فلوی یک پلتفرم جستجوی بلیط است که امکان مقایسه و رزرو آسان بلیط پرواز، هتل، قطار و دیگر خدمات سفر را از میان صدها منبع معتبر فراهم می‌کند.  
  ما با ارائه داده‌های به‌روز و قیمت‌های رقابتی، به کاربران کمک می‌کنیم تا بهترین انتخاب را برای سفرهای خود داشته باشند.  
  هدف ما ساده‌سازی فرآیند جستجو و رزرو، صرفه‌جویی در زمان و هزینه، و ایجاد تجربه‌ای لذت‌بخش برای مسافران است.
</p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full">
        <p className="text-center text-gray-500 text-[11px] py-3 font-normal ">
          کلیه حقوق این سرویس (وب‌سایت و اپلیکیشن‌های موبایل) محفوظ و متعلق به شرکت فلوی می‌باشد.
        </p>
      </div>
    </footer>
  );
};

export default Footer;