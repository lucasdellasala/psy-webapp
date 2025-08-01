"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Video, Clock, ChevronLeft, CheckCircle, Mail, User, Calendar, XCircle, AlertTriangle } from "lucide-react"
import { saveSession } from "@/lib/sessions"
import { formatDateToSpanish, formatDateWithWeekday, generateUUID } from "@/lib/utils"
import { createSession } from "@/lib/api-client"

const possibleOutcomes = [
  "success",
  "slot_taken",
  "out_of_window", 
  "network_error",
]

export default function ConfirmAppointment() {
  const searchParams = useSearchParams()
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(true)

  useEffect(() => {
    const therapistId = searchParams.get('therapistId')
    const therapistName = searchParams.get('therapistName')
    const sessionTypeId = searchParams.get('sessionTypeId')
    const sessionType = searchParams.get('sessionType')
    const slotId = searchParams.get('slotId')
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    const startUtc = searchParams.get('startUtc')
    const endUtc = searchParams.get('endUtc')
    const modality = searchParams.get('modality')

    if (therapistId && therapistName && sessionTypeId && sessionType && slotId && date && time && startUtc) {
      const appointment = {
        therapistId,
        therapistName,
        sessionTypeId,
        sessionType,
        slotId,
        date,
        time,
        startUtc,
        endUtc,
        modality: modality || 'online',
      }
      setSelectedAppointment(appointment)
    }
    setIsLoadingAppointment(false)
  }, [searchParams])

  const handleConfirm = async () => {
    if (!patientName.trim() || !patientEmail.trim() || !selectedAppointment) return

    setIsLoading(true)
    setError("")

    try {
      const sessionPayload = {
        therapistId: selectedAppointment.therapistId,
        sessionTypeId: selectedAppointment.sessionTypeId,
        startUtc: selectedAppointment.startUtc,
        patientId: `user_${Date.now()}`,
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientTz: "America/Argentina/Buenos_Aires",
      }

      const idempotencyKey = generateUUID()
      const response = await createSession(sessionPayload, idempotencyKey)

      const sessionId = response.id || response.data?.id

      if (!sessionId) {
        throw new Error("No se recibió ID de sesión del backend")
      }

      const sessionToSave = {
        id: sessionId,
        therapistName: selectedAppointment.therapistName,
        startInPatientTz: response.data?.startInPatientTz || response.startInPatientTz || selectedAppointment.startUtc,
        endInPatientTz: response.data?.endInPatientTz || response.endInPatientTz || selectedAppointment.endUtc || new Date(new Date(selectedAppointment.startUtc).getTime() + 60 * 60 * 1000).toISOString(),
        modality: response.data?.modality || response.modality || selectedAppointment.modality as "online" | "in_person",
        durationMin: response.data?.durationMin || response.durationMin || 60,
        patientEmail: patientEmail.trim(),
        status: (response.data?.status || response.status || "pending")?.toLowerCase() as "pending" | "confirmed" | "canceled",
      }

      saveSession(sessionToSave)
      setIsConfirmed(true)
      
      setTimeout(() => {
        window.location.href = `/session/confirmed?id=${sessionToSave.id}`
      }, 1500)

    } catch (error: any) {
      console.error("Error confirmando sesión:", error)
      
      if (error.status === 409) {
        setError("slot_taken")
      } else if (error.status === 422) {
        setError("out_of_window")
      } else if (error.status >= 500) {
        setError("network_error")
      } else {
        setError("network_error")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError("")
    handleConfirm()
  }

  const isFormValid = patientName.trim().length > 0 && patientEmail.trim().length > 0 && selectedAppointment

  if (isLoadingAppointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-emerald-900 mb-2">Cargando...</h1>
            <p className="text-emerald-700">Obteniendo datos del turno</p>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedAppointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-900 mb-2">Error</h1>
            <p className="text-red-700 mb-6">No se encontraron los datos del turno seleccionado</p>
            <Link href={`/therapist/${searchParams.get('therapistId')}/availability`}>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Volver a seleccionar turno
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-4">¡Reserva enviada!</h1>
            <h2 className="text-xl text-emerald-800 mb-4">Tu sesión está pendiente de confirmación</h2>
            <p className="text-emerald-700 leading-relaxed mb-6">
              El profesional revisará tu solicitud y te confirmará la sesión. Te notificaremos por email cuando esté confirmada.
            </p>
          </div>

          <Card className="border-emerald-200 bg-emerald-50 mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-emerald-900 mb-4">Resumen de tu solicitud</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800">
                    {selectedAppointment?.date ? formatDateToSpanish(selectedAppointment.date) : ''} · {selectedAppointment?.time}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800">{selectedAppointment?.sessionType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800">{selectedAppointment?.therapistName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800">{patientEmail}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/my-sessions">
            <Button className="w-full py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Ver mis solicitudes
            </Button>
          </Link>

          <p className="text-emerald-600 text-sm mt-6">
            Si tenés alguna consulta, podés contactarnos
            <br />
            por WhatsApp o email.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6 pt-8">
          <Link href={`/therapist/${selectedAppointment?.therapistId || searchParams.get('therapistId')}/availability`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <span className="text-emerald-600 text-sm ml-2">Volver</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">Confirmá tu sesión</h1>
          <p className="text-emerald-700">Revisá los detalles y completá tus datos</p>
        </div>

        <Card className="border-emerald-300 bg-emerald-50 shadow-md mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-emerald-900 mb-4 text-center">Resumen de tu turno</h3>

            <div className="space-y-4">
              <div className="text-center p-4 bg-white rounded-lg border border-emerald-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900 text-lg">
                    {selectedAppointment?.date ? formatDateToSpanish(selectedAppointment.date) : 'Cargando...'}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{selectedAppointment?.time || 'Cargando...'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white rounded-lg border border-emerald-200">
                  <Video className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-emerald-900">{selectedAppointment?.sessionType || 'Cargando...'}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-emerald-200">
                  <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-emerald-900">60 minutos</p>
                </div>
              </div>

              <div className="text-center p-3 bg-white rounded-lg border border-emerald-200">
                <div className="w-8 h-8 bg-emerald-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-700">MG</span>
                </div>
                <p className="font-medium text-emerald-900">{selectedAppointment?.therapistName || 'Cargando...'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-emerald-900 mb-6">Completá tus datos</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-emerald-800 font-medium mb-2">¿Cuál es tu nombre?</label>
                <Input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-emerald-800 font-medium mb-2">
                  ¿A qué email te enviamos la confirmación?
                </label>
                <Input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card
            className={`mb-6 ${
              error === "network_error" ? "border-yellow-300 bg-yellow-50" : "border-red-300 bg-red-50"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${
                    error === "slot_taken"
                      ? "bg-red-100"
                      : error === "out_of_window"
                        ? "bg-orange-100"
                        : "bg-yellow-100"
                  }`}
                >
                  {error === "slot_taken" && <XCircle className="w-5 h-5 text-red-600" />}
                  {error === "out_of_window" && <Calendar className="w-5 h-5 text-orange-600" />}
                  {error === "network_error" && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-2 ${
                      error === "slot_taken"
                        ? "text-red-900"
                        : error === "out_of_window"
                          ? "text-orange-900"
                          : "text-yellow-900"
                    }`}
                  >
                    {error === "slot_taken" && "Turno ya tomado"}
                    {error === "out_of_window" && "Horario no disponible"}
                    {error === "network_error" && "Error de conexión"}
                  </h4>
                  <p
                    className={`text-sm mb-3 ${
                      error === "slot_taken"
                        ? "text-red-700"
                        : error === "out_of_window"
                          ? "text-orange-700"
                          : "text-yellow-700"
                    }`}
                  >
                    {error === "slot_taken" &&
                      "Ese turno fue tomado mientras completabas el formulario. Elegí otro horario."}
                    {error === "out_of_window" && "Ese horario ya no está disponible. Probá con otra semana."}
                    {error === "network_error" &&
                      "Tuvimos un problema al guardar tu reserva. Intentá de nuevo en unos segundos."}
                  </p>
                  <div className="flex gap-2">
                    {error === "slot_taken" && (
                      <Link href={`/therapist/${selectedAppointment.therapistId}/availability`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                        >
                          Volver a los horarios
                        </Button>
                      </Link>
                    )}
                    {error === "out_of_window" && (
                      <Link href={`/therapist/${selectedAppointment.therapistId}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                        >
                          Cambiar semana
                        </Button>
                      </Link>
                    )}
                    {error === "network_error" && (
                      <Button size="sm" onClick={handleRetry} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                        Reintentar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8">
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid || isLoading}
            className="w-full py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirmando sesión...
              </div>
            ) : (
              "Confirmar sesión"
            )}
          </Button>

          {!isFormValid && (
            <p className="text-emerald-600 text-sm text-center mt-2">Completá tu nombre y email para continuar</p>
          )}
        </div>

        <div className="text-center text-emerald-600 text-sm">
          <p>
            Al confirmar, aceptás nuestros términos de servicio.
            <br />
            Podés cancelar o reprogramar hasta 24hs antes.
          </p>
        </div>
      </div>
    </div>
  )
}
