import { Permission } from '../../modules/auth/entities/permission.entity';

export const permissionsData: Partial<Permission>[] = [
  // Empleados
  { resource: 'employees', action: 'create', description: 'Crear empleados' },
  { resource: 'employees', action: 'read', description: 'Ver empleados' },
  {
    resource: 'employees',
    action: 'update',
    description: 'Actualizar empleados',
  },
  {
    resource: 'employees',
    action: 'delete',
    description: 'Eliminar empleados',
  },
  {
    resource: 'employees',
    action: 'export',
    description: 'Exportar lista de empleados',
  },

  // Nóminas
  { resource: 'payroll', action: 'create', description: 'Crear nóminas' },
  { resource: 'payroll', action: 'read', description: 'Ver nóminas' },
  { resource: 'payroll', action: 'update', description: 'Actualizar nóminas' },
  { resource: 'payroll', action: 'delete', description: 'Eliminar nóminas' },
  { resource: 'payroll', action: 'approve', description: 'Aprobar nóminas' },
  { resource: 'payroll', action: 'export', description: 'Exportar nóminas' },

  // Reportes
  { resource: 'reports', action: 'read', description: 'Ver reportes' },
  { resource: 'reports', action: 'export', description: 'Exportar reportes' },
  {
    resource: 'reports',
    action: 'advanced',
    description: 'Reportes avanzados',
  },

  // Departamentos
  {
    resource: 'departments',
    action: 'create',
    description: 'Crear departamentos',
  },
  { resource: 'departments', action: 'read', description: 'Ver departamentos' },
  {
    resource: 'departments',
    action: 'update',
    description: 'Actualizar departamentos',
  },
  {
    resource: 'departments',
    action: 'delete',
    description: 'Eliminar departamentos',
  },

  // Documentos
  { resource: 'documents', action: 'upload', description: 'Subir documentos' },
  { resource: 'documents', action: 'read', description: 'Ver documentos' },
  {
    resource: 'documents',
    action: 'delete',
    description: 'Eliminar documentos',
  },

  // Administración
  {
    resource: 'admin',
    action: 'access',
    description: 'Acceso a panel administrativo',
  },
  { resource: 'admin', action: 'users', description: 'Gestionar usuarios' },
  { resource: 'admin', action: 'roles', description: 'Gestionar roles' },
  {
    resource: 'admin',
    action: 'system',
    description: 'Configuración del sistema',
  },
];
