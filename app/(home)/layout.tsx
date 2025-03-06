import { getQueryClient } from "@/lib/getQueryClient";
import { getAllShortlistsGroupedById } from "@/lib/shortlist";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { SocketClient } from "components/common/SocketClient";
import ReplaceDialog from "components/search/ReplaceDialog";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Toaster } from "sonner";

const NavBar = dynamic(() => import("components/nav/Navbar"), {
	ssr: false,
});

export default async function HomeLayout({
	searchModal,
	children,
}: {
	searchModal: React.ReactNode;
	children: React.ReactNode;
}) {
	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: ["shortlists"],
		queryFn: getAllShortlistsGroupedById,
	});
	return (
		<>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={null}>
					<NavBar />
				</Suspense>
				<SocketClient />

				<Toaster position="top-center" />
				<ReplaceDialog />
				{searchModal}

				{children}
			</HydrationBoundary>
		</>
	);
}
