import { Permission } from '../../modules/auth/entities/permission.entity';

export const permissionsData: Partial<Permission>[] = [
  {
    resource: 'vacation',
    action: 'calculate',
    description: 'Generar cálculo de vacaciones y la solicitud de aprobación',
  },
  {
    resource: 'vacation',
    action: 'generate_receipt',
    description: 'Generar recibos de vacaciones y la solicitud de aprobación',
  },
  {
    resource: 'vacation',
    action: 'request_receipt_send',
    description: 'Solicitar envío de recibos por correo',
  },
  {
    resource: 'vacation',
    action: 'generate_report',
    description: 'Generar reportes de vacaciones y la solicitud de aprobación',
  },
  {
    resource: 'vacation',
    action: 'request_report_send',
    description: 'Solicitar envío de reportes por correo',
  },

  // Nóminas
  {
    resource: 'payroll',
    action: 'calculate',
    description: 'Generar cálculo de nómina',
  },
  {
    resource: 'payroll',
    action: 'request_adjustment',
    description: 'Solicitar cambios en sueldos/tasas de cambio',
  },
  {
    resource: 'payroll',
    action: 'generate_receipt',
    description: 'Generar recibos de nómina',
  },
  {
    resource: 'payroll',
    action: 'request_receipt_send',
    description: 'Solicitar envío de recibos por correo',
  },
  {
    resource: 'payroll',
    action: 'generate_report',
    description: 'Generar reportes de nómina',
  },
  {
    resource: 'payroll',
    action: 'request_report_send',
    description: 'Solicitar envío de reportes por correo',
  },

  // Liquidaciones
  {
    resource: 'settlement',
    action: 'calculate',
    description: 'Generar cálculo de liquidaciones',
  },
  {
    resource: 'settlement',
    action: 'generate_receipt',
    description: 'Generar recibos de liquidación',
  },
  {
    resource: 'settlement',
    action: 'request_receipt_send',
    description: 'Solicitar envío de recibos por correo',
  },
  {
    resource: 'settlement',
    action: 'generate_report',
    description: 'Generar reportes de liquidación',
  },
  {
    resource: 'settlement',
    action: 'request_report_send',
    description: 'Solicitar envío de reportes por correo',
  },

  // Notificaciones y Solicitudes Generales
  {
    resource: 'notifications',
    action: 'approve',
    description:
      'Autorizar o negar solicitudes de envío de recibos, aumentos salariales, cambios de tasas de cambio, nóminas, vacaciones y liquidaciones',
  },
  {
    resource: 'notifications',
    action: 'reject',
    description: 'Rechazar solicitudes generales',
  },

  // Expedientes de Trabajadores
  {
    resource: 'employee_records',
    action: 'create',
    description:
      'Crear el expediente del trabajador con nombre completo, cédula, fecha de ingreso, categoría de trabajadores y nómina, y sueldo',
  },
  {
    resource: 'employee_records',
    action: 'read',
    description: 'Ver expedientes de trabajadores',
  },

  // Información de Personal
  {
    resource: 'personal_info',
    action: 'update',
    description:
      'Modificar información en los expedientes de trabajadores: Status, Documentación, Datos personales, Registro de Prestamos, categoría de nómina, Categoría de Trabajadores, Tipo de contrato, Jornada laboral, Grupo profesional, Sector de actividad y si son empleados o contratistas independientes',
  },

  // Políticas de Cálculo
  {
    resource: 'calculation_policies',
    action: 'create',
    description:
      'Crear/Modificar políticas de cálculos generales pre-establecidas por el sistema que se rigen por la normativa venezolana',
  },
  {
    resource: 'calculation_policies',
    action: 'update',
    description:
      'Aumentar el recargo de horas extras, Domingo trabajado, y otros conceptos',
  },
];
