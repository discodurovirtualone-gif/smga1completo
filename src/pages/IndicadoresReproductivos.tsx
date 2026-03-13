import { useState } from "react";
import FormLayout from "@/components/FormLayout";
import FieldInput from "@/components/FieldInput";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

interface IndicadorRepro {
  id_vaca: string;
  iip: string;       // intervalo interpartos (días)
  ipc: string;       // intervalo parto-concepción (días)
  serv_conc: string;  // servicios por concepción
}

const empty: IndicadorRepro = { id_vaca: "", iip: "", ipc: "", serv_conc: "" };

const IndicadoresReproductivos = () => {
  const [data, setData] = useState<IndicadorRepro[]>([]);
  const [form, setForm] = useState<IndicadorRepro>(empty);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [sortKey, setSortKey] = useState<keyof IndicadorRepro>("id_vaca");
  const [sortAsc, setSortAsc] = useState(true);

  const update = (key: keyof IndicadorRepro) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_vaca) { toast.error("Id Vaca es obligatorio"); return; }
    if (editIndex !== null) {
      setData((prev) => prev.map((r, i) => (i === editIndex ? form : r)));
      toast.success("Indicador actualizado");
    } else {
      setData((prev) => [...prev, form]);
      toast.success("Indicador agregado");
    }
    setForm(empty); setEditIndex(null); setOpen(false);
  };

  const startEdit = (i: number) => { setForm(data[i]); setEditIndex(i); setOpen(true); };
  const startNew = () => { setForm(empty); setEditIndex(null); setOpen(true); };

  const toggleSort = (key: keyof IndicadorRepro) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  // Calculate ranking based on composite score (lower iip + lower ipc + lower serv_conc = better)
  const scored = data.map((d, origIdx) => {
    const iip = parseFloat(d.iip) || 9999;
    const ipc = parseFloat(d.ipc) || 9999;
    const sc = parseInt(d.serv_conc) || 99;
    const score = iip + ipc + sc * 30; // weighted composite
    return { ...d, origIdx, score };
  });
  scored.sort((a, b) => a.score - b.score);
  const ranked = scored.map((s, i) => ({ ...s, ranking: i + 1 }));

  // Apply user sort
  const sorted = [...ranked].sort((a, b) => {
    const va = sortKey === "id_vaca" ? a[sortKey] : parseFloat(a[sortKey]) || 0;
    const vb = sortKey === "id_vaca" ? b[sortKey] : parseFloat(b[sortKey]) || 0;
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  const SortHead = ({ label, k }: { label: string; k: keyof IndicadorRepro }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(k)}>
      <span className="flex items-center gap-1">{label} <ArrowUpDown className="h-3 w-3" /></span>
    </TableHead>
  );

  return (
    <FormLayout title="Indicadores Reproductivos">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Agregar Indicador</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editIndex !== null ? "Editar Indicador" : "Nuevo Indicador"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Id Vaca" value={form.id_vaca} onChange={update("id_vaca")} type="number" />
                <FieldInput label="IIP (días)" value={form.iip} onChange={update("iip")} type="number" placeholder="Intervalo interpartos" />
                <FieldInput label="IPC (días)" value={form.ipc} onChange={update("ipc")} type="number" placeholder="Intervalo parto-concepción" />
                <FieldInput label="Serv/Conc" value={form.serv_conc} onChange={update("serv_conc")} type="number" placeholder="Servicios por concepción" />
              </div>
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
              <SortHead label="IIP (días)" k="iip" />
              <SortHead label="IPC (días)" k="ipc" />
              <SortHead label="Serv/Conc" k="serv_conc" />
              <TableHead>Ranking</TableHead>
              <TableHead className="w-16">Acc.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay indicadores. Haga clic en "Agregar Indicador" para comenzar.
                </TableCell>
              </TableRow>
            ) : sorted.map((r) => (
              <TableRow key={r.id_vaca}>
                <TableCell className="font-medium">{r.id_vaca}</TableCell>
                <TableCell>{r.iip || "—"}</TableCell>
                <TableCell>{r.ipc || "—"}</TableCell>
                <TableCell>{r.serv_conc || "—"}</TableCell>
                <TableCell className="font-bold text-primary">{r.ranking}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(r.origIdx)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.length > 0 && (
        <Card className="mt-4">
          <CardContent className="py-4 text-sm text-muted-foreground">
            <strong>Ranking:</strong> Se calcula automáticamente combinando IIP + IPC + (Serv/Conc × 30). Menor puntaje = mejor posición reproductiva.
          </CardContent>
        </Card>
      )}
    </FormLayout>
  );
};

export default IndicadoresReproductivos;
