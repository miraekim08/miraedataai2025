import DashboardShell from "@/components/layout/dashboard-shell";

export default function MaterialsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardShell>{children}</DashboardShell>;
}
