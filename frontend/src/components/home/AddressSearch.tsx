import { useState, useEffect } from "react";
import api from "../../services/api";
import { useLanguage } from "../../languages/LanguageContext";
import { StreetOption, HouseNumberOption } from "../../types/address";

interface AddressSearchProps {
  // Comes from the parent so it can be pre-filled on login
  streetQuery: string;
  selectedStreet: StreetOption | null;
  selectedHouseNumber: HouseNumberOption | null;
  onStreetQueryChange: (query: string) => void;
  onSelectStreet: (street: StreetOption) => void;
  onSelectHouseNumber: (houseNumber: HouseNumberOption) => void;
}

function AddressSearch({
  streetQuery,
  selectedStreet,
  selectedHouseNumber,
  onStreetQueryChange,
  onSelectStreet,
  onSelectHouseNumber,
}: AddressSearchProps) {
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
    <>
      {/* Street + house number search */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-1 relative">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t("home.streetPlaceholder")}
            value={streetQuery}
            onChange={(e) => {
              onStreetQueryChange(e.target.value);
              setShowStreetSuggestions(true);
            }}
            onFocus={() => setShowStreetSuggestions(true)}
            className="glass-input w-full rounded-xl px-4 py-3 text-white text-sm sm:text-base focus:outline-none"
          />

          {showStreetSuggestions && streetSuggestions.length > 0 && (
            <div className="glass-dropdown absolute z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-xl">
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
      </div>

      {/* House number selection — only shown once a street has been picked */}
      {selectedStreet && (
        <div className="mb-3 relative">
          <button
            onClick={() => setShowHouseNumberOptions((prev) => !prev)}
            className="glass-input w-full sm:w-48 rounded-xl px-4 py-3 text-left text-sm sm:text-base flex items-center justify-between"
          >
            <span>{selectedHouseNumber ? `Nr. ${selectedHouseNumber.label}` : t("home.houseNumberPlaceholder")}</span>
            <span className="text-faint">▾</span>
          </button>

          {showHouseNumberOptions && (
            <div className="glass-dropdown absolute z-20 mt-2 w-full sm:w-48 max-h-60 overflow-y-auto rounded-xl">
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

      <p className="text-faint text-xs sm:text-sm mb-8 sm:mb-10">
        {t("home.examplesLabel")}{" "}
        {["Anger", "Bahnhofstraße", "Krämerbrücke"].map((s) => (
          <span key={s} className="text-tertiary cursor-pointer transition mr-2"
            onClick={() => {
              onStreetQueryChange(s);
              setShowStreetSuggestions(true);
            }}>
            {s}
          </span>
        ))}
      </p>
    </>
  );
}

export default AddressSearch;