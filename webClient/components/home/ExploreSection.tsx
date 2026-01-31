"use client"

import { Button } from "@base-ui/react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/utils/animations";

const ExploreSection = () => (
  <section className="py-24 px-6 bg-slate-50/50" id="explore">
    <div className="max-w-6xl mx-auto text-center space-y-8">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeInUp}
        >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Explore Ideas Right Now</h2>
            <p className="text-slate-500 mt-3 font-medium">Browse trending ideas even without signing up</p>
            
            <div className="flex justify-center gap-4 mt-8 mb-12">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 h-12 shadow-lg shadow-violet-200 font-semibold">Browse Feed</Button>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 h-12 shadow-lg shadow-violet-200 font-semibold">Sign up to save</Button>
            </div>
        </motion.div>

        {/* Image Strip */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex gap-6 items-end justify-center overflow-hidden"
        >
             <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&fit=crop" className="w-full h-full object-cover" />
             </div>
             <div className="w-48 h-40 rounded-3xl overflow-hidden shadow-xl flex-shrink-0 mb-0">
                <img src="https://images.unsplash.com/photo-1616486029423-aaa478965c96?w=500&fit=crop" className="w-full h-full object-cover" />
             </div>
             <div className="w-48 h-40 rounded-3xl overflow-hidden shadow-xl flex-shrink-0 mb-0">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=500&fit=crop" className="w-full h-full object-cover" />
             </div>
             <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&fit=crop" className="w-full h-full object-cover" />
             </div>
        </motion.div>
    </div>
  </section>
);

export default ExploreSection