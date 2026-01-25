"use client"

import { Upload, Globe, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer} from "@/utils/animations";
import { Card, CardContent } from "../ui/card";



const FeaturesSection = () => {
  const features = [
    { icon: <Bookmark className="w-6 h-6" />, title: "Save Ideas", desc: "Organize inspiration into boards." },
    { icon: <Upload className="w-6 h-6" />, title: "Upload Content", desc: "Share your own ideas with the community." },
    { icon: <Globe className="w-6 h-6" />, title: "Discover Trends", desc: "Explore trending ideas across categories." },
  ];

  return (
    <section className="py-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Everything you need to <br /> capture inspiration
          </h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={fadeInUp} whileHover={{ y: -5 }}>
              <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full rounded-2xl bg-white">
                <CardContent className="p-8 flex flex-col items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-start text-slate-900">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection