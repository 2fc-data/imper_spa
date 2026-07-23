import { forwardRef } from 'react'

function applyCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function applyPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function applyCurrency(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  const num = Number(digits) / 100
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const maskMap = {
  cnpj: applyCNPJ,
  phone: applyPhone,
  currency: applyCurrency,
} as const

export type MaskType = keyof typeof maskMap

export function getRawValue(value: string, mask?: MaskType): string {
  if (!mask) return value
  if (mask === 'currency') return value.replace(/\D/g, '')
  return value.replace(/\D/g, '')
}

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  mask?: MaskType
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value, onChange, error, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      if (!mask) {
        onChange(raw)
        return
      }
      const formatter = maskMap[mask]
      onChange(formatter(raw))
    }

    const base = 'w-full px-4 py-2 rounded-lg border bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]'
    const border = error ? 'border-red-500' : 'border-[var(--border)]'

    return (
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        className={`${base} ${border} ${className ?? ''}`}
        {...props}
      />
    )
  }
)

MaskedInput.displayName = 'MaskedInput'
