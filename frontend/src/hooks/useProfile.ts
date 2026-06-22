import { useState, useEffect } from "react";
import api from "../services/api";
import { useLanguage } from "../languages/LanguageContext";
import { StreetOption, HouseNumberOption } from "../types/address";

export interface ProfileData {
  email: string;
  address: { street: string; houseNumber: string; city: string };
  notifications: { enabled: boolean; daysBefore: number };
  language: "de" | "en";
}

export function useProfile() {
  const { t, setLanguage } = useLanguage();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [streetQuery, setStreetQuery] = useState("");
  const [selectedStreet, setSelectedStreet] = useState<StreetOption | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/user/profile");
        setProfile(res.data);

        // Apply the saved language preference right away
        if (res.data.language === "de" || res.data.language === "en") {
          setLanguage(res.data.language);
        }

        // Pre-fill street + house numbers if user already has a fav address
        const savedStreet = res.data.address?.street;
        if (savedStreet) {
          setStreetQuery(savedStreet);
          try {
            const streetRes = await api.get(`/api/streets/search?q=${encodeURIComponent(savedStreet)}`);
            const matched: StreetOption | undefined = streetRes.data.find(
              (s: StreetOption) => s.name === savedStreet
            );
            if (matched) setSelectedStreet(matched);
          } catch {
            // street lookup failed but user can still re-search manually
          }
        }
      } catch {
        setError(t("profile.loadError"));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStreetQueryChange = (query: string) => {
    setStreetQuery(query);
    setSelectedStreet(null);
    if (profile) {
      setProfile({ ...profile, address: { ...profile.address, street: "", houseNumber: "" } });
    }
  };

  const handleSelectStreet = (street: StreetOption) => {
    setSelectedStreet(street);
    setStreetQuery(street.name);
    if (profile) {
      setProfile({
        ...profile,
        address: { ...profile.address, street: street.name, houseNumber: "" },
      });
    }
  };

  const handleSelectHouseNumber = (houseNumber: HouseNumberOption) => {
    if (profile) {
      setProfile({
        ...profile,
        address: { ...profile.address, houseNumber: houseNumber.label },
      });
    }
  };

  const handleToggleNotifications = () => {
    if (!profile) return;
    setProfile({ ...profile, notifications: { ...profile.notifications, enabled: !profile.notifications.enabled } });
  };

  const handleChangeDaysBefore = (days: number) => {
    if (!profile) return;
    setProfile({ ...profile, notifications: { ...profile.notifications, daysBefore: days } });
  };

  const handleSelectLanguage = (lang: "de" | "en") => {
    if (!profile) return;
    setProfile({ ...profile, language: lang });
    // Switch the language right away, don't wait for the save to finish
    setLanguage(lang);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      const res = await api.put("/api/user/profile", {
        address: profile.address,
        notifications: profile.notifications,
        language: profile.language,
      });
      setProfile(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    success,
    error,
    streetQuery,
    selectedStreet,
    handleStreetQueryChange,
    handleSelectStreet,
    handleSelectHouseNumber,
    handleToggleNotifications,
    handleChangeDaysBefore,
    handleSelectLanguage,
    handleSave,
  };
}