import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />

      <main className="h-screen w-full flex justify-center items-center">
        {/* {session ? <p>Hello, {session?.user.name}!</p> : <p>Not signed in</p>} */}
      </main>
    </>
  );
}
