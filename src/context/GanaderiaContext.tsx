import { createContext, useContext, useState, ReactNode } from "react";

export interface RegistroBasico {
  ejercicio: string;
  id_vaca: string;
  partos: string;
  fecha_nacimiento: string;
  raza: string;
  lactancia: string;
  edad: string;
  potencial_vaca: string;
}

export interface RegistroProductivo {
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

export interface FactorCorreccion {
  raza: string;
  nivel_produccion: string;
  edad: number;
  lactancia: number;
  factor: number;
}

export const defaultFactores: FactorCorreccion[] = [
  { raza: "Holstein", nivel_produccion: "Alto", edad: 2, lactancia: 1, factor: 1.222 },
  { raza: "Holstein", nivel_produccion: "Alto", edad: 3, lactancia: 1, factor: 1.187 },
  { raza: "Holstein", nivel_produccion: "Alto", edad: 3, lactancia: 2, factor: 1.056 },
  { raza: "Holstein", nivel_produccion: "Alto", edad: 4, lactancia: 1, factor: 1.127 },
  { raza: "Holstein", nivel_produccion: "Alto", edad: 4, lactancia: 2, factor: 1.021 },
  { raza: "Holstein", nivel_produccion: "Alto", edad: 4, lactancia: 3, factor: 1.000 },
];

// Wood formula
export const calcWood = (potencial_vaca: number, dia: number): number => {
  return (potencial_vaca * 0.00318) * Math.pow(dia, 0.1027) * Math.exp(-0.003 * dia);
};

interface GanaderiaContextType {
  registrosBasicos: RegistroBasico[];
  setRegistrosBasicos: React.Dispatch<React.SetStateAction<RegistroBasico[]>>;
  registrosProductivos: RegistroProductivo[];
  setRegistrosProductivos: React.Dispatch<React.SetStateAction<RegistroProductivo[]>>;
  factores: FactorCorreccion[];
  setFactores: React.Dispatch<React.SetStateAction<FactorCorreccion[]>>;
}

const GanaderiaContext = createContext<GanaderiaContextType | undefined>(undefined);

export const GanaderiaProvider = ({ children }: { children: ReactNode }) => {
  const [registrosBasicos, setRegistrosBasicos] = useState<RegistroBasico[]>([]);
  const [registrosProductivos, setRegistrosProductivos] = useState<RegistroProductivo[]>([]);
  const [factores, setFactores] = useState<FactorCorreccion[]>(defaultFactores);

  return (
    <GanaderiaContext.Provider value={{
      registrosBasicos, setRegistrosBasicos,
      registrosProductivos, setRegistrosProductivos,
      factores, setFactores,
    }}>
      {children}
    </GanaderiaContext.Provider>
  );
};

export const useGanaderia = () => {
  const ctx = useContext(GanaderiaContext);
  if (!ctx) throw new Error("useGanaderia must be used within GanaderiaProvider");
  return ctx;
};
