import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function Loading({ size = "md", text, className = "" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-emerald-600`} />
      {text && <span className="text-emerald-600">{text}</span>}
    </div>
  )
}

export function LoadingSpinner({ size = "md", className = "" }: Omit<LoadingProps, "text">) {
  return <Loading size={size} className={className} />
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <Loading size="lg" text="Cargando..." />
        <p className="text-emerald-600 mt-4">Conectando con el servidor...</p>
      </div>
    </div>
  )
} 