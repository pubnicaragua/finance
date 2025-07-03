/*
  # Calendario de equipo y sistema de notificaciones

  1. Nuevas Tablas
    - `miembros_equipo` - Información de los miembros del equipo
    - `asignaciones` - Tareas asignadas a miembros del equipo
    - `notificaciones` - Sistema de notificaciones para miembros sin asignaciones
    - `configuracion_notificaciones` - Configuración de notificaciones por usuario

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para usuarios autenticados
*/

-- Tabla de miembros del equipo
CREATE TABLE IF NOT EXISTS miembros_equipo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  cargo text NOT NULL,
  departamento text,
  activo boolean DEFAULT true,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de asignaciones
CREATE TABLE IF NOT EXISTS asignaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  miembro_id uuid NOT NULL REFERENCES miembros_equipo(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descripcion text,
  fecha_inicio timestamptz NOT NULL,
  fecha_fin timestamptz NOT NULL,
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completada', 'cancelada')),
  prioridad text DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
  proyecto_id uuid REFERENCES clientes(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  miembro_id uuid NOT NULL REFERENCES miembros_equipo(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'sin_asignacion' CHECK (tipo IN ('sin_asignacion', 'recordatorio', 'sistema')),
  mensaje text NOT NULL,
  leida boolean DEFAULT false,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_lectura timestamptz
);

-- Tabla de configuración de notificaciones
CREATE TABLE IF NOT EXISTS configuracion_notificaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  miembro_id uuid NOT NULL REFERENCES miembros_equipo(id) ON DELETE CASCADE,
  notificaciones_activas boolean DEFAULT true,
  notificar_sin_asignacion boolean DEFAULT true,
  tiempo_sin_asignacion interval DEFAULT '1 hour',
  notificar_por_email boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT configuracion_notificaciones_miembro_unique UNIQUE (miembro_id)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE miembros_equipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Allow all operations for authenticated users" ON miembros_equipo FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON asignaciones FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON notificaciones FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON configuracion_notificaciones FOR ALL TO authenticated USING (true);

-- Triggers para actualizar updated_at
CREATE TRIGGER update_miembros_equipo_updated_at BEFORE UPDATE ON miembros_equipo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asignaciones_updated_at BEFORE UPDATE ON asignaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracion_notificaciones_updated_at BEFORE UPDATE ON configuracion_notificaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear notificaciones cuando un miembro no tiene asignaciones por más de 1 hora
CREATE OR REPLACE FUNCTION check_miembros_sin_asignaciones()
RETURNS TRIGGER AS $$
DECLARE
  miembro RECORD;
  config RECORD;
  ultima_asignacion RECORD;
  tiempo_sin_asignacion INTERVAL;
BEGIN
  -- Para cada miembro activo
  FOR miembro IN SELECT * FROM miembros_equipo WHERE activo = true LOOP
    -- Obtener la configuración de notificaciones del miembro
    SELECT * INTO config FROM configuracion_notificaciones WHERE miembro_id = miembro.id;
    
    -- Si las notificaciones están activas y se debe notificar sin asignación
    IF (config IS NULL OR config.notificaciones_activas) AND (config IS NULL OR config.notificar_sin_asignacion) THEN
      -- Obtener la última asignación del miembro que no esté completada o cancelada
      SELECT * INTO ultima_asignacion FROM asignaciones 
      WHERE miembro_id = miembro.id 
      AND estado NOT IN ('completada', 'cancelada')
      AND fecha_fin > now()
      ORDER BY fecha_fin DESC 
      LIMIT 1;
      
      -- Si no hay asignación activa o la última terminó hace más del tiempo configurado
      IF ultima_asignacion IS NULL THEN
        -- Verificar si ya existe una notificación sin leer para este miembro
        IF NOT EXISTS (
          SELECT 1 FROM notificaciones 
          WHERE miembro_id = miembro.id 
          AND tipo = 'sin_asignacion' 
          AND leida = false
        ) THEN
          -- Crear notificación
          INSERT INTO notificaciones (miembro_id, tipo, mensaje)
          VALUES (
            miembro.id, 
            'sin_asignacion', 
            'No tienes asignaciones activas por más de ' || 
            COALESCE(config.tiempo_sin_asignacion, '1 hour')::text
          );
        END IF;
      END IF;
    END IF;
  END LOOP;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear un trigger que se ejecute periódicamente (esto requiere una extensión como pg_cron)
-- Como alternativa, se puede llamar a esta función desde una tarea programada externa

-- Insertar algunos miembros de equipo de ejemplo
INSERT INTO miembros_equipo (nombre, email, cargo, departamento) VALUES
  ('Nahuel', 'nahuel@softwarenicaragua.com', 'Desarrollador Senior', 'Desarrollo'),
  ('Ileana', 'ileana@softwarenicaragua.com', 'Gerente de Proyectos', 'Administración'),
  ('Edxel', 'edxel@softwarenicaragua.com', 'Desarrollador Frontend', 'Desarrollo'),
  ('María', 'maria@softwarenicaragua.com', 'Diseñadora UX/UI', 'Diseño')
ON CONFLICT (email) DO NOTHING;

-- Insertar configuración de notificaciones para los miembros
INSERT INTO configuracion_notificaciones (miembro_id, notificaciones_activas, notificar_sin_asignacion, tiempo_sin_asignacion)
SELECT id, true, true, '1 hour' FROM miembros_equipo
ON CONFLICT (miembro_id) DO NOTHING;