import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Upload, FileCheck, User, Brain, HeartPulse, AlertCircle, BookOpen, Scale } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

// --- VALIDATION SCHEMAS ---

const currentYear = new Date().getFullYear();

// Fix: Apply max() before refine() for better type inference or adjust order. 
// Zod chain order matters. coerce.number().max(65).refine(...) is safer.
const step1Schema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  surname: z.string().min(2, "El apellido es requerido"),
  gender: z.enum(["Masculino", "Femenino", "No Binario"]),
  civilStatus: z.enum(["Soltero", "Casado", "Divorciado", "Separado", "Viudo", "Juntado"]),
  age: z.coerce.number().max(65, "Edad máxima excedida").refine(val => val > 17, { message: "Debe ser mayor de 17 años al 31 de diciembre." }),
  nationality: z.string().min(1, "Seleccione nacionalidad"),
  birthplace: z.string().min(1, "Seleccione lugar de nacimiento"),
  idType: z.string().min(1, "Tipo de documento requerido"),
  idNumber: z.string().min(5, "Número de documento inválido"),
  email: z.string().email("Email inválido (Debe ser real)"),
  discord: z.string().min(3, "Usuario de Discord requerido"),
  roblox: z.string().min(3, "Usuario de Roblox requerido"),
});

const step2Schema = z.object({
  educationLevel: z.enum(["Secundario", "Terciario", "Universitario", "Posgrado/Maestria"]),
  educationTitle: z.string().min(2, "El título obtenido es requerido"),
  hasCriminalRecord: z.enum(["yes", "no"]),
  recordCompetence: z.enum(["Provincial", "Federal", "Ambos"]).optional(),
  recordDescription: z.string().optional(),
  activeCauses: z.enum(["Si", "No", "Desconoce"]).optional(),
}).refine(data => {
  if (data.hasCriminalRecord === "yes") {
    return !!data.recordCompetence && !!data.recordDescription && !!data.activeCauses;
  }
  return true;
}, {
  message: "Debe completar todos los detalles de antecedentes penales",
  path: ["recordDescription"] // Attach error to description field
});

const step3Schema = z.object({
  motive: z.string().min(50, "Desarrolle su respuesta (mínimo 50 caracteres)."),
  exam_1: z.string().min(1, "Respuesta requerida"),
  exam_2: z.string().min(1, "Respuesta requerida"),
  exam_3: z.string().min(1, "Respuesta requerida"),
  exam_4: z.string().min(1, "Respuesta requerida"),
  exam_5: z.string().min(1, "Respuesta requerida"),
});

const step4Schema = z.object({
  medicalDeclaration: z.boolean().refine(val => val === true, "Debe declarar su estado de salud"),
  oathDeclaration: z.boolean().refine(val => val === true, "Debe prestar juramento para continuar"),
});

// --- CONSTANTS ---

const PROVINCES = [
  "Ciudad Autónoma de Buenos Aires", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

const COUNTRIES = [
  "Uruguay", "Brasil", "Paraguay", "Chile", "Bolivia", "Perú", "Colombia", "Venezuela", "Ecuador", "Estados Unidos", "España", "Italia", "Francia", "Alemania", "China", "Japón", "Otro"
];

export default function Incorporation() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});

  const form1 = useForm({ resolver: zodResolver(step1Schema), defaultValues: formData, mode: "onChange" });
  const form2 = useForm({ resolver: zodResolver(step2Schema), defaultValues: formData, mode: "onChange" });
  const form3 = useForm({ resolver: zodResolver(step3Schema), defaultValues: formData, mode: "onChange" });
  const form4 = useForm({ resolver: zodResolver(step4Schema), defaultValues: formData, mode: "onChange" });

  const watchNationality = form1.watch("nationality");
  const watchHasRecord = form2.watch("hasCriminalRecord");

  const goNext = (data: any, nextStep: number) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  const submitFinal = async (data: any) => {
    if (!photo) {
      toast({ title: "Falta fotografía", description: "Debe subir una foto 4x4.", variant: "destructive" });
      return;
    }
    
    const code = `INC-${Math.floor(Math.random() * 900000 + 100000)}`;
    setTrackingCode(code);
    
    const fullData = {
      ...formData,
      ...data,
      photo,
      trackingCode: code,
      hasCriminalRecord: formData.hasCriminalRecord === "yes",
      medicalDeclaration: data.medicalDeclaration,
      oathDeclaration: data.oathDeclaration,
    };
    
    try {
      const response = await fetch('/api/incorporation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData)
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar la solicitud');
      }
      
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "No se pudo enviar la solicitud. Intente nuevamente.", 
        variant: "destructive" 
      });
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50">
          <Card className="max-w-xl w-full border-t-4 border-t-secondary shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <FileCheck className="h-10 w-10 text-green-700" />
              </div>
              <CardTitle className="text-3xl font-serif text-primary">Solicitud Enviada</CardTitle>
              <CardDescription className="text-lg">División Incorporaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Código de Seguimiento</p>
                <p className="text-4xl font-mono font-bold text-primary tracking-widest selection:bg-secondary">{trackingCode}</p>
                <p className="text-xs text-gray-400 mt-2">Guarde este código. Lo necesitará para consultar el estado de su trámite.</p>
              </div>
              
              <div className="text-left space-y-4 text-sm text-gray-600 bg-white p-4 rounded border">
                <p><strong>Declaración Jurada Recibida.</strong></p>
                <p>Su legajo ha sido abierto y se encuentra en estado <strong>"En Revisión"</strong>. Un oficial verificará sus antecedentes y respuestas del examen.</p>
                <p>Puede consultar el estado en la sección "Estado de Trámite" del portal.</p>
              </div>

              <div className="pt-4 flex gap-4">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">Volver al Inicio</Button>
                </Link>
                <Link href="/seguimiento" className="flex-1">
                  <Button className="w-full bg-primary text-white">Ir a Seguimiento</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-primary pb-32 pt-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">Formulario Oficial de Incorporación</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Proceso de selección para aspirantes a la Policía Federal Argentina.
            <br />
            <span className="text-secondary text-sm font-bold uppercase tracking-wider">Capital Federal | Roblox Game</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 pb-20 relative z-20">
        <Card className="max-w-5xl mx-auto shadow-2xl border-none">
          {/* Enhanced Progress Header */}
          <div className="bg-white border-b px-6 py-6 rounded-t-xl">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Expediente de Ingreso</h2>
               <Badge variant="outline" className="text-primary border-primary">Fase {step} de 4</Badge>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary transition-all duration-500 ease-out"
                />
              </div>
              <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-tighter md:tracking-normal">
                <span className={step >= 1 ? "text-primary" : ""}>1. Datos Personales</span>
                <span className={step >= 2 ? "text-primary" : ""}>2. Antecedentes</span>
                <span className={step >= 3 ? "text-primary" : ""}>3. Examen</span>
                <span className={step >= 4 ? "text-primary" : ""}>4. Legajo</span>
              </div>
            </div>
          </div>

          <CardContent className="p-6 md:p-10 min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* STEP 1: PERSONAL DATA */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form1.handleSubmit((data) => goNext(data, 2))}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="border-b pb-2 mb-4">
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                          <User className="h-5 w-5 text-secondary" /> Identidad del Personaje (IC)
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre(s) <span className="text-red-500">*</span></Label>
                          <Input id="name" {...form1.register("name")} className="bg-slate-50" />
                          {form1.formState.errors.name && <p className="text-red-500 text-xs">{String(form1.formState.errors.name.message)}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="surname">Apellido(s) <span className="text-red-500">*</span></Label>
                          <Input id="surname" {...form1.register("surname")} className="bg-slate-50" />
                          {form1.formState.errors.surname && <p className="text-red-500 text-xs">{String(form1.formState.errors.surname.message)}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                          <Label>Género</Label>
                          <Controller
                            control={form1.control}
                            name="gender"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger> <SelectValue placeholder="Seleccione" /> </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Masculino">Masculino</SelectItem>
                                  <SelectItem value="Femenino">Femenino</SelectItem>
                                  <SelectItem value="No Binario">No Binario</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Estado Civil</Label>
                           <Controller
                            control={form1.control}
                            name="civilStatus"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger> <SelectValue placeholder="Seleccione" /> </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Soltero">Soltero/a</SelectItem>
                                  <SelectItem value="Casado">Casado/a</SelectItem>
                                  <SelectItem value="Divorciado">Divorciado/a</SelectItem>
                                  <SelectItem value="Separado">Separado/a</SelectItem>
                                  <SelectItem value="Viudo">Viudo/a</SelectItem>
                                  <SelectItem value="Juntado">Juntado/a</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Edad (IC)</Label>
                        <Input id="age" type="number" {...form1.register("age")} placeholder="Ej: 21" />
                        <p className="text-[10px] text-gray-500">Debe ser mayor de 17 años al 31/12 del año en curso.</p>
                        {form1.formState.errors.age && <p className="text-red-500 text-xs font-bold">{String(form1.formState.errors.age.message)}</p>}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 space-y-2">
                          <Label>Tipo ID</Label>
                          <Controller
                            control={form1.control}
                            name="idType"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger> <SelectValue placeholder="Tipo" /> </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="DNI">DNI</SelectItem>
                                  <SelectItem value="Cedula">Cédula</SelectItem>
                                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                  <SelectItem value="Visa">Visa</SelectItem>
                                  <SelectItem value="Orden Legitima">Orden Legítima</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="idNumber">N° Identificación</Label>
                          <Input id="idNumber" {...form1.register("idNumber")} />
                        </div>
                      </div>
                       {form1.formState.errors.idType && <p className="text-red-500 text-xs">{String(form1.formState.errors.idType.message)}</p>}
                       {form1.formState.errors.idNumber && <p className="text-red-500 text-xs">{String(form1.formState.errors.idNumber.message)}</p>}
                    </div>

                    <div className="space-y-6">
                      <div className="border-b pb-2 mb-4">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                          Origen y Contacto
                        </h3>
                      </div>

                      <div className="space-y-4">
                         <div className="space-y-2">
                          <Label>Nacionalidad</Label>
                           <Controller
                            control={form1.control}
                            name="nationality"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger> <SelectValue placeholder="Seleccione Nacionalidad" /> </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Argentina">Argentina</SelectItem>
                                  <SelectItem value="Argentina Naturalizado">Argentina (Naturalizado)</SelectItem>
                                  <SelectItem value="Extranjero">Extranjero (Otra)</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Lugar de Nacimiento</Label>
                          <Controller
                            control={form1.control}
                            name="birthplace"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchNationality}>
                                <SelectTrigger> 
                                  <SelectValue placeholder={watchNationality ? "Seleccione Lugar" : "Seleccione Nacionalidad primero"} /> 
                                </SelectTrigger>
                                <SelectContent>
                                  {(watchNationality === "Argentina" || watchNationality === "Argentina Naturalizado") ? (
                                    PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)
                                  ) : (
                                    COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border space-y-4 mt-6">
                        <h4 className="text-sm font-bold text-gray-500 uppercase">Datos de Contacto (OOC)</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo Electrónico (Real)</Label>
                          <Input id="email" {...form1.register("email")} placeholder="ejemplo@email.com" />
                          <p className="text-[10px] text-gray-400">Canal oficial de comunicación.</p>
                          {form1.formState.errors.email && <p className="text-red-500 text-xs">{String(form1.formState.errors.email.message)}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="discord">Usuario Discord</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-400 text-xs">@</span>
                              <Input id="discord" {...form1.register("discord")} className="pl-6" />
                            </div>
                            {form1.formState.errors.discord && <p className="text-red-500 text-xs">{String(form1.formState.errors.discord.message)}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="roblox">Usuario Roblox</Label>
                            <Input id="roblox" {...form1.register("roblox")} />
                            {form1.formState.errors.roblox && <p className="text-red-500 text-xs">{String(form1.formState.errors.roblox.message)}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t mt-6">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-lg shadow-lg">
                      Siguiente Etapa <ChevronRight className="ml-2" />
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* STEP 2: EDUCATION & BACKGROUND */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form2.handleSubmit((data) => goNext(data, 3))}
                  className="space-y-8"
                >
                   <div className="space-y-8">
                     {/* Education */}
                     <div className="space-y-4">
                       <div className="flex items-center gap-2 mb-2">
                         <BookOpen className="text-secondary h-6 w-6" />
                         <h3 className="text-xl font-bold text-primary font-serif">Formación Académica</h3>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <Label>Máximo Nivel Alcanzado</Label>
                           <Controller
                              control={form2.control}
                              name="educationLevel"
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger> <SelectValue placeholder="Seleccione Nivel" /> </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Secundario">Secundario Completo</SelectItem>
                                    <SelectItem value="Terciario">Terciario</SelectItem>
                                    <SelectItem value="Universitario">Universitario</SelectItem>
                                    <SelectItem value="Posgrado/Maestria">Posgrado / Maestría</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                         </div>
                         <div className="space-y-2">
                           <Label htmlFor="educationTitle">Título Obtenido</Label>
                           <Input id="educationTitle" {...form2.register("educationTitle")} placeholder="Ej: Bachiller en Economía" />
                           {form2.formState.errors.educationTitle && <p className="text-red-500 text-xs">{String(form2.formState.errors.educationTitle.message)}</p>}
                         </div>
                       </div>
                     </div>

                     <Separator />

                     {/* Criminal Record */}
                     <div className="space-y-4">
                       <div className="flex items-center gap-2 mb-2">
                         <Scale className="text-secondary h-6 w-6" />
                         <h3 className="text-xl font-bold text-primary font-serif">Antecedentes Penales</h3>
                       </div>

                       <div className="bg-slate-50 border p-6 rounded-lg space-y-6">
                          <div className="space-y-2">
                            <Label className="text-base">¿Posee antecedentes penales?</Label>
                            <Controller
                              control={form2.control}
                              name="hasCriminalRecord"
                              render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-6 mt-2">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="rec-no" />
                                    <Label htmlFor="rec-no" className="font-normal cursor-pointer">NO</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="rec-yes" />
                                    <Label htmlFor="rec-yes" className="font-normal cursor-pointer">SÍ</Label>
                                  </div>
                                </RadioGroup>
                              )}
                            />
                          </div>

                          <AnimatePresence>
                            {watchHasRecord === "yes" && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-6 pt-4 border-t border-slate-200"
                              >
                                <div className="space-y-2">
                                  <Label>Competencia</Label>
                                  <Controller
                                    control={form2.control}
                                    name="recordCompetence"
                                    render={({ field }) => (
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger> <SelectValue placeholder="Seleccione Competencia" /> </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Provincial">Provincial</SelectItem>
                                          <SelectItem value="Federal">Federal</SelectItem>
                                          <SelectItem value="Ambos">Ambos</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Descripción de Antecedentes y Fechas</Label>
                                  <Textarea {...form2.register("recordDescription")} placeholder="Detalle carátula, fecha y resolución..." />
                                  {form2.formState.errors.recordDescription && <p className="text-red-500 text-xs">{String(form2.formState.errors.recordDescription.message)}</p>}
                                </div>

                                <div className="space-y-2">
                                  <Label>¿Posee causas activas actualmente?</Label>
                                   <Controller
                                    control={form2.control}
                                    name="activeCauses"
                                    render={({ field }) => (
                                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Si" id="cause-yes" />
                                          <Label htmlFor="cause-yes">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="No" id="cause-no" />
                                          <Label htmlFor="cause-no">No</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Desconoce" id="cause-dk" />
                                          <Label htmlFor="cause-dk">Desconoce</Label>
                                        </div>
                                      </RadioGroup>
                                    )}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                     </div>
                   </div>

                   <div className="flex justify-between pt-6 border-t mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="px-6">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-lg shadow-lg">
                      Siguiente Etapa <ChevronRight className="ml-2" />
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: EXAM */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form3.handleSubmit((data) => goNext(data, 4))}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                     <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 flex gap-3">
                       <Brain className="text-yellow-600 h-6 w-6 flex-shrink-0" />
                       <div>
                         <h4 className="font-bold text-yellow-800 text-sm">Evaluación Psicotécnica y de Conocimiento</h4>
                         <p className="text-xs text-yellow-700 mt-1">Responda con honestidad. Sus respuestas serán analizadas por el gabinete psicológico.</p>
                       </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="motive" className="text-lg font-bold text-primary">¿Por qué desea ingresar a la Policía Federal Argentina?</Label>
                        <Textarea 
                          id="motive" 
                          {...form3.register("motive")} 
                          placeholder="Desarrolle su respuesta (Mínimo 50 caracteres)..."
                          className="min-h-[150px]"
                        />
                        {form3.formState.errors.motive && <p className="text-red-500 text-xs">{String(form3.formState.errors.motive.message)}</p>}
                      </div>

                      <Separator />

                      <div className="space-y-6">
                         <h3 className="font-bold text-gray-700">Cuestionario de Situación Policial</h3>
                         
                         <div className="space-y-4">
                           <div className="border p-4 rounded-lg bg-slate-50">
                             <Label className="font-semibold mb-2 block">1. En una persecución a pie, el sospechoso arroja el arma y levanta las manos. ¿Cómo procede?</Label>
                             <Controller
                                control={form3.control}
                                name="exam_1"
                                render={({ field }) => (
                                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="e1a" /><Label htmlFor="e1a">Disparo preventivamente para asegurar.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="e1b" /><Label htmlFor="e1b">Me abalanzo sobre él y lo golpeo para reducirlo.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="e1c" /><Label htmlFor="e1c">Le ordeno tirarse al suelo, mantengo distancia y procedo al esposamiento.</Label></div>
                                  </RadioGroup>
                                )}
                              />
                               {form3.formState.errors.exam_1 && <p className="text-red-500 text-xs">Requerido</p>}
                           </div>

                           <div className="border p-4 rounded-lg bg-slate-50">
                             <Label className="font-semibold mb-2 block">2. Definición de "Uso Racional de la Fuerza":</Label>
                             <Controller
                                control={form3.control}
                                name="exam_2"
                                render={({ field }) => (
                                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="e2a" /><Label htmlFor="e2a">Usar siempre el arma de fuego ante cualquier amenaza.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="e2b" /><Label htmlFor="e2b">Utilizar el nivel de fuerza necesario y proporcional a la resistencia ofrecida.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="e2c" /><Label htmlFor="e2c">Dialogar siempre, nunca usar la fuerza física.</Label></div>
                                  </RadioGroup>
                                )}
                              />
                              {form3.formState.errors.exam_2 && <p className="text-red-500 text-xs">Requerido</p>}
                           </div>

                           <div className="border p-4 rounded-lg bg-slate-50">
                             <Label className="font-semibold mb-2 block">3. ¿Qué es la "Cadena de Mando"?</Label>
                             <Controller
                                control={form3.control}
                                name="exam_3"
                                render={({ field }) => (
                                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="e3a" /><Label htmlFor="e3a">Una sugerencia de organización opcional.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="e3b" /><Label htmlFor="e3b">La estructura jerárquica de autoridad y responsabilidad.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="e3c" /><Label htmlFor="e3c">Una herramienta para detenciones.</Label></div>
                                  </RadioGroup>
                                )}
                              />
                              {form3.formState.errors.exam_3 && <p className="text-red-500 text-xs">Requerido</p>}
                           </div>

                           <div className="border p-4 rounded-lg bg-slate-50">
                             <Label className="font-semibold mb-2 block">4. Observa a un compañero aceptando un soborno. ¿Acción?</Label>
                             <Controller
                                control={form3.control}
                                name="exam_4"
                                render={({ field }) => (
                                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="e4a" /><Label htmlFor="e4a">Lo ignoro, no es mi problema.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="e4b" /><Label htmlFor="e4b">Le pido una parte del dinero.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="e4c" /><Label htmlFor="e4c">Reporto inmediatamente el incidente a Asuntos Internos / Superior.</Label></div>
                                  </RadioGroup>
                                )}
                              />
                              {form3.formState.errors.exam_4 && <p className="text-red-500 text-xs">Requerido</p>}
                           </div>

                           <div className="border p-4 rounded-lg bg-slate-50">
                             <Label className="font-semibold mb-2 block">5. ¿Cuál es la prioridad máxima en una situación de rehenes?</Label>
                             <Controller
                                control={form3.control}
                                name="exam_5"
                                render={({ field }) => (
                                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="e5a" /><Label htmlFor="e5a">Abatir a los secuestradores a toda costa.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="e5b" /><Label htmlFor="e5b">Preservar la vida de los rehenes y civiles.</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="e5c" /><Label htmlFor="e5c">Recuperar el dinero robado.</Label></div>
                                  </RadioGroup>
                                )}
                              />
                              {form3.formState.errors.exam_5 && <p className="text-red-500 text-xs">Requerido</p>}
                           </div>
                         </div>
                      </div>
                  </div>

                   <div className="flex justify-between pt-6 border-t mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="px-6">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-lg shadow-lg">
                      Siguiente Etapa <ChevronRight className="ml-2" />
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* STEP 4: DOCUMENTATION & OATH */}
              {step === 4 && (
                <motion.form
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form4.handleSubmit(submitFinal)}
                  className="space-y-8"
                >
                   <div className="space-y-8">
                     <div className="text-center space-y-2">
                       <h2 className="text-2xl font-serif font-bold text-primary">Conformación de Legajo</h2>
                       <p className="text-gray-500">Último paso antes de enviar su solicitud.</p>
                     </div>

                     <div className="flex flex-col md:flex-row gap-8 items-start">
                       {/* Photo */}
                       <div className="w-full md:w-1/3">
                         <div className="bg-slate-50 border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center text-center">
                            <Label className="mb-4 font-bold text-gray-700">Foto 4x4 (Fondo Blanco)</Label>
                            <div 
                              className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden relative cursor-pointer group shadow-inner"
                              onClick={() => setPhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=" + Math.random())}
                            >
                              {photo ? (
                                <img src={photo} className="w-full h-full object-cover" alt="Foto" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <User className="h-16 w-16" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-medium text-xs"><Upload className="h-4 w-4 mx-auto mb-1"/> Cargar Foto</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Haga clic para simular carga</p>
                         </div>
                       </div>

                       {/* Declarations */}
                       <div className="w-full md:w-2/3 space-y-6">
                          <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><HeartPulse className="h-5 w-5 text-red-500" /> Declaración de Salud</h4>
                            <div className="flex items-start gap-3">
                              <Controller
                                control={form4.control}
                                name="medicalDeclaration"
                                render={({ field }) => (
                                  <Checkbox id="med" checked={field.value} onCheckedChange={field.onChange} />
                                )}
                              />
                              <Label htmlFor="med" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                                Declaro no poseer impedimentos físicos ni psicológicos que afecten mi desempeño operativo. Comprendo que seré sometido a exámenes exhaustivos.
                              </Label>
                            </div>
                            {form4.formState.errors.medicalDeclaration && <p className="text-red-500 text-xs ml-8 mt-1">Requerido</p>}
                          </div>

                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm">
                            <h4 className="font-bold text-primary mb-4 flex items-center gap-2"><Scale className="h-5 w-5" /> Juramento Oficial</h4>
                            <div className="flex items-start gap-3">
                              <Controller
                                control={form4.control}
                                name="oathDeclaration"
                                render={({ field }) => (
                                  <Checkbox id="oath" checked={field.value} onCheckedChange={field.onChange} />
                                )}
                              />
                              <Label htmlFor="oath" className="text-sm font-medium text-primary leading-relaxed cursor-pointer text-justify">
                                "Declaro bajo juramento que los datos consignados en el presente formulario son veraces y exactos, conociendo las penalidades previstas en el Código Penal para el falso testimonio y la falsificación de documentos en Capital Federal | Roblox Game."
                              </Label>
                            </div>
                            {form4.formState.errors.oathDeclaration && <p className="text-red-500 text-xs ml-8 mt-1">Debe aceptar el juramento</p>}
                          </div>
                       </div>
                     </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(3)} className="px-6">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-12 py-6 text-lg shadow-xl transform transition hover:scale-105">
                      FINALIZAR INSCRIPCIÓN
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
