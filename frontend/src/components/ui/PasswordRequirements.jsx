import { Check, X } from 'lucide-react'

export default function PasswordRequirements({ password = '' }) {
  const reqLength = password.length >= 6 && password.length <= 20
  const reqUpper = /[A-Z]/.test(password)
  const reqNumber = /[0-9]/.test(password)

  const Item = ({ met, text }) => (
    <li className={`flex items-center gap-1.5 transition-colors ${met ? 'text-green-400' : 'text-gray-400'}`}>
      {met ? <Check size={14} className="shrink-0" /> : <X size={14} className="shrink-0 opacity-50" />}
      <span>{text}</span>
    </li>
  )

  return (
    <ul className="text-xs mt-2 space-y-1">
      <Item met={reqLength} text="Entre 6 e 20 caracteres" />
      <Item met={reqUpper} text="Pelo menos 1 letra maiúscula" />
      <Item met={reqNumber} text="Pelo menos 1 número" />
    </ul>
  )
}
