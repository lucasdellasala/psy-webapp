"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, Clock, ChevronLeft, Calendar } from "lucide-react"

// Mock data
const therapist = {
  id: "t1",
  name: "Dra. María Gómez",
  sessionType: "Sesión online de 60 minutos",
  week: "Semana del 29 de julio",
}

const availability = [
  {
    date: "2025-07-29",
    dayLabel: "Martes",
    dayNumber: "29",
    bookableStarts: [
      {
        id: "slot1",
        startInPatientTz: "10:00",
        endInPatientTz: "11:00",
        startUtc: "2025-07-29T13:00:00Z",
        endUtc: "2025-07-29T14:00:00Z",
      },
      {
        id: "slot2",
        startInPatientTz: "14:00",
        endInPatientTz: "15:00",
        startUtc: "2025-07-29T17:00:00Z",
        endUtc: "2025-07-29T18:00:00Z",
      },
    ],
  },
  {
    date: "2025-07-30",
    dayLabel: "Miércoles",
    dayNumber: "30",
    bookableStarts: [
      {
        id: "slot3",
        startInPatientTz: "09:00",
        endInPatientTz: "10:00",
        startUtc: "2025-07-30T12:00:00Z",
        endUtc: "2025-07-30T13:00:00Z",
      },
      {
        id: "slot4",
        startInPatientTz: "16:00",
        endInPatientTz: "17:00",
        startUtc: "2025-07-30T19:00:00Z",
        endUtc: "2025-07-30T20:00:00Z",
      },
      {
        id: "slot5",
        startInPatientTz: "18:00",
        endInPatientTz: "19:00",
        startUtc: "2025-07-30T21:00:00Z",
        endUtc: "2025-07-30T22:00:00Z",
      },
    ],
  },
  {
    date: "2025-07-31",
    dayLabel: "Jueves",
    dayNumber: "31",
    bookableStarts: [],
  },
  {
    date: "2025-08-01",
    dayLabel: "Viernes",
    dayNumber: "1",
    bookableStarts: [
      {
        id: "slot6",
        startInPatientTz: "11:00",
        endInPatientTz: "12:00",
        startUtc: "2025-08-01T14:00:00Z",
        endUtc: "2025-08-01T15:00:00Z",
      },
      {
        id: "slot7",
        startInPatientTz: "15:00",
        endInPatientTz: "16:00",
        startUtc: "2025-08-01T18:00:00Z",
        endUtc: "2025-08-01T19:00:00Z",
      },
    ],
  },
  {
    date: "2025-08-02",
    dayLabel: "Sábado",
    dayNumber: "2",
    bookableStarts: [
      {
        id: "slot8",
        startInPatientTz: "10:00",
        endInPatientTz: "11:00",
        startUtc: "2025-08-02T13:00:00Z",
        endUtc: "2025-08-02T14:00:00Z",
      },
    ],
  },
]

// Verificar si hay algún horario disponible en toda la semana
const hasAnyAvailability = availability.some((day) => day.bookableStarts.length > 0)

export default function TherapistAvailability() {
  const [selectedSlot, setSelectedSlot] = useState<string>("")

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId)
    // Aquí se navegaría a la confirmación
    console.log("Slot seleccionado:", slotId)
  }

  const getSelectedSlotDetails = () => {
    for (const day of availability) {
      const slot = day.bookableStarts.find((s) => s.id === selectedSlot)
      if (slot) {
        return {
          day: day.dayLabel,
          date: day.dayNumber,
          time: `${slot.startInPatientTz} – ${slot.endInPatientTz}`,
        }
      }
    }
    return null
  }

  const selectedDetails = getSelectedSlotDetails()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header con navegación */}
        <div className="flex items-center mb-6 pt-8">
          <Link href={`/therapist/${therapist.id}`}>
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

        {/* Resumen de contexto */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-900 mb-2">Elegí tu horario</h1>
            <p className="text-emerald-700">Seleccioná el momento que mejor te convenga</p>
          </div>

          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-700">MG</span>
                  </div>
                  <span className="font-semibold text-emerald-900">{therapist.name}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <Video className="w-4 h-4" />
                  <span className="text-sm">{therapist.sessionType}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{therapist.week}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vista de calendario semanal */}
        {hasAnyAvailability ? (
          <div className="space-y-6 mb-8">
            {availability.map((day) => (
              <div key={day.date}>
                {/* Encabezado del día */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-emerald-700">{day.dayNumber}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">{day.dayLabel}</h3>
                    <p className="text-sm text-emerald-600">
                      {day.bookableStarts.length > 0
                        ? `${day.bookableStarts.length} horario${day.bookableStarts.length > 1 ? "s" : ""} disponible${
                            day.bookableStarts.length > 1 ? "s" : ""
                          }`
                        : "Sin turnos disponibles"}
                    </p>
                  </div>
                </div>

                {/* Horarios disponibles */}
                {day.bookableStarts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 ml-15">
                    {day.bookableStarts.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedSlot === slot.id ? "default" : "outline"}
                        onClick={() => handleSlotSelect(slot.id)}
                        className={`h-12 text-sm font-medium transition-all duration-200 ${
                          selectedSlot === slot.id
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                            : "border-emerald-300 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50"
                        }`}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {slot.startInPatientTz} – {slot.endInPatientTz}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="ml-15 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-sm text-center">Sin turnos disponibles este día</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-blue-200 bg-blue-50 mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">💤</div>
              <h3 className="font-semibold text-blue-900 mb-3">
                Este profesional no tiene turnos disponibles esta semana
              </h3>
              <p className="text-blue-700 text-sm mb-6 leading-relaxed">
                Podés probar otra semana o volver a elegir tipo de sesión. También podés contactar directamente al
                profesional.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Ver próxima semana</Button>
                <Link href={`/therapist/${therapist.id}`}>
                  <Button
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                  >
                    Cambiar tipo de sesión
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumen de selección y botón continuar */}
        {selectedSlot && selectedDetails && (
          <Card className="border-emerald-600 bg-emerald-50 shadow-md mb-6">
            <CardContent className="p-4">
              <div className="text-center">
                <h4 className="font-semibold text-emerald-900 mb-2">Turno seleccionado</h4>
                <div className="space-y-1">
                  <p className="text-emerald-700">
                    <span className="font-medium">
                      {selectedDetails.day} {selectedDetails.date}
                    </span>
                  </p>
                  <p className="text-emerald-700">
                    <span className="font-medium">{selectedDetails.time}</span>
                  </p>
                  <Badge className="bg-emerald-600 text-white mt-2">{therapist.sessionType}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botón continuar - solo si hay disponibilidad */}
        {hasAnyAvailability && (
          <div className="mb-8">
            <Link href={`/therapist/${therapist.id}/confirm`}>
              <Button
                disabled={!selectedSlot}
                className="w-full py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar turno
              </Button>
            </Link>

            {!selectedSlot && (
              <p className="text-emerald-600 text-sm text-center mt-2">Seleccioná un horario para continuar</p>
            )}
          </div>
        )}

        {/* Mensaje de apoyo */}
        <div className="text-center text-emerald-600 text-sm">
          <p>
            Una vez confirmado, recibirás los detalles
            <br />
            de tu sesión por email y WhatsApp.
          </p>
        </div>
      </div>
    </div>
  )
}
