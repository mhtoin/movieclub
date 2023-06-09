import NavBar from "./components/NavBar";

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-full">
      {/* Include shared UI here e.g. a header or sidebar */}
      <NavBar />
      {children}
    </section>
  );
}
