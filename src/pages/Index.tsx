import { Link } from "react-router-dom";
import { Milk, ClipboardList, BarChart3, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CowIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 4c0 0 1-2 3-2s2 2 4 2 2-2 4-2 2 2 4 2 1-2 3-2 3 2 3 2" />
    <path d="M3 7c0 0 1 1 2 1s2-1 2-1" />
    <path d="M17 7c0 0 1 1 2 1s2-1 2-1" />
    <ellipse cx="12" cy="14" rx="8" ry="8" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
    <ellipse cx="12" cy="16" rx="3" ry="2" />
    <circle cx="10.5" cy="16.5" r="0.5" fill="currentColor" />
    <circle cx="13.5" cy="16.5" r="0.5" fill="currentColor" />
  </svg>
);

const ingresosItems = [
  {
    title: "Registros Reproductivos",
    description: "Parto, servicios, concepción, toro usado y más",
    icon: CowIcon,
    path: "/reproductivos",
    color: "from-primary to-primary/80",
    iconBg: "bg-primary/10 ring-2 ring-primary/30",
    iconColor: "text-primary",
  },
  {
    title: "Registros Productivos",
    description: "Producción de leche, grasa y proteína",
    icon: Milk,
    path: "/productivos",
    color: "from-secondary to-accent",
    iconBg: "bg-secondary/10 ring-2 ring-secondary/30",
    iconColor: "text-secondary",
  },
  {
    title: "Registros Otros",
    description: "Renguera, mastitis, longevidad y más",
    icon: ClipboardList,
    path: "/otros",
    color: "from-primary/70 to-primary",
    iconBg: "bg-primary/10 ring-2 ring-primary/30",
    iconColor: "text-primary",
  },
];

const reportesItems = [
  {
    title: "Reporte Vacas",
    description: "Reportes detallados del rodeo de vacas",
    icon: FileText,
    path: "/reporte-vacas",
    color: "from-report to-report/80",
    iconBg: "bg-report/10 ring-2 ring-report/30",
    iconColor: "text-report",
  },
  {
    title: "Reporte Toros",
    description: "Comparación y análisis de toros",
    icon: BarChart3,
    path: "/reporte-toros",
    color: "from-report to-report-accent",
    iconBg: "bg-report/10 ring-2 ring-report/30",
    iconColor: "text-report",
  },
  {
    title: "Tablero General",
    description: "Dashboard con indicadores del rodeo",
    icon: LayoutDashboard,
    path: "/dashboard",
    color: "from-report-accent to-report",
    iconBg: "bg-report-accent/10 ring-2 ring-report-accent/30",
    iconColor: "text-report-accent",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 py-12 bg-background">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-3">
          🐄 Sistema Ganadero
        </h1>
        <p className="text-lg text-muted-foreground">
          Seleccione el módulo de registro o reporte
        </p>
      </div>

      {/* Sección Ingresos */}
      <div className="w-full max-w-4xl">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 text-center">
          📝 Ingreso de datos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ingresosItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              <div className="relative flex flex-col items-center text-center gap-4">
                <div className={`rounded-full p-4 ${item.iconBg}`}>
                  <item.icon className={`h-10 w-10 ${item.iconColor}`} />
                </div>
                <h2 className="text-xl font-bold text-card-foreground">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Separador */}
      <div className="w-full max-w-4xl my-10 flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
          📊 Reportes
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Sección Reportes */}
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportesItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group relative overflow-hidden rounded-2xl border border-report/30 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              <div className="relative flex flex-col items-center text-center gap-4">
                <div className={`rounded-full p-4 ${item.iconBg}`}>
                  <item.icon className={`h-10 w-10 ${item.iconColor}`} />
                </div>
                <h2 className="text-xl font-bold text-card-foreground">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
