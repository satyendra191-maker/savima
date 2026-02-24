import React from 'react';
import { 
  Bot, TrendingUp, Users, MessageSquare, 
  ChevronRight, Zap, Target, Clock, Download
} from 'lucide-react';
import { Card, CardHeader, Button, Badge, StatusBadge, Toggle } from '../../components/design-system';

const aiMetrics = [
  { label: 'Total Queries', value: '1,247', change: '+12%', icon: MessageSquare, color: 'bg-accent' },
  { label: 'Leads Captured', value: '342', change: '+8%', icon: Users, color: 'bg-success' },
  { label: 'Conversion Rate', value: '27.4%', change: '+3%', icon: Target, color: 'bg-warning' },
  { label: 'Avg Response Time', value: '2.3s', change: '-15%', icon: Clock, color: 'bg-steel' },
];

const recentQueries = [
  { id: 1, query: 'CNC turning for automotive parts', confidence: 95, captured: true, timestamp: '2 min ago' },
  { id: 2, query: 'SS 304 fasteners pricing', confidence: 87, captured: true, timestamp: '5 min ago' },
  { id: 3, query: 'Precision milling tolerances', confidence: 72, captured: false, timestamp: '8 min ago' },
  { id: 4, query: 'ISO certification details', confidence: 91, captured: true, timestamp: '12 min ago' },
  { id: 5, query: 'Custom prototype quote', confidence: 68, captured: false, timestamp: '15 min ago' },
];

const languageBreakdown = [
  { language: 'English', queries: 650, percentage: 52 },
  { language: 'Hindi', queries: 280, percentage: 22 },
  { language: 'Spanish', queries: 120, percentage: 10 },
  { language: 'German', queries: 85, percentage: 7 },
  { language: 'Other', queries: 112, percentage: 9 },
];

export const AIAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-100">
      {/* Header */}
      <header className="bg-navy text-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Bot size={24} />
            <div>
              <h1 className="text-h1">AI Engine Analytics</h1>
              <p className="text-small text-gray-400">Monitor AI performance and insights</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-small">AI Enabled</span>
              <Toggle checked={true} onChange={() => {}} />
            </div>
            <Button variant="secondary" size="sm" leftIcon={<Download size={16} />}>
              Export Report
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {aiMetrics.map((metric, index) => (
            <Card key={index} className="flex items-center gap-4">
              <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                <metric.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-small text-gray-500">{metric.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-h1 text-navy">{metric.value}</p>
                  <Badge variant={metric.change.startsWith('+') ? 'success' : 'warning'}>
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent AI Interactions */}
          <Card>
            <CardHeader 
              title="Recent AI Interactions"
              description="Latest queries and their confidence scores"
            />
            <div className="space-y-3">
              {recentQueries.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Bot size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-body font-medium text-navy">{item.query}</p>
                      <p className="text-small text-gray-500">{item.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-small text-gray-500">Confidence:</span>
                      <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.confidence >= 80 ? 'bg-success' : 
                            item.confidence >= 50 ? 'bg-warning' : 'bg-danger'
                          }`}
                          style={{ width: `${item.confidence}%` }}
                        />
                      </div>
                      <span className="text-small font-medium">{item.confidence}%</span>
                    </div>
                    {item.captured && (
                      <Badge variant="success">Lead</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Language Distribution */}
          <Card>
            <CardHeader 
              title="Language Distribution"
              description="Queries by detected language"
            />
            <div className="space-y-4">
              {languageBreakdown.map((lang, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-body text-navy">{lang.language}</span>
                    <span className="text-small text-gray-500">
                      {lang.queries} queries ({lang.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-surface-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* AI Configuration */}
        <Card>
          <CardHeader 
            title="AI Engine Configuration"
            description="Manage AI behavior and suggestions"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-surface-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-warning" />
                  <span className="font-medium text-navy">Auto-Pricing</span>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <p className="text-small text-gray-500">
                AI suggests prices based on material, quantity, and complexity
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-small text-gray-500">Confidence threshold:</span>
                <Badge variant="success">80%</Badge>
              </div>
            </div>
            
            <div className="p-4 border border-surface-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-success" />
                  <span className="font-medium text-navy">Lead Capture</span>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <p className="text-small text-gray-500">
                Automatically capture leads after 3 messages
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-small text-gray-500">Messages before capture:</span>
                <Badge>3</Badge>
              </div>
            </div>
            
            <div className="p-4 border border-surface-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-accent" />
                  <span className="font-medium text-navy">Manual Override</span>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <p className="text-small text-gray-500">
                Allow users to override AI suggestions
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-small text-gray-500">Override requests:</span>
                <Badge variant="warning">12%</Badge>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AIAnalytics;
