import { ThemeToggle } from "./theme-toggle";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

const OnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-500">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-500">Offline</span>
        </>
      )}
    </div>
  );
};

export const Header = () => {
  const location = useLocation();

  return (
    <>
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-background text-black dark:text-white w-full">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <ThemeToggle />
          <OnlineStatus />
        </div>
        <nav className="flex space-x-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md ${
              location.pathname === "/" ? "bg-accent" : "hover:bg-accent"
            }`}
          >
            Chat
          </Link>
          <Link
            to="/analytics"
            className={`px-3 py-2 rounded-md ${
              location.pathname === "/analytics"
                ? "bg-accent"
                : "hover:bg-accent"
            }`}
          >
            Analytics
          </Link>
          <Link
            to="/discovers"
            className={`px-3 py-2 rounded-md ${
              location.pathname === "/discovers"
                ? "bg-accent"
                : "hover:bg-accent"
            }`}
          >
            Discovers
          </Link>
        </nav>
      </header>
    </>
  );
};
