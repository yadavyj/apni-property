import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin",
};

export default function AdminDashboardLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
