// src/components/dashboard/AdminDashboard.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStats from "./DashboardStats";
import AdminLeadsTable from "./AdminLeadsTable";

const AdminDashboard = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Admin Dashboard</h1>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="all-leads">All Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <DashboardStats />
        </TabsContent>

        <TabsContent value="all-leads" className="mt-4">
          <AdminLeadsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;