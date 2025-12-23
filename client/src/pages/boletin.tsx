import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, FileText } from "lucide-react";

export default function Boletin() {
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBulletins();
  }, []);

  const fetchBulletins = async () => {
    try {
      const response = await fetch("/api/bulletins/published");
      if (response.ok) {
        const data = await response.json();
        setBulletins(data.sort((a: any, b: any) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        ));
      }
    } catch (err) {
      setError("Error al cargar boletines");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Alerta": return "bg-red-100 text-red-800";
      case "Comunicado": return "bg-blue-100 text-blue-800";
      case "Noticia": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Boletín Oficial</h1>
            <p className="text-gray-600">Comunicados y Noticias de la PFA</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6 flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                {error}
              </CardContent>
            </Card>
          ) : bulletins.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="flex flex-col items-center gap-3 text-gray-600">
                <FileText className="h-8 w-8" />
                <p>No hay boletines publicados en este momento</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {bulletins.map((bulletin) => (
                <Card key={bulletin.id} className="shadow hover:shadow-lg transition border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{bulletin.title}</CardTitle>
                        <Badge className={getCategoryColor(bulletin.category)}>
                          {bulletin.category}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(bulletin.publishedAt).toLocaleDateString("es-AR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{bulletin.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
