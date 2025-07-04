import CarList from "@/components/carlists";

export default function Home() {
  return (
    <>
      <header></header>
      <section className="p-8 bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white h-full min-h-screen">
        <CarList />
      </section>
    </>
  );
}
