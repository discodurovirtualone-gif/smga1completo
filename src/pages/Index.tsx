import { Link } from "react-router-dom";
import { Baby, Milk, ClipboardList } from "lucide-react";

const menuItems = [
  {
    title: "Registros Reproductivos",
    description: "Parto, servicios, concepción, toro usado y más",
    icon: Baby,
    path: "/reproductivos",
    color: "from-primary to-primary/80",
  },
  {
    title: "Registros Productivos",
    description: "Producción de leche, grasa y proteína",
    icon: Milk,
    path: "/productivos",
    color: "from-secondary to-accent",
  },
  {
    title: "Registros Otros",
    description: "Renguera, mastitis, longevidad y más",
    icon: ClipboardList,
    path: "/otros",
    color: "from-primary/70 to-primary",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-3">
          🐄 Sistema Ganadero
        </h1>
        <p className="text-lg text-muted-foreground">
          Seleccione el módulo de registro
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />
            <div className="relative flex flex-col items-center text-center gap-4">
              <div className="rounded-xl bg-primary/10 p-4">
                <item.icon className="h-10 w-10 text-primary" />
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
  );
};

export default Index;
