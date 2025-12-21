"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import { Sidebar } from "@/components/layout/sidebar";
import { useState, useEffect } from "react";

export function MobileSidebar() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden pt-0 h-9 w-9 -ml-2">
                    <Menu className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="fixed inset-y-0 left-0 z-50 h-full w-72 border-r bg-[#111827] p-0 shadow-2xl translate-x-0 translate-y-0 top-0 sm:rounded-none border-none animate-in slide-in-from-left duration-300">
                <Sidebar />
            </DialogContent>
        </Dialog>
    );
}
