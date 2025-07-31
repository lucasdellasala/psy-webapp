"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
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
import { Video, MapPin, Clock, Calendar, User, ChevronLeft, AlertTriangle, CalendarX } from "lucide-react"
import { getSessions, cancelSession, type Session } from "@/lib/sessions"

export default function MySessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [sessionToCancel, setSessionToCancel] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSessions(getSessions())
  }, [])

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const dayName = date.toLocaleDateString("es-AR", { weekday: "long" })
    const dayNumber = date.getDate()
    const month = date.toLocaleDateString("es-AR", { month: "long" })
    const time = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })

    return {
      fullDate: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNumber} de ${month}`,
      time,
    }
  }

  const handleCancelClick = (sessionId: string) => {
    setSessionToCancel(sessionId)
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = async () => {
    setIsLoading(true)

    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    cancelSession(sessionToCancel)
    setSessions(getSessions())
    setShowCancelDialog(false)
    setSessionToCancel("")
    setIsLoading(false)
  }

  const confirmedSessions = sessions.filter((s) => s.status === "confirmed")
  const canceledSessions = sessions.filter((s) => s.status === "canceled")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header con navegación */}
        <div className="flex items-center mb-6 pt-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <span className="text-emerald-600 text-sm ml-2">Volver al inicio</span>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">Mis sesiones</h1>
          <p className="text-emerald-700">Acá podés ver y gestionar tus sesiones agendadas</p>
        </div>

        {sessions.length === 0 ? (
          /* Estado vacío */
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-8 text-center">
              <CalendarX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-3">No tenés sesiones agendadas</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Cuando reserves una sesión, aparecerá acá para que puedas consultarla y gestionarla.
              </p>
              <Link href="/">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Buscar terapeutas
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Sesiones confirmadas */}
            {confirmedSessions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-emerald-900 mb-4">Sesiones confirmadas</h2>
                <div className="space-y-4">
                  {confirmedSessions.map((session) => {
                    const dateTime = formatDateTime(session.startInPatientTz)
                    const endTime = new Date(session.endInPatientTz).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })

                    return (
                      <Card key={session.id} className="border-emerald-200 bg-emerald-50">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-emerald-600" />
                                <h3 className="font-semibold text-emerald-900">{session.therapistName}</h3>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-emerald-700">
                                  <Calendar className="w-4 h-4" />
                                  <span>{dateTime.fullDate}</span>
                                </div>

                                <div className="flex items-center gap-2 text-emerald-700">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {dateTime.time} – {endTime} ({session.durationMin} min)
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-emerald-700">
                                  {session.modality === "online" ? (
                                    <Video className="w-4 h-4" />
                                  ) : (
                                    <MapPin className="w-4 h-4" />
                                  )}
                                  <span>{session.modality === "online" ? "Online" : "Presencial"}</span>
                                </div>
                              </div>
                            </div>

                            <Badge className="bg-emerald-600 text-white">Confirmada</Badge>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelClick(session.id)}
                            className="w-full border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                          >
                            Cancelar sesión
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sesiones canceladas */}
            {canceledSessions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Sesiones canceladas</h2>
                <div className="space-y-4">
                  {canceledSessions.map((session) => {
                    const dateTime = formatDateTime(session.startInPatientTz)
                    const endTime = new Date(session.endInPatientTz).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })

                    return (
                      <Card key={session.id} className="border-gray-200 bg-gray-50">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <h3 className="font-semibold text-gray-700">{session.therapistName}</h3>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>{dateTime.fullDate}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {dateTime.time} – {endTime}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                              Cancelada
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal de confirmación de cancelación */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-center text-red-900">¿Seguro que querés cancelar esta sesión?</DialogTitle>
              <DialogDescription className="text-center text-red-700">
                Esta acción no se puede deshacer. La sesión quedará marcada como cancelada.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-3 sm:flex-col">
              <Button
                onClick={handleConfirmCancel}
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
