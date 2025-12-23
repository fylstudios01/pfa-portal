import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, FileText, CheckCircle, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Denuncias() {
  const [view, setView] = useState<"report" | "track">("report");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportCode, setReportCode] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingError, setTrackingError] = useState("");
  const [formData, setFormData] = useState({
    crimeType: "",
    description: "",
    location: "",
    dateOfCrime: "",
    reporter: "",
    reporterContact: "",
  });
  const { toast } = useToast();

  const crimeTypes = [
    "Robo",
    "Asalto",
    "Fraude",
    "Corrupción",
    "Tráfico",
    "Secuestro",
    "Homicidio",
    "Violencia Doméstica",
    "Otro",
  ];

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.crimeType || !formData.description || !formData.location) {
      toast({ title: "Error", description: "Complete todos los campos requeridos", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/crime-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "Registrada",
          priority: "Normal",
        }),
      });

      if (!response.ok) throw new Error("Error al registrar denuncia");

      const report = await response.json();
      setReportCode(report.reportCode);
      setFormData({
        crimeType: "",
        description: "",
        location: "",
        dateOfCrime: "",
        reporter: "",
        reporterContact: "",
      });

      toast({
        title: "Denuncia Registrada",
        description: `Código: ${report.reportCode}`,
      });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo registrar la denuncia", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode) return;

    try {
      const response = await fetch(`/api/crime-reports/${trackingCode.toUpperCase()}`);
      if (response.status === 404) {
        setTrackingError("Denuncia no encontrada");
        return;
      }

      if (!response.ok) throw new Error("Error al consultar");

      const data = await response.json();
      setTrackingResult(data);
      setTrackingError("");
    } catch (error) {
      setTrackingError("Error al conectar con el servidor");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resuelta": return "bg-green-100 text-green-800";
      case "En Investigación": return "bg-blue-100 text-blue-800";
      case "Registrada": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Centro Federal de Denuncias</h1>
            <p className="text-gray-500">Sistema de Denuncia de Delitos Federales - PFA</p>
          </div>

          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => { setView("report"); setReportCode(""); }}
              className={`px-6 py-3 font-semibold transition ${
                view === "report"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="inline mr-2 h-4 w-4" />
              Realizar Denuncia
            </button>
            <button
              onClick={() => setView("track")}
              className={`px-6 py-3 font-semibold transition ${
                view === "track"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Search className="inline mr-2 h-4 w-4" />
              Seguimiento
            </button>
          </div>

          <AnimatePresence mode="wait">
            {view === "report" && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {reportCode ? (
                  <Card className="shadow-lg border-t-4 border-t-green-500">
                    <CardContent className="pt-8 text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-4">Denuncia Registrada</h2>
                      <div className="bg-primary/5 p-6 rounded-lg mb-6">
                        <p className="text-sm text-gray-600 mb-2">Código de Denuncia</p>
                        <p className="text-4xl font-mono font-bold text-primary">{reportCode}</p>
                      </div>
                      <p className="text-gray-600 mb-6">Guarde este código para hacer seguimiento de su denuncia.</p>
                      <Button onClick={() => setReportCode("")} className="bg-primary">
                        Nueva Denuncia
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Registrar Nueva Denuncia</CardTitle>
                      <CardDescription>Denuncie delitos federales de forma segura y confidencial</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmitReport} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Tipo de Delito</Label>
                            <Select value={formData.crimeType} onValueChange={(v) => setFormData({ ...formData, crimeType: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {crimeTypes.map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Ubicación del Incidente</Label>
                            <Input
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              placeholder="Zona / Jurisdicción"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Descripción del Incidente</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describa detalladamente lo ocurrido..."
                            className="min-h-32"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Fecha del Incidente</Label>
                            <Input
                              type="datetime-local"
                              value={formData.dateOfCrime}
                              onChange={(e) => setFormData({ ...formData, dateOfCrime: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Nombre del Denunciante</Label>
                            <Input
                              value={formData.reporter}
                              onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
                              placeholder="Su nombre completo"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Contacto (Teléfono/Email)</Label>
                          <Input
                            value={formData.reporterContact}
                            onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
                            placeholder="Método de contacto para seguimiento"
                          />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full bg-primary">
                          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Registrar Denuncia
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {view === "track" && (
              <motion.div
                key="track"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="pt-8">
                    <form onSubmit={handleTrackReport} className="flex gap-4 mb-8">
                      <Input
                        placeholder="Ingrese código (ej: DEN-1234)"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                        className="text-lg font-mono uppercase"
                      />
                      <Button type="submit" className="bg-primary">
                        <Search className="mr-2 h-4 w-4" />
                        Consultar
                      </Button>
                    </form>

                    {trackingError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-3">
                        <AlertTriangle className="h-5 w-5" />
                        {trackingError}
                      </div>
                    )}

                    {trackingResult && (
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Código de Denuncia</p>
                              <p className="text-2xl font-mono font-bold text-primary">{trackingResult.reportCode}</p>
                            </div>
                            <Badge className={getStatusColor(trackingResult.status)}>
                              {trackingResult.status}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Tipo de Delito:</span>
                              <p className="font-semibold">{trackingResult.crimeType}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Ubicación:</span>
                              <p className="font-semibold">{trackingResult.location}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Prioridad:</span>
                              <p className="font-semibold">{trackingResult.priority}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Fecha de Registro:</span>
                              <p className="font-semibold">{new Date(trackingResult.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 border rounded-lg">
                          <p className="text-gray-600 text-sm mb-2">Descripción</p>
                          <p className="text-gray-800">{trackingResult.description}</p>
                        </div>
                      </div>
                    )}
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
