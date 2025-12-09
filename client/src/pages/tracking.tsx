import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, Loader2, CheckCircle, XCircle, Clock, AlertTriangle, FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Tracking() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    // Simulate complex backend connection
    setTimeout(() => {
      const allRequests = JSON.parse(localStorage.getItem('pfa_requests') || '[]');
      const found = allRequests.find((r: any) => r.id === code.trim().toUpperCase());
      
      setLoading(false);
      
      if (found) {
        setResult(found);
      } else {
        setError("No se encontró ninguna solicitud con ese código. Verifique y vuelva a intentar.");
      }
    }, 2000);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Aprobado":
      case "Admitido":
        return {
          color: "bg-green-500",
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          title: "Solicitud Admitida",
          desc: "Su perfil ha sido revisado y aprobado. Por favor, revise su Discord para las instrucciones de ingreso.",
          step: 3
        };
      case "Rechazado":
      case "Desestimado":
        return {
          color: "bg-red-500",
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: "Solicitud Desestimada",
          desc: "Lamentamos informarle que su solicitud no cumple con los requisitos actuales o ha sido desestimada por la superioridad.",
          step: 3
        };
      case "Cancelado":
        return {
          color: "bg-slate-500",
          icon: <XCircle className="h-12 w-12 text-slate-500" />,
          title: "Solicitud Cancelada",
          desc: "La solicitud ha sido cancelada administrativamente.",
          step: 3
        };
      case "Analizando":
        return {
          color: "bg-blue-500",
          icon: <Search className="h-12 w-12 text-blue-500" />,
          title: "En Análisis",
          desc: "Un oficial de incorporaciones está revisando su legajo en este momento.",
          step: 2
        };
      default: // Pendiente / En Revisión
        return {
          color: "bg-yellow-500",
          icon: <Clock className="h-12 w-12 text-yellow-500" />,
          title: "En Espera de Revisión",
          desc: "Su solicitud ha sido recibida y está en cola de espera para ser asignada a un evaluador.",
          step: 1
        };
    }
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Estado de Trámite</h1>
            <p className="text-gray-500">Sistema de Seguimiento de Incorporaciones - PFA</p>
          </div>

          <Card className="shadow-xl border-t-4 border-t-secondary mb-8">
            <CardContent className="p-8">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <Label htmlFor="code" className="sr-only">Código de Seguimiento</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      id="code" 
                      placeholder="Ingrese su código (ej: INC-123456)" 
                      className="pl-10 h-12 text-lg font-mono uppercase"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                  CONSULTAR
                </Button>
              </form>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className="overflow-hidden shadow-lg border-none">
                  <div className="bg-primary px-6 py-4 flex justify-between items-center text-white">
                    <div>
                      <h3 className="font-bold text-lg">Solicitud #{result.id}</h3>
                      <p className="text-xs text-slate-300">Iniciada el {new Date(result.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className="border-white text-white px-3 py-1 text-xs">
                      {result.status || "Pendiente"}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-0">
                    <div className="p-8 text-center border-b bg-white">
                      <div className="flex justify-center mb-4">
                        {getStatusInfo(result.status || "Pendiente").icon}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {getStatusInfo(result.status || "Pendiente").title}
                      </h2>
                      <p className="text-gray-600 max-w-lg mx-auto">
                        {getStatusInfo(result.status || "Pendiente").desc}
                      </p>
                    </div>

                    {/* Timeline Visual */}
                    <div className="p-8 bg-slate-50">
                      <h4 className="text-sm font-bold uppercase text-gray-500 mb-6 tracking-wider">Línea de Tiempo</h4>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        {/* Step 1: Received */}
                        <div className="relative flex items-start gap-4 mb-8">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${getStatusInfo(result.status).step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-gray-800">Solicitud Recibida</h5>
                            <p className="text-xs text-gray-500">Su formulario ha ingresado al sistema correctamente.</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">{new Date(result.date).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Step 2: Analysis */}
                        <div className="relative flex items-start gap-4 mb-8">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${getStatusInfo(result.status).step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                            <Search className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-gray-800">Análisis de Perfil</h5>
                            <p className="text-xs text-gray-500">Verificación de antecedentes y examen psicotécnico.</p>
                          </div>
                        </div>

                        {/* Step 3: Resolution */}
                        <div className="relative flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${getStatusInfo(result.status).step >= 3 ? (result.status === 'Rechazado' || result.status === 'Desestimado' || result.status === 'Cancelado' ? 'bg-red-500 text-white' : 'bg-green-500 text-white') : 'bg-gray-200 text-gray-400'}`}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-gray-800">Resolución Final</h5>
                            <p className="text-xs text-gray-500">Dictamen de la División Incorporaciones.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-4 text-center text-xs text-gray-500 border-t">
                      Si tiene dudas sobre este proceso, contacte a un oficial en Discord.
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
