/**
 * LeadForm.tsx
 * Formulário multi-step para captura de leads financeiros
 * Steps: 1. CPF, 2. Nome, 3. Telefone, 4. Email
 */

import { useState } from "react";
import { isValidCPF, formatPhone, isValidEmail } from "@lib/utils";
import { fbEvents } from "@lib/tracking";

interface LeadFormProps {
  onComplete?: (data: LeadData) => void;
}

interface LeadData {
  cpf: string;
  nome: string;
  telefone: string;
  email: string;
}

const TOTAL_STEPS = 4;

export default function LeadForm({ onComplete }: LeadFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<LeadData>({
    cpf: "",
    nome: "",
    telefone: "",
    email: "",
  });

  // Format CPF as user types
  const formatCPF = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9)
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    setErrors({});

    switch (step) {
      case 1: {
        const cpfClean = formData.cpf.replace(/\D/g, "");
        if (!cpfClean) {
          setErrors({ cpf: "CPF é obrigatório" });
          return false;
        }
        if (!isValidCPF(cpfClean)) {
          setErrors({ cpf: "CPF inválido" });
          return false;
        }
        return true;
      }
      case 2: {
        if (!formData.nome.trim()) {
          setErrors({ nome: "Nome é obrigatório" });
          return false;
        }
        if (formData.nome.trim().split(" ").length < 2) {
          setErrors({ nome: "Digite seu nome completo" });
          return false;
        }
        return true;
      }
      case 3: {
        const phoneClean = formData.telefone.replace(/\D/g, "");
        if (!phoneClean) {
          setErrors({ telefone: "Telefone é obrigatório" });
          return false;
        }
        if (phoneClean.length < 10 || phoneClean.length > 11) {
          setErrors({ telefone: "Telefone inválido" });
          return false;
        }
        return true;
      }
      case 4: {
        if (!formData.email.trim()) {
          setErrors({ email: "Email é obrigatório" });
          return false;
        }
        if (!isValidEmail(formData.email)) {
          setErrors({ email: "Email inválido" });
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  };

  // Handle next step
  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle previous step
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  // Handle input change
  const handleChange = (field: keyof LeadData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors({});
  };

  // Handle CPF input
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    handleChange("cpf", formatted);
  };

  // Handle phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    handleChange("telefone", formatted);
  };

  // Handle key press (Enter to continue)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      // Save to localStorage
      localStorage.setItem("leadData", JSON.stringify(formData));

      // Track Lead event
      fbEvents.lead({
        contentName: "Lead Form Completed",
        contentCategory: "LEAD_GENERATION",
      });

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(formData);
      } else {
        // Default: redirect to analysis page
        window.location.href = "/analise";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Erro ao enviar formulário. Tente novamente." });
      setIsLoading(false);
    }
  };

  // Progress percentage
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-text-muted mb-2">
          <span>Passo {currentStep} de {TOTAL_STEPS}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        {/* Step 1: CPF */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-secondary mb-2">
                Digite seu CPF
              </h2>
              <p className="text-text-muted">
                Seus dados estão seguros e protegidos
              </p>
            </div>

            <div>
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-text-muted mb-2"
              >
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={handleCPFChange}
                onKeyPress={handleKeyPress}
                placeholder="000.000.000-00"
                maxLength={14}
                autoFocus
                className={`
                  w-full px-4 py-3 rounded-lg border-2 text-lg
                  focus:outline-none focus:border-primary transition
                  ${errors.cpf ? "border-red-500" : "border-gray-200"}
                `}
              />
              {errors.cpf && (
                <p className="mt-2 text-sm text-red-500">{errors.cpf}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Nome */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-secondary mb-2">
                Qual é o seu nome?
              </h2>
              <p className="text-text-muted">Digite seu nome completo</p>
            </div>

            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-text-muted mb-2"
              >
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="João da Silva"
                autoFocus
                className={`
                  w-full px-4 py-3 rounded-lg border-2 text-lg
                  focus:outline-none focus:border-primary transition
                  ${errors.nome ? "border-red-500" : "border-gray-200"}
                `}
              />
              {errors.nome && (
                <p className="mt-2 text-sm text-red-500">{errors.nome}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Telefone */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📱</div>
              <h2 className="text-2xl font-bold text-secondary mb-2">
                Qual seu telefone?
              </h2>
              <p className="text-text-muted">
                Para enviarmos suas ofertas por WhatsApp
              </p>
            </div>

            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-text-muted mb-2"
              >
                Telefone/WhatsApp
              </label>
              <input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={handlePhoneChange}
                onKeyPress={handleKeyPress}
                placeholder="(11) 99999-9999"
                maxLength={15}
                autoFocus
                className={`
                  w-full px-4 py-3 rounded-lg border-2 text-lg
                  focus:outline-none focus:border-primary transition
                  ${errors.telefone ? "border-red-500" : "border-gray-200"}
                `}
              />
              {errors.telefone && (
                <p className="mt-2 text-sm text-red-500">{errors.telefone}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Email */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="text-2xl font-bold text-secondary mb-2">
                Qual seu e-mail?
              </h2>
              <p className="text-text-muted">
                Para enviarmos suas ofertas personalizadas
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-muted mb-2"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="seu@email.com"
                autoFocus
                className={`
                  w-full px-4 py-3 rounded-lg border-2 text-lg
                  focus:outline-none focus:border-primary transition
                  ${errors.email ? "border-red-500" : "border-gray-200"}
                `}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {currentStep > 1 && (
          <button
            onClick={handlePrev}
            disabled={isLoading}
            className="flex-1 py-3 px-6 rounded-xl font-medium text-secondary border-2 border-gray-200 hover:border-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Voltar
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`
            ${currentStep === 1 ? "w-full" : "flex-1"}
            py-3 px-6 rounded-xl font-bold text-white
            transition-all duration-200 uppercase tracking-wide
            ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
          ) : currentStep === TOTAL_STEPS ? (
            "FINALIZAR"
          ) : (
            "CONTINUAR"
          )}
        </button>
      </div>

      {/* Privacy Note */}
      <p className="mt-6 text-center text-xs text-text-muted">
        Ao continuar, você concorda com nossa Política de Privacidade e Termos
        de Uso. Seus dados são protegidos pela LGPD.
      </p>
    </div>
  );
}
