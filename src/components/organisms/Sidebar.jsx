import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Fields", href: "/fields", icon: "Map" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Inventory", href: "/inventory", icon: "Package" },
    { name: "Market Prices", href: "/market-prices", icon: "TrendingUp" },
    { name: "Weather", href: "/weather", icon: "Cloud" }
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      onClick={mobile ? () => setIsMobileOpen(false) : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
            : "text-gray-700 hover:bg-primary/10 hover:text-primary"
        )
      }
    >
      <ApperIcon name={item.icon} size={20} className="mr-3" />
      {item.name}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface shadow-md"
      >
        <ApperIcon name="Menu" size={24} className="text-primary" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-surface shadow-xl z-50 transition-transform duration-300",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <ApperIcon name="Sprout" size={24} className="text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-primary">FarmSync</h1>
                <p className="text-sm text-gray-600">Agricultural Management</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="X" size={20} className="text-gray-600" />
            </button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} mobile />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-surface shadow-lg">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <ApperIcon name="Sprout" size={24} className="text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-primary">FarmSync</h1>
              <p className="text-sm text-gray-600">Agricultural Management</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;