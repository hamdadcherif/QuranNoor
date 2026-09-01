const BASE_URL = 'https://api.alquran.cloud/v1';

// Surah information (used on the homepage)
export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// One ayah 
export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
}

// A complete surah with ayahs
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
}

// معلومات القارئ
export interface Reciter {
  identifier: string; // معرف edition عند alquran.cloud
  name: string;        // الاسم بالعربية للعرض في الواجهة
}

// List of available readers
export const RECITERS: Reciter[] = [
  { identifier: 'ar.alafasy', name: 'مشاري راشد العفاسي' },
  { identifier: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد (مرتل)' },
  { identifier: 'ar.abdurrahmaansudais', name: 'عبد الرحمن السديس' },
  { identifier: 'ar.saoodshuraym', name: 'سعود الشريم' },
  { identifier: 'ar.husary', name: 'محمود خليل الحصري' },
  { identifier: 'ar.minshawi', name: 'محمد صديق المنشاوي' },
  { identifier: 'ar.muhammadayyoub', name: 'محمد أيوب' },
  { identifier: 'ar.hanirifai', name: 'هاني الرفاعي' },
  { identifier: 'ar.abdulsamad', name: 'عبد الباسط عبد الصمد' },
  { identifier: 'ar.husarymujawwad', name: 'محمود خليل الحصري (مجود)' },
  { identifier: 'ar.minshawimujawwad', name: 'محمد صديق المنشاوي (مجود)' },
  { identifier: 'ar.muhammadjibreel', name: 'محمد جبريل' },
  { identifier: 'ar.hudhaify', name: 'علي بن عبدالرحمن الحذيفي' },
  { identifier: 'ar.mahermuaiqly', name: 'ماهر المعيقلي' },
  { identifier: 'ar.abdullahbasfar', name: 'عبد الله بصفر' },
  { identifier: 'ar.shaatree', name: 'أبو بكر الشاطري' },
  { identifier: 'ar.ahmedajamy', name: 'أحمد بن علي العجمي' },
  { identifier: 'ar.ibrahimakhbar', name: 'إبراهيم الأخضر' },
  { identifier: 'ar.aymanswoaid', name: 'أيمن سويد' },
];

export const DEFAULT_RECITER = RECITERS[0].identifier;

// Local storage key to save user selection
const RECITER_STORAGE_KEY = 'selectedReciter';

export const getSavedReciter = (): string => {
  try {
    return localStorage.getItem(RECITER_STORAGE_KEY) || DEFAULT_RECITER;
  } catch {
    return DEFAULT_RECITER;
  }
};

export const saveReciter = (identifier: string): void => {
  try {
    localStorage.setItem(RECITER_STORAGE_KEY, identifier);
  } catch {
    // تجاهل أي خطأ في التخزين (مثلاً وضع التصفح الخاص)
  }
};

// Bring a list of all 114 surahs
export const getAllSurahs = async (): Promise<SurahInfo[]> => {
  const response = await fetch(`${BASE_URL}/surah`);
  if (!response.ok) throw new Error('Unable to fetch list of surahs');
  const data = await response.json();
  return data.data;
};

// Bring the complete Surah with its number (1 to 114), including per-ayah audio
export const getSurah = async (
  surahNumber: number,
  reciterIdentifier: string = DEFAULT_RECITER
): Promise<Surah> => {
  const response = await fetch(
    `${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,${reciterIdentifier}`
  );
  if (!response.ok) throw new Error('The surah could not be retrieved');
  const data = await response.json();

  const [textEdition, audioEdition] = data.data;

  const ayahs: Ayah[] = textEdition.ayahs.map((ayah: Ayah, index: number) => ({
    number: ayah.number,
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
    audio: audioEdition.ayahs[index]?.audio,
  }));

  return {
    number: textEdition.number,
    name: textEdition.name,
    englishName: textEdition.englishName,
    ayahs,
  };
};