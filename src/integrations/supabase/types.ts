export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      donors: {
        Row: {
          blood_group: string
          city: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          blood_group: string
          city: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          blood_group?: string
          city?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          donor_id: string
          id: string
          message_text: string
          message_type: string
          sent_at: string
          status: string
        }
        Insert: {
          donor_id: string
          id?: string
          message_text: string
          message_type?: string
          sent_at?: string
          status?: string
        }
        Update: {
          donor_id?: string
          id?: string
          message_text?: string
          message_type?: string
          sent_at?: string
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          whatsapp_number: string | null
          is_admin: boolean
        }
        Insert: {
          id: string
          whatsapp_number?: string | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          whatsapp_number?: string | null
          is_admin?: boolean
        }
        Relationships: []
      }
      secrets: {
        Row: {
          id: string
          name: string
          secret: string
        }
        Insert: {
          id?: string
          name: string
          secret: string
        }
        Update: {
          id?: string
          name?: string
          secret?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]