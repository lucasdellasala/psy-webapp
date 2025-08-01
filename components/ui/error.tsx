import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "./button"

interface ErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function Error({ 
  title = "Algo salió mal", 
  message = "Ocurrió un error inesperado. Intentá de nuevo.",
  onRetry,
  className = ""
}: ErrorProps) {
  return (
    <div className={`text-center p-6 ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 text-sm mb-4">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      )}
    </div>
  )
}

export function ErrorPage({ 
  title = "Error de conexión",
  message = "No pudimos conectar con el servidor. Verificá tu conexión e intentá de nuevo.",
  onRetry
}: ErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <Error title={title} message={message} onRetry={onRetry} />
      </div>
    </div>
  )
} 