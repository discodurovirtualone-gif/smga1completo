import { useState } from "react";
import FormLayout from "@/components/FormLayout";
import FieldInput from "@/components/FieldInput";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGanaderia, calcWood } from "@/context/GanaderiaContext";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

const DIAS = [30, 120, 210, 270] as const;
const POTENCIALES = [2000, 3000, 4000, 5000, 6000, 7000];

interface ProduccionDiaria {
  id_vaca: string;
  prodReal: [string, string, string, string]; // días 30, 120, 210, 270
}

const ProduccionWood = () => {
  const { registrosBasicos, factores } = useGanaderia();
  const [prodDiaria, setProdDiaria] = useState<ProduccionDiaria[]>([]);
  const [form, setForm] = useState<ProduccionDiaria>({ id_vaca: "", prodReal: ["", "", "", ""] });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const vacasConPotencial = registrosBasicos.filter((v) => parseFloat(v.potencial_vaca) > 0);

  const findFactor = (raza: string, edad: number, lactancia: number): number | null => {
    const razaMap: Record<string, string> = { "1": "Holstein", "2": "Jersey" };
    const razaNombre = razaMap[raza] || raza;
    const match = factores.find(
      (f) => f.raza === razaNombre && f.edad === edad && f.lactancia === lactancia
    );
    return match ? match.factor : null;
  };

  // For each potencial value, calculate Wood production at a given day
  const woodForPotencial = (pot: number, dia: number) => calcWood(pot, dia);

  // Find the potencial whose Wood value is closest to produccion_real
  const findClosestPotencial = (prodReal: number, dia: number): number => {
    let closest = POTENCIALES[0];
    let minDiff = Math.abs(woodForPotencial(POTENCIALES[0], dia) - prodReal);
    for (const pot of POTENCIALES) {
      const diff = Math.abs(woodForPotencial(pot, dia) - prodReal);
      if (diff < minDiff) {
        minDiff = diff;
        closest = pot;
      }
    }
    return closest;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_vaca) { toast.error("Id Vaca es obligatorio"); return; }
    if (editIndex !== null) {
      setProdDiaria((prev) => prev.map((r, i) => (i === editIndex ? form : r)));
      toast.success("Registro actualizado");
    } else {
      setProdDiaria((prev) => [...prev, form]);
      toast.success("Registro agregado");
    }
    setForm({ id_vaca: "", prodReal: ["", "", "", ""] });
    setEditIndex(null);
    setOpen(false);
  };

  const startEdit = (i: number) => { setForm(prodDiaria[i]); setEditIndex(i); setOpen(true); };
  const startNew = () => { setForm({ id_vaca: "", prodReal: ["", "", "", ""] }); setEditIndex(null); setOpen(true); };

  // Build result rows combining registrosBasicos + prodDiaria
  const rows = prodDiaria.map((pd) => {
    const vaca = registrosBasicos.find((v) => v.id_vaca === pd.id_vaca);
    const reales = pd.prodReal.map((v) => parseFloat(v) || 0);

    // Assign closest potencial per day
    const potAsignados = DIAS.map((dia, i) => findClosestPotencial(reales[i], dia));
    const potPromedio = potAsignados.reduce((s, v) => s + v, 0) / potAsignados.length;

    // Wood production using potencial from registrosBasicos
    const potencialVaca = vaca ? parseFloat(vaca.potencial_vaca) || 0 : 0;
    const prodWood = DIAS.map((d) => calcWood(potencialVaca, d));
    const promedioWood = prodWood.reduce((s, v) => s + v, 0) / prodWood.length;

    const edad = vaca ? parseInt(vaca.edad) || 0 : 0;
    const lactancia = vaca ? parseInt(vaca.lactancia) || 0 : 0;
    const factor = vaca ? findFactor(vaca.raza, edad, lactancia) : null;
    const corregida = factor !== null ? potPromedio * factor : null;

    return {
      id_vaca: pd.id_vaca,
      potencialVaca,
      reales,
      potAsignados,
      potPromedio,
      prodWood,
      promedioWood,
      factor,
      corregida,
    };
  });

  // Also show vacas with potencial but no prodDiaria entry
  const vacasSinProd = vacasConPotencial.filter(
    (v) => !prodDiaria.some((pd) => pd.id_vaca === v.id_vaca)
  );
  const rowsSinProd = vacasSinProd.map((vaca) => {
    const potencial = parseFloat(vaca.potencial_vaca);
    const prod = DIAS.map((d) => calcWood(potencial, d));
    const promedio = prod.reduce((s, v) => s + v, 0) / prod.length;
    const edad = parseInt(vaca.edad) || 0;
    const lactancia = parseInt(vaca.lactancia) || 0;
    const factor = findFactor(vaca.raza, edad, lactancia);
    const corregida = factor !== null ? promedio * factor : null;
    return { id_vaca: vaca.id_vaca, potencial, prod, promedio, factor, corregida };
  });

  return (
    <FormLayout title="Cálculo Producción Wood 305">
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

      {/* Producción Diaria Input */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Producción Diaria (Real)</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Agregar</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editIndex !== null ? "Editar Producción" : "Nueva Producción Diaria"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldInput label="Id Vaca" value={form.id_vaca} onChange={(v) => setForm((p) => ({ ...p, id_vaca: v }))} type="number" />
                <div className="grid grid-cols-2 gap-4">
                  {DIAS.map((dia, i) => (
                    <FieldInput
                      key={dia}
                      label={`Prod. Real Día ${dia} (lt)`}
                      value={form.prodReal[i]}
                      onChange={(v) => {
                        const newProd = [...form.prodReal] as [string, string, string, string];
                        newProd[i] = v;
                        setForm((p) => ({ ...p, prodReal: newProd }));
                      }}
                      type="number"
                    />
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit">{editIndex !== null ? "Actualizar" : "Guardar"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        {prodDiaria.length > 0 && (
          <CardContent>
            <div className="rounded-lg border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Id Vaca</TableHead>
                    {DIAS.map((d) => <TableHead key={d}>Real D{d}</TableHead>)}
                    {DIAS.map((d) => <TableHead key={`pa${d}`}>Pot.Asig D{d}</TableHead>)}
                    <TableHead>Prom. Pot.</TableHead>
                    <TableHead>Factor</TableHead>
                    <TableHead>Prod. Corregida</TableHead>
                    <TableHead className="w-16">Acc.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={r.id_vaca}>
                      <TableCell className="font-medium">{r.id_vaca}</TableCell>
                      {r.reales.map((v, j) => <TableCell key={j}>{v.toFixed(1)}</TableCell>)}
                      {r.potAsignados.map((v, j) => <TableCell key={j} className="text-primary font-medium">{v.toLocaleString()}</TableCell>)}
                      <TableCell className="font-bold">{r.potPromedio.toFixed(0)}</TableCell>
                      <TableCell>{r.factor !== null ? r.factor.toFixed(3) : <span className="text-muted-foreground text-xs">Sin factor</span>}</TableCell>
                      <TableCell className="font-bold">{r.corregida !== null ? r.corregida.toFixed(2) : "—"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => startEdit(i)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Wood calculations from potencial_vaca in RegistrosBasicos */}
      {rowsSinProd.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Producción Estimada (desde Potencial Vaca)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Id Vaca</TableHead>
                    <TableHead>Potencial (lt)</TableHead>
                    {DIAS.map((d) => <TableHead key={d}>Día {d}</TableHead>)}
                    <TableHead>Promedio Lact.</TableHead>
                    <TableHead>Factor</TableHead>
                    <TableHead>Prod. Corregida</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rowsSinProd.map((r) => (
                    <TableRow key={r.id_vaca}>
                      <TableCell className="font-medium">{r.id_vaca}</TableCell>
                      <TableCell>{r.potencial.toLocaleString()}</TableCell>
                      {r.prod.map((p, i) => <TableCell key={i}>{p.toFixed(2)}</TableCell>)}
                      <TableCell className="font-medium">{r.promedio.toFixed(2)}</TableCell>
                      <TableCell>{r.factor !== null ? r.factor.toFixed(3) : <span className="text-muted-foreground text-xs">Sin factor</span>}</TableCell>
                      <TableCell className="font-bold">{r.corregida !== null ? r.corregida.toFixed(2) : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {vacasConPotencial.length === 0 && prodDiaria.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No hay datos. Agregue vacas en Registros Básicos o ingrese producción diaria real.
          </CardContent>
        </Card>
      )}
    </FormLayout>
  );
};

export default ProduccionWood;
