import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSurahs } from '../services/quranApi';
import type { SurahInfo } from '../services/quranApi';

// Removing diacritics for search
function normalizeArabic(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[\u0622\u0623\u0625]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
    .replace(/\u0629/g, '\u0647')
    .toLowerCase()
    .trim();
}

export default function HomePage() {
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await getAllSurahs();
        setSurahs(data);
      } catch {
        setError('تعذّر تحميل السور، تحقّق من الاتصال بالإنترنت');
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter((surah) => {
    const normalizedSearch = normalizeArabic(search);
    return (
      normalizeArabic(surah.name).includes(normalizedSearch) ||
      surah.englishName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div dir="rtl" className="min-h-screen bg-paper font-ui text-ink">
      <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-5 h-px w-40 bg-gradient-to-r from-transparent via-gilt to-transparent" />
          <h1 className="font-kufi text-4xl tracking-wide text-mosque sm:text-5xl">
            القرآن الكريم
          </h1>
          <p className="mt-3 text-sm text-ink-soft">
            ١١٤ سورة — اقرأ، ابحث، وتدبّر
          </p>
          <div className="mx-auto mt-5 h-px w-40 bg-gradient-to-r from-transparent via-gilt to-transparent" />
        </header>

        <input
          type="text"
          placeholder="ابحث عن سورة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-8 w-full rounded-full border border-line bg-white/70 px-5 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-gilt focus:ring-2 focus:ring-gilt/30"
        />

        {loading && (
          <p className="py-10 text-center text-ink-soft">جاري تحميل السور...</p>
        )}
        {error && <p className="py-10 text-center text-red-700">{error}</p>}

        {!loading && !error && (
          <ul className="divide-y divide-line border-t border-line">
            {filteredSurahs.map((surah) => (
              <li key={surah.number}>
                <button
                  onClick={() => navigate(`/surah/${surah.number}`)}
                  className="group flex w-full items-center gap-4 rounded-lg px-2 py-4 transition-colors hover:bg-paper-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gilt text-sm font-semibold text-gilt-deep">
                    {surah.number}
                  </span>
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span className="font-quran text-lg font-semibold text-ink transition-colors group-hover:text-mosque">
                      {surah.name}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-ink-soft">
                      <span className="rounded-full bg-paper-deep px-2 py-0.5">
                        {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                      </span>
                      <span>{surah.numberOfAyahs} آية</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
