"use client";

import { useState } from "react";
import { Calculator, Atom, Zap, Waves, Mountain, Activity } from "lucide-react";

type CalculatorType = "force" | "kinetic" | "ohm" | "potential" | "wave";

interface CalcConfig {
  id: CalculatorType;
  title: string;
  formula: string;
  icon: React.ElementType;
  inputs: { name: string; label: string; placeholder: string; unit: string }[];
  calculate: (values: number[]) => number;
}

const calculators: CalcConfig[] = [
  {
    id: "force",
    title: "Force (Deuxième loi de Newton)",
    formula: "F = m × a",
    icon: Activity,
    inputs: [
      { name: "mass", label: "Masse", placeholder: "Ex: 10", unit: "kg" },
      { name: "acceleration", label: "Accélération", placeholder: "Ex: 9.81", unit: "m/s²" },
    ],
    calculate: ([m, a]) => m * a,
  },
  {
    id: "kinetic",
    title: "Énergie Cinétique",
    formula: "Ec = ½mv²",
    icon: Atom,
    inputs: [
      { name: "mass", label: "Masse", placeholder: "Ex: 10", unit: "kg" },
      { name: "velocity", label: "Vitesse", placeholder: "Ex: 20", unit: "m/s" },
    ],
    calculate: ([m, v]) => 0.5 * m * v * v,
  },
  {
    id: "ohm",
    title: "Loi d'Ohm",
    formula: "V = I × R",
    icon: Zap,
    inputs: [
      { name: "current", label: "Intensité", placeholder: "Ex: 2", unit: "A" },
      { name: "resistance", label: "Résistance", placeholder: "Ex: 100", unit: "Ω" },
    ],
    calculate: ([I, R]) => I * R,
  },
  {
    id: "potential",
    title: "Énergie Potentielle Gravitationnelle",
    formula: "Ep = mgh",
    icon: Mountain,
    inputs: [
      { name: "mass", label: "Masse", placeholder: "Ex: 10", unit: "kg" },
      { name: "height", label: "Hauteur", placeholder: "Ex: 5", unit: "m" },
      { name: "gravity", label: "Gravité", placeholder: "Ex: 9.81", unit: "m/s²" },
    ],
    calculate: ([m, h, g]) => m * g * h,
  },
  {
    id: "wave",
    title: "Vitesse d'une Onde",
    formula: "v = f × λ",
    icon: Waves,
    inputs: [
      { name: "frequency", label: "Fréquence", placeholder: "Ex: 50", unit: "Hz" },
      { name: "wavelength", label: "Longueur d'onde", placeholder: "Ex: 2", unit: "m" },
    ],
    calculate: ([f, λ]) => f * λ,
  },
];

export function PhysicsCalculator() {
  const [activeCalc, setActiveCalc] = useState<CalculatorType>("force");
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);

  const activeConfig = calculators.find((c) => c.id === activeCalc)!;

  const handleInputChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setResult(null);
  };

  const calculate = () => {
    const inputValues = activeConfig.inputs.map((input) => parseFloat(values[input.name] || "0"));
    if (inputValues.every((v) => !isNaN(v) && v !== 0)) {
      setResult(activeConfig.calculate(inputValues));
    }
  };

  const getUnit = () => {
    switch (activeCalc) {
      case "force":
        return "N";
      case "kinetic":
        return "J";
      case "ohm":
        return "V";
      case "potential":
        return "J";
      case "wave":
        return "m/s";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/80 px-8 py-12 shadow-[0_40px_120px_rgba(0,0,0,0.24)]">
      <div className="text-center">
        <Calculator className="mx-auto h-12 w-12 text-cyan-300" />
        <h3 className="mt-4 text-2xl font-semibold text-slate-50">Calculateur Physique</h3>
        <p className="mt-2 text-slate-300">Modules de calcul pour la physique</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {calculators.map((calc) => {
          const Icon = calc.icon;
          return (
            <button
              key={calc.id}
              onClick={() => {
                setActiveCalc(calc.id);
                setValues({});
                setResult(null);
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCalc === calc.id
                  ? "bg-cyan-300 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {calc.title.split(" (")[0]}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-lg bg-slate-800 px-4 py-2 text-lg font-mono text-cyan-300">
            {activeConfig.formula}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeConfig.inputs.map((input) => (
            <div key={input.name}>
              <label className="block text-sm font-medium text-slate-300">
                {input.label} ({input.unit})
              </label>
              <input
                type="number"
                value={values[input.name] || ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-50 focus:border-cyan-300 focus:outline-none"
                placeholder={input.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={calculate}
        className="mt-6 w-full rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Calculer
      </button>

      {result !== null && (
        <div className="mt-4 rounded-lg bg-slate-800 p-4 text-center">
          <p className="text-lg text-slate-50">
            {activeConfig.title.split(" (")[0]} = <span className="font-bold text-cyan-300">{result.toFixed(2)} {getUnit()}</span>
          </p>
        </div>
      )}
    </div>
  );
}
