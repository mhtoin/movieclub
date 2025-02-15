"use client";

import {
	type HydrationBoundaryProps,
	HydrationBoundary as RQHydrate,
} from "@tanstack/react-query";

function Hydrate(props: HydrationBoundaryProps) {
	return <RQHydrate {...props} />;
}

export default Hydrate;
