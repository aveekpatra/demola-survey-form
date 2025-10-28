import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard - Survey Analytics",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <AdminDashboard />
    </div>
  );
}
