"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Video, Clock, ChevronLeft, CheckCircle, Mail, User, Calendar, XCircle, AlertTriangle } from "lucide-react"
import { saveSession } from "@/lib/sessions"

// Posibles resultados de la confirmación
const possibleOutcomes = [
  "success", // reserva confirmada
  "slot_taken", // 409 SLOT_TAKEN
  "out_of_window", // 422 OUT_OF_WINDOW
  "network_error", // genérico
]

// Mock data del turno seleccionado
const selectedAppointment = {
  therapistId: "t1",
  therapistName: "Dra. María Gómez",
  sessionTypeId: "st1",
  sessionType: "Sesión online",
  duration: "60 minutos",
  date: "Martes 30 de julio",
  time: "10:00 – 11:00",
  startUtc: "2025-07-30T13:00:00Z",
  modality: "online",
}

export default function ConfirmAppointment() {
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const handleConfirm = async () => {
    if (!patientName.trim() || !patientEmail.trim()) return

    setIsLoading(true)
    setError("") // Limpiar errores previos

    // Simular llamada a API con posibles errores
    const mockPayload = {
      therapistId: selectedAppointment.therapistId,
      sessionTypeId: selectedAppointment.sessionTypeId,
      startUtc: selectedAppointment.startUtc,
      patientId: "user123",
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientTz: "America/Argentina/Buenos_Aires",
    }

    console.log("Payload simulado:", mockPayload)

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular resultado aleatorio
    const randomOutcome = possibleOutcomes[Math.floor(Math.random() * possibleOutcomes.length)]

    setIsLoading(false)

    if (randomOutcome === "success") {
      // Guardar sesión en localStorage
      const sessionToSave = {
        id: `session_${Date.now()}`,
        therapistName: selectedAppointment.therapistName,
        startInPatientTz: selectedAppointment.startUtc,
        endInPatientTz: new Date(new Date(selectedAppointment.startUtc).getTime() + 60 * 60 * 1000).toISOString(),
        modality: selectedAppointment.modality as "online" | "in_person",
        durationMin: 60,
        patientEmail: patientEmail.trim(),
        status: "confirmed" as const,
      }

      saveSession(sessionToSave)
      setIsConfirmed(true)
    } else {
      setError(randomOutcome)
    }
  }

  const handleRetry = () => {
    setError("")
    handleConfirm()
  }

  const isFormValid = patientName.trim().length > 0 && patientEmail.trim().length > 0

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-4">¡Listo!</h1>
            <h2 className="text-xl text-emerald-800 mb-4">Tu sesión fue reservada</h2>
            <p className="text-emerald-700 leading-relaxed mb-6">
              Vamos a enviarte los detalles por email junto con el enlace para tu sesión online.
            </p>
          </div>

          <Card className="border-emerald-200 bg-emerald-50 mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-emerald-900 mb-4">Resumen de tu sesión</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800">
                    {selectedAppointment.date} · {selectedAppointment.time}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800">{selectedAppointment.sessionType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800">{selectedAppointment.therapistName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800">{patientEmail}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/">
            <Button className="w-full py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Volver al inicio
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
        {/* Header con navegación */}
        <div className="flex items-center mb-6 pt-8">
          <Link href={`/therapist/${selectedAppointment.therapistId}/availability`}>
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

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">Confirmá tu sesión</h1>
          <p className="text-emerald-700">Revisá los detalles y completá tus datos</p>
        </div>

        {/* Resumen del turno */}
        <Card className="border-emerald-300 bg-emerald-50 shadow-md mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-emerald-900 mb-4 text-center">Resumen de tu turno</h3>

            <div className="space-y-4">
              {/* Fecha y horario */}
              <div className="text-center p-4 bg-white rounded-lg border border-emerald-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900 text-lg">{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{selectedAppointment.time}</span>
                </div>
              </div>

              {/* Detalles de la sesión */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white rounded-lg border border-emerald-200">
                  <Video className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-emerald-900">{selectedAppointment.sessionType}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-emerald-200">
                  <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-emerald-900">{selectedAppointment.duration}</p>
                </div>
              </div>

              {/* Profesional */}
              <div className="text-center p-3 bg-white rounded-lg border border-emerald-200">
                <div className="w-8 h-8 bg-emerald-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-700">MG</span>
                </div>
                <p className="font-medium text-emerald-900">{selectedAppointment.therapistName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de datos personales */}
        <Card className="border-emerald-200 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-emerald-900 mb-6">Completá tus datos</h3>

            <div className="space-y-6">
              {/* Nombre */}
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

              {/* Email */}
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

        {/* Manejo de errores */}
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

        {/* Botón de confirmación */}
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

        {/* Mensaje de apoyo */}
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
