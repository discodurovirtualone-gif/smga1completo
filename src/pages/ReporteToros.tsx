import FormLayout from "@/components/FormLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sampleToros = [
  { nombre: "PEAK ALTADANYL-ET", caracteristicas: "Leche, Fertilidad, Patas", codigo: "1" },
  { nombre: "S-S-I REGAL SHORTSTACK-ET", caracteristicas: "Mastitis, Longevidad", codigo: "2" },
  { nombre: "OCD SHERPA-ET", caracteristicas: "Tendencia en el medio", codigo: "3" },
];

const ReporteToros = () => {
  return (
    <FormLayout title="Reporte Toros">
      <div className="space-y-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Comparación de Toros</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Toro</TableHead>
                <TableHead>Características</TableHead>
                <TableHead>Código</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleToros.map((row) => (
                <TableRow key={row.codigo}>
                  <TableCell className="font-medium">{row.nombre}</TableCell>
                  <TableCell>{row.caracteristicas}</TableCell>
                  <TableCell>{row.codigo}</TableCell>
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

export default ReporteToros;
