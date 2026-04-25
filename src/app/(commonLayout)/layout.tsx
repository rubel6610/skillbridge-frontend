import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/NavBar";
import React from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen pt-24">{children}</div>
      <Footer />
    </div>
  );
};

export default CommonLayout;
