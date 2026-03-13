import { useState } from "react";
import FormLayout from "@/components/FormLayout";
import FieldInput from "@/components/FieldInput";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

const H2_LECHE = 0.25; // heredabilidad base
const R_REPETIBILIDAD = 0.5; // repetibilidad

interface ValorCriaRow {
  id_vaca: string;
  prodCorregidas: string; // comma-separated production per lactancia
}

const empty: ValorCriaRow = { id_vaca: "", prodCorregidas: "" };

const calcH2m = (n: number): number => {
  if (n <= 0) return 0;
  return (H2_LECHE * n) / (1 + (n - 1) * R_REPETIBILIDAD);
};

const ValorCria = () => {
  const [data, setData] = useState<ValorCriaRow[]>([]);
  const [form, setForm] = useState<ValorCriaRow>(empty);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string>("valor_cria");
  const [sortAsc, setSortAsc] = useState(false);

  const update = (key: keyof ValorCriaRow) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_vaca) { toast.error("Id Vaca es obligatorio"); return; }
    if (editIndex !== null) {
      setData((prev) => prev.map((r, i) => (i === editIndex ? form : r)));
      toast.success("Registro actualizado");
    } else {
      setData((prev) => [...prev, form]);
      toast.success("Registro agregado");
    }
    setForm(empty); setEditIndex(null); setOpen(false);
  };

  const startEdit = (i: number) => { setForm(data[i]); setEditIndex(i); setOpen(true); };
  const startNew = () => { setForm(empty); setEditIndex(null); setOpen(true); };

  // Parse all entries and compute values
  const parsed = data.map((d, origIdx) => {
    const prods = d.prodCorregidas.split(",").map((v) => parseFloat(v.trim())).filter((v) => !isNaN(v));
    return { ...d, origIdx, prods };
  });

  // Calculate promedio_rodeo per lactancia position
  const maxLact = Math.max(0, ...parsed.map((p) => p.prods.length));
  const promediosPorLact: number[] = [];
  for (let l = 0; l < maxLact; l++) {
    const vals = parsed.map((p) => p.prods[l]).filter((v) => v !== undefined);
    promediosPorLact[l] = vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
  }

  const computed = parsed.map((p) => {
    const diffs = p.prods.map((prod, i) => prod - (promediosPorLact[i] || 0));
    const totalDiff = diffs.reduce((s, v) => s + v, 0);
    const diffPromedio = diffs.length > 0 ? totalDiff / diffs.length : 0;
    const n = p.prods.length;
    const h2m = calcH2m(n);
    const valorCria = diffPromedio * h2m;
    const valorCriaHijas = valorCria * 0.5;
    const promProd = n > 0 ? p.prods.reduce((s, v) => s + v, 0) / n : 0;

    return {
      ...p,
      promProd,
      diffPromedio,
      n,
      h2m,
      valorCria,
      valorCriaHijas,
    };
  });

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(key === "id_vaca"); }
  };

  const sorted = [...computed].sort((a, b) => {
    let va: number, vb: number;
    switch (sortKey) {
      case "id_vaca": va = parseInt(a.id_vaca) || 0; vb = parseInt(b.id_vaca) || 0; break;
      case "valor_cria": va = a.valorCria; vb = b.valorCria; break;
      case "valor_cria_hijas": va = a.valorCriaHijas; vb = b.valorCriaHijas; break;
      default: va = 0; vb = 0;
    }
    return sortAsc ? va - vb : vb - va;
  });

  const SortHead = ({ label, k }: { label: string; k: string }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(k)}>
      <span className="flex items-center gap-1">{label} <ArrowUpDown className="h-3 w-3" /></span>
    </TableHead>
  );

  return (
    <FormLayout title="Valor de Cría (BV)">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Fórmulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><code className="bg-muted px-2 py-0.5 rounded">H2m = (h² × n) / (1 + (n-1) × R)</code> — h²={H2_LECHE}, R={R_REPETIBILIDAD}</div>
          <div><code className="bg-muted px-2 py-0.5 rounded">Valor Cría = Dif. Promedio × H2m</code></div>
          <div><code className="bg-muted px-2 py-0.5 rounded">Valor Cría Hijas = Valor Cría × 0.5</code></div>
        </CardContent>
      </Card>

      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Agregar Vaca</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editIndex !== null ? "Editar" : "Nueva Vaca"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldInput label="Id Vaca" value={form.id_vaca} onChange={update("id_vaca")} type="number" />
              <FieldInput
                label="Producciones Corregidas (separadas por coma)"
                value={form.prodCorregidas}
                onChange={update("prodCorregidas")}
                placeholder="Ej: 5200, 5800, 6100"
              />
              <p className="text-xs text-muted-foreground">Ingrese la producción corregida (Wood305) de cada lactancia separada por comas.</p>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">{editIndex !== null ? "Actualizar" : "Guardar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <SortHead label="Id Vaca" k="id_vaca" />
              <TableHead>Prod. Prom.</TableHead>
              <TableHead>Prom. Rodeo</TableHead>
              <TableHead>Dif. Promedio</TableHead>
              <TableHead>n (Lact.)</TableHead>
              <TableHead>H2m</TableHead>
              <SortHead label="Valor Cría" k="valor_cria" />
              <SortHead label="VC Hijas" k="valor_cria_hijas" />
              <TableHead className="w-16">Acc.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No hay datos. Agregue vacas con sus producciones corregidas.
                </TableCell>
              </TableRow>
            ) : sorted.map((r) => {
              const promRodeo = r.prods.length > 0
                ? r.prods.map((_, i) => promediosPorLact[i] || 0).reduce((s, v) => s + v, 0) / r.prods.length
                : 0;
              return (
                <TableRow key={r.id_vaca}>
                  <TableCell className="font-medium">{r.id_vaca}</TableCell>
                  <TableCell>{r.promProd.toFixed(1)}</TableCell>
                  <TableCell>{promRodeo.toFixed(1)}</TableCell>
                  <TableCell className={r.diffPromedio >= 0 ? "text-green-600 font-medium" : "text-destructive font-medium"}>
                    {r.diffPromedio >= 0 ? "+" : ""}{r.diffPromedio.toFixed(1)}
                  </TableCell>
                  <TableCell>{r.n}</TableCell>
                  <TableCell>{r.h2m.toFixed(4)}</TableCell>
                  <TableCell className="font-bold">{r.valorCria.toFixed(1)}</TableCell>
                  <TableCell className="font-bold">{r.valorCriaHijas.toFixed(1)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(r.origIdx)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </FormLayout>
  );
};

export default ValorCria;
