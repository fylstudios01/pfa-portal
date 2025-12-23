import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Shield, Users, Scale, FileText, Siren } from "lucide-react";
import logo from "@assets/image_(18)_1765250186765.png";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary to-primary" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <img src={logo} alt="Escudo PFA" className="h-40 w-auto drop-shadow-2xl" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-serif text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight"
            >
              POLICÍA FEDERAL <span className="text-secondary">ARGENTINA</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light"
            >
              "Al servicio de la comunidad"
              <br />
              Protegiendo el orden constitucional y garantizando la seguridad en todo el territorio de Capital Federal.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/incorporacion">
                <Button size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-primary font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all border-none">
                  INSCRIBIRSE AHORA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/quienes-somos">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg">
                  CONOCER MÁS
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Decor stripe */}
        <div className="h-2 w-full bg-secondary shadow-[0_0_20px_rgba(212,175,55,0.5)]"></div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Nuestros Valores</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Pilares Institucionales</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8 px-6 text-center">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-secondary transition-colors duration-300">
                  <Shield className="h-8 w-8 text-primary group-hover:text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Honor y Deber</h3>
                <p className="text-gray-600 leading-relaxed">
                  Actuamos con integridad absoluta, respetando los principios éticos que rigen nuestra institución y la confianza depositada por la ciudadanía.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8 px-6 text-center">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-secondary transition-colors duration-300">
                  <Users className="h-8 w-8 text-primary group-hover:text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Vocación de Servicio</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprometidos con el bienestar de la comunidad, respondiendo ante cualquier emergencia con profesionalismo y rapidez.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8 px-6 text-center">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-secondary transition-colors duration-300">
                  <Scale className="h-8 w-8 text-primary group-hover:text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Justicia y Ley</h3>
                <p className="text-gray-600 leading-relaxed">
                  Hacemos cumplir la ley con firmeza y respeto a los derechos humanos, garantizando el orden y la paz social.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-6">
              <div className="bg-secondary/10 p-4 rounded-lg">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-1">¿Querés ser parte?</h3>
                <p className="text-gray-600">Iniciá tu trámite de incorporación hoy mismo.</p>
              </div>
            </div>
            <Link href="/incorporacion">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium">
                Comenzar Solicitud
              </Button>
            </Link>
          </div>

           <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <Siren className="h-10 w-10 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-1">Denuncias Federales</h3>
                <p className="text-gray-600">Reportá delitos federales de forma segura y conforme a la ley.</p>
              </div>
            </div>
            <Link href="/denuncias">
              <Button variant="outline" size="lg" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 font-medium">
                Realizar Denuncia
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
