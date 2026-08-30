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
}

//A complete surah with ayah
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
}

// Retrieve a list of all 114 surah
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

//Bring the complete Surah with its number (1 to 114)
export const getSurah = async (surahNumber: number): Promise<Surah> => {
  const response = await fetch(`${BASE_URL}/surah/${surahNumber}`);
  if (!response.ok) throw new Error('The surah could not be retrieved');
  const data = await response.json();
  return data.data;
};