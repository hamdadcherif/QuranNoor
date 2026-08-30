import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSurahs } from '../services/quranApi';
import type { SurahInfo } from '../services/quranApi';
import '../styles/HomePage.css';


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

function HomePage() {
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
    <div dir="rtl" className="home-page">
      <header className="home-header">
        <h1>القرآن الكريم</h1>
        <p className="home-subtitle">١١٤ سورة — اقرأ، ابحث، وتدبّر</p>
      </header>

      <input
        type="text"
        placeholder="ابحث عن سورة..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading && <p className="status-text">جاري تحميل السور...</p>}
      {error && <p className="status-text error">{error}</p>}

      {!loading && !error && (
        <ul className="surah-list">
          {filteredSurahs.map((surah) => (
            <li
              key={surah.number}
              className="surah-row"
              onClick={() => navigate(`/surah/${surah.number}`)}
            >
              <span className="surah-number">{surah.number}</span>
              <span className="surah-info">
                <span className="surah-name">{surah.name}</span>
                <span className="surah-meta">
                  {surah.englishNameTranslation} · {surah.numberOfAyahs} آية ·{' '}
                  {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;