
import HeroSection from "@/components/HomePage/HeroSection";
import StudentSection from "@/components/HomePage/StudentSection";
import TutorSection from "@/components/HomePage/TutorSection";
import React from "react";

const Home:React.FC = () => {
  return (
    <div>
      <HeroSection />
      <StudentSection />
      <TutorSection />
    </div>
  );
};

export default Home;
