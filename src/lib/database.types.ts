export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      onboarding_surveys: {
        Row: {
          id: string
          user_id: string
          age_category: '18-25' | '26-35' | '36-45' | '46+'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age_category: '18-25' | '26-35' | '36-45' | '46+'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age_category?: '18-25' | '26-35' | '36-45' | '46+'
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          importance: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          importance: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          importance?: string
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          category: 'Health' | 'Productivity' | 'Finance' | 'Relationships' | 'Learning' | 'Spiritual/Mental'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: 'Health' | 'Productivity' | 'Finance' | 'Relationships' | 'Learning' | 'Spiritual/Mental'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: 'Health' | 'Productivity' | 'Finance' | 'Relationships' | 'Learning' | 'Spiritual/Mental'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          assessment_type: string
          limiting_beliefs: string | null
          bad_habits: string | null
          time_wasters: string | null
          energy_drainers: string | null
          growth_blockers: string | null
          new_beliefs: string | null
          empowering_habits: string | null
          time_investment: string | null
          energy_gains: string | null
          growth_areas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assessment_type: string
          limiting_beliefs?: string | null
          bad_habits?: string | null
          time_wasters?: string | null
          energy_drainers?: string | null
          growth_blockers?: string | null
          new_beliefs?: string | null
          empowering_habits?: string | null
          time_investment?: string | null
          energy_gains?: string | null
          growth_areas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assessment_type?: string
          limiting_beliefs?: string | null
          bad_habits?: string | null
          time_wasters?: string | null
          energy_drainers?: string | null
          growth_blockers?: string | null
          new_beliefs?: string | null
          empowering_habits?: string | null
          time_investment?: string | null
          energy_gains?: string | null
          growth_areas?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
