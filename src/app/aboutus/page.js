"use client";

import { motion } from "framer-motion";
import { Building2, Users, Target, Award } from "lucide-react";
import Notification from "@/components/Notification";

// Team member component with animation
const TeamMember = ({ name, role, imageUrl }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="flex flex-col items-center group"
  >
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-primary/20 rounded-full transform group-hover:scale-110 transition-transform duration-300" />
      <img 
        src={imageUrl} 
        alt={`${name}'s Photo`} 
        className="rounded-full shadow-xl w-40 h-40 object-cover relative z-10"
      />
    </div>
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-2 text-primary">{name}</h3>
      <p className="text-lg text-muted-foreground">{role}</p>
    </div>
  </motion.div>
);

// Stat card component
const StatCard = ({ icon: Icon, title, value }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300"
  >
    <div className="bg-primary/10 p-4 rounded-full mb-4">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h4 className="text-xl font-semibold mb-2">{value}</h4>
    <p className="text-muted-foreground">{title}</p>
  </motion.div>
);

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              About SDRB Technologies
            </h1>
            <p className="text-xl text-muted-foreground">
              Pioneering smart automation solutions for a connected future.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard icon={Building2} title="Years Experience" value="1+" />
          <StatCard icon={Users} title="Happy Clients" value="5+" />
          <StatCard icon={Target} title="Projects Completed" value="10+" />
          <StatCard icon={Award} title="Awards Won" value="1+" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold mb-8">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded by <span className="font-semibold text-primary">Sri Datta Shanmukh Sai Yeddu</span>, 
              SDRB Technologies emerged from a vision to transform ordinary homes into intelligent living spaces. 
              Our journey began with a simple belief: that technology should enhance our daily lives while remaining 
              seamlessly integrated into our homes.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we stand at the forefront of home automation innovation, delivering cutting-edge solutions 
              that make homes smarter, safer, and more energy-efficient. Our commitment to excellence and 
              customer satisfaction has made us a trusted name in the industry.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-3xl transform rotate-3" />
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/ssb-automations.appspot.com/o/CompanyLogos%2Flogo-enhanced.jpeg?alt=media&token=6b00a6c1-0a02-414b-85e1-af2536f77900" 
              alt="Company Logo" 
              className="rounded-3xl shadow-2xl relative z-10"
            />
          </motion.div>
        </div>
      </div>

      {/* Location Section */}
      {/* Location Section */}
<div className="container mx-auto px-4 py-16">
  <h2 className="text-4xl font-bold text-center mb-8">Our Location</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    {/* Map */}
    <div className="rounded-xl shadow-lg overflow-hidden w-full h-[300px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.910410964091!2d80.63434397460921!3d16.53061992692215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35e5a53bc09633%3A0x209bed35874fc471!2sSSB%20AUTOMATIONS!5e0!3m2!1sen!2sin!4v1723533035824!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: '0' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="SDRB Technologies Location"
        className="w-full h-full"
      ></iframe>
    </div>
    {/* Address */}
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary">Visit Us</h3>
      <p className="text-lg text-muted-foreground leading-relaxed">
        <strong>SDRB Technologies</strong>
        <br />
        sdrb-technologies,
        <br />
        Main Road, Patamata,
        <br />
        Vijayawada, Andhra Pradesh,
        <br />
        India, 520010
      </p>
      <p className="text-lg text-muted-foreground leading-relaxed">
        <strong>Contact:</strong> +91-12345-67890
        <br />
        <strong>Email:</strong> info@sdrbtechnologies.com
      </p>
    </div>
  </div>
</div>

      <Notification />
    </div>
  );
}
