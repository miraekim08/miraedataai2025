import DashboardShell from "@/components/layout/dashboard-shell";

export default function CalendarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardShell>{children}</DashboardShell>;
}
