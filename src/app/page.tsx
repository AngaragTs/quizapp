import prisma from "@/lib/prisma";
import { HomeScreen } from "./feature/homescreen";

export default async function Home() {
  const users = await prisma.user.findMany();
  console.log(users);

  return (
    <div>
      <HomeScreen />
    </div>
  );
}
