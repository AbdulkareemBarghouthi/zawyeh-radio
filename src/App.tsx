import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MiniPlayer } from "./components/MiniPlayer";
import { Home } from "./components/pages/Home";
import { Schedule } from "./components/pages/Schedule";
import { Residents } from "./components/pages/Residents";
import { ShowDetail } from "./components/pages/ShowDetail";
import { ResidentDetail } from "./components/pages/ResidentDetail";
import { About } from "./components/pages/About";
import som3aSvg from "./assets/som3a.svg";
import { AudioPlayer } from "./components/AudioPlayer";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show mini player after scrolling down 400px
      if (window.scrollY > 400) {
        setShowMiniPlayer(true);
      } else {
        setShowMiniPlayer(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (page: string) => {
    navigate(`/${page === "home" ? "" : page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowClick = (showId: string) => {
    navigate(`/show/${showId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResidentClick = (residentId: string) => {
    navigate(`/resident/${residentId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (location.pathname.startsWith("/show/")) {
      navigate("/schedule");
    } else if (location.pathname.startsWith("/resident/")) {
      navigate("/residents");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCurrentPage = (): string => {
    const path = location.pathname;
    if (path === "/" || path === "") return "home";
    if (path.startsWith("/show/")) return "schedule";
    if (path.startsWith("/resident/")) return "residents";
    return path.slice(1); // Remove leading slash
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Container */}
      <div className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="w-full h-full max-w-[1200px] max-h-[1200px] flex items-center justify-center">
          <img
            src={som3aSvg}
            alt="Background Pattern"
            style={{
              width: "400px",
            }}
            className="w-full h-full object-contain opacity-[0.15]"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        <Header currentPage={getCurrentPage()} onNavigate={handleNavigate} />
        <section className="pt-36">
          <div className="max-w-6xl mx-auto px-8">
            <AudioPlayer />
          </div>
        </section>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onShowClick={handleShowClick} />} />
            <Route
              path="/schedule"
              element={<Schedule onShowClick={handleShowClick} />}
            />
            <Route
              path="/residents"
              element={<Residents onResidentClick={handleResidentClick} />}
            />
            <Route
              path="/show/:showId"
              element={
                <ShowDetail onBack={handleBack} onShowClick={handleShowClick} />
              }
            />
            <Route
              path="/resident/:residentId"
              element={
                <ResidentDetail
                  onBack={handleBack}
                  onShowClick={handleShowClick}
                />
              }
            />
          </Routes>
        </main>
        <Footer isLive={true} />
        <MiniPlayer
          isVisible={showMiniPlayer && getCurrentPage() === "home"}
          isLive={true}
          showTitle="Electronic Echoes"
          resident="Alex Rivera"
        />
      </div>
    </div>
  );
}
