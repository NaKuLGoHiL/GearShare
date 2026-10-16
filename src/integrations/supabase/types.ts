export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      gear_inventory: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand: string;
          category: string;
          mount_type: string | null;
          sensor_type: string | null;
          base_daily_rate: number;
          replacement_value: number;
          serial_number: string | null;
          flange_focal_distance_calibrated_at: string | null;
          status: "available" | "maintenance" | "on_set" | "retired";
          specs: string[];
          included_accessories: string[];
          image_url: string | null;
          badge: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          brand: string;
          category: string;
          mount_type?: string | null;
          sensor_type?: string | null;
          base_daily_rate: number;
          replacement_value: number;
          serial_number?: string | null;
          flange_focal_distance_calibrated_at?: string | null;
          status?: "available" | "maintenance" | "on_set" | "retired";
          specs?: string[];
          included_accessories?: string[];
          image_url?: string | null;
          badge?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          brand?: string;
          category?: string;
          mount_type?: string | null;
          sensor_type?: string | null;
          base_daily_rate?: number;
          replacement_value?: number;
          serial_number?: string | null;
          flange_focal_distance_calibrated_at?: string | null;
          status?: "available" | "maintenance" | "on_set" | "retired";
          specs?: string[];
          included_accessories?: string[];
          image_url?: string | null;
          badge?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      inventory_blocks: {
        Row: {
          id: string;
          gear_id: string;
          booking_id: string | null;
          block_date: string;
          block_type: "hold" | "confirmed" | "maintenance" | "turnaround_buffer";
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          gear_id: string;
          booking_id?: string | null;
          block_date: string;
          block_type?: "hold" | "confirmed" | "maintenance" | "turnaround_buffer";
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          gear_id?: string;
          booking_id?: string | null;
          block_date?: string;
          block_type?: "hold" | "confirmed" | "maintenance" | "turnaround_buffer";
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_blocks_gear_id_fkey";
            columns: ["gear_id"];
            isOneToOne: false;
            referencedRelation: "gear_inventory";
            referencedColumns: ["id"];
          },
        ];
      };
      rental_bookings: {
        Row: {
          id: string;
          reference_code: string;
          customer_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shoot_start_date: string;
          shoot_return_date: string;
          total_days: number;
          subtotal_inr: number;
          discount_inr: number;
          gst_inr: number;
          total_amount_inr: number;
          security_deposit_inr: number;
          deposit_waiver_applied: boolean;
          stage_destination: string;
          metro_hub: "Mumbai" | "Hyderabad" | "Delhi NCR" | "Bengaluru";
          status:
            | "hold_requested"
            | "kyc_review"
            | "confirmed"
            | "prepped_and_calibrated"
            | "van_dispatched"
            | "on_set"
            | "wrap_returned"
            | "collimation_cleared"
            | "closed"
            | "cancelled";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_code: string;
          customer_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shoot_start_date: string;
          shoot_return_date: string;
          total_days: number;
          subtotal_inr: number;
          discount_inr?: number;
          gst_inr?: number;
          total_amount_inr: number;
          security_deposit_inr?: number;
          deposit_waiver_applied?: boolean;
          stage_destination: string;
          metro_hub?: "Mumbai" | "Hyderabad" | "Delhi NCR" | "Bengaluru";
          status?:
            | "hold_requested"
            | "kyc_review"
            | "confirmed"
            | "prepped_and_calibrated"
            | "van_dispatched"
            | "on_set"
            | "wrap_returned"
            | "collimation_cleared"
            | "closed"
            | "cancelled";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_code?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shoot_start_date?: string;
          shoot_return_date?: string;
          total_days?: number;
          subtotal_inr?: number;
          discount_inr?: number;
          gst_inr?: number;
          total_amount_inr?: number;
          security_deposit_inr?: number;
          deposit_waiver_applied?: boolean;
          stage_destination?: string;
          metro_hub?: "Mumbai" | "Hyderabad" | "Delhi NCR" | "Bengaluru";
          status?:
            | "hold_requested"
            | "kyc_review"
            | "confirmed"
            | "prepped_and_calibrated"
            | "van_dispatched"
            | "on_set"
            | "wrap_returned"
            | "collimation_cleared"
            | "closed"
            | "cancelled";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rental_bookings_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customer_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      booking_items: {
        Row: {
          id: string;
          booking_id: string;
          gear_id: string;
          daily_rate: number;
          quantity: number;
          subtotal_inr: number;
        };
        Insert: {
          id?: string;
          booking_id: string;
          gear_id: string;
          daily_rate: number;
          quantity?: number;
          subtotal_inr: number;
        };
        Update: {
          id?: string;
          booking_id?: string;
          gear_id?: string;
          daily_rate?: number;
          quantity?: number;
          subtotal_inr?: number;
        };
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "rental_bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "booking_items_gear_id_fkey";
            columns: ["gear_id"];
            isOneToOne: false;
            referencedRelation: "gear_inventory";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          production_house: string | null;
          gstin: string | null;
          wica_card_number: string | null;
          kyc_status: "unverified" | "pending" | "verified" | "rejected";
          deposit_waiver_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          production_house?: string | null;
          gstin?: string | null;
          wica_card_number?: string | null;
          kyc_status?: "unverified" | "pending" | "verified" | "rejected";
          deposit_waiver_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          production_house?: string | null;
          gstin?: string | null;
          wica_card_number?: string | null;
          kyc_status?: "unverified" | "pending" | "verified" | "rejected";
          deposit_waiver_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dispatch_inspections: {
        Row: {
          id: string;
          booking_id: string;
          gear_id: string;
          inspector_name: string;
          flange_focal_distance_mm: number;
          deviation_mm: number;
          sensor_clean_pass: boolean;
          lens_element_scratch_pass: boolean;
          checked_out_at: string;
          checked_in_at: string | null;
          return_notes: string | null;
        };
        Insert: {
          id?: string;
          booking_id: string;
          gear_id: string;
          inspector_name: string;
          flange_focal_distance_mm: number;
          deviation_mm: number;
          sensor_clean_pass?: boolean;
          lens_element_scratch_pass?: boolean;
          checked_out_at?: string;
          checked_in_at?: string | null;
          return_notes?: string | null;
        };
        Update: {
          id?: string;
          booking_id?: string;
          gear_id?: string;
          inspector_name?: string;
          flange_focal_distance_mm?: number;
          deviation_mm?: number;
          sensor_clean_pass?: boolean;
          lens_element_scratch_pass?: boolean;
          checked_out_at?: string;
          checked_in_at?: string | null;
          return_notes?: string | null;
        };
        Relationships: [];
      };
      rental_inquiries: {
        Row: {
          category: string;
          created_at: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          end_date: string;
          gear_name: string;
          id: string;
          notes: string;
          start_date: string;
          status: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          end_date: string;
          gear_name: string;
          id?: string;
          notes?: string;
          start_date: string;
          status?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string;
          end_date?: string;
          gear_name?: string;
          id?: string;
          notes?: string;
          start_date?: string;
          status?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

