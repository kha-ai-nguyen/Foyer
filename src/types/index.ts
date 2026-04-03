export type EventType =
  | 'Workshop'
  | 'Wedding'
  | 'Corporate'
  | 'Party'
  | 'Exhibition'

export interface Venue {
  id: string
  name: string
  neighbourhood: string
  capacityRange: string
  priceEstimate: string
  eventType: EventType
  imageUrl: string
  description: string
}
