import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea una fecha en formato YYYY-MM-DD a un formato legible en español
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada en español (ej: "29 de julio de 2025")
 */
export function formatDateToSpanish(dateString: string): string {
  try {
    const date = new Date(dateString)
    
    // Verificar que la fecha es válida
    if (isNaN(date.getTime())) {
      return dateString // Retornar el string original si no es una fecha válida
    }
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formateando fecha:', error)
    return dateString // Retornar el string original en caso de error
  }
}

/**
 * Formatea una fecha en formato YYYY-MM-DD a un formato corto en español
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada en español (ej: "29 jul")
 */
export function formatDateToShortSpanish(dateString: string): string {
  try {
    const date = new Date(dateString)
    
    // Verificar que la fecha es válida
    if (isNaN(date.getTime())) {
      return dateString // Retornar el string original si no es una fecha válida
    }
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  } catch (error) {
    console.error('Error formateando fecha:', error)
    return dateString // Retornar el string original en caso de error
  }
}

/**
 * Formatea una fecha en formato YYYY-MM-DD a un formato con día de la semana
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada con día de la semana (ej: "Martes 29 de julio")
 */
export function formatDateWithWeekday(dateString: string): string {
  try {
    const date = new Date(dateString)
    
    // Verificar que la fecha es válida
    if (isNaN(date.getTime())) {
      return dateString // Retornar el string original si no es una fecha válida
    }
    
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  } catch (error) {
    console.error('Error formateando fecha:', error)
    return dateString // Retornar el string original en caso de error
  }
}

/**
 * Genera un UUID v4 válido
 * @returns UUID v4 string
 */
export function generateUUID(): string {
  // Usar crypto.randomUUID() si está disponible (navegadores modernos)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback para navegadores más antiguos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
