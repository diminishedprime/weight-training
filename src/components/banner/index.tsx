import { auth } from "@/auth";
import BannerClient from "@/components/banner/BannerClient";

export default async function Banner() {
  const session = await auth();
  const user = session?.user;

  return <BannerClient user={user} />;
}
