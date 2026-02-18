import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AppLayout } from './components/AppLayout';
import { useOllamaConnection } from './hooks/useOllamaConnection';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  // Initialize connection polling and keyboard shortcuts globally
  useOllamaConnection();
  useKeyboardShortcuts();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<AppLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
