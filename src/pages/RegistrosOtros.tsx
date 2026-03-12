import { useState } from "react";
import FormLayout from "@/components/FormLayout";
import FieldInput from "@/components/FieldInput";
import FieldSelect from "@/components/FieldSelect";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ejercicioOptions = Array.from({ length: 10 }, (_, i) => {
  const y = 2020 + i;
  return { value: `${y}/${y + 1}`, label: `${y}/${y + 1}` };
});

const initialState = {
  ejercicio: "",
  idVaca: "",
  renguera: "",
  mastitis: "",
  facParto: "",
  longevidad: "",
  fortalezaPatas: "",
};

const RegistrosOtros = () => {
  const [form, setForm] = useState(initialState);

  const update = (key: string) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registro guardado correctamente");
    setForm(initialState);
  };

  return (
    <FormLayout title="Registros Otros">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FieldSelect label="Ejercicio" value={form.ejercicio} onChange={update("ejercicio")} options={ejercicioOptions} placeholder="Seleccionar año" />
          <FieldInput label="#Id Vaca" value={form.idVaca} onChange={update("idVaca")} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FieldInput label="Renguera (1-5)" value={form.renguera} onChange={update("renguera")} type="number" highlighted placeholder="1-5" />
          <FieldInput label="Mastitis (1-5)" value={form.mastitis} onChange={update("mastitis")} type="number" highlighted placeholder="1-5" />
          <FieldInput label="Fac. Parto (1-5)" value={form.facParto} onChange={update("facParto")} type="number" highlighted placeholder="1-5" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FieldInput label="Longevidad (1-5)" value={form.longevidad} onChange={update("longevidad")} type="number" highlighted placeholder="1-5" />
          <FieldInput label="Fortaleza Patas (1-5)" value={form.fortalezaPatas} onChange={update("fortalezaPatas")} type="number" highlighted placeholder="1-5" />
        </div>

        <Button type="submit" className="w-full md:w-auto px-8">
          Guardar Registro
        </Button>
      </form>
    </FormLayout>
  );
};

export default RegistrosOtros;
