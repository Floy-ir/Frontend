/**
 * Converts English/Western numerals to Persian/Farsi numerals
 */
export function englishToFarsiNumber(n: number | string | undefined): string {
  if (n === undefined) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  return n
    .toString()
    .replace(/\d/g, x => farsiDigits[parseInt(x)]!);
} 