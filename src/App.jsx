import { BrowserRouter, Routes, Route } from "react-router-dom";
import Directory from "./pages/Directory";
import CardPage from "./pages/CardPage";
import Admin from "./pages/Admin";
import LoginGate from "./pages/PasswordGate";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Directory />} />
        <Route path="/c/:slug" element={<CardPage />} />
        <Route
          path="/admin"
          element={
            <LoginGate>
              <Admin />
            </LoginGate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
