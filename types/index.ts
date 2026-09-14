import { Event, EventCategory, User, Role, Media, MediaType, MediaCategory, Facility, FAQ, ContactSubmission, ContactSubmissionStatus, Announcement } from '@prisma/client'

export type {
  Event,
  EventCategory,
  User,
  Role,
  Media,
  MediaType,
  MediaCategory,
  Facility,
  FAQ,
  ContactSubmission,
  ContactSubmissionStatus,
  Announcement
}

// Extended types with additional properties
export interface EventWithMeta extends Event {
  formattedDate?: string
  formattedTime?: string
}

export interface SafeUser extends Omit<User, 'password'> {
  // Excludes password field for client-side use
} 