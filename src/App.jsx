import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import './styles/App.css';
import CanvasCursor from './components/CanvasCursor';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<MainPage />} />
            </Routes>

            <CanvasCursor />
        </BrowserRouter>
    );
}

export default App;
