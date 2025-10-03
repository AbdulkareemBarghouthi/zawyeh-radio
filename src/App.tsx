import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MiniPlayer } from "./components/MiniPlayer";
import { Home } from "./components/pages/Home";
import { Schedule } from "./components/pages/Schedule";
import { Residents } from "./components/pages/Residents";
import { ShowDetail } from "./components/pages/ShowDetail";
import { ResidentDetail } from "./components/pages/ResidentDetail";
import { About } from "./components/pages/About";

type Page =
  | "home"
  | "schedule"
  | "residents"
  | "about"
  | { type: "show"; id: string }
  | { type: "resident"; id: string };

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
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
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowClick = (showId: string) => {
    setCurrentPage({ type: "show", id: showId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResidentClick = (residentId: string) => {
    setCurrentPage({ type: "resident", id: residentId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (typeof currentPage === "object" && currentPage.type === "show") {
      setCurrentPage("schedule");
    } else if (typeof currentPage === "object" && currentPage.type === "resident") {
      setCurrentPage("residents");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getHeaderPage = (): string => {
    if (typeof currentPage === "string") {
      return currentPage;
    }
    if (currentPage.type === "show") {
      return "schedule";
    }
    if (currentPage.type === "resident") {
      return "residents";
    }
    return "home";
  };

  const renderPage = () => {
    if (typeof currentPage === "string") {
      switch (currentPage) {
        case "home":
          return <Home onShowClick={handleShowClick} />;
        case "schedule":
          return <Schedule onShowClick={handleShowClick} />;
        case "residents":
          return <Residents onResidentClick={handleResidentClick} />;
        case "about":
          return <About />;
        default:
          return <Home onShowClick={handleShowClick} />;
      }
    }

    if (currentPage.type === "show") {
      return (
        <ShowDetail
          showId={currentPage.id}
          onBack={handleBack}
          onShowClick={handleShowClick}
        />
      );
    }

    if (currentPage.type === "resident") {
      return (
        <ResidentDetail
          residentId={currentPage.id}
          onBack={handleBack}
          onShowClick={handleShowClick}
        />
      );
    }

    return <Home onShowClick={handleShowClick} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={getHeaderPage()} onNavigate={handleNavigate} />

      <main className="flex-1">{renderPage()}</main>

      <Footer isLive={true} />

      <MiniPlayer
        isVisible={showMiniPlayer && currentPage === "home"}
        isLive={true}
        showTitle="Electronic Echoes"
        resident="Alex Rivera"
      />
    </div>
  );
}
