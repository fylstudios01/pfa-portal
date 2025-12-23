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
import { Check, ChevronRight, ChevronLeft, Upload, FileCheck, User, Brain, HeartPulse, AlertCircle, BookOpen, Scale, Image } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const currentYear = new Date().getFullYear();

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
  path: ["recordDescription"]
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
  oathDeclaration: z.boolean().refine(val => val === true, "Debe prestar juramento para continuar"),
});

const step5Schema = z.object({
  bloodType: z.string().min(1, "Tipo de sangre requerido"),
  height: z.string().min(1, "Altura requerida"),
  weight: z.string().min(1, "Peso requerido"),
  healthConditions: z.string().optional(),
  medicalDeclarationCheck: z.boolean().refine(val => val === true, "Debe aceptar la declaración médica"),
});

const step6Schema = z.object({
  formalLetterAccepted: z.boolean().refine(val => val === true, "Debe aceptar la carta formal"),
});

const PROVINCES = [
  "Ciudad Autónoma de Buenos Aires", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

const COUNTRIES = [
  "Uruguay", "Brasil", "Paraguay", "Chile", "Bolivia", "Perú", "Colombia", "Venezuela", "Ecuador", "Estados Unidos", "España", "Italia", "Francia", "Alemania", "China", "Japón", "Otro"
];

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function Incorporation() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});

  const form1 = useForm({ resolver: zodResolver(step1Schema), defaultValues: formData, mode: "onChange" });
  const form2 = useForm({ resolver: zodResolver(step2Schema), defaultValues: formData, mode: "onChange" });
  const form3 = useForm({ resolver: zodResolver(step3Schema), defaultValues: formData, mode: "onChange" });
  const form4 = useForm({ resolver: zodResolver(step4Schema), defaultValues: formData, mode: "onChange" });
  const form5 = useForm({ resolver: zodResolver(step5Schema), defaultValues: formData, mode: "onChange" });
  const form6 = useForm({ resolver: zodResolver(step6Schema), defaultValues: formData, mode: "onChange" });

  const watchNationality = form1.watch("nationality");
  const watchHasRecord = form2.watch("hasCriminalRecord");

  const goNext = (data: any, nextStep: number) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhoto(result);
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitFinal = async (data: any) => {
    if (!photo) {
      toast({ title: "Falta fotografía", description: "Debe subir una foto.", variant: "destructive" });
      return;
    }
    
    const code = `INC-${Math.floor(Math.random() * 900000 + 100000)}`;
    setTrackingCode(code);
    
    const fullData = {
      ...formData,
      photo,
      trackingCode: code,
      hasCriminalRecord: formData.hasCriminalRecord === "yes",
      medicalDeclaration: `Tipo de sangre: ${formData.bloodType}, Altura: ${formData.height}, Peso: ${formData.weight}, Condiciones de salud: ${formData.healthConditions || "Ninguna reportada"}`,
      oathDeclaration: formData.oathDeclaration === true,
      formalLetterAccepted: data.formalLetterAccepted,
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
                <p><strong>Legajo Completo Recibido.</strong></p>
                <p>Su solicitud ha sido procesada completamente y se encuentra en estado <strong>"En Revisión"</strong>. Un oficial verificará todos sus datos, antecedentes, examen psicotécnico y documentación médica.</p>
                <p>Puede consultar el estado en la sección "Estado de Trámite" del portal.</p>
              </div>

              <div className="pt-4 flex gap-4">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">Volver al Inicio</Button>
                </Link>
                <Link href="/seguimiento" className="flex-1">
                  <Button className="w-full bg-primary">Ver Estado</Button>
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
      <div className="bg-slate-50 min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-serif font-bold text-primary">Formulario de Incorporación</h1>
              <Badge variant="outline" className="text-lg px-4 py-2">Etapa {step}/6</Badge>
            </div>
            <Progress value={(step / 6) * 100} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Personal Data */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="border-t-4 border-t-primary shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <User className="h-6 w-6 text-primary" />
                      <CardTitle>Datos Personales (IC)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form1.handleSubmit((data) => goNext(data, 2))} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nombre</Label>
                          <Input {...form1.register("name")} />
                          {form1.formState.errors.name && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.name.message}</p>}
                        </div>
                        <div>
                          <Label>Apellido</Label>
                          <Input {...form1.register("surname")} />
                          {form1.formState.errors.surname && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.surname.message}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Género</Label>
                          <Controller
                            control={form1.control}
                            name="gender"
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Masculino">Masculino</SelectItem>
                                  <SelectItem value="Femenino">Femenino</SelectItem>
                                  <SelectItem value="No Binario">No Binario</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {form1.formState.errors.gender && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.gender.message}</p>}
                        </div>
                        <div>
                          <Label>Estado Civil</Label>
                          <Controller
                            control={form1.control}
                            name="civilStatus"
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
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
                          {form1.formState.errors.civilStatus && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.civilStatus.message}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Edad</Label>
                          <Input type="number" {...form1.register("age")} />
                          {form1.formState.errors.age && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.age.message}</p>}
                        </div>
                        <div>
                          <Label>Nacionalidad</Label>
                          <Controller
                            control={form1.control}
                            name="nationality"
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Argentino">Argentino/a</SelectItem>
                                  {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {form1.formState.errors.nationality && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.nationality.message}</p>}
                        </div>
                      </div>

                      <div>
                        <Label>Lugar de Nacimiento</Label>
                        <Controller
                          control={form1.control}
                          name="birthplace"
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {(watchNationality === "Argentino" ? PROVINCES : COUNTRIES).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {form1.formState.errors.birthplace && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.birthplace.message}</p>}
                      </div>

                      <Separator />

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Tipo de Documento</Label>
                          <Controller
                            control={form1.control}
                            name="idType"
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="DNI">DNI</SelectItem>
                                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                  <SelectItem value="LC">LC</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {form1.formState.errors.idType && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.idType.message}</p>}
                        </div>
                        <div>
                          <Label>Número de Documento</Label>
                          <Input {...form1.register("idNumber")} />
                          {form1.formState.errors.idNumber && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.idNumber.message}</p>}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label>Email (OOC)</Label>
                        <Input type="email" {...form1.register("email")} />
                        {form1.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.email.message}</p>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Usuario Discord</Label>
                          <Input {...form1.register("discord")} />
                          {form1.formState.errors.discord && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.discord.message}</p>}
                        </div>
                        <div>
                          <Label>Usuario Roblox</Label>
                          <Input {...form1.register("roblox")} />
                          {form1.formState.errors.roblox && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.roblox.message}</p>}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-6">
                        <Button type="submit" className="flex-1 bg-primary">
                          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 2: Education & Background */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="border-t-4 border-t-primary shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <CardTitle>Educación y Antecedentes</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form2.handleSubmit((data) => goNext(data, 3))} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nivel de Educación</Label>
                          <Controller
                            control={form2.control}
                            name="educationLevel"
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Secundario">Secundario Completo</SelectItem>
                                  <SelectItem value="Terciario">Terciario</SelectItem>
                                  <SelectItem value="Universitario">Universitario</SelectItem>
                                  <SelectItem value="Posgrado/Maestria">Posgrado/Maestría</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {form2.formState.errors.educationLevel && <p className="text-red-500 text-sm mt-1">{form2.formState.errors.educationLevel.message}</p>}
                        </div>
                        <div>
                          <Label>Título Obtenido</Label>
                          <Input {...form2.register("educationTitle")} placeholder="ej: Técnico en Informática" />
                          {form2.formState.errors.educationTitle && <p className="text-red-500 text-sm mt-1">{form2.formState.errors.educationTitle.message}</p>}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <Label>¿Posee antecedentes penales?</Label>
                        <Controller
                          control={form2.control}
                          name="hasCriminalRecord"
                          render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="no-record" />
                                <Label htmlFor="no-record" className="font-normal cursor-pointer">No</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="yes-record" />
                                <Label htmlFor="yes-record" className="font-normal cursor-pointer">Sí</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                      </div>

                      {watchHasRecord === "yes" && (
                        <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div>
                            <Label>Competencia</Label>
                            <Controller
                              control={form2.control}
                              name="recordCompetence"
                              render={({ field }) => (
                                <Select value={field.value || ""} onValueChange={field.onChange}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Provincial">Provincial</SelectItem>
                                    <SelectItem value="Federal">Federal</SelectItem>
                                    <SelectItem value="Ambos">Ambos</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {form2.formState.errors.recordCompetence && <p className="text-red-500 text-sm mt-1">{form2.formState.errors.recordCompetence.message}</p>}
                          </div>
                          <div>
                            <Label>Descripción del Antecedente</Label>
                            <Textarea {...form2.register("recordDescription")} placeholder="Describa el tipo de delito y circunstancias..." className="min-h-24" />
                            {form2.formState.errors.recordDescription && <p className="text-red-500 text-sm mt-1">{form2.formState.errors.recordDescription.message}</p>}
                          </div>
                          <div>
                            <Label>¿Tiene causas activas?</Label>
                            <Controller
                              control={form2.control}
                              name="activeCauses"
                              render={({ field }) => (
                                <Select value={field.value || ""} onValueChange={field.onChange}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Si">Sí</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                    <SelectItem value="Desconoce">Desconoce</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {form2.formState.errors.activeCauses && <p className="text-red-500 text-sm mt-1">{form2.formState.errors.activeCauses.message}</p>}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-6">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                          <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary">
                          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 3: Psychotechnical Exam */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="border-t-4 border-t-primary shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Brain className="h-6 w-6 text-primary" />
                      <CardTitle>Examen Psicotécnico</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form3.handleSubmit((data) => goNext(data, 4))} className="space-y-6">
                      <div>
                        <Label>¿Por qué desea ingresar a la Policía Federal?</Label>
                        <Textarea {...form3.register("motive")} placeholder="Mínimo 50 caracteres..." className="min-h-24" />
                        {form3.formState.errors.motive && <p className="text-red-500 text-sm mt-1">{form3.formState.errors.motive.message}</p>}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800">Responda las siguientes preguntas:</h3>
                        
                        {[
                          { num: 1, q: "¿Cómo resolvería un conflicto con un compañero de trabajo?" },
                          { num: 2, q: "¿Qué haría ante una orden que considera injusta?" },
                          { num: 3, q: "Describa una situación donde mantener la calma fue crucial." },
                          { num: 4, q: "¿Cuál es su mayor debilidad y cómo la maneja?" },
                          { num: 5, q: "¿Cómo entiende la responsabilidad civil de un policía?" }
                        ].map((item) => (
                          <div key={item.num}>
                            <Label>Pregunta {item.num}: {item.q}</Label>
                            <Textarea {...form3.register(`exam_${item.num}`)} className="min-h-20" />
                            {form3.formState.errors[`exam_${item.num}` as keyof typeof form3.formState.errors] && 
                              <p className="text-red-500 text-sm mt-1">Respuesta requerida</p>
                            }
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-6">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                          <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary">
                          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 4: Photo Upload */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="border-t-4 border-t-primary shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Image className="h-6 w-6 text-primary" />
                      <CardTitle>Fotografía y Declaraciones</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form4.handleSubmit((data) => goNext(data, 5))} className="space-y-6">
                      <div className="space-y-4">
                        <Label>Fotografía (4x4 cm)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          {photoPreview ? (
                            <div className="space-y-4">
                              <img src={photoPreview} alt="Preview" className="w-32 h-32 mx-auto object-cover rounded border-2 border-primary" />
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => document.getElementById("photo-input")?.click()}
                              >
                                Cambiar Foto
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                              <p className="text-sm text-gray-600 mb-2">Haga clic para seleccionar una foto o arrástrela aquí</p>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("photo-input")?.click()}
                              >
                                Seleccionar Foto
                              </Button>
                            </div>
                          )}
                          <input
                            id="photo-input"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="oath"
                            {...form4.register("oathDeclaration")}
                            className="mt-1"
                          />
                          <Label htmlFor="oath" className="font-normal leading-relaxed cursor-pointer">
                            Declaro bajo juramento que toda la información proporcionada en este formulario es verdadera y completa. Entiendo que proporcionar información falsa puede resultar en la negación de mi solicitud o en acciones legales. Acepto someterme a todas las pruebas requeridas y entiendo que seré sujeto a un proceso de investigación exhaustivo.
                          </Label>
                        </div>
                        {form4.formState.errors.oathDeclaration && <p className="text-red-500 text-sm">{form4.formState.errors.oathDeclaration.message}</p>}
                      </div>

                      <div className="flex gap-2 pt-6">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(3)}>
                          <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary">
                          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 5: Medical Data */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="border-t-4 border-t-primary shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <HeartPulse className="h-6 w-6 text-primary" />
                      <CardTitle>Datos Médicos</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form5.handleSubmit((data) => goNext(data, 6))} className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label>Tipo de Sangre</Label>
                          <Controller
                            control={form5.control}
                            name="bloodType"
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {form5.formState.errors.bloodType && <p className="text-red-500 text-sm mt-1">{form5.formState.errors.bloodType.message}</p>}
                        </div>
                        <div>
                          <Label>Altura (cm)</Label>
                          <Input {...form5.register("height")} placeholder="ej: 175" />
                          {form5.formState.errors.height && <p className="text-red-500 text-sm mt-1">{form5.formState.errors.height.message}</p>}
                        </div>
                        <div>
                          <Label>Peso (kg)</Label>
                          <Input {...form5.register("weight")} placeholder="ej: 75" />
                          {form5.formState.errors.weight && <p className="text-red-500 text-sm mt-1">{form5.formState.errors.weight.message}</p>}
                        </div>
                      </div>

                      <div>
                        <Label>Condiciones de Salud o Alergias</Label>
                        <Textarea {...form5.register("healthConditions")} placeholder="Indique cualquier condición médica, alergia o medicamento que toma regularmente. Deje en blanco si no aplica." className="min-h-20" />
                      </div>

                      <Separator />

                      <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="medical-declaration"
                            {...form5.register("medicalDeclarationCheck")}
                            className="mt-1"
                          />
                          <Label htmlFor="medical-declaration" className="font-normal leading-relaxed cursor-pointer text-sm">
                            Declaro bajo juramento que toda la información médica proporcionada es exacta y verídica. Certifico que los datos de tipo de sangre, altura, peso y condiciones de salud indicadas corresponden fielmente a mi estado médico actual. Me notifico que proporcionar información médica falsa puede resultar en la exclusión del proceso de incorporación. Entiendo que me someteré a exámenes médicos adicionales durante el proceso de selección.
                          </Label>
                        </div>
                        {form5.formState.errors.medicalDeclarationCheck && <p className="text-red-500 text-sm">{form5.formState.errors.medicalDeclarationCheck.message}</p>}
                      </div>

                      <div className="flex gap-2 pt-6">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(4)}>
                          <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary">
                          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 6: Final Letter */}
            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="border-t-4 border-t-primary shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Scale className="h-6 w-6 text-primary" />
                      <CardTitle>Cierre del Legajo</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form6.handleSubmit(submitFinal)} className="space-y-6">
                      <div className="p-6 bg-gray-50 border rounded-lg font-serif text-sm leading-relaxed whitespace-pre-wrap">
                        {`El que suscribe ${formData.name || "________"} ${formData.surname || "________"}, solicita del Señor Jefe de la Policía Federal Argentina ser inscripto como aspirante a ingresar a esa Repartición en calidad de Cadete.

Declaro bajo juramento, firmado de conformidad, estar en todo de acuerdo con las obligaciones contenidas en el documento y anexos, como de las disposiciones mencionadas en el artículo 6º del Decreto 4673/68 que textualmente dicen: "Las inexactitudes u omisiones en las declaraciones juradas...", "...configurarán falta grave que será sancionada con exoneración en su caso, con la cancelación del nombramiento o la anulación del contrato...". Asimismo me notifico de las obligaciones impuestas por la Ley 21.965 para el personal de la Policía Federal Argentina: "La no participación en actividades políticas, partidarias o gremiales, mediante el desempeño de funciones públicas propias de cargos electivos, y abstenerse en absoluto de integrarse o participar en entidades que propicien o actúen en condiciones incompatibles con el desempeño de la función policial". Atento a ello declaro no hallarme afiliado a ningún partido político y no participar en actividad política y/o gremial alguna.

Por otra parte me notifico que de acuerdo al decreto 894/01 "El desempeño de una función o cargo remunerado o prestación contractual con o sin relacion de dependencia, bajo cualquier modalidad de Administración Pública Nacional, es incompatible con la percepción de un beneficio previsional o haber de retiro proveniente de cualquier régimen de previsión nacional, provincial o municipal. La referida se aplicar con independencia de las excepciones especificadas que se hayan dispuesto o dispusieren respecto del presente derecho, sus modificatorios y complementarios.`}
                      </div>

                      <Separator />

                      <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="formal-letter"
                            {...form6.register("formalLetterAccepted")}
                            className="mt-1"
                          />
                          <Label htmlFor="formal-letter" className="font-normal leading-relaxed cursor-pointer">
                            Acepto la declaración anterior tal como se presenta. Certifico que he leído, comprendido y aceptado todos los términos y condiciones establecidos en esta carta formal dirigida al Jefe de la Policía Federal Argentina. Entiendo mis obligaciones y derechos como aspirante a ingresar a la institución.
                          </Label>
                        </div>
                        {form6.formState.errors.formalLetterAccepted && <p className="text-red-500 text-sm">{form6.formState.errors.formalLetterAccepted.message}</p>}
                      </div>

                      <div className="flex gap-2 pt-6">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(5)}>
                          <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary">
                          <Check className="mr-2 h-4 w-4" /> Enviar Solicitud
                        </Button>
                      </div>
                    </form>
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
