import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Heart, Scale } from "lucide-react";

export default function QuienesSomos() {
  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">
              ¿Quiénes Somos?
            </h1>
            <p className="text-xl text-gray-600">
              Policía Federal Argentina - Capital Federal
            </p>
          </div>

          {/* Mission and Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-t-4 border-t-primary shadow-lg">
              <CardContent className="pt-8">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                  Misión
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Garantizar la seguridad y el orden público en Capital Federal, protegiendo los derechos 
                  de los ciudadanos y cumpliendo con la ley federal de la manera más íntegra y profesional.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary shadow-lg">
              <CardContent className="pt-8">
                <h2 className="text-2xl font-serif font-bold text-secondary mb-4">
                  Visión
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Ser la institución policial de referencia en la región, reconocida por su profesionalismo,
                  transparencia y compromiso con la justicia y la protección ciudadana.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="shadow-lg hover:shadow-xl transition">
                <CardContent className="pt-8 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Integridad</h3>
                  <p className="text-sm text-gray-600">
                    Actuamos con total transparencia y honestidad en todas nuestras acciones.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition">
                <CardContent className="pt-8 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Profesionalismo</h3>
                  <p className="text-sm text-gray-600">
                    Personal capacitado y comprometido con la excelencia en el servicio.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition">
                <CardContent className="pt-8 text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Compromiso</h3>
                  <p className="text-sm text-gray-600">
                    Dedicados a proteger y servir a la comunidad sin excepción.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition">
                <CardContent className="pt-8 text-center">
                  <Scale className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Justicia</h3>
                  <p className="text-sm text-gray-600">
                    Aplicamos la ley de forma equitativa y respetamos los derechos de todos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* History Section */}
          <Card className="shadow-lg border-l-4 border-l-primary">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                Nuestra Historia
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                La Policía Federal Argentina en Capital Federal ha sido durante años la institución encargada
                de garantizar la seguridad y el orden público. Con una larga trayectoria de profesionalismo y
                dedicación, nuestros oficiales trabajan día a día para proteger a los ciudadanos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Nuestra estructura jerárquica permite una clara cadena de mando, desde los agentes en las calles
                hasta la Jefatura de Policía, asegurando una coordinación efectiva y un servicio de calidad.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
