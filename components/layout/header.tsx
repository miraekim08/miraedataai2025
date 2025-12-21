"use client";

import { Bell } from "lucide-react";
import { MobileSidebar } from "@/components/shared/mobile-sidebar";

export function Header() {
    return (
        <div className="flex items-center p-4 border-b h-16 bg-white shrink-0">
            <MobileSidebar />
            <div className="flex w-full justify-end">
                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <Bell className="h-5 w-5 text-slate-600" />
                </button>
                <div className="ml-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600">U</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
