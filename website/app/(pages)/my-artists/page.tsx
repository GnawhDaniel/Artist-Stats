"use client";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";

export default function MyArtists() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="flex max-w-[90%] w-full">
        <div>
          <Sidebar username="xxxxxxxxxxxxxxx" currentPath={usePathname()} />
        </div>
        <div>{usePathname()}</div>
      </div>
    </div>
  );
}
