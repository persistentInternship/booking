"use client";

import Image from "next/image";
import NavBar from "./components/NavBar";
import HomeServices from "./components/HomeService";
import Footer from "./components/Footer";

export default function Home() {
  return (
  <>
  <NavBar/>
  <HomeServices/>
  <Footer />
  </>
  );
}
