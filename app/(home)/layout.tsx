import { getQueryClient } from "@/lib/getQueryClient";
import { getAllShortlistsGroupedById } from "@/lib/shortlist";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { SocketClient } from "components/common/SocketClient";
import ReplaceDialog from "components/search/ReplaceDialog";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

const NavBar = dynamic(
	() => import("components/Navigation/Navbar").then((mod) => mod.NavBar),
	{
		ssr: false,
	},
);

export default async function HomeLayout({
	searchModal,
	children,
}: {
	searchModal: React.ReactNode;
	children: React.ReactNode;
}) {
	const cookieStore = cookies();
	const theme = cookieStore.get("theme");
	const accent = cookieStore.get("accent");

	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: ["shortlists"],
		queryFn: getAllShortlistsGroupedById,
	});
	return (
		<>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<NavBar
					theme={theme as { value: string; name: string }}
					accent={accent as { value: string; name: string }}
				/>
				<SocketClient />

				<Toaster position="top-center" />
				<ReplaceDialog />
				{searchModal}

				{children}
			</HydrationBoundary>
		</>
	);
}
