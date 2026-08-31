import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SurahPage from './pages/SurahPage';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/surah/:id" element={<SurahPage />} />
    </Routes>
  );
}

export default App;