import { useState, useEffect } from "react";
import api from "../../services/api";
import { useLanguage } from "../../languages/LanguageContext";
import { StreetOption, HouseNumberOption } from "../../types/address";

interface FavoriteAddressCardProps {
  streetQuery: string;
  selectedStreet: StreetOption | null;
  currentHouseNumber: string;
  onStreetQueryChange: (query: string) => void;
  onSelectStreet: (street: StreetOption) => void;
  onSelectHouseNumber: (houseNumber: HouseNumberOption) => void;
}

function FavoriteAddressCard({
  streetQuery,
  selectedStreet,
  currentHouseNumber,
  onStreetQueryChange,
  onSelectStreet,
  onSelectHouseNumber,
}: FavoriteAddressCardProps) {
  const { t } = useLanguage();

  const [streetSuggestions, setStreetSuggestions] = useState<StreetOption[]>([]);
  const [showStreetSuggestions, setShowStreetSuggestions] = useState(false);
  const [showHouseNumberOptions, setShowHouseNumberOptions] = useState(false);

  // Searches streets as the user types in the street field
  useEffect(() => {
    if (streetQuery.trim().length < 2) {
      setStreetSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await api.get(`/api/streets/search?q=${encodeURIComponent(streetQuery)}`);
        setStreetSuggestions(res.data);
      } catch {
        setStreetSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [streetQuery]);

  const handleSelectStreet = (street: StreetOption) => {
    onSelectStreet(street);
    setShowStreetSuggestions(false);
    setShowHouseNumberOptions(true);
  };

  const handleSelectHouseNumber = (houseNumber: HouseNumberOption) => {
    onSelectHouseNumber(houseNumber);
    setShowHouseNumberOptions(false);
  };

  return (
    <div className="glass-card p-5 mb-4 relative z-30">
      <h3 className="font-semibold mb-4">{t("profile.favoriteAddress")}</h3>

      <div className="relative mb-3">
        <input
          type="text"
          placeholder={t("profile.streetPlaceholder")}
          value={streetQuery}
          onChange={(e) => {
            onStreetQueryChange(e.target.value);
            setShowStreetSuggestions(true);
          }}
          onFocus={() => setShowStreetSuggestions(true)}
          className="bg-subtle w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
        />

        {showStreetSuggestions && streetSuggestions.length > 0 && (
          <div className="glass-dropdown absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl">
            {streetSuggestions.map((s) => (
              <button
                key={s._id}
                onClick={() => handleSelectStreet(s)}
                className="w-full text-left px-4 py-2.5 text-sm transition hover:bg-white/5"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedStreet && (
        <div className="relative">
          <button
            onClick={() => setShowHouseNumberOptions((prev) => !prev)}
            className="bg-subtle w-full sm:w-40 rounded-xl px-4 py-3 text-left text-sm flex items-center justify-between"
          >
            <span>{currentHouseNumber ? `Nr. ${currentHouseNumber}` : t("profile.houseNumberPlaceholder")}</span>
            <span className="text-faint">▾</span>
          </button>

          {showHouseNumberOptions && (
            <div className="glass-dropdown absolute z-50 mt-2 w-full sm:w-40 max-h-60 overflow-y-auto rounded-xl">
              {selectedStreet.houseNumbers.map((h) => (
                <button
                  key={h.hnrId}
                  onClick={() => handleSelectHouseNumber(h)}
                  className="w-full text-left px-4 py-2.5 text-sm transition hover:bg-white/5"
                >
                  {h.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-faint text-xs mt-2">
        {t("profile.addressNote")}
      </p>
    </div>
  );
}

export default FavoriteAddressCard;