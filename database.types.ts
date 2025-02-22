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
          captions_vtt: string
          created_at: string
          id: number
          slug: string
          speaker_name: string
          title: string
        }
        Insert: {
          audio_url: string
          captions_vtt: string
          created_at?: string
          id?: number
          slug: string
          speaker_name: string
          title: string
        }
        Update: {
          audio_url?: string
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
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
