import dataSource from '../../../../typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
async function migrateTenants() {
  await dataSource.initialize();
  const tenants = await dataSource.query(
    'select schema_name as name from information_schema.schemata;',
  );
  for (const tenant of tenants) {
    if (tenant.name.startsWith('tenant_')) {
      const tenantDataSource = new DataSource({
        ...dataSource.options,
        schema: tenant.name,
      } as DataSourceOptions);
      await tenantDataSource.initialize();
      await tenantDataSource.runMigrations();
      await tenantDataSource.destroy();
      console.log(`✅ Tenant "${tenant.name}" migrated successfully`);
    }
  }
  console.log(`✅ All tenants migrated successfully`);
  await dataSource.destroy();
}
migrateTenants().catch((error) => {
  console.error(error);
  process.exit(1);
});
