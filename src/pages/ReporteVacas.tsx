import FormLayout from "@/components/FormLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sampleData = [
  { id: "400", nombre: "a_NOMBRE1", orden: "A_PADRE1/a_ABUELO1" },
  { id: "401", nombre: "a_NOMBRE2", orden: "A_PADRE2/a_ABUELO2" },
  { id: "402", nombre: "a_NOMBRE3", orden: "A_PADRE3/a_ABUELO3" },
  { id: "403", nombre: "a_NOMBRE4", orden: "A_PADRE4/a_ABUELO4" },
  { id: "404", nombre: "a_NOMBRE5", orden: "A_PADRE5/a_ABUELO5" },
];

const ReporteVacas = () => {
  return (
    <FormLayout title="Reporte Vacas">
      <div className="space-y-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Listado de Vacas Activas</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead># Identificación Animal</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Padre / Abuelo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.orden}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-sm text-muted-foreground mt-4 italic">
            Datos de ejemplo — conecte una base de datos para ver registros reales.
          </p>
        </div>
      </div>
    </FormLayout>
  );
};

export default ReporteVacas;
