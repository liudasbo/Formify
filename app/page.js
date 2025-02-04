import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session.user.name);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <p>Hello, {session.user.name}!</p>
    </div>
  );
}
