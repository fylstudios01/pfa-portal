import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, User, Shield } from "lucide-react";
import logo from "@assets/image_(18)_1765250186765.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      if (username === "admin" && password === "admin") {
        toast({
          title: "Acceso Concedido",
          description: "Bienvenido al sistema de gestión.",
        });
        // Set fake session
        localStorage.setItem("pfa_session", "true");
        setLocation("/admin");
      } else {
        toast({
          title: "Acceso Denegado",
          description: "Credenciales inválidas.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-100 px-4 py-12">
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="flex justify-center">
               <img src={logo} alt="Escudo" className="h-20 w-auto" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-primary font-bold">Acceso Restringido</CardTitle>
              <CardDescription>Sistema de Gestión de Personal</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario / Legajo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="username" 
                    placeholder="Ingrese usuario" 
                    className="pl-10" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Ingresar al Sistema"}
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" /> Acceso exclusivo para personal autorizado
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
