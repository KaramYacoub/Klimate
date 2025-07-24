import { useTheme } from "@/context/theme-provider";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import CitySearch from "./CitySearch";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark: boolean = theme === "dark";

  function handleThemeToggle(): void {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-2xl py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <Link to="/">
          <img
            src={isDark ? "/logo.png" : "/logo2.png"}
            alt="Klimate Logo"
            className="h-14"
          />
        </Link>

        <div className="flex gap-4">
          {/* Search */}
          <CitySearch />
          {/* theme toggle */}
          <div
            className={`cursor-pointer flex items-center transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
            onClick={handleThemeToggle}
          >
            {isDark ? (
              <Sun className="size-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="size-6 text-blue-500 rotate-0 transition-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
