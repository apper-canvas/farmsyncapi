import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Fields from "@/components/pages/Fields";
import Tasks from "@/components/pages/Tasks";
import Inventory from "@/components/pages/Inventory";
import MarketPrices from "@/components/pages/MarketPrices";
import Weather from "@/components/pages/Weather";
import IrrigationCalendar from "@/components/pages/IrrigationCalendar";
import PestReports from "@/components/pages/PestReports";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 lg:ml-0">
<Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fields" element={<Fields />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/irrigation" element={<IrrigationCalendar />} />
            <Route path="/pest-reports" element={<PestReports />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </Router>
  );
}

export default App;