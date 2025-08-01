"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, Clock, ChevronLeft, Calendar } from "lucide-react"
import { useTherapist, useTherapistAvailability } from "@/hooks/use-api"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorPage } from "@/components/ui/error"
import { ClientOnly } from "@/components/ui/client-only"
import type { DayAvailability } from "@/lib/types"
import { formatDateWithWeekday } from "@/lib/utils"

export default function TherapistAvailability() {
  const { id: therapistId } = useParams()
  const searchParams = useSearchParams()
  const sessionTypeIdFromUrl = searchParams.get('sessionTypeId')
  const weekStartFromUrl = searchParams.get('weekStart')
  
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [selectedSessionTypeId, setSelectedSessionTypeId] = useState<string>("")
  const [weekStart, setWeekStart] = useState<string>("")

  const { 
    data: therapist, 
    loading: therapistLoading, 
    error: therapistError, 
    refetch: refetchTherapist 
  } = useTherapist(therapistId as string)

  const availabilityParams = selectedSessionTypeId && weekStart ? {
    sessionTypeId: selectedSessionTypeId,
    weekStart,
  } : null

  const { 
    data: availabilityData, 
    loading: availabilityLoading, 
    error: availabilityError, 
    refetch: refetchAvailability 
  } = useTherapistAvailability(therapistId as string, availabilityParams)

  useEffect(() => {
    if (therapist && !weekStart) {
      const weekStartValue = weekStartFromUrl || (() => {
        const today = new Date()
        const monday = new Date(today)
        monday.setDate(today.getDate() - today.getDay() + 1)
        monday.setHours(0, 0, 0, 0)
        return monday.toISOString().split('T')[0]
      })()
      
      setWeekStart(weekStartValue)
    }

    if (therapist?.sessionTypes && therapist.sessionTypes.length > 0 && !selectedSessionTypeId) {
      const sessionTypeToUse = sessionTypeIdFromUrl || therapist.sessionTypes[0].id
      setSelectedSessionTypeId(sessionTypeToUse)
    }
  }, [therapist, sessionTypeIdFromUrl, weekStartFromUrl])

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId)
  }

  const getSelectedSlotDetails = () => {
    if (!availability || !selectedSlot) return null

    const selectedSlotData = availability.find((slot: any) => slot.id === selectedSlot)
    if (selectedSlotData) {
      return {
        day: formatDateWithWeekday(selectedSlotData.date),
        date: selectedSlotData.date,
        time: `${selectedSlotData.startTime} – ${selectedSlotData.endTime}`,
        slot: selectedSlotData,
      }
    }
    return null
  }

  if (therapistLoading) {
    return <LoadingPage />
  }

  if (therapistError) {
    return <ErrorPage title="Error al cargar terapeuta" message={therapistError} onRetry={refetchTherapist} />
  }

  if (!therapist) {
    return <ErrorPage title="Terapeuta no encontrado" message="No se pudo cargar la información del terapeuta" />
  }

  let availability: any[] = []
  let hasAnyAvailability = false

  if (availabilityData) {
    if (availabilityData.sessionTypes && Array.isArray(availabilityData.sessionTypes)) {
      const firstSessionType = availabilityData.sessionTypes[0]
      if (firstSessionType && firstSessionType.availability) {
        availability = Object.values(firstSessionType.availability)
        hasAnyAvailability = availability.some((day: any) => Array.isArray(day) && day.length > 0)
      }
    } else if (Array.isArray(availabilityData)) {
      availability = availabilityData
      hasAnyAvailability = availability.some((day: any) => day.bookableStarts && day.bookableStarts.length > 0)
    } else if (availabilityData.availability && typeof availabilityData.availability === 'object') {
      const availabilityEntries = Object.entries(availabilityData.availability)
      availability = availabilityEntries.map(([date, slots]) => {
        if (Array.isArray(slots)) {
          return slots.map((slot: any) => ({
            ...slot,
            date: date,
            id: `${date}_${slot.startTime}_${slot.endTime}`,
            startTime: slot.startTime,
            endTime: slot.endTime,
          }))
        }
        return []
      }).flat()
      
      hasAnyAvailability = availability.length > 0
    }
  }

  const selectedDetails = getSelectedSlotDetails()
  const selectedSessionType = therapist.sessionTypes?.find((st: any) => st.id === selectedSessionTypeId)

  return (
    <ClientOnly fallback={<LoadingPage />}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6 pt-8">
            <Link href={`/therapist/${therapistId}`}>
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
                      <span className="text-sm font-bold text-emerald-700">
                        {therapist.name.split(" ").map((n: string) => n[0]).join("")}
                      </span>
                    </div>
                    <span className="font-semibold text-emerald-900">{therapist.name}</span>
                  </div>
                  {selectedSessionType && (
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Video className="w-4 h-4" />
                      <span className="text-sm">{selectedSessionType.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Semana del {weekStart}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {availabilityLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-emerald-600">Cargando disponibilidad...</p>
            </div>
          )}

          {availabilityError && (
            <Card className="border-red-200 bg-red-50 mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-red-900 mb-3">Error al cargar disponibilidad</h3>
                <p className="text-red-700 text-sm mb-4">{availabilityError}</p>
                <Button 
                  onClick={refetchAvailability}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Reintentar
                </Button>
              </CardContent>
            </Card>
          )}

          {!availabilityLoading && !availabilityError && hasAnyAvailability && (
            <div className="space-y-6 mb-8">
              {(() => {
                const slotsByDay: { [key: string]: any[] } = {}
                
                availability.forEach((slot: any) => {
                  const date = slot.date
                  if (!slotsByDay[date]) {
                    slotsByDay[date] = []
                  }
                  slotsByDay[date].push(slot)
                })
                
                return Object.entries(slotsByDay).map(([date, daySlots]) => {
                  const dayLabel = formatDateWithWeekday(date)
                  const dayNumber = new Date(date).getDate()
                  
                  return (
                    <div key={date}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-emerald-700">{dayNumber}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-emerald-900">{dayLabel}</h3>
                          <p className="text-sm text-emerald-600">
                            {daySlots.length > 0
                              ? `${daySlots.length} horario${daySlots.length > 1 ? "s" : ""} disponible${
                                  daySlots.length > 1 ? "s" : ""
                                }`
                              : "Sin turnos disponibles"}
                          </p>
                        </div>
                      </div>

                      {daySlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 ml-15">
                          {daySlots.map((slot: any) => (
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
                              {slot.startTime} – {slot.endTime}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-15 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-500 text-sm text-center">Sin turnos disponibles este día</p>
                        </div>
                      )}
                    </div>
                  )
                })
              })()}
            </div>
          )}

          {!availabilityLoading && !availabilityError && !hasAnyAvailability && (
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
                  <Link href={`/therapist/${therapistId}`}>
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
                    {selectedSessionType && (
                      <Badge className="bg-emerald-600 text-white mt-2">{selectedSessionType.name}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!availabilityLoading && !availabilityError && hasAnyAvailability && (
            <div className="mb-8">
              <Link 
                href={{
                  pathname: `/therapist/${therapistId}/confirm`,
                  query: selectedDetails?.slot ? {
                    therapistId: therapistId,
                    therapistName: therapist.name,
                    sessionTypeId: selectedSessionTypeId,
                    sessionType: selectedSessionType?.name || '',
                    slotId: selectedSlot,
                    date: selectedDetails.date,
                    time: selectedDetails.time,
                    startUtc: selectedDetails.slot.startUtc,
                    endUtc: selectedDetails.slot.endUtc,
                    modality: selectedSessionType?.modality || 'online',
                  } : {}
                }}
              >
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

          <div className="text-center text-emerald-600 text-sm">
            <p>
              Una vez confirmado, recibirás los detalles
              <br />
              de tu sesión por email y WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>
  )
}
