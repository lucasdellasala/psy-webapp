"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, MapPin, Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react"

// Mock data
const therapist = {
  id: "t1",
  name: "Dra. María Gómez",
  specialty: "Psicóloga Clínica",
  topics: ["Ansiedad", "Relaciones personales", "Estrés"],
  modalities: ["online", "in_person"],
  description:
    "Especialista en terapia cognitivo-conductual con más de 8 años de experiencia acompañando personas en procesos de crecimiento personal.",
  experience: "8 años de experiencia",
}

const sessionTypes = [
  {
    id: "st1",
    name: "Sesión online",
    description: "Desde la comodidad de tu hogar",
    durationMin: 60,
    modality: "online",
    icon: Video,
  },
  {
    id: "st2",
    name: "Sesión presencial",
    description: "En consultorio, encuentro cara a cara",
    durationMin: 90,
    modality: "in_person",
    icon: MapPin,
  },
]

const weeks = [
  { id: "w1", label: "Esta semana", dateRange: "29 jul – 4 ago" },
  { id: "w2", label: "Próxima semana", dateRange: "5 – 11 ago" },
  { id: "w3", label: "En 2 semanas", dateRange: "12 – 18 ago" },
  { id: "w4", label: "En 3 semanas", dateRange: "19 – 25 ago" },
]

export default function TherapistProfile() {
  const [selectedSessionType, setSelectedSessionType] = useState<string>("")
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)

  const handleContinue = () => {
    // Aquí se navegaría a la pantalla de calendario
    console.log("Continuar con:", { selectedSessionType, selectedWeek })
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
                .map((n) => n[0])
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
            {therapist.topics.map((topic) => (
              <Badge key={topic} variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Selección de tipo de sesión */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-emerald-900 mb-3">Elegí el tipo de sesión que querés agendar</h3>
          <div className="space-y-3">
            {sessionTypes.map((sessionType) => {
              const Icon = sessionType.icon
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
              onClick={() => setSelectedWeek(weeks[currentWeekIndex].id)}
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
          <Link href={`/therapist/${therapist.id}/availability`}>
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
            La Dra. María está lista para acompañarte.
          </p>
        </div>
      </div>
    </div>
  )
}
