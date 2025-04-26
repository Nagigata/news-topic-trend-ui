import { ThemeToggle } from "./theme-toggle";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();

  return (
    <>
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-background text-black dark:text-white w-full">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <ThemeToggle />
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
            to="/trending"
            className={`px-3 py-2 rounded-md ${
              location.pathname === "/trending"
                ? "bg-accent"
                : "hover:bg-accent"
            }`}
          >
            Discover
          </Link>
        </nav>
      </header>
    </>
  );
};
