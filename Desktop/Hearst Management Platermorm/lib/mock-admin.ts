export interface AdminSection {
  id: string;
  title: string;
  description: string;
  iconId: string;
  path: string;
  category: 'products' | 'users' | 'system' | 'security' | 'data';
  status: 'active' | 'maintenance' | 'beta';
  stats?: {
    label: string;
    value: string | number;
  }[];
}

export interface SystemMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'healthy' | 'warning' | 'critical';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'success' | 'failed' | 'pending';
  details?: string;
}

export const mockAdminSections: AdminSection[] = [
  {
    id: 'product-factory',
    title: 'Product Factory',
    description: 'Create, configure, and manage products (Market-Only, Mining-Enhanced, Bouquets)',
    iconId: 'product-factory',
    path: '/admin/product-factory',
    category: 'products',
    status: 'active',
    stats: [
      { label: 'Total Products', value: 12 },
      { label: 'Active', value: 10 },
      { label: 'Draft', value: 2 }
    ]
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Manage users, roles, permissions, and access controls',
    iconId: 'user-management',
    path: '/admin/users',
    category: 'users',
    status: 'active',
    stats: [
      { label: 'Total Users', value: 48 },
      { label: 'Active', value: 42 },
      { label: 'Admins', value: 6 }
    ]
  },
  {
    id: 'system-settings',
    title: 'System Settings',
    description: 'Configure platform settings, integrations, and system parameters',
    iconId: 'system-settings',
    path: '/admin/settings',
    category: 'system',
    status: 'active',
    stats: [
      { label: 'Integrations', value: 8 },
      { label: 'Active', value: 7 },
      { label: 'Pending', value: 1 }
    ]
  },
  {
    id: 'access-control',
    title: 'Access Control',
    description: 'Manage roles, permissions, and security policies',
    iconId: 'access-control',
    path: '/admin/access',
    category: 'security',
    status: 'active',
    stats: [
      { label: 'Roles', value: 5 },
      { label: 'Policies', value: 12 },
      { label: 'Active Sessions', value: 23 }
    ]
  },
  {
    id: 'audit-logs',
    title: 'Audit Logs',
    description: 'View and analyze system activity, user actions, and security events',
    iconId: 'audit-logs',
    path: '/admin/audit',
    category: 'security',
    status: 'active',
    stats: [
      { label: 'Today', value: 1247 },
      { label: 'This Week', value: 8934 },
      { label: 'Alerts', value: 3 }
    ]
  },
  {
    id: 'data-management',
    title: 'Data Management',
    description: 'Manage data exports, backups, and data retention policies',
    iconId: 'data-management',
    path: '/admin/data',
    category: 'data',
    status: 'active',
    stats: [
      { label: 'Backups', value: 30 },
      { label: 'Last Backup', value: '2h ago' },
      { label: 'Storage', value: '2.4 TB' }
    ]
  },
  {
    id: 'mining-pools',
    title: 'Mining Pool Management',
    description: 'Configure and monitor mining pool integrations and allocations',
    iconId: 'mining-pools',
    path: '/admin/mining-pools',
    category: 'system',
    status: 'active',
    stats: [
      { label: 'Active Pools', value: 4 },
      { label: 'Total Hashrate', value: '12.5 PH/s' },
      { label: 'BTC Mined (30d)', value: '2.4' }
    ]
  },
  {
    id: 'api-keys',
    title: 'API Keys & Integrations',
    description: 'Manage API keys, webhooks, and third-party integrations',
    iconId: 'api-keys',
    path: '/admin/api',
    category: 'system',
    status: 'active',
    stats: [
      { label: 'API Keys', value: 15 },
      { label: 'Active', value: 12 },
      { label: 'Webhooks', value: 8 }
    ]
  }
];

export const mockSystemMetrics: SystemMetric[] = [
  {
    id: 'cpu',
    label: 'CPU Usage',
    value: 42,
    unit: '%',
    trend: 'stable',
    status: 'healthy'
  },
  {
    id: 'memory',
    label: 'Memory Usage',
    value: 68,
    unit: '%',
    trend: 'up',
    status: 'healthy'
  },
  {
    id: 'storage',
    label: 'Storage',
    value: 72,
    unit: '%',
    trend: 'up',
    status: 'warning'
  },
  {
    id: 'api-latency',
    label: 'API Latency',
    value: 45,
    unit: 'ms',
    trend: 'stable',
    status: 'healthy'
  },
  {
    id: 'active-users',
    label: 'Active Users',
    value: 23,
    unit: '',
    trend: 'up',
    status: 'healthy'
  },
  {
    id: 'error-rate',
    label: 'Error Rate',
    value: 0.12,
    unit: '%',
    trend: 'down',
    status: 'healthy'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'A1',
    timestamp: '2024-01-15T14:32:10Z',
    user: 'admin@hearth.com',
    action: 'Product Created',
    resource: 'BTC Mining Reserve',
    status: 'success',
    details: 'Created new Mining-Enhanced product with 30% mining exposure'
  },
  {
    id: 'A2',
    timestamp: '2024-01-15T14:28:45Z',
    user: 'risk@hearth.com',
    action: 'Risk Threshold Updated',
    resource: 'Global Risk Policy',
    status: 'success',
    details: 'Updated VaR threshold from 5% to 4.5%'
  },
  {
    id: 'A3',
    timestamp: '2024-01-15T14:15:22Z',
    user: 'admin@hearth.com',
    action: 'User Role Changed',
    resource: 'user:analyst@hearth.com',
    status: 'success',
    details: 'Changed role from Analyst to Senior Analyst'
  },
  {
    id: 'A4',
    timestamp: '2024-01-15T13:58:33Z',
    user: 'compliance@hearth.com',
    action: 'Compliance Check Failed',
    resource: 'Qatar Sovereign Fund',
    status: 'failed',
    details: 'Mandate compliance check failed: Missing regulatory documentation'
  },
  {
    id: 'A5',
    timestamp: '2024-01-15T13:42:11Z',
    user: 'system',
    action: 'System Backup',
    resource: 'Database',
    status: 'success',
    details: 'Automated daily backup completed successfully'
  },
  {
    id: 'A6',
    timestamp: '2024-01-15T13:30:05Z',
    user: 'admin@hearth.com',
    action: 'API Key Revoked',
    resource: 'api_key:xyz789',
    status: 'success',
    details: 'Revoked API key due to security policy violation'
  },
  {
    id: 'A7',
    timestamp: '2024-01-15T13:18:44Z',
    user: 'operations@hearth.com',
    action: 'Execution Rule Updated',
    resource: 'Venue: Binance',
    status: 'success',
    details: 'Updated execution rules for Binance venue'
  },
  {
    id: 'A8',
    timestamp: '2024-01-15T13:05:12Z',
    user: 'admin@hearth.com',
    action: 'Product Deactivated',
    resource: 'Legacy Yield Product',
    status: 'success',
    details: 'Deactivated product due to low AUM and client migration'
  }
];

export function getAdminSectionById(id: string): AdminSection | undefined {
  return mockAdminSections.find(s => s.id === id);
}

export function getAdminSectionsByCategory(category: AdminSection['category']): AdminSection[] {
  return mockAdminSections.filter(s => s.category === category);
}



