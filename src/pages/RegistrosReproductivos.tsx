import { useState } from "react";
import FormLayout from "@/components/FormLayout";
import FieldInput from "@/components/FieldInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const initialState = {
  ejercicio: "",
  idVaca: "",
  parto: "",
  raza: "",
  servicio1: "",
  servicio2: "",
  servicio3: "",
  concepcion1: "",
  toroUsado: "",
  aborto1: "",
  aborto2: "",
  parto1: "",
};

const RegistrosReproductivos = () => {
  const [form, setForm] = useState(initialState);

  const update = (key: string) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registro reproductivo guardado correctamente");
    setForm(initialState);
  };

  return (
    <FormLayout title="Registros Reproductivos">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FieldInput label="Ejercicio" value={form.ejercicio} onChange={update("ejercicio")} />
          <FieldInput label="#Id Vaca" value={form.idVaca} onChange={update("idVaca")} />
          <FieldInput label="Parto" value={form.parto} onChange={update("parto")} type="date" highlighted />
          <FieldInput label="Raza" value={form.raza} onChange={update("raza")} highlighted />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FieldInput label="Servicio 1" value={form.servicio1} onChange={update("servicio1")} type="date" highlighted />
          <FieldInput label="Servicio 2" value={form.servicio2} onChange={update("servicio2")} type="date" highlighted />
          <FieldInput label="Servicio 3" value={form.servicio3} onChange={update("servicio3")} type="date" highlighted />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FieldInput label="Concepción 1" value={form.concepcion1} onChange={update("concepcion1")} type="date" highlighted />
          <FieldInput label="Toro Usado" value={form.toroUsado} onChange={update("toroUsado")} highlighted />
          <FieldInput label="Aborto 1" value={form.aborto1} onChange={update("aborto1")} type="date" highlighted />
          <FieldInput label="Aborto 2" value={form.aborto2} onChange={update("aborto2")} type="date" highlighted />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FieldInput label="Parto 1" value={form.parto1} onChange={update("parto1")} type="date" highlighted />
        </div>

        <Button type="submit" className="w-full md:w-auto px-8">
          Guardar Registro
        </Button>
      </form>
    </FormLayout>
  );
};

export default RegistrosReproductivos;
