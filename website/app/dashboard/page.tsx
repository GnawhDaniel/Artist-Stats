"use client";
import Sidebar from "@/components/sidebar"


// Define Test component
export default function Dashboard() {
    // You would typically get this from your routing system
    const currentPath = '/dashboard';
  
    return (
      <div className="flex min-h-screen flex-col items-center">
        <div className="flex max-w-[85%] w-full">
          <Sidebar username="xxxxxxxxxxxxxxx" currentPath={currentPath}/>
          <div className="p-4">
          </div>
        </div>
      </div>
    );
  }