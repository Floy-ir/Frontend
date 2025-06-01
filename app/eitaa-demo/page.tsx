'use client';

import EitaaLink from '@/components/EitaaLink/EitaaLink';
import EitaaWrapper from '@/components/EitaaWrapper/EitaaWrapper';

export default function EitaaDemoPage() {
  return (
    <EitaaWrapper autoReady={true} autoExpand={true}>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">فلوی - برنامک ایتا</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">پیشنهادات ویژه</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">پرواز تهران به مشهد</h3>
              <p className="text-gray-600 mb-3">قیمت از ۲،۵۰۰،۰۰۰ تومان</p>
              <EitaaLink 
                href="https://www.alibaba.ir/" 
                className="text-blue-600 hover:underline"
              >
                مشاهده جزئیات
              </EitaaLink>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">پرواز تهران به کیش</h3>
              <p className="text-gray-600 mb-3">قیمت از ۳،۸۰۰،۰۰۰ تومان</p>
              <EitaaLink 
                href="https://www.alibaba.ir/" 
                className="text-blue-600 hover:underline"
              >
                مشاهده جزئیات
              </EitaaLink>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">لینک‌های مفید</h2>
          <ul className="space-y-2">
            <li>
              <EitaaLink 
                href="https://www.alibaba.ir/" 
                className="text-blue-600 hover:underline"
              >
                درباره فلوی
              </EitaaLink>
            </li>
            <li>
              <EitaaLink 
                href="https://www.alibaba.ir/" 
                className="text-blue-600 hover:underline"
              >
                تماس با ما
              </EitaaLink>
            </li>
            <li>
              <EitaaLink 
                href="https://www.alibaba.ir/" 
                className="text-blue-600 hover:underline"
              >
                سوالات متداول
              </EitaaLink>
            </li>
          </ul>
        </div>
      </div>
    </EitaaWrapper>
  );
} 