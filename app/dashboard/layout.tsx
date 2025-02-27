import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen flex-col mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0">
      <DashboardNav user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}