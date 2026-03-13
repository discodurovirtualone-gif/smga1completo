import FormLayout from "@/components/FormLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGanaderia, calcWood } from "@/context/GanaderiaContext";

const DIAS = [30, 120, 210, 270] as const;

const ProduccionWood = () => {
  const { registrosBasicos, factores } = useGanaderia();

  const vacasConPotencial = registrosBasicos.filter((v) => parseFloat(v.potencial_vaca) > 0);

  const findFactor = (raza: string, edad: number, lactancia: number): number | null => {
    // Map raza codes: simplify matching
    const razaMap: Record<string, string> = { "1": "Holstein", "2": "Jersey" };
    const razaNombre = razaMap[raza] || raza;
    const match = factores.find(
      (f) => f.raza === razaNombre && f.edad === edad && f.lactancia === lactancia
    );
    return match ? match.factor : null;
  };

  const rows = vacasConPotencial.map((vaca) => {
    const potencial = parseFloat(vaca.potencial_vaca);
    const prod = DIAS.map((d) => calcWood(potencial, d));
    const promedio = prod.reduce((s, v) => s + v, 0) / prod.length;
    const edad = parseInt(vaca.edad) || 0;
    const lactancia = parseInt(vaca.lactancia) || 0;
    const factor = findFactor(vaca.raza, edad, lactancia);
    const corregida = factor !== null ? promedio * factor : null;

    return {
      id_vaca: vaca.id_vaca,
      potencial,
      prod,
      promedio,
      factor,
      corregida,
    };
  });

  return (
    <FormLayout title="Cálculo Producción Wood 305">
      {vacasConPotencial.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No hay vacas con potencial definido. Agregue vacas en Registros Básicos con un valor de "Potencial Vaca" para ver los cálculos.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Fórmula de Wood</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                Prod. Potencial = (potencial_vaca × 0.00318) × (día ^ 0.1027) × e^(-0.003 × día)
              </code>
            </CardContent>
          </Card>

          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Id Vaca</TableHead>
                  <TableHead>Potencial (lt)</TableHead>
                  <TableHead>Día 30</TableHead>
                  <TableHead>Día 120</TableHead>
                  <TableHead>Día 210</TableHead>
                  <TableHead>Día 270</TableHead>
                  <TableHead>Promedio Lact.</TableHead>
                  <TableHead>Factor</TableHead>
                  <TableHead>Prod. Corregida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id_vaca}>
                    <TableCell className="font-medium">{r.id_vaca}</TableCell>
                    <TableCell>{r.potencial.toLocaleString()}</TableCell>
                    {r.prod.map((p, i) => (
                      <TableCell key={i}>{p.toFixed(2)}</TableCell>
                    ))}
                    <TableCell className="font-medium">{r.promedio.toFixed(2)}</TableCell>
                    <TableCell>{r.factor !== null ? r.factor.toFixed(3) : <span className="text-muted-foreground text-xs">Sin factor</span>}</TableCell>
                    <TableCell className="font-bold">{r.corregida !== null ? r.corregida.toFixed(2) : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </FormLayout>
  );
};

export default ProduccionWood;
