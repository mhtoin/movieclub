import Raffle from "components/raffle/Raffle";

export default function HomeLayout({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Raffle />
			{children}
		</>
	);
}
