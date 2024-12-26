"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ThermometerSun, Lock, Wifi, Video, BatteryCharging, Smartphone } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: <ThermometerSun className="w-8 h-8" />,
    title: "Climate Control",
    description: "Smart temperature management for optimal comfort"
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Security",
    description: "Advanced security systems for peace of mind"
  },
  {
    icon: <Wifi className="w-8 h-8" />,
    title: "Smart Connectivity",
    description: "Seamless integration of all your devices"
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Video Surveillance",
    description: "24/7 monitoring and smart alerts"
  },
  {
    icon: <BatteryCharging className="w-8 h-8" />,
    title: "Energy Management",
    description: "Optimize energy consumption and reduce costs"
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile Control",
    description: "Control your home from anywhere"
  }
];

const stats = [
  { number: "1000+", label: "Homes Automated" },
  { number: "98%", label: "Customer Satisfaction" },
  { number: "24/7", label: "Support Available" }
];

export default function Home() {
  const router = useRouter();
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });
  const [statsRef, statsInView] = useInView({ triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true });

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            variants={fadeIn}
            className="text-6xl md:text-7xl font-bold mb-6"
          >
            Smart Living, Simplified
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            Transform your home into an intelligent ecosystem with our cutting-edge automation solutions
          </motion.p>
          <motion.button
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all"
            onClick={() => router.push("/contact")}
          >
            Get Started Today
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={stagger}
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={fadeIn}
            className="text-4xl font-bold text-center mb-16"
          >
            Intelligent Features for Modern Living
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={stagger}
        className="py-20 bg-blue-600 text-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeIn}>
                <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
                <p className="text-xl text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-20 px-4 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Home?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied homeowners who have embraced the future of living
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all"
            onClick={() => router.push("/contact")}
          >
            Schedule a Consultation
          </motion.button>
        </div>
      </motion.section>
    </main>
  );
}