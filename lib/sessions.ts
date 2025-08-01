import { getSessionById } from './api-client'

export interface Session {
  id: string
  therapistName: string
  startInPatientTz: string
  endInPatientTz: string
  modality: "online" | "in_person"
  durationMin: number
  patientEmail: string
  status: "pending" | "confirmed" | "canceled"
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


export const syncSessionWithBackend = async (sessionId: string) => {
  try {
    const response = await getSessionById(sessionId)
    
    if (response && response.data) {
      const sessions = getSessions()
      const updatedSessions = sessions.map((session) =>
        session.id === sessionId 
          ? { 
              ...session, 
              status: response.data.status?.toLowerCase() || session.status,
              startInPatientTz: response.data.startInPatientTz || session.startInPatientTz,
              endInPatientTz: response.data.endInPatientTz || session.endInPatientTz,
            }
          : session
      )
      localStorage.setItem("mySessions", JSON.stringify(updatedSessions))
      return true
    }
  } catch (error) {
    console.error('❌ Error sincronizando sesión:', error)
  }
  return false
}

import { cancelSession as cancelBackendSession } from './api-client'

export const cancelSession = async (sessionId: string) => {
  try {
    const backendResponse = await cancelBackendSession(sessionId)
    
    const sessions = getSessions()
    const updatedSessions = sessions.map((session) =>
      session.id === sessionId 
        ? { 
            ...session, 
            status: backendResponse.data?.status?.toLowerCase() || "canceled" as const 
          } 
        : session,
    )

    localStorage.setItem("mySessions", JSON.stringify(updatedSessions))
    
    return true
  } catch (error) {
    console.error('❌ Error al cancelar la sesión:', error)
    throw error
  }
}
