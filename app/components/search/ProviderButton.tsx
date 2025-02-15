import { useFilterStore } from "@/stores/useFilterStore";
import { de } from "date-fns/locale";
import { use, useEffect, useState } from "react";
import { Button } from "../ui/Button";

export default function ProviderButton({
	provider,
	isToggled,
	submit,
}: {
	provider: WatchProvider;
	isToggled: boolean;
	submit: () => void;
}) {
	const setDefaultSelectAll = useFilterStore.use.setDefaultSelectAll();
	const defaultSelectAll = useFilterStore.use.defaultSelectAll();
	const setWatchProviders = useFilterStore.use.setWatchProviders();
	const addProvider = useFilterStore((state) => state.addWatchprovider);
	const removeProvider = useFilterStore((state) => state.removeWatchprovider);

	useEffect(() => {
		submit();
	}, [submit]);

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
		<Button
			key={provider.provider_id}
			className="border-1 rounded-md m-1 hover:scale-110"
			onClick={handleSelect}
		>
			<img
				src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
				className={`object-fill object-center rounded-md  ${
					isToggled ? "opacity-100" : "opacity-10"
				}`}
				alt={provider.provider_name}
			/>
		</Button>
	);
}
