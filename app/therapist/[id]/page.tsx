"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, MapPin, Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { useTherapist, useTherapistSessionTypes } from "@/hooks/use-api"
import { LoadingPage, Loading } from "@/components/ui/loading"
import { ErrorPage } from "@/components/ui/error"
import { useParams } from "next/navigation"

// Función para calcular las semanas
const getWeeks = () => {
  const today = new Date()
  const weeks = []
  
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + 1 + (i * 7)) // Lunes + i semanas
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const weekStartStr = weekStart.toISOString().split('T')[0]
    const weekEndStr = weekEnd.toISOString().split('T')[0]
    
    const labels = [
      "Esta semana",
      "Próxima semana", 
      "En 2 semanas",
      "En 3 semanas"
    ]
    
    const dateRanges = [
      `${weekStart.getDate()} ${weekStart.toLocaleDateString('es-AR', { month: 'short' })} – ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('es-AR', { month: 'short' })}`,
      `${weekStart.getDate()} – ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('es-AR', { month: 'short' })}`,
      `${weekStart.getDate()} – ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('es-AR', { month: 'short' })}`,
      `${weekStart.getDate()} – ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('es-AR', { month: 'short' })}`
    ]
    
    weeks.push({
      id: `w${i + 1}`,
      label: labels[i],
      dateRange: dateRanges[i],
      weekStart: weekStartStr
    })
  }
  
  return weeks
}

const weeks = getWeeks()

export default function TherapistProfile() {
  const params = useParams()
  const therapistId = params.id as string
  
  const [selectedSessionType, setSelectedSessionType] = useState<string>("")
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>("")
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)


  const { data: therapistData, loading: therapistLoading, error: therapistError, refetch: refetchTherapist } = useTherapist(therapistId)
  const { data: sessionTypesData, loading: sessionTypesLoading, error: sessionTypesError, refetch: refetchSessionTypes } = useTherapistSessionTypes(therapistId)

  const handleContinue = () => {
    // Función para navegar a la pantalla de calendario
  }

  const nextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1)
      setSelectedWeek("")
    }
  }

  const prevWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1)
      setSelectedWeek("")
    }
  }


  if (therapistLoading) {
    return <LoadingPage />
  }

  if (therapistError) {
    return <ErrorPage title="Error al cargar el terapeuta" message={therapistError} onRetry={refetchTherapist} />
  }

  if (!therapistData) {
    return <ErrorPage title="Terapeuta no encontrado" message="No se pudo encontrar el terapeuta solicitado." />
  }

  const therapist = therapistData
  const sessionTypes = sessionTypesData || []

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
          <span className="text-emerald-600 text-sm ml-2">Volver a resultados</span>
        </div>

        {/* Encabezado del terapeuta */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-emerald-700">
              {therapist.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">{therapist.name}</h1>
          <p className="text-emerald-700 mb-4">{therapist.specialty}</p>
          <p className="text-emerald-600 text-sm leading-relaxed mb-4">{therapist.description}</p>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            {therapist.experience}
          </Badge>
        </div>

        {/* Temas que atiende */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-emerald-900 mb-3">Temas que atiende</h3>
          <div className="flex flex-wrap gap-2">
            {therapist.topics.map((topic: any) => (
              <Badge key={topic.id || topic} variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50">
                {topic.name || topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Selección de tipo de sesión */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-emerald-900 mb-3">Elegí el tipo de sesión que querés agendar</h3>
          
          {sessionTypesLoading ? (
            <Loading text="Cargando tipos de sesión..." />
          ) : sessionTypesError ? (
            <div className="text-center p-4">
              <p className="text-red-600 text-sm">Error al cargar tipos de sesión</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refetchSessionTypes}
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessionTypes.map((sessionType: any) => {
                const Icon = sessionType.modality === 'online' ? Video : MapPin
                return (
                  <Card
                    key={sessionType.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedSessionType === sessionType.id
                        ? "border-emerald-600 bg-emerald-50 shadow-md"
                        : "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                    onClick={() => setSelectedSessionType(sessionType.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-full ${
                            selectedSessionType === sessionType.id
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-emerald-900 mb-1">{sessionType.name}</h4>
                          <p className="text-emerald-600 text-sm mb-2">{sessionType.description}</p>
                          <div className="flex items-center gap-1 text-emerald-700">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{sessionType.durationMin} minutos</span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedSessionType === sessionType.id
                              ? "border-emerald-600 bg-emerald-600"
                              : "border-emerald-300"
                          }`}
                        >
                          {selectedSessionType === sessionType.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Selector de semana - Solo se muestra si hay tipo de sesión seleccionado */}
        {selectedSessionType && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">¿Para qué semana querés agendar?</h3>

            {/* Navegador de semanas */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevWeek}
                disabled={currentWeekIndex === 0}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-center">
                <p className="font-medium text-emerald-900">{weeks[currentWeekIndex].label}</p>
                <p className="text-sm text-emerald-600">{weeks[currentWeekIndex].dateRange}</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextWeek}
                disabled={currentWeekIndex === weeks.length - 1}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Botón para seleccionar la semana actual */}
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                selectedWeek === weeks[currentWeekIndex].id
                  ? "border-emerald-600 bg-emerald-50 shadow-md"
                  : "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
              onClick={() => {
                setSelectedWeek(weeks[currentWeekIndex].id)
                setSelectedWeekStart(weeks[currentWeekIndex].weekStart)
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-900">{weeks[currentWeekIndex].label}</p>
                      <p className="text-sm text-emerald-600">{weeks[currentWeekIndex].dateRange}</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedWeek === weeks[currentWeekIndex].id
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-emerald-300"
                    }`}
                  >
                    {selectedWeek === weeks[currentWeekIndex].id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Botón continuar */}
        <div className="mb-8">
          <Link href={`/therapist/${therapistId}/availability?sessionTypeId=${selectedSessionType}&weekStart=${selectedWeekStart}`}>
            <Button
              disabled={!selectedSessionType || !selectedWeek}
              className="w-full py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ver horarios disponibles
            </Button>
          </Link>

          {(!selectedSessionType || !selectedWeek) && (
            <p className="text-emerald-600 text-sm text-center mt-2">
              {!selectedSessionType
                ? "Elegí un tipo de sesión para continuar"
                : "Seleccioná una semana para ver la disponibilidad"}
            </p>
          )}
        </div>

        {/* Mensaje de apoyo */}
        <div className="text-center text-emerald-600 text-sm">
          <p>
            Estás a un paso de agendar tu sesión.
            <br />
            {therapist.name} está lista para acompañarte.
          </p>
        </div>
      </div>
    </div>
  )
}
