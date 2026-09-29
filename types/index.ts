import {
  Event,
  User,
  Media,
  Facility,
  FAQ,
  ContactSubmission,
  Announcement,
  Post,
} from '@prisma/client'

export type {
  Event,
  User,
  Media,
  Facility,
  FAQ,
  ContactSubmission,
  Announcement,
  Post,
}

// These used to be Prisma enums. The schema moved to SQLite, which has no enum
// type, so the columns are plain strings and the allowed values live in the
// data/ files. Declaring them as unions here keeps the compile-time checking
// that the enums used to give, without the database feature.
export type Role = 'EDITOR' | 'ADMIN'
export type EventCategory =
  | 'GENERAL'
  | 'EDUCATIONAL'
  | 'YOUTH'
  | 'COMMUNITY'
  | 'RELIGIOUS'
  | 'CHARITY'
export type MediaType = 'IMAGE' | 'VIDEO'
export type MediaCategory = 'EVENT' | 'GALLERY' | 'FACILITY' | 'GENERAL'
export type ContactSubmissionStatus = 'PENDING' | 'RESPONDED' | 'ARCHIVED'

// See data/posts.js for the labels and behaviour attached to each.
export type PostType = 'STATEMENT' | 'ARTICLE'
export type PostStatus = 'DRAFT' | 'PUBLISHED'

// Extended types with additional properties
export interface EventWithMeta extends Event {
  formattedDate?: string
  formattedTime?: string
}

export interface SafeUser extends Omit<User, 'password'> {
  // Excludes password field for client-side use
}
