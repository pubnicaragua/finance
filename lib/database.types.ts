export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      activos_corrientes: {
        Row: {
          cuenta_id: string | null
          created_at: string | null
          descripcion: string
          fecha_adquisicion: string | null
          id: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          cuenta_id?: string | null
          created_at?: string | null
          descripcion: string
          fecha_adquisicion?: string | null
          id?: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          cuenta_id?: string | null
          created_at?: string | null
          descripcion?: string
          fecha_adquisicion?: string | null
          id?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "activos_corrientes_cuenta_id_fkey"
            columns: ["cuenta_id"]
            isOneToOne: false
            referencedRelation: "cuentas_financieras"
            referencedColumns: ["id"]
          },
        ]
      }
      activos_no_corrientes: {
        Row: {
          created_at: string | null
          depreciacion: number | null
          descripcion: string
          id: string
          updated_at: string | null
          valor: number
          valor_neto: number | null
        }
        Insert: {
          created_at?: string | null
          depreciacion?: number | null
          descripcion: string
          id?: string
          updated_at?: string | null
          valor: number
          valor_neto?: number | null
        }
        Update: {
          created_at?: string | null
          depreciacion?: number | null
          descripcion?: string
          id?: string
          updated_at?: string | null
          valor?: number
          valor_neto?: number | null
        }
        Relationships: []
      }
      alcances_desarrollo: {
        Row: {
          cliente_id: string
          created_at: string
          descripcion: string
          estado: string
          fecha_implementacion: string | null
          id: string
          nombre_modulo: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          descripcion: string
          estado?: string
          fecha_implementacion?: string | null
          id?: string
          nombre_modulo: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          descripcion?: string
          estado?: string
          fecha_implementacion?: string | null
          id?: string
          nombre_modulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      avances_proyecto: {
        Row: {
          cliente_id: string
          comentarios_cliente: string | null
          created_at: string
          descripcion: string
          fecha: string
          id: string
          porcentaje_avance: number
        }
        Insert: {
          cliente_id: string
          comentarios_cliente?: string | null
          created_at?: string
          descripcion: string
          fecha: string
          id?: string
          porcentaje_avance?: number
        }
        Update: {
          cliente_id?: string
          comentarios_cliente?: string | null
          created_at?: string
          descripcion?: string
          fecha?: string
          id?: string
          porcentaje_avance?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          abonado: number | null
          cliente: string
          costo_proyecto: number | null
          created_at: string | null
          deuda: number | null
          estado: string | null
          fecha_vencimiento: string | null
          historial_pagos: Json | null
          id: string
          pais: string | null
          proyeccion_pagos: Json | null
          proyecto: string
          tipo_software: string | null
          updated_at: string | null
        }
        Insert: {
          abonado?: number | null
          cliente: string
          costo_proyecto?: number | null
          created_at?: string | null
          deuda?: number | null
          estado?: string | null
          fecha_vencimiento?: string | null
          historial_pagos?: Json | null
          id?: string
          pais?: string | null
          proyeccion_pagos?: Json | null
          proyecto: string
          tipo_software?: string | null
          updated_at?: string | null
        }
        Update: {
          abonado?: number | null
          cliente?: string
          costo_proyecto?: number | null
          created_at?: string | null
          deuda?: number | null
          estado?: string | null
          fecha_vencimiento?: string | null
          historial_pagos?: Json | null
          id?: string
          pais?: string | null
          proyeccion_pagos?: Json | null
          proyecto?: string
          tipo_software?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comisiones: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          fecha: string
          id: string
          monto: number
          pagada: boolean | null
          transaccion_id: string | null
          updated_at: string | null
          vendedor: string
          vendedores_adicionales: string[] | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          fecha: string
          id?: string
          monto: number
          pagada?: boolean | null
          transaccion_id?: string | null
          updated_at?: string | null
          vendedor: string
          vendedores_adicionales?: string[] | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          fecha?: string
          id?: string
          monto?: number
          pagada?: boolean | null
          transaccion_id?: string | null
          updated_at?: string | null
          vendedor?: string
          vendedores_adicionales?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "comisiones_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comisiones_transaccion_id_fkey"
            columns: ["transaccion_id"]
            isOneToOne: false
            referencedRelation: "transacciones"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracion: {
        Row: {
          clave: string
          created_at: string | null
          descripcion: string | null
          id: string
          updated_at: string | null
          valor: string
        }
        Insert: {
          clave: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          updated_at?: string | null
          valor: string
        }
        Update: {
          clave?: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          updated_at?: string | null
          valor?: string
        }
        Relationships: []
      }
      cuentas: {
        Row: {
          id: string
          moneda: string
          nombre: string
          saldo: number | null
        }
        Insert: {
          id: string
          moneda: string
          nombre: string
          saldo?: number | null
        }
        Update: {
          id?: string
          moneda?: string
          nombre?: string
          saldo?: number | null
        }
        Relationships: []
      }
      cuentas_financieras: {
        Row: {
          created_at: string | null
          id: string
          moneda: string
          nombre: string
          saldo: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          moneda: string
          nombre: string
          saldo?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          moneda?: string
          nombre?: string
          saldo?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      egresos: {
        Row: {
          cuenta_id: string | null
          created_at: string
          descripcion: string | null
          fecha: string
          id: string
          moneda: string
          monto: number
          proveedor: string | null
        }
        Insert: {
          cuenta_id?: string | null
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          moneda?: string
          monto: number
          proveedor?: string | null
        }
        Update: {
          cuenta_id?: string | null
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          moneda?: string
          monto?: number
          proveedor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "egresos_cuenta_id_fkey"
            columns: ["cuenta_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id"]
          },
        ]
      }
      ingresos: {
        Row: {
          cliente_id: string | null
          cuenta_id: string | null
          created_at: string
          descripcion: string | null
          fecha: string
          id: string
          moneda: string
          monto: number
        }
        Insert: {
          cliente_id?: string | null
          cuenta_id?: string | null
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          moneda?: string
          monto: number
        }
        Update: {
          cliente_id?: string | null
          cuenta_id?: string | null
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          moneda?: string
          monto?: number
        }
        Relationships: [
          {
            foreignKeyName: "ingresos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingresos_cuenta_id_fkey"
            columns: ["cuenta_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          canal_contacto: string | null
          cliente: string
          created_at: string | null
          estado: string | null
          fecha_ultimo_contacto: string | null
          id: string
          pais: string | null
          proyeccion_usd: number | null
          proyecto: string
          seguimiento: Json | null
          tipo_software: string | null
          updated_at: string | null
        }
        Insert: {
          canal_contacto?: string | null
          cliente: string
          created_at?: string | null
          estado?: string | null
          fecha_ultimo_contacto?: string | null
          id?: string
          pais?: string | null
          proyeccion_usd?: number | null
          proyecto: string
          seguimiento?: Json | null
          tipo_software?: string | null
          updated_at?: string | null
        }
        Update: {
          canal_contacto?: string | null
          cliente?: string
          created_at?: string | null
          estado?: string | null
          fecha_ultimo_contacto?: string | null
          id?: string
          pais?: string | null
          proyeccion_usd?: number | null
          proyecto?: string
          seguimiento?: Json | null
          tipo_software?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          created_at: string | null
          estado: string | null
          expectativas: Json | null
          fecha_fin: string | null
          fecha_inicio: string | null
          historial_interacciones: Json | null
          id: string
          monto_financiado: number | null
          nombre: string
          responsabilidades: Json | null
          tipo_acuerdo: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: string | null
          expectativas?: Json | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          historial_interacciones?: Json | null
          id?: string
          monto_financiado?: number | null
          nombre: string
          responsabilidades?: Json | null
          tipo_acuerdo?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string | null
          expectativas?: Json | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          historial_interacciones?: Json | null
          id?: string
          monto_financiado?: number | null
          nombre?: string
          responsabilidades?: Json | null
          tipo_acuerdo?: string | null
        }
        Relationships: []
      }
      pasivos_corrientes: {
        Row: {
          created_at: string | null
          debe: number
          descripcion: string
          id: string
          saldo: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          debe: number
          descripcion: string
          id?: string
          saldo: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          debe?: number
          descripcion?: string
          id?: string
          saldo?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      pasivos_no_corrientes: {
        Row: {
          created_at: string | null
          descripcion: string
          fecha_vencimiento: string | null
          id: string
          saldo: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion: string
          fecha_vencimiento?: string | null
          id?: string
          saldo: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string
          fecha_vencimiento?: string | null
          id?: string
          saldo?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      proyectos: {
        Row: {
          cliente_id: string | null
          costo_total: number | null
          created_at: string
          descripcion: string | null
          estado: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          cliente_id?: string | null
          costo_total?: number | null
          created_at?: string
          descripcion?: string | null
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string | null
          costo_total?: number | null
          created_at?: string
          descripcion?: string | null
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proyectos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      tipo_cambio: {
        Row: {
          created_at: string
          fecha: string
          fuente: string | null
          id: string
          valor: number
        }
        Insert: {
          created_at?: string
          fecha?: string
          fuente?: string | null
          id?: string
          valor: number
        }
        Update: {
          created_at?: string
          fecha?: string
          fuente?: string | null
          id?: string
          valor?: number
        }
        Relationships: []
      }
      transacciones: {
        Row: {
          aplicar_comision: boolean | null
          cliente_id: string | null
          comision_aplicada: number | null
          concepto: string
          cuenta_id: string | null
          created_at: string | null
          detalle: string | null
          fecha: string
          id: string
          monto: number
          tipo: string
          tipo_egreso: string | null
          tipo_ingreso: string | null
          updated_at: string | null
          vendedor_comision: string | null
        }
        Insert: {
          aplicar_comision?: boolean | null
          cliente_id?: string | null
          comision_aplicada?: number | null
          concepto: string
          cuenta_id?: string | null
          created_at?: string | null
          detalle?: string | null
          fecha: string
          id?: string
          monto: number
          tipo: string
          tipo_egreso?: string | null
          tipo_ingreso?: string | null
          updated_at?: string | null
          vendedor_comision?: string | null
        }
        Update: {
          aplicar_comision?: boolean | null
          cliente_id?: string | null
          comision_aplicada?: number | null
          concepto?: string
          cuenta_id?: string | null
          created_at?: string | null
          detalle?: string | null
          fecha?: string
          id?: string
          monto?: number
          tipo?: string
          tipo_egreso?: string | null
          tipo_ingreso?: string | null
          updated_at?: string | null
          vendedor_comision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_cuenta_id_fkey"
            columns: ["cuenta_id"]
            isOneToOne: false
            referencedRelation: "cuentas_financieras"
            referencedColumns: ["id"]
          },
        ]
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
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
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
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
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
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
