export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      activos_corrientes: {
        Row: {
          id: string
          descripcion: string
          valor: number
          cuenta_id: string | null
          created_at: string | null
          updated_at: string | null
          fecha_adquisicion: string | null
        }
        Insert: {
          id?: string
          descripcion: string
          valor: number
          cuenta_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          fecha_adquisicion?: string | null
        }
        Update: {
          id?: string
          descripcion?: string
          valor?: number
          cuenta_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          fecha_adquisicion?: string | null
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
          id: string
          descripcion: string
          valor: number
          depreciacion: number | null
          valor_neto: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          descripcion: string
          valor: number
          depreciacion?: number | null
          valor_neto?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          descripcion?: string
          valor?: number
          depreciacion?: number | null
          valor_neto?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      alcances_desarrollo: {
        Row: {
          id: string
          cliente_id: string
          created_at: string
          descripcion: string
          estado: string
          fecha_implementacion: string | null
          nombre_modulo: string
        }
        Insert: {
          id?: string
          cliente_id: string
          created_at?: string
          descripcion: string
          estado?: string
          fecha_implementacion?: string | null
          nombre_modulo: string
        }
        Update: {
          id?: string
          cliente_id?: string
          created_at?: string
          descripcion?: string
          estado?: string
          fecha_implementacion?: string | null
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
      asignaciones: {
        Row: {
          id: string
          miembro_id: string
          titulo: string
          descripcion: string | null
          fecha_inicio: string
          fecha_fin: string
          estado: string
          prioridad: string | null
          proyecto_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          miembro_id: string
          titulo: string
          descripcion?: string | null
          fecha_inicio: string
          fecha_fin: string
          estado?: string
          prioridad?: string | null
          proyecto_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          miembro_id?: string
          titulo?: string
          descripcion?: string | null
          fecha_inicio?: string
          fecha_fin?: string
          estado?: string
          prioridad?: string | null
          proyecto_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asignaciones_miembro_id_fkey"
            columns: ["miembro_id"]
            isOneToOne: false
            referencedRelation: "miembros_equipo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignaciones_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          }
        ]
      }
      avances_proyecto: {
        Row: {
          id: string
          cliente_id: string
          comentarios_cliente: string | null
          created_at: string
          descripcion: string
          fecha: string
          porcentaje_avance: number
          completado: boolean | null
          backlog_url: string | null
          firma_virtual: string | null
          firma_aprobada: boolean | null
          fecha_vencimiento_firma: string | null
        }
        Insert: {
          id?: string
          cliente_id: string
          comentarios_cliente?: string | null
          created_at?: string
          descripcion: string
          fecha: string
          porcentaje_avance?: number
          completado?: boolean | null
          backlog_url?: string | null
          firma_virtual?: string | null
          firma_aprobada?: boolean | null
          fecha_vencimiento_firma?: string | null
        }
        Update: {
          id?: string
          cliente_id?: string
          comentarios_cliente?: string | null
          created_at?: string
          descripcion?: string
          fecha?: string
          porcentaje_avance?: number
          completado?: boolean | null
          backlog_url?: string | null
          firma_virtual?: string | null
          firma_aprobada?: boolean | null
          fecha_vencimiento_firma?: string | null
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
          id: string
          cliente: string
          proyecto: string
          tipo_software: string | null
          estado: string | null
          pais: string | null
          costo_proyecto: number | null
          abonado: number | null
          deuda: number | null
          fecha_vencimiento: string | null
          historial_pagos: Json | null
          proyeccion_pagos: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          cliente: string
          proyecto: string
          tipo_software?: string | null
          estado?: string | null
          pais?: string | null
          costo_proyecto?: number | null
          abonado?: number | null
          fecha_vencimiento?: string | null
          historial_pagos?: Json | null
          proyeccion_pagos?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          cliente?: string
          proyecto?: string
          tipo_software?: string | null
          estado?: string | null
          pais?: string | null
          costo_proyecto?: number | null
          abonado?: number | null
          fecha_vencimiento?: string | null
          historial_pagos?: Json | null
          proyeccion_pagos?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comisiones: {
        Row: {
          id: string
          cliente_id: string | null
          created_at: string | null
          fecha: string
          monto: number
          pagada: boolean | null
          transaccion_id: string | null
          updated_at: string | null
          vendedor: string
          vendedores_adicionales: string[] | null
        }
        Insert: {
          id?: string
          cliente_id?: string | null
          created_at?: string | null
          fecha: string
          monto: number
          pagada?: boolean | null
          transaccion_id?: string | null
          updated_at?: string | null
          vendedor: string
          vendedores_adicionales?: string[] | null
        }
        Update: {
          id?: string
          cliente_id?: string | null
          created_at?: string | null
          fecha?: string
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
      configuracion_notificaciones: {
        Row: {
          id: string
          miembro_id: string
          notificaciones_activas: boolean | null
          notificar_sin_asignacion: boolean | null
          tiempo_sin_asignacion: unknown | null
          notificar_por_email: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          miembro_id: string
          notificaciones_activas?: boolean | null
          notificar_sin_asignacion?: boolean | null
          tiempo_sin_asignacion?: unknown | null
          notificar_por_email?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          miembro_id?: string
          notificaciones_activas?: boolean | null
          notificar_sin_asignacion?: boolean | null
          tiempo_sin_asignacion?: unknown | null
          notificar_por_email?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracion_notificaciones_miembro_id_fkey"
            columns: ["miembro_id"]
            isOneToOne: true
            referencedRelation: "miembros_equipo"
            referencedColumns: ["id"]
          }
        ]
      }
      cuentas_financieras: {
        Row: {
          id: string
          nombre: string
          moneda: string
          saldo: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          nombre: string
          moneda: string
          saldo?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          moneda?: string
          saldo?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      empleados: {
        Row: {
          id: string
          nombre: string
          apellido: string
          email: string | null
          telefono: string | null
          puesto: string
          departamento: string | null
          salario_base: number
          fecha_contratacion: string | null
          estado: string | null
          numero_cuenta: string | null
          banco: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          apellido: string
          email?: string | null
          telefono?: string | null
          puesto: string
          departamento?: string | null
          salario_base: number
          fecha_contratacion?: string | null
          estado?: string | null
          numero_cuenta?: string | null
          banco?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string
          email?: string | null
          telefono?: string | null
          puesto?: string
          departamento?: string | null
          salario_base?: number
          fecha_contratacion?: string | null
          estado?: string | null
          numero_cuenta?: string | null
          banco?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          nombre: string
          email: string | null
          telefono: string | null
          interes: string | null
          estado: string | null
          fecha_contacto: string | null
          fuente: string | null
          notas: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          email?: string | null
          telefono?: string | null
          interes?: string | null
          estado?: string | null
          fecha_contacto?: string | null
          fuente?: string | null
          notas?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          email?: string | null
          telefono?: string | null
          interes?: string | null
          estado?: string | null
          fecha_contacto?: string | null
          fuente?: string | null
          notas?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      miembros_equipo: {
        Row: {
          id: string
          nombre: string
          email: string
          cargo: string
          departamento: string | null
          activo: boolean | null
          user_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          email: string
          cargo: string
          departamento?: string | null
          activo?: boolean | null
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          cargo?: string
          departamento?: string | null
          activo?: boolean | null
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "miembros_equipo_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      nomina: {
        Row: {
          id: string
          empleado_id: string
          periodo_inicio: string
          periodo_fin: string
          salario_base: number
          bonificaciones: number | null
          deducciones: number | null
          salario_neto: number | null
          estado: string | null
          fecha_pago: string | null
          notas: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          empleado_id: string
          periodo_inicio: string
          periodo_fin: string
          salario_base: number
          bonificaciones?: number | null
          deducciones?: number | null
          estado?: string | null
          fecha_pago?: string | null
          notas?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          empleado_id?: string
          periodo_inicio?: string
          periodo_fin?: string
          salario_base?: number
          bonificaciones?: number | null
          deducciones?: number | null
          estado?: string | null
          fecha_pago?: string | null
          notas?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nomina_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones: {
        Row: {
          id: string
          miembro_id: string
          tipo: string
          mensaje: string
          leida: boolean | null
          fecha_creacion: string | null
          fecha_lectura: string | null
        }
        Insert: {
          id?: string
          miembro_id: string
          tipo?: string
          mensaje: string
          leida?: boolean | null
          fecha_creacion?: string | null
          fecha_lectura?: string | null
        }
        Update: {
          id?: string
          miembro_id?: string
          tipo?: string
          mensaje?: string
          leida?: boolean | null
          fecha_creacion?: string | null
          fecha_lectura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_miembro_id_fkey"
            columns: ["miembro_id"]
            isOneToOne: false
            referencedRelation: "miembros_equipo"
            referencedColumns: ["id"]
          }
        ]
      }
      partnerships: {
        Row: {
          id: string
          nombre: string
          tipo_acuerdo: string | null
          estado: string | null
          monto_financiado: number | null
          fecha_inicio: string | null
          fecha_fin: string | null
          responsabilidades: Json | null
          expectativas: Json | null
          historial_interacciones: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          tipo_acuerdo?: string | null
          estado?: string | null
          monto_financiado?: number | null
          fecha_inicio?: string | null
          fecha_fin?: string | null
          responsabilidades?: Json | null
          expectativas?: Json | null
          historial_interacciones?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          tipo_acuerdo?: string | null
          estado?: string | null
          monto_financiado?: number | null
          fecha_inicio?: string | null
          fecha_fin?: string | null
          responsabilidades?: Json | null
          expectativas?: Json | null
          historial_interacciones?: Json | null
          created_at?: string | null
        }
        Relationships: []
      }
      pasivos_corrientes: {
        Row: {
          id: string
          descripcion: string
          debe: number
          saldo: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          descripcion: string
          debe: number
          saldo: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          descripcion?: string
          debe?: number
          saldo?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pasivos_no_corrientes: {
        Row: {
          id: string
          descripcion: string
          saldo: number
          fecha_vencimiento: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          descripcion: string
          saldo: number
          fecha_vencimiento?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          descripcion?: string
          saldo?: number
          fecha_vencimiento?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      qa_issues: {
        Row: {
          id: string
          feature: string
          description: string
          status: string
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          feature: string
          description: string
          status?: string
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          feature?: string
          description?: string
          status?: string
          created_at?: string
          resolved_at?: string | null
        }
        Relationships: []
      }
      transacciones: {
        Row: {
          id: string
          cuenta_id: string | null
          concepto: string
          detalle: string | null
          fecha: string
          monto: number
          tipo: string
          tipo_ingreso: string | null
          tipo_egreso: string | null
          cliente_id: string | null
          aplicar_comision: boolean | null
          vendedor_comision: string | null
          comision_aplicada: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          cuenta_id?: string | null
          concepto: string
          detalle?: string | null
          fecha: string
          monto: number
          tipo: string
          tipo_ingreso?: string | null
          tipo_egreso?: string | null
          cliente_id?: string | null
          aplicar_comision?: boolean | null
          vendedor_comision?: string | null
          comision_aplicada?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          cuenta_id?: string | null
          concepto?: string
          detalle?: string | null
          fecha?: string
          monto?: number
          tipo?: string
          tipo_ingreso?: string | null
          tipo_egreso?: string | null
          cliente_id?: string | null
          aplicar_comision?: boolean | null
          vendedor_comision?: string | null
          comision_aplicada?: number | null
          created_at?: string | null
          updated_at?: string | null
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicTableNameOrOptions]
    : never