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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [requests, setRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    // Check auth
    if (!localStorage.getItem("pfa_session")) {
      setLocation("/login");
      return;
    }

    // Load Data
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
      case "Aprobado": return <Badge className="bg-green-600 hover:bg-green-700">Aprobado</Badge>;
      case "Rechazado": return <Badge className="bg-red-600 hover:bg-red-700">Rechazado</Badge>;
      default: return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendiente</Badge>;
    }
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-xl font-serif font-bold">Panel de Control</h1>
            <p className="text-xs text-slate-400">División Incorporaciones</p>
          </div>
          <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-white/5" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Salir
          </Button>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Solicitudes</p>
                  <p className="text-2xl font-bold">{requests.length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full"><Clock className="text-blue-600 h-5 w-5" /></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === "Pendiente").length}</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full"><Clock className="text-yellow-600 h-5 w-5" /></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aprobados</p>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === "Aprobado").length}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="text-green-600 h-5 w-5" /></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rechazados</p>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === "Rechazado").length}</p>
                </div>
                <div className="bg-red-100 p-2 rounded-full"><XCircle className="text-red-600 h-5 w-5" /></div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar por nombre, apellido o código..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Estado" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pendiente">Pendientes</SelectItem>
                  <SelectItem value="Aprobado">Aprobados</SelectItem>
                  <SelectItem value="Rechazado">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Card className="shadow-lg border-none overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[100px]">Código</TableHead>
                  <TableHead>Postulante</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Discord</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
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
                      <TableCell className="font-mono font-medium">{req.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           {req.photo ? (
                             <img src={req.photo} className="h-8 w-8 rounded object-cover border" alt="Avatar" />
                           ) : (
                             <div className="h-8 w-8 rounded bg-slate-200" />
                           )}
                           <div className="flex flex-col">
                             <span className="font-bold text-slate-800">{req.surname}, {req.name}</span>
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
                              <Eye className="h-4 w-4 mr-1" /> Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <DialogTitle className="text-xl font-serif text-primary">Detalle de Solicitud #{req.id}</DialogTitle>
                                  <DialogDescription>Enviada el {new Date(req.date).toLocaleString()}</DialogDescription>
                                </div>
                                {getStatusBadge(req.status)}
                              </div>
                            </DialogHeader>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                              <div className="col-span-1">
                                <div className="aspect-[4/4] bg-slate-100 rounded-lg overflow-hidden border mb-4">
                                  <img src={req.photo} alt="Foto Perfil" className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between border-b py-1">
                                    <span className="text-muted-foreground">Edad:</span>
                                    <span className="font-medium">{req.age} años</span>
                                  </div>
                                  <div className="flex justify-between border-b py-1">
                                    <span className="text-muted-foreground">Altura:</span>
                                    <span className="font-medium">{req.height} cm</span>
                                  </div>
                                  <div className="flex justify-between border-b py-1">
                                    <span className="text-muted-foreground">Peso:</span>
                                    <span className="font-medium">{req.weight} kg</span>
                                  </div>
                                  <div className="flex justify-between border-b py-1">
                                    <span className="text-muted-foreground">Sangre:</span>
                                    <span className="font-medium">{req.bloodType}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-span-2 space-y-6">
                                <div>
                                  <h4 className="font-bold text-primary border-b pb-2 mb-3">Datos Personales</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="block text-muted-foreground text-xs">Nombre Completo</span>
                                      <p className="font-medium">{req.name} {req.surname}</p>
                                    </div>
                                    <div>
                                      <span className="block text-muted-foreground text-xs">Documento</span>
                                      <p className="font-medium">{req.idType} - {req.idNumber}</p>
                                    </div>
                                    <div>
                                      <span className="block text-muted-foreground text-xs">Nacionalidad</span>
                                      <p className="font-medium">{req.nationality}</p>
                                    </div>
                                    <div>
                                      <span className="block text-muted-foreground text-xs">Lugar Nacimiento</span>
                                      <p className="font-medium">{req.birthplace}</p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-bold text-primary border-b pb-2 mb-3">Contacto</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="block text-muted-foreground text-xs">Discord</span>
                                      <p className="font-medium font-mono text-xs bg-slate-100 p-1 rounded inline-block">{req.discord}</p>
                                    </div>
                                    <div>
                                      <span className="block text-muted-foreground text-xs">Roblox</span>
                                      <p className="font-medium">{req.roblox}</p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-bold text-primary border-b pb-2 mb-3">Examen de Ingreso</h4>
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <span className="block text-muted-foreground text-xs mb-1">Motivación</span>
                                      <p className="bg-slate-50 p-3 rounded text-slate-700 italic border">{req.motive}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2 text-center mt-2">
                                      <div className={`p-2 rounded text-xs border ${req.q_chain === 'correct' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                        Cadena de Mando
                                      </div>
                                      <div className={`p-2 rounded text-xs border ${req.q_force === 'correct' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                        Uso de Fuerza
                                      </div>
                                      <div className={`p-2 rounded text-xs border ${req.q_procedure === 'correct' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                        Procedimiento
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {req.hasCriminalRecord === 'yes' && (
                                  <div className="bg-red-50 border border-red-200 p-3 rounded">
                                    <h5 className="text-red-800 font-bold text-sm flex items-center gap-2"><XCircle className="h-4 w-4" /> Posee Antecedentes</h5>
                                    <p className="text-xs text-red-700 mt-1">{req.recordDetail}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button 
                                  variant="destructive" 
                                  className="w-full sm:w-auto"
                                  onClick={() => updateStatus(req.id, "Rechazado")}
                                >
                                  Rechazar
                                </Button>
                                <Button 
                                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => updateStatus(req.id, "Aprobado")}
                                >
                                  Aprobar Ingreso
                                </Button>
                            </DialogFooter>
                          </DialogContent>
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
