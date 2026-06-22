import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { transformToScheduleEntries } from "../utils/scheduleTransform";
import { getUpcomingReminders } from "../utils/reminders";
import ReminderBanner from "../components/ReminderBanner";
import HomeHero from "../components/home/HomeHero";
import AddressSearch from "../components/home/AddressSearch";
import ScheduleDisplay from "../components/home/ScheduleDisplay";
import ChatWidget from "../components/home/ChatWidget";
import { useLanguage } from "../languages/LanguageContext";
import { ScheduleData } from "../types/schedule";
import { StreetOption, HouseNumberOption } from "../types/address";

function Home() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // Address selection state, owned here because it needs to be set
  // both by user interaction (via AddressSearch) and by the favorite
  // address auto-load effect below.
  const [streetQuery, setStreetQuery] = useState("");
  const [selectedStreet, setSelectedStreet] = useState<StreetOption | null>(null);
  const [selectedHouseNumber, setSelectedHouseNumber] = useState<HouseNumberOption | null>(null);

  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  const [notificationSettings, setNotificationSettings] = useState<{ enabled: boolean; daysBefore: number }>({
    enabled: false,
    daysBefore: 1,
  });

  // Fetches and transforms the live collection calendar for a chosen
  // street + house number combination.
  const fetchSchedule = async (street: StreetOption, houseNumber: HouseNumberOption) => {
    setScheduleLoading(true);
    setScheduleError("");
    setScheduleData(null);
    try {
      const res = await api.get(
        `/api/schedule/lookup?streetId=${street.strId}&houseNumberId=${houseNumber.hnrId}`
      );
      const entries = transformToScheduleEntries(res.data);
      setScheduleData({
        street: street.name,
        houseNumber: houseNumber.label,
        district: "Erfurt",
        schedule: entries,
      });
    } catch {
      setScheduleError(t("home.scheduleError"));
    } finally {
      setScheduleLoading(false);
    }
  };

  // Load favorite address and auto-search on login
  useEffect(() => {
    const loadFavoriteAddress = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await api.get("/api/user/profile");
        const fav = res.data.address;

        if (res.data.notifications) {
          setNotificationSettings({
            enabled: !!res.data.notifications.enabled,
            daysBefore: res.data.notifications.daysBefore ?? 1,
          });
        }

        if (fav?.street) {
          const streetRes = await api.get(`/api/streets/search?q=${encodeURIComponent(fav.street)}`);
          const matchedStreet: StreetOption | undefined = streetRes.data.find(
            (s: StreetOption) => s.name === fav.street
          );
          if (matchedStreet) {
            const matchedHouseNumber = matchedStreet.houseNumbers.find(
              (h) => h.label === fav.houseNumber
            );
            setSelectedStreet(matchedStreet);
            setStreetQuery(matchedStreet.name);
            if (matchedHouseNumber) {
              setSelectedHouseNumber(matchedHouseNumber);
              fetchSchedule(matchedStreet, matchedHouseNumber);
            }
          }
        }
      } catch {
        // not logged in or profile fetch failed, ignore
      }
    };
    loadFavoriteAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleStreetQueryChange = (query: string) => {
    setStreetQuery(query);
    setSelectedStreet(null);
    setSelectedHouseNumber(null);
  };

  const handleSelectStreet = (street: StreetOption) => {
    setSelectedStreet(street);
    setStreetQuery(street.name);
    setSelectedHouseNumber(null);
    setScheduleData(null);
    setScheduleError("");
  };

  const handleSelectHouseNumber = (houseNumber: HouseNumberOption) => {
    setSelectedHouseNumber(houseNumber);
    if (selectedStreet) {
      fetchSchedule(selectedStreet, houseNumber);
    }
  };

  const upcomingReminders = scheduleData && notificationSettings.enabled
    ? getUpcomingReminders(scheduleData.schedule, notificationSettings.daysBefore)
    : [];

  return (
    <div className="page-background page-background-fixed min-h-screen text-white relative overflow-hidden">

      {/* Dark overlay */}
      <div className="page-overlay" />

      <div className="relative max-w-3xl mx-auto px-4 py-8 sm:py-16">

        <HomeHero />

        <ReminderBanner reminders={upcomingReminders} />

        <AddressSearch
          streetQuery={streetQuery}
          selectedStreet={selectedStreet}
          selectedHouseNumber={selectedHouseNumber}
          onStreetQueryChange={handleStreetQueryChange}
          onSelectStreet={handleSelectStreet}
          onSelectHouseNumber={handleSelectHouseNumber}
        />

        {scheduleLoading && <p className="text-center mb-10 animate-pulse" style={{ color: "rgba(255,255,255,0.5)" }}>{t("home.loading")}</p>}
        {scheduleError && <p className="text-red-400 text-center mb-10">{scheduleError}</p>}

        {scheduleData && <ScheduleDisplay scheduleData={scheduleData} />}

        <ChatWidget />

        <div className="glass-card mt-10 px-6 py-4 rounded-2xl text-center">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {t("home.footer")} <span style={{ color: "var(--accent)" }}>SWE Stadtwirtschaft GmbH Erfurt</span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Home;