const BASE_URL = 'https://api.alquran.cloud/v1';
const CDN_SURAH_AUDIO = 'https://cdn.islamic.network/quran/audio-surah/128';

export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
}

export interface Reciter {
  key: string;         // Internal key used in the list and storage
  name: string;        // Name in Arabic
  ayahEdition: string;  // Edition used to play an individual ayah
  surahEdition: string; // Edition for the complete surah audio file
}

// Reciters verified to have one complete audio file for each surah
export const RECITERS: Reciter[] = [
  { key: 'alafasy', name: 'مشاري راشد العفاسي', ayahEdition: 'ar.alafasy', surahEdition: 'ar.alafasy-surah' },
  { key: 'abdulbasitmurattal', name: 'عبد الباسط عبد الصمد (مرتل)', ayahEdition: 'ar.abdulbasitmurattal', surahEdition: 'ar.abdulbasitmurattal-surah' },
  { key: 'abdulbasitmujawwad', name: 'عبد الباسط عبد الصمد (مجود)', ayahEdition: 'ar.abdulbasitmurattal', surahEdition: 'ar.abdulbasitmujawwad' },
  { key: 'saoodshuraym', name: 'سعود الشريم', ayahEdition: 'ar.saoodshuraym', surahEdition: 'ar.saudalshuraim' },
  { key: 'muhammadayyoub', name: 'محمد أيوب', ayahEdition: 'ar.muhammadayyoub', surahEdition: 'ar.muhammadayyub' },
  { key: 'hanirifai', name: 'هاني الرفاعي', ayahEdition: 'ar.hanirifai', surahEdition: 'ar.haniarrifai' },
  { key: 'minshawimujawwad', name: 'محمد صديق المنشاوي (مجود)', ayahEdition: 'ar.minshawimujawwad', surahEdition: 'ar.muhammadsiddiqalminshawimujawwad' },
  { key: 'hudhaify', name: 'علي الحذيفي', ayahEdition: 'ar.hudhaify', surahEdition: 'ar.aliabdurrahmanalhuthaify' },
  { key: 'abdullahbasfar', name: 'عبد الله بصفر', ayahEdition: 'ar.abdullahbasfar', surahEdition: 'ar.abdullahbasfar-surah' },
  { key: 'ahmedajamy', name: 'أحمد بن علي العجمي', ayahEdition: 'ar.ahmedajamy', surahEdition: 'ar.ahmedalajmi' },
  { key: 'ibrahimakhbar', name: 'إبراهيم الأخضر', ayahEdition: 'ar.ibrahimakhbar', surahEdition: 'ar.ibrahimalakhdar' },
  { key: 'aymanswoaid', name: 'أيمن سويد', ayahEdition: 'ar.aymanswoaid', surahEdition: 'ar.aymanswed' },
  { key: 'nasseralqatami', name: 'ناصر القطامي', ayahEdition: 'ar.alafasy', surahEdition: 'ar.nasseralqatami' },
  { key: 'yasseraldossari', name: 'ياسر الدوسري', ayahEdition: 'ar.alafasy', surahEdition: 'ar.yasseraldossari' },
  { key: 'mustafaismail', name: 'مصطفى إسماعيل', ayahEdition: 'ar.alafasy', surahEdition: 'ar.mustafaismail' },
];

export const DEFAULT_RECITER = RECITERS[0].key;

const RECITER_STORAGE_KEY = 'selectedReciter';

export const getSavedReciter = (): string => {
  try {
    return localStorage.getItem(RECITER_STORAGE_KEY) || DEFAULT_RECITER;
  } catch {
    return DEFAULT_RECITER;
  }
};

export const saveReciter = (key: string): void => {
  try {
    localStorage.setItem(RECITER_STORAGE_KEY, key);
  } catch {
    // Ignore errors (for example, private browsing mode)
  }
};

export const getReciter = (key: string): Reciter =>
  RECITERS.find((r) => r.key === key) ?? RECITERS[0];

export const getAllSurahs = async (): Promise<SurahInfo[]> => {
  const response = await fetch(`${BASE_URL}/surah`);
  if (!response.ok) throw new Error('Unable to fetch list of surahs');
  const data = await response.json();
  return data.data;
};

// Surah text + individual ayah audio (used only when clicking a single ayah number)
export const getSurah = async (
  surahNumber: number,
  ayahEdition: string
): Promise<Surah> => {
  const response = await fetch(
    `${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,${ayahEdition}`
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

// URL of the complete surah audio file (single file, without concatenating ayahs)
export const getSurahAudioUrl = (
  surahNumber: number,
  surahEdition: string
): string =>
  `${CDN_SURAH_AUDIO}/${surahEdition}/${surahNumber}.mp3`;