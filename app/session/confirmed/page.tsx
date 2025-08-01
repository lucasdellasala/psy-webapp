"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, User, Calendar, Video, Clock, Mail, AlertTriangle, XCircle, Home } from "lucide-react"
import { formatDateWithWeekday } from "@/lib/utils"
import { getSessions, type Session } from "@/lib/sessions"

export default function SessionConfirmed() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('id')
  
  const [session, setSession] = useState<Session | null>(null)
  const [sessionStatus, setSessionStatus] = useState<string>("pending")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  // Cargar datos de la sesión
  useEffect(() => {
    if (sessionId) {
      const sessions = getSessions()
      const foundSession = sessions.find(s => s.id === sessionId)
      if (foundSession) {
        setSession(foundSession)
        setSessionStatus(foundSession.status)
      }
      setIsLoadingSession(false)
    }
  }, [sessionId])

  // Formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const dayName = date.toLocaleDateString("es-AR", { weekday: "long" })
    const dayNumber = date.getDate()
    const month = date.toLocaleDateString("es-AR", { month: "long" })
    const time = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })

    return {
      dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      dayNumber,
      month,
      time,
      fullDate: formatDateWithWeekday(dateString.split('T')[0]), // Usar nuestra función de utilidad
    }
  }

  // Loading state
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-emerald-900 mb-2">Cargando...</h1>
            <p className="text-emerald-700">Obteniendo datos de la sesión</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state - sesión no encontrada
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-900 mb-2">Sesión no encontrada</h1>
            <p className="text-red-700 mb-6">No se pudo encontrar la sesión solicitada</p>
            <Link href="/my-sessions">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Ver mis sesiones
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const startDateTime = formatDateTime(session.startInPatientTz)
  const endTime = new Date(session.endInPatientTz).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleCancelSession = async () => {
    setIsLoading(true)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSessionStatus("cancelled")
    setShowCancelDialog(false)
    setIsLoading(false)
  }

  if (sessionStatus === "cancelled") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-900 mb-4">Sesión cancelada</h1>
            <p className="text-red-700 leading-relaxed mb-6">
              Tu sesión fue cancelada correctamente. Si cambiás de opinión, podés agendar una nueva sesión cuando
              quieras.
            </p>
          </div>

          <Card className="border-red-200 bg-red-50 mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-red-900 mb-4">Sesión cancelada</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{session.therapistName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">
                    {startDateTime.fullDate} · {startDateTime.time} – {endTime}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">Sesión online</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                <Home className="w-5 h-5 mr-2" />
                Buscar nueva sesión
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Volver al inicio
              </Button>
            </Link>
          </div>

          <p className="text-red-600 text-sm mt-6">
            Si tenés alguna consulta sobre la cancelación,
            <br />
            podés contactarnos por WhatsApp o email.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto pt-12">
        {/* Mensaje de confirmación */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-4">
            {sessionStatus === "confirmed" 
              ? "¡Tu sesión fue confirmada!"
              : "¡Tu sesión fue reservada con éxito!"
            }
          </h1>
          <p className="text-emerald-700 leading-relaxed">
            {sessionStatus === "confirmed"
              ? "Tu sesión está confirmada. Te enviamos todos los detalles por email."
              : "Te enviamos todos los detalles por email. El profesional confirmará tu sesión pronto."
            }
          </p>
        </div>

        {/* Detalles de la sesión */}
        <Card className="border-emerald-300 bg-emerald-50 shadow-md mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-emerald-900 mb-6 text-center">Detalles de tu sesión</h3>

            <div className="space-y-5">
              {/* Profesional */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Profesional</p>
                  <p className="text-emerald-900 font-semibold">{session.therapistName}</p>
                </div>
              </div>

              {/* Fecha y horario */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Día y horario</p>
                  <p className="text-emerald-900 font-semibold">{startDateTime.fullDate}</p>
                  <p className="text-emerald-700">
                    {startDateTime.time} – {endTime}
                  </p>
                </div>
              </div>

              {/* Modalidad */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                  <Video className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Modalidad</p>
                  <p className="text-emerald-900 font-semibold">
                    {session.modality === "online" ? "Online" : "Presencial"}
                  </p>
                </div>
              </div>

              {/* Duración */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Duración</p>
                  <p className="text-emerald-900 font-semibold">{session.durationMin} minutos</p>
                </div>
              </div>

              {/* Email de confirmación */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Confirmación enviada a</p>
                  <p className="text-emerald-900 font-semibold">{session.patientEmail}</p>
                </div>
              </div>
            </div>

            {/* Estado de la sesión */}
            <div className="mt-6 text-center">
              <Badge className={
                sessionStatus === "confirmed" 
                  ? "bg-emerald-600 text-white px-4 py-2"
                  : sessionStatus === "canceled"
                  ? "bg-red-600 text-white px-4 py-2"
                  : "bg-orange-600 text-white px-4 py-2"
              }>
                {sessionStatus === "confirmed" 
                  ? "Sesión confirmada"
                  : sessionStatus === "canceled"
                  ? "Sesión cancelada"
                  : "Sesión pendiente de confirmación"
                }
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="space-y-4 mb-8">
          <Link href="/">
            <Button className="w-full py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <Home className="w-5 h-5 mr-2" />
              Volver al inicio
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => setShowCancelDialog(true)}
            className="w-full py-3 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
          >
            Cancelar sesión
          </Button>
        </div>

        {/* Mensaje de apoyo */}
        <div className="text-center text-emerald-600 text-sm">
          <p>
            Si tenés alguna consulta o necesitás reprogramar,
            <br />
            contactanos por WhatsApp o email.
          </p>
        </div>

        {/* Modal de confirmación de cancelación */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-center text-red-900">
                ¿Estás seguro de que querés cancelar esta sesión?
              </DialogTitle>
              <DialogDescription className="text-center text-red-700">
                Esta acción no se puede deshacer. Si cancelás, tendrás que agendar una nueva sesión desde el inicio.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-3 sm:flex-col">
              <Button
                onClick={handleCancelSession}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Cancelando...
                  </div>
                ) : (
                  "Sí, cancelar sesión"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                disabled={isLoading}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                No, mantener sesión
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
