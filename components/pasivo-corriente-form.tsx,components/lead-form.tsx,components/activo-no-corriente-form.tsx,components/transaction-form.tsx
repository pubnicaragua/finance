––– components/pasivo-corriente-form.tsx –––
\`\`\`tsx

interface PasivoCorrienteFormProps {
  initialData?: any
  onSuccess?: () => void
}

export default function CurrentLiabilityForm({ initialData, onSuccess }: PasivoCorrienteFormProps) {
  return (
    <div>
      {/* Form content goes here */}
      <h2>Current Liability Form</h2>
    </div>
  )
}

// exportación nombrada requerida por las páginas
export { CurrentLiabilityForm }
\`\`\`

––– components/lead-form.tsx –––
\`\`\`tsx

interface LeadFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function LeadForm({ initialData, onSuccess }: LeadFormProps) {
  return (
    <div>
      {/* Form content goes here */}
      <h2>Lead Form</h2>
    </div>
  )
}

\`\`\`

––– components/activo-no-corriente-form.tsx –––
\`\`\`tsx

interface ActivoNoCorrienteFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function ActivoNoCorrienteForm({ initialData, onSuccess }: ActivoNoCorrienteFormProps) {
  return (
    <div>
      {/* Form content goes here */}
      <h2>Activo No Corriente Form</h2>
    </div>
  )
}

\`\`\`

––– components/transaction-form.tsx –––
\`\`\`tsx

interface TransactionFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function TransactionForm({ initialData, onSuccess }: TransactionFormProps) {
  return (
    <div>
      {/* Form content goes here */}
      <h2>Transaction Form</h2>
    </div>
  )
}

\`\`\`
