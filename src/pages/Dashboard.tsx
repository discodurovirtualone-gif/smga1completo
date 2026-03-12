import FormLayout from "@/components/FormLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Milk, Baby, Heart, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Vacas", value: "44", icon: Milk, color: "text-primary" },
  { label: "Partos este Ejercicio", value: "12", icon: Baby, color: "text-secondary" },
  { label: "Tasa Concepción", value: "68%", icon: Heart, color: "text-destructive" },
  { label: "Producción Prom.", value: "25 L/día", icon: TrendingUp, color: "text-report" },
];

const Dashboard = () => {
  return (
    <FormLayout title="Tablero General">
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-card-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placeholder for charts */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Resumen del Rodeo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-card-foreground">Parámetros</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">IPS</span><span className="font-medium">42</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Servicios</span><span className="font-medium">175</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Ind. Mastitis</span><span className="font-medium">3.5</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Ind. Renguera</span><span className="font-medium">2.2</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Ind. Fac. Parto</span><span className="font-medium">3.0</span></div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-card-foreground">Metas del Ejercicio</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">IPC objetivo</span><span className="font-medium">90 días</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tasa preñez</span><span className="font-medium">&gt; 65%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">LC305 prom.</span><span className="font-medium">8.500 L</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">% Grasa</span><span className="font-medium">3.8%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">% Proteína</span><span className="font-medium">3.3%</span></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6 italic">
              Datos de ejemplo — conecte una base de datos para ver indicadores reales.
            </p>
          </CardContent>
        </Card>
      </div>
    </FormLayout>
  );
};

export default Dashboard;
