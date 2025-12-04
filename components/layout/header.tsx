"use client";

import { Bell } from "lucide-react";

export function Header() {
    return (
        <div className="flex items-center p-4 border-b h-16 bg-white">
            <div className="flex w-full justify-end">
                <button className="p-2 rounded-full hover:bg-slate-100">
                    <Bell className="h-5 w-5 text-slate-600" />
                </button>
                <div className="ml-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-sm font-medium">U</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
