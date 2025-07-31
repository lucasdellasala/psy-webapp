export interface Session {
  id: string
  therapistName: string
  startInPatientTz: string
  endInPatientTz: string
  modality: "online" | "in_person"
  durationMin: number
  patientEmail: string
  status: "confirmed" | "canceled"
}

export const saveSession = (session: Session) => {
  if (typeof window === "undefined") return

  const existingSessions = getSessions()
  const sessionIndex = existingSessions.findIndex((s) => s.id === session.id)

  if (sessionIndex >= 0) {
    // Reemplazar sesión existente
    existingSessions[sessionIndex] = session
  } else {
    // Agregar nueva sesión
    existingSessions.push(session)
  }

  localStorage.setItem("mySessions", JSON.stringify(existingSessions))
}

export const getSessions = (): Session[] => {
  if (typeof window === "undefined") return []

  try {
    const sessions = localStorage.getItem("mySessions")
    return sessions ? JSON.parse(sessions) : []
  } catch {
    return []
  }
}

export const cancelSession = (sessionId: string) => {
  const sessions = getSessions()
  const updatedSessions = sessions.map((session) =>
    session.id === sessionId ? { ...session, status: "canceled" as const } : session,
  )

  localStorage.setItem("mySessions", JSON.stringify(updatedSessions))
}
