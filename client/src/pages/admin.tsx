import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, LogOut, FileText, User, AlertTriangle, BookOpen, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [requests, setRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    if (!localStorage.getItem("pfa_session")) {
      setLocation("/login");
      return;
    }
    const data = JSON.parse(localStorage.getItem('pfa_requests') || '[]');
    setRequests(data);
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("pfa_session");
    setLocation("/login");
  };

  const updateStatus = (id: string, newStatus: string) => {
    const updated = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setRequests(updated);
    localStorage.setItem('pfa_requests', JSON.stringify(updated));
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      req.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Admitido": 
      case "Aprobado": return <Badge className="bg-green-600 hover:bg-green-700">ADMITIDO</Badge>;
      case "Desestimado":
      case "Rechazado": return <Badge className="bg-red-600 hover:bg-red-700">DESESTIMADO</Badge>;
      case "Analizando": return <Badge className="bg-blue-600 hover:bg-blue-700">ANALIZANDO</Badge>;
      case "Cancelado": return <Badge className="bg-slate-600 hover:bg-slate-700">CANCELADO</Badge>;
      default: return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">EN REVISIÓN</Badge>;
    }
  };

  return (
    <Layout>
      <div className="bg-slate-100 min-h-screen">
        <div className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow-md border-b-4 border-secondary sticky top-0 z-30">
          <div className="flex items-center gap-3">
             <Shield className="h-8 w-8 text-secondary" />
             <div>
                <h1 className="text-xl font-serif font-bold leading-none">SISTEMA DE GESTIÓN</h1>
                <p className="text-[10px] text-secondary tracking-widest uppercase">División Incorporaciones</p>
             </div>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Salir
          </Button>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar por nombre, apellido o código..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-56">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Estado" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="En Revisión">En Revisión</SelectItem>
                  <SelectItem value="Analizando">Analizando</SelectItem>
                  <SelectItem value="Admitido">Admitidos</SelectItem>
                  <SelectItem value="Desestimado">Desestimados</SelectItem>
                  <SelectItem value="Cancelado">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="shadow-lg border-none overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[120px]">Legajo</TableHead>
                  <TableHead>Postulante</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No se encontraron solicitudes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono font-bold text-primary">{req.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                             {req.photo ? <img src={req.photo} className="w-full h-full object-cover" /> : null}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-bold text-slate-800 uppercase">{req.surname}, {req.name}</span>
                             <span className="text-xs text-slate-500">{req.nationality}</span>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>{req.age}</TableCell>
                      <TableCell className="text-xs font-mono">{req.discord}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(req.date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}>
                              <Eye className="h-4 w-4 mr-1" /> Revisar
                            </Button>
                          </DialogTrigger>
                          {selectedRequest?.id === req.id && (
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                               <div className="bg-primary text-white p-4 flex justify-between items-center">
                                 <div className="flex items-center gap-3">
                                   <FileText className="h-6 w-6" />
                                   <div>
                                     <DialogTitle className="text-lg font-serif">LEGAJO PERSONAL: {req.surname}, {req.name}</DialogTitle>
                                     <p className="text-xs opacity-80 font-mono tracking-widest">EXP: {req.id}</p>
                                   </div>
                                 </div>
                                 {getStatusBadge(req.status)}
                               </div>

                               <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Sidebar Info */}
                                    <div className="col-span-1 space-y-4">
                                      <div className="aspect-[3/4] bg-white rounded-lg shadow-sm border p-1">
                                        <img src={req.photo} className="w-full h-full object-cover rounded" />
                                      </div>
                                      
                                      <Card>
                                        <CardContent className="p-3 space-y-2 text-sm">
                                          <div><span className="text-xs text-gray-500 block">Edad</span> <b>{req.age} años</b></div>
                                          <div><span className="text-xs text-gray-500 block">Género</span> {req.gender}</div>
                                          <div><span className="text-xs text-gray-500 block">Estado Civil</span> {req.civilStatus}</div>
                                          <div><span className="text-xs text-gray-500 block">Nacionalidad</span> {req.nationality}</div>
                                          <div><span className="text-xs text-gray-500 block">Lugar Nac.</span> {req.birthplace}</div>
                                        </CardContent>
                                      </Card>

                                      <Card className="bg-blue-50 border-blue-100">
                                        <CardContent className="p-3 text-xs space-y-2">
                                          <div className="font-bold text-blue-800 border-b border-blue-200 pb-1 mb-1">Contacto</div>
                                          <div><span className="block text-blue-600">Email:</span> {req.email}</div>
                                          <div><span className="block text-blue-600">Discord:</span> {req.discord}</div>
                                          <div><span className="block text-blue-600">Roblox:</span> {req.roblox}</div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Main Content */}
                                    <div className="col-span-3">
                                      <Tabs defaultValue="personal" className="w-full">
                                        <TabsList className="w-full justify-start bg-white border mb-4">
                                          <TabsTrigger value="personal">Datos & Educación</TabsTrigger>
                                          <TabsTrigger value="exam">Examen & Psicotécnico</TabsTrigger>
                                          <TabsTrigger value="background">Antecedentes</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="personal" className="space-y-4">
                                           <Card>
                                             <CardHeader className="pb-2"><CardTitle className="text-base">Identificación</CardTitle></CardHeader>
                                             <CardContent>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                  <div><span className="text-gray-500 block">Tipo Documento</span> {req.idType}</div>
                                                  <div><span className="text-gray-500 block">Número</span> {req.idNumber}</div>
                                                </div>
                                             </CardContent>
                                           </Card>

                                           <Card>
                                             <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4"/> Educación</CardTitle></CardHeader>
                                             <CardContent>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                  <div><span className="text-gray-500 block">Nivel</span> {req.educationLevel}</div>
                                                  <div><span className="text-gray-500 block">Título</span> {req.educationTitle}</div>
                                                </div>
                                             </CardContent>
                                           </Card>
                                        </TabsContent>

                                        <TabsContent value="exam" className="space-y-4">
                                           <Card>
                                             <CardHeader className="pb-2"><CardTitle className="text-base">Motivación de Ingreso</CardTitle></CardHeader>
                                             <CardContent>
                                                <p className="text-sm italic bg-slate-50 p-3 border rounded text-gray-700">"{req.motive}"</p>
                                             </CardContent>
                                           </Card>

                                           <Card>
                                             <CardHeader className="pb-2"><CardTitle className="text-base">Respuestas de Examen</CardTitle></CardHeader>
                                             <CardContent className="space-y-3 text-sm">
                                                <div className="grid grid-cols-1 gap-2">
                                                  <div className="border p-2 rounded"><span className="text-xs text-gray-500 block">1. Persecución/Arma</span> Res: <b>{req.exam_1}</b></div>
                                                  <div className="border p-2 rounded"><span className="text-xs text-gray-500 block">2. Uso de Fuerza</span> Res: <b>{req.exam_2}</b></div>
                                                  <div className="border p-2 rounded"><span className="text-xs text-gray-500 block">3. Cadena de Mando</span> Res: <b>{req.exam_3}</b></div>
                                                  <div className="border p-2 rounded"><span className="text-xs text-gray-500 block">4. Soborno</span> Res: <b>{req.exam_4}</b></div>
                                                  <div className="border p-2 rounded"><span className="text-xs text-gray-500 block">5. Rehenes</span> Res: <b>{req.exam_5}</b></div>
                                                </div>
                                             </CardContent>
                                           </Card>
                                        </TabsContent>

                                        <TabsContent value="background">
                                           {req.hasCriminalRecord === "yes" ? (
                                             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                               <h3 className="text-red-800 font-bold flex items-center gap-2 mb-4"><AlertTriangle className="h-5 w-5"/> ANTECEDENTES REGISTRADOS</h3>
                                               <div className="space-y-2 text-sm text-red-900">
                                                 <p><strong>Competencia:</strong> {req.recordCompetence}</p>
                                                 <p><strong>Causas Activas:</strong> {req.activeCauses}</p>
                                                 <div className="mt-2">
                                                   <p className="font-bold">Descripción:</p>
                                                   <p className="italic bg-white/50 p-2 rounded border border-red-100">{req.recordDescription}</p>
                                                 </div>
                                               </div>
                                             </div>
                                           ) : (
                                              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center text-green-800">
                                                <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-50"/>
                                                <p className="font-bold">Sin Antecedentes Penales Declarados</p>
                                              </div>
                                           )}
                                        </TabsContent>
                                      </Tabs>
                                    </div>
                                  </div>
                               </div>

                               <DialogFooter className="bg-slate-100 p-4 border-t flex justify-between items-center">
                                 <div className="text-xs text-gray-500">
                                   Cambiar estado actual: <b>{req.status}</b>
                                 </div>
                                 <div className="flex gap-2">
                                   <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => updateStatus(req.id, "Analizando")}>
                                     Analizando
                                   </Button>
                                   <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => updateStatus(req.id, "Cancelado")}>
                                     Cancelar
                                   </Button>
                                   <Button variant="destructive" size="sm" onClick={() => updateStatus(req.id, "Desestimado")}>
                                     Desestimar
                                   </Button>
                                   <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm" onClick={() => updateStatus(req.id, "Admitido")}>
                                     Admitir Ingreso
                                   </Button>
                                 </div>
                               </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
