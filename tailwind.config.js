/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ألوان مستوحاة من صفحات المصحف: ورق كريمي، أخضر عميق، وتذهيب
        paper: {
          DEFAULT: '#F8F3E7',
          deep: '#F1E9D8',
        },
        ink: {
          DEFAULT: '#2B2620',
          soft: '#6B6152',
        },
        mosque: {
          DEFAULT: '#0E4B3D',
          soft: '#16624F',
          deep: '#0A362B',
        },
        gilt: {
          DEFAULT: '#AD8A4E',
          soft: '#D9C79A',
          deep: '#8A6B37',
        },
        line: '#E3D8BE',
      },
      fontFamily: {
        kufi: ['"Reem Kufi"', 'sans-serif'],   // للعناوين الكبيرة
        ui: ['Tajawal', 'sans-serif'],           // لواجهة الاستخدام
        quran: ['Amiri', 'serif'],               // لنص الآيات
      },
    },
  },
  plugins: [],
};
