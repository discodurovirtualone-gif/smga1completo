import { useState, useCallback } from "react";
import FormLayout from "@/components/FormLayout";
import FieldInput from "@/components/FieldInput";
import FieldSelect from "@/components/FieldSelect";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Pencil, ArrowUpDown } from "lucide-react";

const ejercicioOptions = Array.from({ length: 10 }, (_, i) => {
  const y = 2020 + i;
  return { value: `${y % 100}/${(y + 1) % 100}`, label: `${y % 100}/${(y + 1) % 100}` };
});

interface Registro {
  ejercicio: string;
  id_vaca: string;
  reg_1_dia30: string;
  reg_2_dia120: string;
  reg_3_dia210: string;
  reg_4_dia270: string;
  lc305_wood: string;
  porcentaje_grasa: string;
  porcentaje_proteina: string;
  lact1: string;
  lact2: string;
  lact3: string;
  lact4: string;
  lact5: string;
}

const emptyRegistro: Registro = {
  ejercicio: "", id_vaca: "",
  reg_1_dia30: "", reg_2_dia120: "", reg_3_dia210: "", reg_4_dia270: "",
  lc305_wood: "", porcentaje_grasa: "", porcentaje_proteina: "",
  lact1: "", lact2: "", lact3: "", lact4: "", lact5: "",
};

const calcKg = (lc305: string, pct: string) => {
  const l = parseFloat(lc305);
  const p = parseFloat(pct);
  if (isNaN(l) || isNaN(p)) return "";
  return (l * (p / 100)).toFixed(2);
};

type SortKey = "id_vaca" | "lc305_wood" | "porcentaje_grasa" | "porcentaje_proteina" | "lact1" | "lact2" | "lact3" | "lact4" | "lact5";

const RegistrosProductivos = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [form, setForm] = useState<Registro>(emptyRegistro);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const update = (key: keyof Registro) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_vaca) {
      toast.error("El campo Id Vaca es obligatorio");
      return;
    }
    if (editIndex !== null) {
      setRegistros((prev) => prev.map((r, i) => (i === editIndex ? form : r)));
      toast.success("Registro actualizado");
    } else {
      setRegistros((prev) => [...prev, form]);
      toast.success("Registro agregado");
    }
    setForm(emptyRegistro);
    setEditIndex(null);
    setOpen(false);
  };

  const startEdit = (index: number) => {
    setForm(registros[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const startNew = () => {
    setForm(emptyRegistro);
    setEditIndex(null);
    setOpen(true);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = registros.filter((r) =>
    filterText === "" || r.id_vaca.includes(filterText)
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const va = parseFloat(a[sortKey]) || 0;
        const vb = parseFloat(b[sortKey]) || 0;
        return sortAsc ? va - vb : vb - va;
      })
    : filtered;

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(field)}>
      <span className="inline-flex items-center gap-1">
        {label} <ArrowUpDown className="h-3 w-3" />
      </span>
    </TableHead>
  );

  return (
    <FormLayout title="Registros Productivos">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <Input
          placeholder="Filtrar por Id Vaca..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-xs"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew}>
              <Plus className="h-4 w-4 mr-2" /> Agregar Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editIndex !== null ? "Editar Registro" : "Nuevo Registro"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FieldSelect label="Ejercicio" value={form.ejercicio} onChange={update("ejercicio")} options={ejercicioOptions} placeholder="Seleccionar" />
                <FieldInput label="Id Vaca" value={form.id_vaca} onChange={update("id_vaca")} type="number" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground pt-2">Registros de Control</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FieldInput label="Reg 1 Día 30" value={form.reg_1_dia30} onChange={update("reg_1_dia30")} type="number" highlighted />
                <FieldInput label="Reg 2 Día 120" value={form.reg_2_dia120} onChange={update("reg_2_dia120")} type="number" highlighted />
                <FieldInput label="Reg 3 Día 210" value={form.reg_3_dia210} onChange={update("reg_3_dia210")} type="number" highlighted />
                <FieldInput label="Reg 4 Día 270" value={form.reg_4_dia270} onChange={update("reg_4_dia270")} type="number" highlighted />
              </div>
              <p className="text-sm font-semibold text-muted-foreground pt-2">Producción</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FieldInput label="LC305 Wood (lt)" value={form.lc305_wood} onChange={update("lc305_wood")} type="number" highlighted />
                <FieldInput label="% Grasa" value={form.porcentaje_grasa} onChange={update("porcentaje_grasa")} type="number" highlighted />
                <FieldInput label="% Proteína" value={form.porcentaje_proteina} onChange={update("porcentaje_proteina")} type="number" highlighted />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FieldInput label="Kg Grasa (auto)" value={calcKg(form.lc305_wood, form.porcentaje_grasa)} onChange={() => {}} />
                <FieldInput label="Kg Proteína (auto)" value={calcKg(form.lc305_wood, form.porcentaje_proteina)} onChange={() => {}} />
              </div>
              <p className="text-sm font-semibold text-muted-foreground pt-2">Lactancias (litros)</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <FieldInput label="Lact 1" value={form.lact1} onChange={update("lact1")} type="number" />
                <FieldInput label="Lact 2" value={form.lact2} onChange={update("lact2")} type="number" />
                <FieldInput label="Lact 3" value={form.lact3} onChange={update("lact3")} type="number" />
                <FieldInput label="Lact 4" value={form.lact4} onChange={update("lact4")} type="number" />
                <FieldInput label="Lact 5" value={form.lact5} onChange={update("lact5")} type="number" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
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
              <SortHeader label="Id Vaca" field="id_vaca" />
              <TableHead>R1 D30</TableHead>
              <TableHead>R2 D120</TableHead>
              <TableHead>R3 D210</TableHead>
              <TableHead>R4 D270</TableHead>
              <SortHeader label="LC305" field="lc305_wood" />
              <SortHeader label="% Grasa" field="porcentaje_grasa" />
              <SortHeader label="% Prot" field="porcentaje_proteina" />
              <TableHead>Kg Grasa</TableHead>
              <TableHead>Kg Prot</TableHead>
              <SortHeader label="L1" field="lact1" />
              <SortHeader label="L2" field="lact2" />
              <SortHeader label="L3" field="lact3" />
              <SortHeader label="L4" field="lact4" />
              <SortHeader label="L5" field="lact5" />
              <TableHead className="w-16">Acc.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className="text-center text-muted-foreground py-8">
                  No hay registros. Haga clic en "Agregar Registro" para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.id_vaca}</TableCell>
                  <TableCell>{r.reg_1_dia30}</TableCell>
                  <TableCell>{r.reg_2_dia120}</TableCell>
                  <TableCell>{r.reg_3_dia210}</TableCell>
                  <TableCell>{r.reg_4_dia270}</TableCell>
                  <TableCell>{r.lc305_wood}</TableCell>
                  <TableCell>{r.porcentaje_grasa}</TableCell>
                  <TableCell>{r.porcentaje_proteina}</TableCell>
                  <TableCell>{calcKg(r.lc305_wood, r.porcentaje_grasa)}</TableCell>
                  <TableCell>{calcKg(r.lc305_wood, r.porcentaje_proteina)}</TableCell>
                  <TableCell>{r.lact1}</TableCell>
                  <TableCell>{r.lact2}</TableCell>
                  <TableCell>{r.lact3}</TableCell>
                  <TableCell>{r.lact4}</TableCell>
                  <TableCell>{r.lact5}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(i)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </FormLayout>
  );
};

export default RegistrosProductivos;
