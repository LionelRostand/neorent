import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSidebarMenuItems } from '@/components/Layout/SidebarComponents/useSidebarMenuItems';

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const menuItems = useSidebarMenuItems();

  const isActive = (path: string) => currentPath === path;
  const isExpanded = menuItems.some((item) => isActive(item.path));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className={`bg-green-500 text-white ${state === "collapsed" ? "w-14" : "w-60"}`}
      collapsible="icon"
    >
      <SidebarContent className="bg-green-500">
        {/* Header */}
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center">
            <div className="h-6 w-6 bg-white/20 rounded mr-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            {state !== "collapsed" && <h1 className="text-xl font-bold text-white">NEORENT</h1>}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path} 
                end 
                className={({ isActive }) => 
                  `flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-green-400 text-white'
                      : 'text-white/90 hover:text-white hover:bg-green-400/50'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {state !== "collapsed" && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-green-400 flex-shrink-0">
          <div className="text-center">
            <div className="text-white text-sm font-medium animate-pulse">
              NEOTECH-CONSULTING
            </div>
            <div className="text-white/80 text-xs mt-1">
              Version 1.0 • {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}