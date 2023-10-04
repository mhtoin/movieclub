import { useFilterStore } from "@/stores/useFilterStore";
import { de } from "date-fns/locale";
import { use, useState } from "react";

export default function ProviderButton({
  provider,
  isToggled,
}: {
  provider: WatchProvider;
  isToggled: boolean;
}) {
  const setDefaultSelectAll = useFilterStore.use.setDefaultSelectAll();
  const defaultSelectAll = useFilterStore.use.defaultSelectAll();
  const setWatchProviders = useFilterStore.use.setWatchProviders();

  const addProvider = useFilterStore((state) => state.addWatchprovider);
  const removeProvider = useFilterStore((state) => state.removeWatchprovider);

  const handleSelect = () => {
    if (defaultSelectAll) {
      setDefaultSelectAll(false);
      setWatchProviders([provider.provider_id]);
    } else if (isToggled) {
      removeProvider(provider.provider_id);
      //setToggled(false);
    } else {
      addProvider(provider.provider_id);
      //setToggled(true);
    }
  };

  return (
    <button
      key={provider.provider_id}
      className="btn btn-square w-50 border-1 "
      onClick={handleSelect}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
        className={`object-fill object-center rounded-md ${
          isToggled ? "opacity-100" : "opacity-10"
        }`}
        alt={provider.provider_name}
      />
    </button>
  );
}
