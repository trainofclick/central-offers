/**
 * DonationSelector.tsx
 * Componente React para seleção de valores de doação
 */

import { useState } from "react";
import { formatCurrency } from "@lib/utils";
import { fbEvents } from "@lib/tracking";

interface DonationValue {
  value: number;
  label: string;
  popular?: boolean;
}

interface DonationSelectorProps {
  values?: DonationValue[];
  defaultValue?: number;
  onSelect?: (value: number) => void;
  onSubmit?: (value: number) => void;
}

const defaultValues: DonationValue[] = [
  { value: 27, label: "R$ 27", popular: false },
  { value: 47, label: "R$ 47", popular: true },
  { value: 97, label: "R$ 97", popular: false },
];

export default function DonationSelector({
  values = defaultValues,
  defaultValue,
  onSelect,
  onSubmit,
}: DonationSelectorProps) {
  const [selectedValue, setSelectedValue] = useState<number>(
    defaultValue || values.find((v) => v.popular)?.value || values[0].value
  );
  const [customValue, setCustomValue] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
    setIsCustom(false);
    setCustomValue("");
    onSelect?.(value);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCustomValue(value);
    if (value) {
      const numValue = parseInt(value);
      setSelectedValue(numValue);
      setIsCustom(true);
      onSelect?.(numValue);
    }
  };

  const handleSubmit = async () => {
    if (selectedValue < 1) return;

    setIsLoading(true);

    // Track AddToCart
    fbEvents.addToCart({
      contentName: "Contribuição",
      value: selectedValue,
    });

    // Call onSubmit or redirect
    if (onSubmit) {
      onSubmit(selectedValue);
    } else {
      // Default: redirect to payment/PIX generation
      // TODO: Integrate with your payment gateway
      window.location.href = `/obrigado?value=${selectedValue}`;
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Value Options */}
      <div className="grid grid-cols-3 gap-3">
        {values.map((item) => (
          <button
            key={item.value}
            onClick={() => handleSelect(item.value)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              ${
                selectedValue === item.value && !isCustom
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-gray-200 hover:border-primary/50"
              }
            `}
          >
            {item.popular && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                Popular
              </span>
            )}
            <span className="text-2xl font-bold text-secondary">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Custom Value */}
      <div>
        <label className="block text-sm text-text-muted mb-2">
          Ou digite outro valor:
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            R$
          </span>
          <input
            type="text"
            value={customValue}
            onChange={handleCustomChange}
            placeholder="0"
            className={`
              w-full pl-10 pr-4 py-3 rounded-lg border-2 text-lg font-medium
              focus:outline-none focus:border-primary transition
              ${isCustom ? "border-primary bg-primary/5" : "border-gray-200"}
            `}
          />
        </div>
      </div>

      {/* Selected Summary */}
      <div className="p-4 bg-surface rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-text-muted">Valor selecionado:</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(selectedValue)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedValue < 1 || isLoading}
        className={`
          w-full py-4 px-6 rounded-xl font-bold text-lg text-white
          transition-all duration-200 uppercase tracking-wide
          ${
            selectedValue < 1 || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processando...
          </span>
        ) : (
          `CONTRIBUIR ${formatCurrency(selectedValue)}`
        )}
      </button>

      {/* Trust Badge */}
      <p className="text-center text-sm text-text-muted">
        Pagamento processado de forma segura via PIX
      </p>
    </div>
  );
}
