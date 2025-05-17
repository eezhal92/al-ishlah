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
      shorts: {
        Row: {
          audio_url: string
          captions_ar_vtt: string | null
          captions_vtt: string
          created_at: string
          id: number
          slug: string
          speaker_name: string
          title: string
        }
        Insert: {
          audio_url: string
          captions_ar_vtt?: string | null
          captions_vtt: string
          created_at?: string
          id?: number
          slug: string
          speaker_name: string
          title: string
        }
        Update: {
          audio_url?: string
          captions_ar_vtt?: string | null
          captions_vtt?: string
          created_at?: string
          id?: number
          slug?: string
          speaker_name?: string
          title?: string
        }
        Relationships: []
      }
      taliims: {
        Row: {
          author: string | null
          author_ar: string | null
          cover_img_url: string | null
          created_at: string
          description: string | null
          id: number
          kitab_title: string
          kitab_title_ar: string | null
          slug: string
          ustadh_id: number
        }
        Insert: {
          author?: string | null
          author_ar?: string | null
          cover_img_url?: string | null
          created_at?: string
          description?: string | null
          id?: number
          kitab_title?: string
          kitab_title_ar?: string | null
          slug: string
          ustadh_id: number
        }
        Update: {
          author?: string | null
          author_ar?: string | null
          cover_img_url?: string | null
          created_at?: string
          description?: string | null
          id?: number
          kitab_title?: string
          kitab_title_ar?: string | null
          slug?: string
          ustadh_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "taliims_ustadh_id_fkey"
            columns: ["ustadh_id"]
            isOneToOne: false
            referencedRelation: "ustadhs"
            referencedColumns: ["id"]
          },
        ]
      }
      tasjilaats: {
        Row: {
          audio_url: string
          created_at: string
          credit: string | null
          id: number
          meta_description: string
          recorded_at: string
          slug: string
          taliim_id: number
          title: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          credit?: string | null
          id?: number
          meta_description?: string
          recorded_at: string
          slug: string
          taliim_id: number
          title: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          credit?: string | null
          id?: number
          meta_description?: string
          recorded_at?: string
          slug?: string
          taliim_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasjilaats_taliim_id_fkey"
            columns: ["taliim_id"]
            isOneToOne: false
            referencedRelation: "taliims"
            referencedColumns: ["id"]
          },
        ]
      }
      ustadhs: {
        Row: {
          created_at: string
          id: number
          name: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          slug?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
