import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { AuthorPage } from '@/pages/AuthorPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SearchPage } from '@/pages/SearchPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { useMessageWebSocket } from '@/hooks/useMessageWebSocket';

function AppRoutes() {
  useMessageWebSocket();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/author/:id" element={<AuthorPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
