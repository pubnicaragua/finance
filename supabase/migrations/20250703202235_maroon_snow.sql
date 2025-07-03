/*
  # Fix constraints for client table

  1. Changes
    - Remove CHECK constraint on estado column to allow more flexible values
    - Fix any other constraint issues
*/

-- Remove the CHECK constraint on estado column in clientes table
ALTER TABLE IF EXISTS clientes 
  DROP CONSTRAINT IF EXISTS clientes_estado_check;

-- Add a more flexible constraint if needed
ALTER TABLE IF EXISTS clientes 
  ADD CONSTRAINT clientes_estado_check 
  CHECK (estado IS NULL OR estado::text = ANY (ARRAY[
    'MVP'::text, 
    'Completa'::text, 
    'Cancelada'::text, 
    'Activo'::text, 
    'Inactivo'::text, 
    'Pendiente'::text, 
    'Completado'::text
  ]));

-- Fix any other constraint issues
ALTER TABLE IF EXISTS transacciones
  DROP CONSTRAINT IF EXISTS transacciones_tipo_ingreso_check,
  DROP CONSTRAINT IF EXISTS transacciones_tipo_egreso_check,
  DROP CONSTRAINT IF EXISTS transacciones_vendedor_comision_check;

-- Add more flexible constraints
ALTER TABLE IF EXISTS transacciones
  ADD CONSTRAINT transacciones_tipo_check
  CHECK (tipo::text = ANY (ARRAY['ingreso'::text, 'egreso'::text, 'transferencia'::text]));