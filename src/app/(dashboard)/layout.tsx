import { Sidebar } from "@/components/layout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
