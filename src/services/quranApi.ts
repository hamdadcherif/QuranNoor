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

//One ayah 
export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
}

//A complete surah with ayah
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
}

//Bring a list of all 114 surah
export const getAllSurahs = async (): Promise<SurahInfo[]> => {
  const response = await fetch(`${BASE_URL}/surah`);
  if (!response.ok) throw new Error('Unable to fetch list of surah');
  const data = await response.json();
  return data.data;
};

// The reciter used for per-ayah audio (Mishary Alafasy)
const AUDIO_EDITION = 'ar.alafasy';

//Bring the complete Surah with its number (1 to 114), including per-ayah audio
export const getSurah = async (surahNumber: number): Promise<Surah> => {
  const response = await fetch(
    `${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,${AUDIO_EDITION}`
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

// Full-surah audio (single continuous recitation file) for the same reciter
export const getSurahAudioUrl = (surahNumber: number): string =>
  `https://cdn.islamic.network/quran/audio-surah/128/${AUDIO_EDITION}/${surahNumber}.mp3`;