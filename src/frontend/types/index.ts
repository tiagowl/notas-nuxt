export interface Marker {
  id: string
  name: string
  userId?: string | null
  createdAt: string
  updatedAt: string
  subMarkers?: SubMarker[]
  _count?: {
    subMarkers?: number
    notes?: number
  }
}

export interface SubMarker {
  id: string
  name: string
  markerId: string
  createdAt: string
  updatedAt: string
  marker?: Marker
  notes?: Note[]
  _count?: {
    notes?: number
  }
}

export interface Note {
  id: string
  title: string
  content: string
  subMarkerId: string
  createdAt: string
  updatedAt: string
  subMarker?: SubMarker
}

export interface CreateMarkerDto {
  name: string
}

export interface UpdateMarkerDto {
  name: string
}

export interface CreateSubMarkerDto {
  name: string
  markerId: string
}

export interface UpdateSubMarkerDto {
  name: string
}

export interface CreateNoteDto {
  title: string
  content: string
  subMarkerId: string
}

export interface UpdateNoteDto {
  title: string
  content: string
}

export interface AIGenerateRequest {
  description: string
}

export interface AIGenerateResponse {
  content: string
}
