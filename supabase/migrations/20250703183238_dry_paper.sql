/*
  # Sistema Financiero Completo - Schema Principal

  1. Tablas principales
    - `cuentas_financieras` - Cuentas bancarias y de efectivo
    - `clientes` - Información de clientes
    - `leads` - Prospectos de clientes
    - `partnerships` - Acuerdos con socios
    - `transacciones` - Ingresos y egresos
    - `comisiones` - Comisiones de vendedores
    - `activos_corrientes` - Activos a corto plazo
    - `activos_no_corrientes` - Activos a largo plazo
    - `pasivos_corrientes` - Pasivos a corto plazo
    - `pasivos_no_corrientes` - Pasivos a largo plazo
    - `avances_proyecto` - Avances de proyectos de clientes
    - `alcances_desarrollo` - Alcances de desarrollo
    - `empleados` - Información de empleados
    - `nomina` - Registro de nómina
    - `qa_issues` - Issues de QA

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para usuarios autenticados
*/

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de cuentas financieras
CREATE TABLE IF NOT EXISTS cuentas_financieras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  moneda text NOT NULL DEFAULT 'USD',
  saldo numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente text NOT NULL,
  proyecto text NOT NULL,
  tipo_software text,
  estado text DEFAULT 'Activo',
  pais text,
  costo_proyecto numeric(12,2) DEFAULT 0,
  abonado numeric(12,2) DEFAULT 0,
  deuda numeric(12,2) GENERATED ALWAYS AS (COALESCE(costo_proyecto, 0) - COALESCE(abonado, 0)) STORED,
  fecha_vencimiento date,
  historial_pagos jsonb DEFAULT '[]'::jsonb,
  proyeccion_pagos jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text,
  telefono text,
  interes text,
  estado text DEFAULT 'Nuevo',
  fecha_contacto date DEFAULT CURRENT_DATE,
  fuente text,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de partnerships
CREATE TABLE IF NOT EXISTS partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  tipo_acuerdo text,
  estado text DEFAULT 'Activo',
  monto_financiado numeric(12,2) DEFAULT 0,
  fecha_inicio date DEFAULT CURRENT_DATE,
  fecha_fin date,
  responsabilidades jsonb DEFAULT '[]'::jsonb,
  expectativas jsonb DEFAULT '[]'::jsonb,
  historial_interacciones jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuenta_id uuid REFERENCES cuentas_financieras(id),
  concepto text NOT NULL,
  detalle text,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  monto numeric(12,2) NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('ingreso', 'egreso', 'transferencia')),
  tipo_ingreso text,
  tipo_egreso text,
  cliente_id uuid REFERENCES clientes(id),
  aplicar_comision boolean DEFAULT false,
  vendedor_comision text,
  comision_aplicada numeric(12,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT check_tipo_categoria CHECK (
    (tipo = 'ingreso' AND tipo_ingreso IS NOT NULL AND tipo_egreso IS NULL) OR
    (tipo = 'egreso' AND tipo_egreso IS NOT NULL AND tipo_ingreso IS NULL) OR
    (tipo = 'transferencia' AND tipo_ingreso IS NULL AND tipo_egreso IS NULL)
  )
);

-- Tabla de comisiones
CREATE TABLE IF NOT EXISTS comisiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaccion_id uuid REFERENCES transacciones(id),
  cliente_id uuid REFERENCES clientes(id),
  vendedor text NOT NULL,
  monto numeric(12,2) NOT NULL,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  pagada boolean DEFAULT false,
  vendedores_adicionales text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de activos corrientes
CREATE TABLE IF NOT EXISTS activos_corrientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  valor numeric(12,2) NOT NULL,
  cuenta_id uuid REFERENCES cuentas_financieras(id),
  fecha_adquisicion date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de activos no corrientes
CREATE TABLE IF NOT EXISTS activos_no_corrientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  valor numeric(12,2) NOT NULL,
  depreciacion numeric(12,2) DEFAULT 0,
  valor_neto numeric(12,2) GENERATED ALWAYS AS (COALESCE(valor, 0) - COALESCE(depreciacion, 0)) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de pasivos corrientes
CREATE TABLE IF NOT EXISTS pasivos_corrientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  debe numeric(12,2) NOT NULL,
  saldo numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de pasivos no corrientes
CREATE TABLE IF NOT EXISTS pasivos_no_corrientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  saldo numeric(12,2) NOT NULL,
  fecha_vencimiento date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de avances de proyecto
CREATE TABLE IF NOT EXISTS avances_proyecto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  descripcion text NOT NULL,
  porcentaje_avance numeric(5,2) DEFAULT 0,
  comentarios_cliente text,
  completado boolean DEFAULT false,
  backlog_url text,
  firma_virtual text,
  firma_aprobada boolean DEFAULT false,
  fecha_vencimiento_firma timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Tabla de alcances de desarrollo
CREATE TABLE IF NOT EXISTS alcances_desarrollo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nombre_modulo text NOT NULL,
  descripcion text NOT NULL,
  fecha_implementacion date,
  estado text DEFAULT 'En Desarrollo',
  created_at timestamptz DEFAULT now()
);

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  apellido text NOT NULL,
  email text UNIQUE,
  telefono text,
  puesto text NOT NULL,
  departamento text,
  salario_base numeric(12,2) NOT NULL,
  fecha_contratacion date DEFAULT CURRENT_DATE,
  estado text DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo', 'Vacaciones', 'Licencia')),
  numero_cuenta text,
  banco text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de nómina
CREATE TABLE IF NOT EXISTS nomina (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empleado_id uuid NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
  periodo_inicio date NOT NULL,
  periodo_fin date NOT NULL,
  salario_base numeric(12,2) NOT NULL,
  bonificaciones numeric(12,2) DEFAULT 0,
  deducciones numeric(12,2) DEFAULT 0,
  salario_neto numeric(12,2) GENERATED ALWAYS AS (COALESCE(salario_base, 0) + COALESCE(bonificaciones, 0) - COALESCE(deducciones, 0)) STORED,
  estado text DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Pagado', 'Cancelado')),
  fecha_pago date,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de QA issues
CREATE TABLE IF NOT EXISTS qa_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Insertar datos iniciales
INSERT INTO cuentas_financieras (id, nombre, moneda, saldo) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Caja Dólares', 'USD', 5000.00),
  ('550e8400-e29b-41d4-a716-446655440002', 'Banco Lafise USD', 'USD', 15000.00)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS en todas las tablas
ALTER TABLE cuentas_financieras ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE comisiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE activos_corrientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activos_no_corrientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pasivos_corrientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pasivos_no_corrientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE avances_proyecto ENABLE ROW LEVEL SECURITY;
ALTER TABLE alcances_desarrollo ENABLE ROW LEVEL SECURITY;
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE nomina ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_issues ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Allow all operations for authenticated users" ON cuentas_financieras FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON clientes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON partnerships FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON transacciones FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON comisiones FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON activos_corrientes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON activos_no_corrientes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON pasivos_corrientes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON pasivos_no_corrientes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON avances_proyecto FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON alcances_desarrollo FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON empleados FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON nomina FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON qa_issues FOR ALL TO authenticated USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_cuentas_financieras_updated_at BEFORE UPDATE ON cuentas_financieras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transacciones_updated_at BEFORE UPDATE ON transacciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comisiones_updated_at BEFORE UPDATE ON comisiones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activos_corrientes_updated_at BEFORE UPDATE ON activos_corrientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activos_no_corrientes_updated_at BEFORE UPDATE ON activos_no_corrientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pasivos_corrientes_updated_at BEFORE UPDATE ON pasivos_corrientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pasivos_no_corrientes_updated_at BEFORE UPDATE ON pasivos_no_corrientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empleados_updated_at BEFORE UPDATE ON empleados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nomina_updated_at BEFORE UPDATE ON nomina FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear comisiones automáticamente
CREATE OR REPLACE FUNCTION create_commission_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo crear comisión si es un ingreso y tiene comisión aplicada
    IF NEW.tipo = 'ingreso' AND NEW.aplicar_comision = true AND NEW.comision_aplicada > 0 THEN
        INSERT INTO comisiones (
            transaccion_id,
            cliente_id,
            vendedor,
            monto,
            fecha,
            pagada
        ) VALUES (
            NEW.id,
            NEW.cliente_id,
            NEW.vendedor_comision,
            NEW.comision_aplicada,
            NEW.fecha,
            false
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear comisiones automáticamente
CREATE TRIGGER create_commission_trigger
    AFTER INSERT ON transacciones
    FOR EACH ROW
    EXECUTE FUNCTION create_commission_on_transaction();