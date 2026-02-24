import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Clock, CheckCircle, AlertTriangle, 
  TrendingUp, Users, Settings, FileText, Truck,
  ChevronDown, Filter, Download, RefreshCw
} from 'lucide-react';
import { Card, CardHeader, Button, Badge, StatusBadge, Table, Toggle } from '../../components/design-system';

// Sample production data
const productionJobs = [
  { id: 'JOB-001', product: 'CNC Shaft A-100', quantity: 500, progress: 75, status: 'processing', machine: 'CNC-01', dueDate: '2026-02-28' },
  { id: 'JOB-002', product: 'Brass Bushing B-25', quantity: 1000, progress: 100, status: 'completed', machine: 'CNC-02', dueDate: '2026-02-25' },
  { id: 'JOB-003', product: 'SS Flange F-50', quantity: 250, progress: 45, status: 'processing', machine: 'CNC-03', dueDate: '2026-03-01' },
  { id: 'JOB-004', product: 'Aluminum Housing H-10', quantity: 100, progress: 0, status: 'pending', machine: 'VMC-01', dueDate: '2026-03-05' },
  { id: 'JOB-005', product: 'Titanium Pin P-15', quantity: 50, progress: 90, status: 'processing', machine: 'CNC-05', dueDate: '2026-02-27' },
];

const machineStatus = [
  { name: 'CNC-01', status: 'running', utilization: 85, job: 'JOB-001' },
  { name: 'CNC-02', status: 'idle', utilization: 0, job: null },
  { name: 'CNC-03', status: 'running', utilization: 65, job: 'JOB-003' },
  { name: 'VMC-01', status: 'maintenance', utilization: 0, job: null },
  { name: 'CNC-05', status: 'running', utilization: 92, job: 'JOB-005' },
];

const metrics = [
  { label: 'Jobs in Queue', value: '12', icon: Package, color: 'bg-accent' },
  { label: 'In Production', value: '8', icon: Clock, color: 'bg-warning' },
  { label: 'Completed Today', value: '24', icon: CheckCircle, color: 'bg-success' },
  { label: 'Delayed', value: '2', icon: AlertTriangle, color: 'bg-danger' },
];

const columns = [
  { key: 'id', header: 'Job ID', width: '100px' },
  { key: 'product', header: 'Product' },
  { key: 'quantity', header: 'Qty', width: '80px' },
  { 
    key: 'progress', 
    header: 'Progress',
    render: (job: typeof productionJobs[0]) => (
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-surface-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full" 
            style={{ width: `${job.progress}%` }}
          />
        </div>
        <span className="text-small dark:text-slate-300">{job.progress}%</span>
      </div>
    )
  },
  { 
    key: 'status', 
    header: 'Status',
    render: (job: typeof productionJobs[0]) => (
      <StatusBadge status={job.status as 'pending' | 'processing' | 'completed'} />
    )
  },
  { key: 'machine', header: 'Machine', width: '100px' },
  { key: 'dueDate', header: 'Due Date', width: '120px' },
];

export const ManufacturingDashboard: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  return (
    <div className="min-h-screen bg-surface-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-navy dark:bg-slate-800 text-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <LayoutDashboard size={24} />
            <h1 className="text-h1">Manufacturing Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-small text-white/80">Auto-refresh</span>
              <Toggle checked={autoRefresh} onChange={setAutoRefresh} />
            </div>
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={16} />}>
              Refresh
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Download size={16} />}>
              Export
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="flex items-center gap-4">
              <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                <metric.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-small text-slate-500 dark:text-slate-400">{metric.label}</p>
                <p className="text-h1 text-navy dark:text-white">{metric.value}</p>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Machine Status */}
        <Card className="mb-6">
          <CardHeader 
            title="Machine Status" 
            description="Real-time machine utilization and status"
            action={
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Filter</Button>
              </div>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {machineStatus.map((machine) => (
              <div 
                key={machine.name}
                className={`
                  p-4 rounded-lg border
                  ${machine.status === 'running' ? 'bg-success/5 dark:bg-success/10 border-success/20 dark:border-success/30' : ''}
                  ${machine.status === 'idle' ? 'bg-surface-100 dark:bg-slate-800 border-surface-200 dark:border-slate-700' : ''}
                  ${machine.status === 'maintenance' ? 'bg-warning/5 dark:bg-warning/10 border-warning/20 dark:border-warning/30' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-navy dark:text-white">{machine.name}</span>
                  <StatusBadge 
                    status={machine.status === 'running' ? 'active' : machine.status === 'idle' ? 'pending' : 'draft'} 
                  />
                </div>
                {machine.status === 'running' ? (
                  <>
                    <p className="text-small text-slate-500 dark:text-slate-400 mb-2">Job: {machine.job}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-surface-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-success rounded-full" 
                          style={{ width: `${machine.utilization}%` }}
                        />
                      </div>
                      <span className="text-small font-medium dark:text-white">{machine.utilization}%</span>
                    </div>
                  </>
                ) : (
                  <p className="text-small text-slate-500 dark:text-slate-400 capitalize">{machine.status}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
        
        {/* Production Jobs Table */}
        <Card>
          <CardHeader 
            title="Production Jobs" 
            description="Current production orders and their status"
            action={
              <Button variant="primary" size="sm">
                + New Job
              </Button>
            }
          />
          <Table 
            data={productionJobs}
            columns={columns}
            keyExtractor={(job) => job.id}
            onRowClick={(job) => console.log('View job:', job.id)}
          />
        </Card>
      </main>
    </div>
  );
};

export default ManufacturingDashboard;
