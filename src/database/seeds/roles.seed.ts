export const rolesData = [
  {
    name: 'auxiliar_vacaciones',
    description:
      'Auxiliar de Vacaciones - Manejo de cálculos, recibos y reportes de vacaciones',
    permissions: [
      'vacation:calculate',
      'vacation:generate_receipt',
      'vacation:request_receipt_send',
      'vacation:generate_report',
      'vacation:request_report_send',
    ],
  },
  {
    name: 'auxiliar_nomina',
    description:
      'Auxiliar de Nómina - Manejo de cálculos, recibos y reportes de nómina',
    permissions: [
      'payroll:calculate',
      'payroll:request_adjustment',
      'payroll:generate_receipt',
      'payroll:request_receipt_send',
      'payroll:generate_report',
      'payroll:request_report_send',
    ],
  },
  {
    name: 'auxiliar_liquidacion',
    description:
      'Auxiliar de Liquidación - Manejo de cálculos, recibos y reportes de liquidaciones',
    permissions: [
      'settlement:calculate',
      'settlement:generate_receipt',
      'settlement:request_receipt_send',
      'settlement:generate_report',
      'settlement:request_report_send',
    ],
  },
  {
    name: 'administrador',
    description: 'Administrador con acceso completo al sistema',
    permissions: [
      // Permisos de vacaciones
      'vacation:calculate',
      'vacation:generate_receipt',
      'vacation:request_receipt_send',
      'vacation:generate_report',
      'vacation:request_report_send',
      // Permisos de nómina
      'payroll:calculate',
      'payroll:request_adjustment',
      'payroll:generate_receipt',
      'payroll:request_receipt_send',
      'payroll:generate_report',
      'payroll:request_report_send',
      // Permisos de liquidación
      'settlement:calculate',
      'settlement:generate_receipt',
      'settlement:request_receipt_send',
      'settlement:generate_report',
      'settlement:request_report_send',
      // Permisos de notificaciones
      'notifications:approve',
      'notifications:reject',
      // Permisos de expedientes
      'employee_records:create',
      'employee_records:read',
      // Permisos de información personal
      'personal_info:update',
      // Permisos de políticas
      'calculation_policies:create',
      'calculation_policies:update',
    ],
  },
];
