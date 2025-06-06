import "./App.css";
import { Chat } from "./pages/chat/chat";
import { Discovers } from "./pages/discovers/discovers";
import { Analytics } from "./pages/analytics/analytics";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="w-full h-screen bg-background text-gray-900 dark:text-white">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/discovers" element={<Discovers />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
