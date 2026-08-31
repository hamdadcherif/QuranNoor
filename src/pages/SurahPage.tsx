import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurah, getSurahAudioUrl } from '../services/quranApi';
import type { Surah } from '../services/quranApi';

function SurahPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
    setPlayingAyah(null);
    setIsPlayingAll(false);
  };

  useEffect(() => {
    if (!id) return;

    const fetchSurah = async () => {
      setLoading(true);
      setError(null);
      setAudioError(null);
      stopAudio();
      try {
        const data = await getSurah(Number(id));
        setSurah(data);
      } catch (err) {
        console.error('Failed to load surah:', err);
        setError('تعذّر تحميل السورة');
      } finally {
        setLoading(false);
      }
    };
    fetchSurah();
  }, [id]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  // Play a single ayah by its index in the ayahs array
  const playAyahAt = (index: number) => {
    if (!surah) return;
    const ayah = surah.ayahs[index];

    if (!ayah) {
      console.error('No ayah found at index', index);
      return;
    }

    if (!ayah.audio) {
      console.error('This ayah has no audio URL:', ayah);
      setAudioError('لا يتوفر رابط صوت لهذه الآية');
      return;
    }

    if (!audioRef.current) return;

    // Reset full surah state if active
    setIsPlayingAll(false);
    setAudioError(null);
    audioRef.current.src = ayah.audio;
    audioRef.current.dataset.type = 'single';

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlayingAyah(ayah.numberInSurah);
        })
        .catch((err) => {
          console.error('Audio playback failed:', err);
          setAudioError('تعذّر تشغيل الصوت، تحقق من اتصال الإنترنت');
          setPlayingAyah(null);
        });
    } else {
      setPlayingAyah(ayah.numberInSurah);
    }
  };

  const handleAyahClick = (index: number) => {
    if (playingAyah === surah?.ayahs[index].numberInSurah && !isPlayingAll) {
      stopAudio();
    } else {
      playAyahAt(index);
    }
  };

  // Play the full continuous MP3 file for the entire surah without audio gaps
  const handlePlayAll = () => {
    if (isPlayingAll) {
      stopAudio();
      return;
    }

    if (!surah || !audioRef.current) return;

    setAudioError(null);
    setPlayingAyah(null);
    
    const fullAudioUrl = getSurahAudioUrl(surah.number);
    audioRef.current.src = fullAudioUrl;
    audioRef.current.dataset.type = 'full';

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlayingAll(true);
        })
        .catch((err) => {
          console.error('Full surah audio playback failed:', err);
          setAudioError('تعذّر تشغيل السورة كاملة، تحقق من اتصال الإنترنت');
          setIsPlayingAll(false);
        });
    } else {
      setIsPlayingAll(true);
    }
  };

  const handleAudioEnded = () => {
    stopAudio();
  };

  return (
    <div dir="rtl" className="min-h-screen bg-paper font-ui text-ink">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
        <button
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-mosque underline-offset-4 transition-colors hover:text-mosque-soft hover:underline"
        >
          <span aria-hidden="true">→</span>
          <span>العودة لقائمة السور</span>
        </button>

        {loading && (
          <p className="py-10 text-center text-ink-soft">جاري التحميل...</p>
        )}
        {error && <p className="py-10 text-center text-red-700">{error}</p>}

        {surah && (
          <>
            <div className="relative mb-10 rounded-2xl border border-gilt/40 bg-white/50 px-6 py-8 text-center">
              <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-gilt/60" />
              <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l-2 border-t-2 border-gilt/60" />
              <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-gilt/60" />
              <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-gilt/60" />
              <h1 className="font-kufi text-3xl text-mosque sm:text-4xl">{surah.name}</h1>
            </div>

            <div className="mb-6 flex justify-center">
              <button
                onClick={handlePlayAll}
                className="rounded-full bg-mosque px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-mosque-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt/50"
              >
                {isPlayingAll ? '⏸ إيقاف الاستماع' : '▶ الاستماع للسورة كاملة'}
              </button>
            </div>

            {audioError && (
              <p className="mb-6 text-center text-sm text-red-700">{audioError}</p>
            )}

            <audio
              ref={audioRef}
              onEnded={handleAudioEnded}
              onError={(e) => {
                const audioEl = e.currentTarget;
                if (!audioEl.getAttribute('src')) return;
                console.error('<audio> element error:', audioEl.error);
                setAudioError('حدث خطأ أثناء تشغيل الصوت');
              }}
              className="hidden"
            />

            <div className="rounded-2xl border border-line bg-white/40 px-6 py-8 sm:px-8 sm:py-10">
              <div className="font-quran text-[1.6rem] leading-[2.6] text-justify">
                {surah.ayahs.map((ayah, index) => (
                  <span
                    key={ayah.number}
                    className={`rounded-md transition-colors ${
                      playingAyah === ayah.numberInSurah
                        ? 'bg-gilt-soft/50'
                        : 'hover:bg-black/[0.03]'
                    }`}
                  >
                    {ayah.text}
                    <span
                      onClick={() => handleAyahClick(index)}
                      title="اضغط للاستماع لهذه الآية"
                      className={`mx-1.5 inline-flex h-7 w-7 cursor-pointer select-none items-center justify-center rounded-full border border-gilt align-middle font-ui text-[0.8rem] transition-colors ${
                        playingAyah === ayah.numberInSurah
                          ? 'bg-gilt-deep text-paper'
                          : 'text-gilt-deep'
                      }`}
                    >
                      {playingAyah === ayah.numberInSurah ? '❚❚' : ayah.numberInSurah}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SurahPage;