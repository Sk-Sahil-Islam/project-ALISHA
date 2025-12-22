import { HashRouter, Routes, Route } from 'react-router-dom'; // Changed from BrowserRouter
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import './styles/App.css';
import { useEffect, useState } from "react";
import CanvasCursor from './components/CanvasCursor';

function useDesktopPointer() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = () => setEnabled(mq.matches);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return enabled;
}

function App() {
    const showCursor = useDesktopPointer();

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<MainPage />} />
            </Routes>

            {showCursor && <CanvasCursor />}
        </HashRouter>
    );
}

export default App;
