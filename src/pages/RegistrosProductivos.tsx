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
  id: "",
  reg1Dia30: "",
  reg2Dia120: "",
  reg3Dia210: "",
  reg4Dia270: "",
  grasa: "",
  proteina: "",
};

const RegistrosProductivos = () => {
  const [form, setForm] = useState(initialState);

  const update = (key: string) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registro productivo guardado correctamente");
    setForm(initialState);
  };

  return (
    <FormLayout title="Registros Productivos">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FieldSelect label="Ejercicio" value={form.ejercicio} onChange={update("ejercicio")} options={ejercicioOptions} placeholder="Seleccionar año" />
          <FieldInput label="# Id" value={form.id} onChange={update("id")} />
          <FieldInput label="Reg_1_Dia 30" value={form.reg1Dia30} onChange={update("reg1Dia30")} type="number" highlighted />
          <FieldInput label="Reg_2_Dia 120" value={form.reg2Dia120} onChange={update("reg2Dia120")} type="number" highlighted />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FieldInput label="Reg_3_Dia 210" value={form.reg3Dia210} onChange={update("reg3Dia210")} type="number" highlighted />
          <FieldInput label="Reg_4_Dia 270" value={form.reg4Dia270} onChange={update("reg4Dia270")} type="number" highlighted />
          <FieldInput label="% Grasa" value={form.grasa} onChange={update("grasa")} type="number" highlighted />
          <FieldInput label="% Proteína" value={form.proteina} onChange={update("proteina")} type="number" highlighted />
        </div>

        <Button type="submit" className="w-full md:w-auto px-8">
          Guardar Registro
        </Button>
      </form>
    </FormLayout>
  );
};

export default RegistrosProductivos;
