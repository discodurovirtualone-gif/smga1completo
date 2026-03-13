import { useState } from "react";
import FormLayout from "@/components/FormLayout";
import FieldInput from "@/components/FieldInput";
import FieldSelect from "@/components/FieldSelect";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";

const ejercicioOptions = Array.from({ length: 10 }, (_, i) => {
  const y = 2020 + i;
  return { value: `${y % 100}/${(y + 1) % 100}`, label: `${y % 100}/${(y + 1) % 100}` };
});

const partosOptions = [
  { value: "Primípara", label: "Primípara" },
  { value: "Multípara", label: "Multípara" },
];

interface Registro {
  ejercicio: string;
  id_vaca: string;
  partos: string;
  fecha_nacimiento: string;
  raza: string;
  lactancia: string;
  edad: string;
}

const emptyRegistro: Registro = {
  ejercicio: "",
  id_vaca: "",
  partos: "",
  fecha_nacimiento: "",
  raza: "",
  lactancia: "",
  edad: "",
};

const RegistrosBasicos = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [form, setForm] = useState<Registro>(emptyRegistro);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

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

  return (
    <FormLayout title="Registros Básicos">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew}>
              <Plus className="h-4 w-4 mr-2" /> Agregar Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editIndex !== null ? "Editar Registro" : "Nuevo Registro"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldSelect label="Ejercicio" value={form.ejercicio} onChange={update("ejercicio")} options={ejercicioOptions} placeholder="Seleccionar" />
                <FieldInput label="Id Vaca" value={form.id_vaca} onChange={update("id_vaca")} type="number" />
                <FieldSelect label="Partos" value={form.partos} onChange={update("partos")} options={partosOptions} placeholder="Seleccionar" />
                <FieldInput label="Fecha Nacimiento" value={form.fecha_nacimiento} onChange={update("fecha_nacimiento")} type="date" />
                <FieldInput label="Raza (código)" value={form.raza} onChange={update("raza")} type="number" />
                <FieldInput label="Lactancia" value={form.lactancia} onChange={update("lactancia")} type="number" />
                <FieldInput label="Edad (años)" value={form.edad} onChange={update("edad")} type="number" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">{editIndex !== null ? "Actualizar" : "Guardar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Id Vaca</TableHead>
              <TableHead>Partos</TableHead>
              <TableHead>Fecha Nacimiento</TableHead>
              <TableHead>Raza</TableHead>
              <TableHead>Lactancia</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead className="w-16">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay registros. Haga clic en "Agregar Registro" para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              registros.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.id_vaca}</TableCell>
                  <TableCell>{r.partos}</TableCell>
                  <TableCell>{r.fecha_nacimiento}</TableCell>
                  <TableCell>{r.raza}</TableCell>
                  <TableCell>{r.lactancia}</TableCell>
                  <TableCell>{r.edad}</TableCell>
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

export default RegistrosBasicos;
