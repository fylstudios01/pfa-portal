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
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Upload, FileCheck, User, Brain, HeartPulse, AlertCircle } from "lucide-react";
import { Link } from "wouter";

// --- VALIDATION SCHEMAS ---

const currentYear = new Date().getFullYear();

const step1Schema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  surname: z.string().min(2, "El apellido es requerido"),
  age: z.coerce.number().min(17, "Debes tener al menos 17 años para ingresar").max(65, "Edad máxima excedida"),
  nationality: z.string().min(1, "Seleccione nacionalidad"),
  birthplace: z.string().min(1, "Seleccione lugar de nacimiento"),
  idType: z.string().min(1, "Tipo de documento requerido"),
  idNumber: z.string().min(5, "Número de documento inválido"),
  email: z.string().email("Email inválido"),
  discord: z.string().min(3, "Usuario de Discord requerido"),
  roblox: z.string().min(3, "Usuario de Roblox requerido"),
});

const step2Schema = z.object({
  motive: z.string().min(20, "Por favor, detalle su motivo con al menos 20 caracteres."),
  q_chain: z.enum(["correct", "incorrect"]),
  q_force: z.enum(["correct", "incorrect"]),
  q_procedure: z.enum(["correct", "incorrect"]),
});

const step3Schema = z.object({
  height: z.coerce.number().min(150, "Altura mínima 150cm").max(220, "Altura máxima excedida"),
  weight: z.coerce.number().min(45, "Peso mínimo 45kg"),
  bloodType: z.string().min(1, "Grupo sanguíneo requerido"),
  hasCriminalRecord: z.enum(["yes", "no"]),
  recordDetail: z.string().optional(),
  medicalDeclaration: z.boolean().refine(val => val === true, "Debe declarar su estado de salud"),
  legalDeclaration: z.boolean().refine(val => val === true, "Debe aceptar la declaración jurada"),
});

// --- CONSTANTS ---

const PROVINCES = [
  "Ciudad Autónoma de Buenos Aires", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

const COUNTRIES = [
  "Uruguay", "Brasil", "Paraguay", "Chile", "Bolivia", "Perú", "Colombia", "Venezuela", "Ecuador", "Estados Unidos", "España", "Italia", "Otro"
];

export default function Incorporation() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const { toast } = useToast();

  // Unified Form Data State
  const [formData, setFormData] = useState<any>({});

  // Individual Form Hooks for each step to handle validation easily
  const form1 = useForm({ resolver: zodResolver(step1Schema), defaultValues: formData });
  const form2 = useForm({ resolver: zodResolver(step2Schema), defaultValues: formData });
  const form3 = useForm({ resolver: zodResolver(step3Schema), defaultValues: formData });

  const watchNationality = form1.watch("nationality");
  const watchCriminalRecord = form3.watch("hasCriminalRecord");

  const onSubmitStep1 = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep(2);
    window.scrollTo(0, 0);
  };

  const onSubmitStep2 = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep(3);
    window.scrollTo(0, 0);
  };

  const onSubmitStep3 = (data: any) => {
    if (!photo) {
      toast({
        title: "Falta la fotografía",
        description: "Debe cargar una foto 4x4 para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    setFormData((prev: any) => ({ ...prev, ...data, photo }));
    
    // Simulate API submission
    setTimeout(() => {
      const code = `INC-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      setTrackingCode(code);
      setSuccess(true);
      
      // Save to localStorage for Admin Demo
      const existing = JSON.parse(localStorage.getItem('pfa_requests') || '[]');
      const newRequest = {
        id: code,
        date: new Date().toISOString(),
        status: 'Pendiente',
        ...formData,
        ...data,
        photo // In real app, this would be a URL
      };
      localStorage.setItem('pfa_requests', JSON.stringify([newRequest, ...existing]));
      
      window.scrollTo(0, 0);
    }, 1500);
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
              <CardTitle className="text-3xl font-serif text-primary">Solicitud Recibida</CardTitle>
              <CardDescription className="text-lg">División Incorporaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Código de Seguimiento</p>
                <p className="text-4xl font-mono font-bold text-primary tracking-widest">{trackingCode}</p>
              </div>
              
              <div className="text-left space-y-4 text-sm text-gray-600 bg-white p-4 rounded border">
                <p><strong>Estimado/a postulante:</strong></p>
                <p>Su solicitud ha sido ingresada correctamente en nuestro sistema. El departamento de Recursos Humanos evaluará su perfil en las próximas 48-72 horas hábiles.</p>
                <p>Por favor, mantenga este código y esté atento a su Discord proporcionado para la notificación de la entrevista.</p>
                <p className="text-xs italic mt-4 text-center text-gray-400">Policía Federal Argentina - Capital Federal | Roblox Game</p>
              </div>

              <div className="pt-4">
                <Link href="/">
                  <Button className="w-full">Volver al Inicio</Button>
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
      <div className="bg-primary pb-24 pt-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Formulario de Incorporación</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Complete todos los pasos con información verídica de su personaje (IC). La falsificación de datos resultará en la anulación inmediata.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20">
        <Card className="max-w-4xl mx-auto shadow-2xl border-none">
          {/* Progress Header */}
          <div className="bg-slate-50 border-b px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Progreso de Solicitud</span>
              <span className="text-xs font-bold text-primary">Paso {step} de 3</span>
            </div>
            <Progress value={(step / 3) * 100} className="h-2" />
            <div className="flex justify-between mt-4 text-xs md:text-sm font-medium text-gray-500">
              <div className={step >= 1 ? "text-primary flex items-center gap-2" : "opacity-50 flex items-center gap-2"}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}>1</div>
                <span className="hidden md:inline">Datos Personales</span>
              </div>
              <div className={step >= 2 ? "text-primary flex items-center gap-2" : "opacity-50 flex items-center gap-2"}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}>2</div>
                <span className="hidden md:inline">Examen de Rol</span>
              </div>
              <div className={step >= 3 ? "text-primary flex items-center gap-2" : "opacity-50 flex items-center gap-2"}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}>3</div>
                <span className="hidden md:inline">Documentación</span>
              </div>
            </div>
          </div>

          <CardContent className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form1.handleSubmit(onSubmitStep1)}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="text-secondary h-6 w-6" />
                      <h2 className="text-xl font-bold text-primary font-serif">Datos del Personaje (IC)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre(s)</Label>
                        <Input id="name" {...form1.register("name")} placeholder="Ej: Juan Antonio" />
                        {form1.formState.errors.name && <p className="text-red-500 text-xs">{String(form1.formState.errors.name.message)}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="surname">Apellido(s)</Label>
                        <Input id="surname" {...form1.register("surname")} placeholder="Ej: Pérez" />
                        {form1.formState.errors.surname && <p className="text-red-500 text-xs">{String(form1.formState.errors.surname.message)}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="age">Edad</Label>
                        <Input id="age" type="number" {...form1.register("age")} placeholder="18" />
                        <p className="text-[10px] text-gray-400">Debe ser mayor de 17 años al 31/12 de este año.</p>
                        {form1.formState.errors.age && <p className="text-red-500 text-xs">{String(form1.formState.errors.age.message)}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo ID</Label>
                          <Controller
                            control={form1.control}
                            name="idType"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="DNI">DNI</SelectItem>
                                  <SelectItem value="Cedula">Cédula</SelectItem>
                                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                  <SelectItem value="Visa">Visa</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {form1.formState.errors.idType && <p className="text-red-500 text-xs">{String(form1.formState.errors.idType.message)}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="idNumber">Número</Label>
                          <Input id="idNumber" {...form1.register("idNumber")} placeholder="12345678" />
                          {form1.formState.errors.idNumber && <p className="text-red-500 text-xs">{String(form1.formState.errors.idNumber.message)}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Nacionalidad</Label>
                        <Controller
                          control={form1.control}
                          name="nationality"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione Nacionalidad" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Argentina">Argentina</SelectItem>
                                <SelectItem value="Extranjero">Extranjero</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {form1.formState.errors.nationality && <p className="text-red-500 text-xs">{String(form1.formState.errors.nationality.message)}</p>}
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
                                {watchNationality === "Argentina" ? (
                                  PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)
                                ) : (
                                  COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {form1.formState.errors.birthplace && <p className="text-red-500 text-xs">{String(form1.formState.errors.birthplace.message)}</p>}
                      </div>
                    </div>

                    <Separator />
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary text-white text-xs px-2 py-0.5 rounded font-bold">OOC</div>
                      <h3 className="text-lg font-bold text-gray-700">Datos de Contacto Real</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...form1.register("email")} placeholder="tu@email.com" />
                         {form1.formState.errors.email && <p className="text-red-500 text-xs">{String(form1.formState.errors.email.message)}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discord">Usuario Discord</Label>
                        <Input id="discord" {...form1.register("discord")} placeholder="usuario#0000" />
                         {form1.formState.errors.discord && <p className="text-red-500 text-xs">{String(form1.formState.errors.discord.message)}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roblox">Usuario Roblox</Label>
                        <Input id="roblox" {...form1.register("roblox")} placeholder="UsuarioRoblox" />
                         {form1.formState.errors.roblox && <p className="text-red-500 text-xs">{String(form1.formState.errors.roblox.message)}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8">
                      Siguiente Etapa <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form2.handleSubmit(onSubmitStep2)}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Brain className="text-secondary h-6 w-6" />
                      <h2 className="text-xl font-bold text-primary font-serif">Examen Psicotécnico y de Rol</h2>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="motive" className="text-base font-semibold">¿Por qué desea ingresar a la Policía Federal Argentina?</Label>
                      <Textarea 
                        id="motive" 
                        {...form2.register("motive")} 
                        placeholder="Describa sus motivaciones y qué puede aportar a la fuerza..."
                        className="min-h-[120px]"
                      />
                      {form2.formState.errors.motive && <p className="text-red-500 text-xs">{String(form2.formState.errors.motive.message)}</p>}
                    </div>

                    <Separator />

                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-700">Cuestionario de Situación</h3>
                      
                      <div className="space-y-3 bg-slate-50 p-4 rounded-lg border">
                        <Label className="text-sm font-semibold text-gray-800">1. Un superior le da una orden directa que contradice levemente un procedimiento habitual pero no es ilegal. ¿Qué hace?</Label>
                        <Controller
                          control={form2.control}
                          name="q_chain"
                          render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="incorrect" id="q1-a" />
                                <Label htmlFor="q1-a" className="font-normal cursor-pointer">Me niego y le explico el procedimiento correcto.</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="correct" id="q1-b" />
                                <Label htmlFor="q1-b" className="font-normal cursor-pointer">Obedezco la orden, ya que la cadena de mando es prioritaria y no es una orden ilegal.</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="incorrect_2" id="q1-c" />
                                <Label htmlFor="q1-c" className="font-normal cursor-pointer">Ignoro la orden y hago lo que creo mejor.</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                         {form2.formState.errors.q_chain && <p className="text-red-500 text-xs">Seleccione una opción</p>}
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-lg border">
                        <Label className="text-sm font-semibold text-gray-800">2. Un civil lo insulta durante un procedimiento de tránsito. ¿Cuál es su reacción?</Label>
                        <Controller
                          control={form2.control}
                          name="q_force"
                          render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="incorrect" id="q2-a" />
                                <Label htmlFor="q2-a" className="font-normal cursor-pointer">Lo detengo inmediatamente por desacato.</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="incorrect_2" id="q2-b" />
                                <Label htmlFor="q2-b" className="font-normal cursor-pointer">Le respondo con el mismo tono para imponer autoridad.</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="correct" id="q2-c" />
                                <Label htmlFor="q2-c" className="font-normal cursor-pointer">Mantengo la calma, ignoro los insultos verbales y continúo con el procedimiento profesionalmente.</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                        {form2.formState.errors.q_force && <p className="text-red-500 text-xs">Seleccione una opción</p>}
                      </div>
                      
                      <div className="space-y-3 bg-slate-50 p-4 rounded-lg border">
                        <Label className="text-sm font-semibold text-gray-800">3. Encuentra un vehículo mal estacionado bloqueando una rampa. ¿Procedimiento?</Label>
                        <Controller
                          control={form2.control}
                          name="q_procedure"
                          render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="correct" id="q3-a" />
                                <Label htmlFor="q3-a" className="font-normal cursor-pointer">Labro la infracción correspondiente y solicito grúa si es necesario.</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="incorrect" id="q3-b" />
                                <Label htmlFor="q3-b" className="font-normal cursor-pointer">Espero al dueño para advertirle verbalmente.</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                        {form2.formState.errors.q_procedure && <p className="text-red-500 text-xs">Seleccione una opción</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="border-primary/20">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8">
                      Siguiente Etapa <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={form3.handleSubmit(onSubmitStep3)}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <HeartPulse className="text-secondary h-6 w-6" />
                      <h2 className="text-xl font-bold text-primary font-serif">Documentación y Medicina</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Photo Uploader Simulation */}
                      <div className="space-y-3">
                         <Label className="block font-semibold">Fotografía 4x4 (Rostro visible)</Label>
                         <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden group"
                            onClick={() => {
                              // Simulate upload
                              setPhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=" + Math.random());
                            }}
                         >
                           {photo ? (
                             <img src={photo} alt="Vista previa" className="h-full w-auto object-cover rounded shadow-sm" />
                           ) : (
                             <>
                               <Upload className="h-10 w-10 text-gray-400 mb-2 group-hover:text-primary transition-colors" />
                               <span className="text-sm text-gray-500">Haga clic para subir foto</span>
                               <span className="text-xs text-gray-400 mt-1">(Simulación)</span>
                             </>
                           )}
                           {photo && (
                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="text-white text-sm font-medium">Cambiar Foto</span>
                             </div>
                           )}
                         </div>
                      </div>

                      {/* Medical Data */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="height">Altura (cm)</Label>
                            <Input id="height" type="number" {...form3.register("height")} placeholder="175" />
                             {form3.formState.errors.height && <p className="text-red-500 text-xs">{String(form3.formState.errors.height.message)}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="weight">Peso (kg)</Label>
                            <Input id="weight" type="number" {...form3.register("weight")} placeholder="75" />
                             {form3.formState.errors.weight && <p className="text-red-500 text-xs">{String(form3.formState.errors.weight.message)}</p>}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Grupo Sanguíneo</Label>
                          <Controller
                            control={form3.control}
                            name="bloodType"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A+">A+</SelectItem>
                                  <SelectItem value="A-">A-</SelectItem>
                                  <SelectItem value="B+">B+</SelectItem>
                                  <SelectItem value="B-">B-</SelectItem>
                                  <SelectItem value="AB+">AB+</SelectItem>
                                  <SelectItem value="AB-">AB-</SelectItem>
                                  <SelectItem value="O+">O+</SelectItem>
                                  <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                           {form3.formState.errors.bloodType && <p className="text-red-500 text-xs">{String(form3.formState.errors.bloodType.message)}</p>}
                        </div>

                        <div className="space-y-2 border p-3 rounded bg-slate-50">
                          <Label className="text-sm font-semibold">Antecedentes Penales</Label>
                          <Controller
                            control={form3.control}
                            name="hasCriminalRecord"
                            render={({ field }) => (
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 mt-2">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="rec-no" />
                                  <Label htmlFor="rec-no" className="font-normal cursor-pointer">No poseo</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="rec-yes" />
                                  <Label htmlFor="rec-yes" className="font-normal cursor-pointer">Sí poseo</Label>
                                </div>
                              </RadioGroup>
                            )}
                          />
                        </div>

                        {watchCriminalRecord === "yes" && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="space-y-2"
                          >
                            <Label htmlFor="recordDetail">Detalle de Causas</Label>
                            <Textarea 
                              id="recordDetail" 
                              {...form3.register("recordDetail")} 
                              placeholder="Especifique jurisdicción, fecha y carátula..." 
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4 bg-yellow-50 p-4 rounded border border-yellow-200">
                      <div className="flex items-start gap-3">
                         <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                         <h4 className="font-bold text-yellow-800 text-sm">Declaración Jurada</h4>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Controller
                          control={form3.control}
                          name="medicalDeclaration"
                          render={({ field }) => (
                            <Checkbox 
                              id="medical" 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          )}
                        />
                        <Label htmlFor="medical" className="text-xs text-gray-700 leading-tight cursor-pointer">
                          Declaro que los datos médicos proporcionados son reales y que no poseo condiciones físicas o psicológicas que me impidan ejercer la labor policial.
                        </Label>
                      </div>
                      {form3.formState.errors.medicalDeclaration && <p className="text-red-500 text-xs ml-6">{String(form3.formState.errors.medicalDeclaration.message)}</p>}

                      <div className="flex items-start space-x-2">
                        <Controller
                          control={form3.control}
                          name="legalDeclaration"
                          render={({ field }) => (
                            <Checkbox 
                              id="legal" 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          )}
                        />
                        <Label htmlFor="legal" className="text-xs text-gray-700 leading-tight cursor-pointer">
                          Entiendo que esta es una solicitud para una facción de Roleplay (Capital Federal | Roblox Game). Declaro que los datos IC son verídicos para mi personaje y acepto las normativas internas de la facción.
                        </Label>
                      </div>
                      {form3.formState.errors.legalDeclaration && <p className="text-red-500 text-xs ml-6">{String(form3.formState.errors.legalDeclaration.message)}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="border-primary/20">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-8 shadow-lg">
                      ENVIAR SOLICITUD <FileCheck className="ml-2 h-4 w-4" />
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
