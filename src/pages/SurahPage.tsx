import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurah } from '../services/quranApi';
import type { Surah } from '../services/quranApi';
import '../styles/SurahPage.css';

function SurahPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSurah = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSurah(Number(id));
        setSurah(data);
      } catch {
        setError('تعذّر تحميل السورة');
      } finally {
        setLoading(false);
      }
    };
    fetchSurah();
  }, [id]);

  return (
    <div dir="rtl" className="surah-page">
      <button className="back-button" onClick={() => navigate('/')}>
        → العودة لقائمة السور
      </button>

      {loading && <p className="status-text">جاري التحميل...</p>}
      {error && <p className="status-text error">{error}</p>}

      {surah && (
        <>
          <h1 className="surah-title">{surah.name}</h1>
          <div className="ayahs-container">
            {surah.ayahs.map((ayah) => (
              <span key={ayah.number} className="ayah">
                {ayah.text}
                <span className="ayah-number">{ayah.numberInSurah}</span>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SurahPage;