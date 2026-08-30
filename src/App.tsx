import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SurahPage from './pages/SurahPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/surah/:id" element={<SurahPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
