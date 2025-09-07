"use client";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Process from "@/components/Process";

const Home = () => {
  return (
    <div className="bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Process />
      <Footer />
    </div>
  );
};

export default Home;
