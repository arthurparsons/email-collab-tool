import React from 'react';
import { Navbar } from './Navbar';
import Hero from './Hero';
import Features from './Features';
import EditorDemo from './EditorDemo';
import TemplateGallery from './TemplateGallery';
import Stats from './Stats';
import Testimonials from './Testimonials';
import CTA from './CTA';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <EditorDemo />
      <TemplateGallery />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
