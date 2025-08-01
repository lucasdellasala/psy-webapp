"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, MapPin, Calendar, Heart, CalendarDays } from "lucide-react"
import { useTopics, useTherapists } from "@/hooks/use-api"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorPage } from "@/components/ui/error"
import type { TherapistsQueryParams } from "@/lib/types"

const modalities = [
  { value: "online", label: "Online", icon: Video },
  { value: "in_person", label: "Presencial", icon: MapPin },
]

export default function TherapistFinder() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedModality, setSelectedModality] = useState<string>("")
  const [showResults, setShowResults] = useState(false)

  // API hooks
  const { data: topicsData, loading: topicsLoading, error: topicsError, refetch: refetchTopics } = useTopics()
  
  const queryParams: TherapistsQueryParams = {
    topicIds: selectedTopics.length > 0 ? selectedTopics.join(',') : undefined,
    modality: selectedModality as 'online' | 'in_person' | undefined,
    limit: 10,
    offset: 0
  }
  
  const { data: therapistsData, loading: therapistsLoading, error: therapistsError, refetch: refetchTherapists } = useTherapists(showResults ? queryParams : undefined)

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  const handleSearch = () => {
    setShowResults(true)
  }

  // Loading states
  if (topicsLoading && !topicsData) {
    return <LoadingPage />
  }

  if (topicsError) {
    return <ErrorPage title="Error al cargar temas" message={topicsError} onRetry={refetchTopics} />
  }

  if (showResults && therapistsLoading) {
    return <LoadingPage />
  }

  if (showResults && therapistsError) {
    return <ErrorPage title="Error al buscar terapeutas" message={therapistsError} onRetry={refetchTherapists} />
  }

  const topics = topicsData || []
  const therapists = therapistsData || []

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6 pt-8">
            <Button
              variant="ghost"
              onClick={() => setShowResults(false)}
              className="mb-4 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100"
            >
              ← Volver a la búsqueda
            </Button>
            <h1 className="text-2xl font-bold text-emerald-900 mb-2">Profesionales disponibles</h1>
            <p className="text-emerald-700 text-sm">
              Encontramos {therapists.length} profesionales que pueden acompañarte
            </p>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {therapists.length > 0 ? (
              therapists.map((therapist: any) => (
                <Card
                  key={therapist.id}
                  className="border-emerald-200 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <CardContent className="p-5">
                    {/* Badge de poca disponibilidad */}
                    {therapist.availabilitySummary && therapist.availabilitySummary.freeSlotsCount <= 2 && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-orange-500 text-white text-xs px-2 py-1">🟠 ¡Quedan pocos turnos!</Badge>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-emerald-900 text-lg">{therapist.name}</h3>
                        <p className="text-emerald-600 text-sm">{therapist.specialty}</p>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {therapist.availabilitySummary?.freeSlotsCount || 0}
                        </span>
                      </div>
                    </div>

                    {/* Modalities */}
                    <div className="flex gap-2 mb-3">
                      {therapist.modalities.map((modality: string, index: number) => (
                        <Badge
                          key={`${modality}-${index}`}
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center gap-1"
                        >
                          {modality === "online" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                          {modalities.find((m) => m.value === modality)?.label}
                        </Badge>
                      ))}
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {therapist.topics.map((topic: any, index: number) => (
                        <Badge key={`${topic.id || topic}-${index}`} variant="outline" className="text-xs border-emerald-300 text-emerald-700">
                          {topic.name || topic}
                        </Badge>
                      ))}
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-emerald-600">
                        {therapist.availabilitySummary?.freeSlotsCount || 0} turnos disponibles esta semana
                      </span>
                      <Link href={`/therapist/${therapist.id}`}>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          Ver perfil
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">😕</div>
                  <h3 className="font-semibold text-amber-900 mb-3">No encontramos terapeutas con esos filtros</h3>
                  <p className="text-amber-700 text-sm mb-6 leading-relaxed">
                    Probá seleccionando otros temas o cambiando la modalidad. También podés contactarnos para ayudarte a
                    encontrar el profesional ideal.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setSelectedTopics([])
                        setSelectedModality("")
                      }}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Cambiar filtros
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
                    >
                      Contactar soporte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header emocional */}
        <div className="text-center mb-8 pt-12">
          <div className="mb-4">
            <Heart className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-4 leading-tight">
            Encontrá al profesional indicado para acompañarte
          </h1>
          <p className="text-emerald-700 text-lg leading-relaxed">
            Te ayudamos a encontrar un terapeuta según lo que estés atravesando.
          </p>
        </div>

        {/* Botón Mis sesiones */}
        <div className="text-center mb-8">
          <Link href="/my-sessions">
            <Button
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Mis sesiones
            </Button>
          </Link>
        </div>

        {/* Selector de temas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-emerald-900 mb-4">¿Qué te gustaría trabajar?</h2>
          <p className="text-emerald-600 text-sm mb-4">Podés elegir uno o varios temas que te resuenen</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic: any) => (
              <button
                key={topic.id}
                onClick={() => toggleTopic(topic.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTopics.includes(topic.id)
                    ? "bg-emerald-600 text-white shadow-md transform scale-105"
                    : "bg-white text-emerald-700 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de modalidad */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-emerald-900 mb-4">¿Preferís una sesión online o presencial?</h2>
          <div className="grid grid-cols-2 gap-3">
            {modalities.map((modality) => {
              const Icon = modality.icon
              return (
                <button
                  key={modality.value}
                  onClick={() => setSelectedModality(selectedModality === modality.value ? "" : modality.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedModality === modality.value
                      ? "border-emerald-600 bg-emerald-50 shadow-md"
                      : "border-emerald-200 bg-white hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectedModality === modality.value ? "text-emerald-600" : "text-emerald-500"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      selectedModality === modality.value ? "text-emerald-900" : "text-emerald-700"
                    }`}
                  >
                    {modality.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mb-8">
          <Button
            onClick={handleSearch}
            className="w-full py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={selectedTopics.length === 0 && !selectedModality}
          >
            Buscar terapeutas disponibles
          </Button>
          {selectedTopics.length === 0 && !selectedModality && (
            <p className="text-emerald-600 text-sm text-center mt-2">
              Elegí al menos un tema o modalidad para continuar
            </p>
          )}
        </div>

        {/* Footer message */}
        <div className="text-center text-emerald-600 text-sm">
          <p>
            Recordá que buscar ayuda es un acto de valentía.
            <br />
            Estamos acá para acompañarte en este proceso.
          </p>
        </div>
      </div>
    </div>
  )
}
