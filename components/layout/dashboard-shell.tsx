"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full flex flex-col">
                <Header />
                <div className="flex-1 p-4 md:p-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
