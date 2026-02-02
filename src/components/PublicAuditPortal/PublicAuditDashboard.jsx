import React, { useState } from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import ShieldIcon from '@mui/icons-material/Shield';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// TRA Brand Colors (from your theme)
const TRABrandColors = {
  primary: {
    main: '#002855',
    light: '#E6ECF5',
    dark: '#001B3D',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#FFD100',
    light: '#FFF5CC',
    dark: '#E6B800',
    contrastText: '#2A3547',
  },
  government: {
    main: '#005792',
    light: '#E3F2FD',
    dark: '#003F6F',
    contrastText: '#ffffff',
  },
  accent: {
    gold: '#D4A419',
    lightGold: '#F8F2E6',
    darkGold: '#BA8F16',
  },
  success: {
    main: '#13DEB9',
    light: '#E6FFFA',
    dark: '#02B3A9',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#FFAE1F',
    light: '#FEF5E7',
    dark: '#AE8E59',
    contrastText: '#ffffff',
  },
  error: {
    main: '#FA896B',
    light: '#FDEDE8',
    dark: '#F3704D',
    contrastText: '#ffffff',
  },
  info: {
    main: '#539BFF',
    light: '#EBF3FE',
    dark: '#1682FB',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#FAFBFB',
    100: '#F2F6FA',
    200: '#E5EDF5',
    300: '#C8D9E8',
    400: '#9FB4C7',
    500: '#7C8FAC',
    600: '#5A6A85',
    700: '#2A3547',
    800: '#212936',
    900: '#1A202C',
  },
};

const TRADashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChartIcon },
    { id: 'audits', label: 'Audit Reports', icon: DescriptionIcon },
    { id: 'compliance', label: 'Compliance', icon: ShieldIcon },
    { id: 'analytics', label: 'Analytics', icon: TrendingUpIcon },
    { id: 'stakeholders', label: 'Stakeholders', icon: GroupIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const stats = [
    {
      title: 'Total Revenue Audited',
      value: 'TSh 2.4T',
      change: '+12.5%',
      changeType: 'positive',
      icon: AttachMoneyIcon,
      gradient: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Active Audits',
      value: '47',
      change: '+3',
      changeType: 'positive',
      icon: LocalActivityIcon,
      gradient: 'from-yellow-400 to-yellow-500',
    },
    {
      title: 'Compliance Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: EmojiEventsIcon,
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-5',
      changeType: 'negative',
      icon: CalendarTodayIcon,
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  const recentAudits = [
    {
      id: 1,
      title: 'Tanzania Ports Authority - Q4 2024',
      status: 'completed',
      date: '2025-01-15',
      amount: 'TSh 450M',
      risk: 'low',
    },
    {
      id: 2,
      title: 'TANESCO Revenue Assessment',
      status: 'in-progress',
      date: '2025-02-01',
      amount: 'TSh 1.2B',
      risk: 'medium',
    },
    {
      id: 3,
      title: 'Mining Sector Tax Review',
      status: 'pending',
      date: '2025-02-15',
      amount: 'TSh 890M',
      risk: 'high',
    },
  ];

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: {
        bg: TRABrandColors.success.light,
        text: TRABrandColors.success.main,
        label: 'Completed',
      },
      'in-progress': {
        bg: TRABrandColors.info.light,
        text: TRABrandColors.info.main,
        label: 'In Progress',
      },
      pending: {
        bg: TRABrandColors.warning.light,
        text: TRABrandColors.warning.main,
        label: 'Pending',
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: config.bg, color: config.text }}
      >
        {config.label}
      </span>
    );
  };

  const RiskBadge = ({ risk }) => {
    const riskConfig = {
      low: { bg: TRABrandColors.success.light, text: TRABrandColors.success.main },
      medium: { bg: TRABrandColors.warning.light, text: TRABrandColors.warning.main },
      high: { bg: TRABrandColors.error.light, text: TRABrandColors.error.main },
    };

    const config = riskConfig[risk];
    return (
      <span
        className="px-2 py-1 rounded text-xs font-medium capitalize"
        style={{ backgroundColor: config.bg, color: config.text }}
      >
        {risk} Risk
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-['Inter']">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out`}
        style={{ backgroundColor: 'white', borderRight: `1px solid ${TRABrandColors.grey[200]}` }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center px-6 border-b"
          style={{ borderColor: TRABrandColors.grey[200] }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{
              background: `linear-gradient(135deg, ${TRABrandColors.primary.main} 0%, ${TRABrandColors.government.main} 100%)`,
            }}
          >
            TRA
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <h1 className="text-lg font-bold" style={{ color: TRABrandColors.primary.main }}>
                Audit Portal
              </h1>
              <p className="text-xs" style={{ color: TRABrandColors.grey[500] }}>
                Public Revenue Authority
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-3 mb-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'shadow-md transform scale-[1.02]' : 'hover:bg-gray-50'
                }`}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${TRABrandColors.primary.light} 0%, ${TRABrandColors.secondary.light} 100%)`
                    : 'transparent',
                  color: isActive ? TRABrandColors.primary.main : TRABrandColors.grey[600],
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="h-16 flex items-center justify-between px-6 shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${TRABrandColors.primary.main} 0%, ${TRABrandColors.government.main} 100%)`,
            color: 'white',
          }}
        >
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <MenuIcon size={20} />
            </button>
            <h2 className="ml-4 text-xl font-semibold">Dashboard Overview</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchIcon
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search audits..."
                className="pl-10 pr-4 py-2 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:bg-white/20 transition-all outline-none"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
              <NotificationsIcon size={20} />
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs"
                style={{ backgroundColor: TRABrandColors.error.main }}
              />
            </button>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: TRABrandColors.grey[200] }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center text-white`}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.changeType === 'positive'
                          ? `bg-green-50 text-green-600`
                          : `bg-red-50 text-red-600`
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-bold mb-1"
                    style={{ color: TRABrandColors.primary.main }}
                  >
                    {stat.value}
                  </h3>
                  <p className="text-sm" style={{ color: TRABrandColors.grey[600] }}>
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Recent Audits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
              className="bg-white rounded-2xl shadow-sm border"
              style={{ borderColor: TRABrandColors.grey[200] }}
            >
              <div className="p-6 border-b" style={{ borderColor: TRABrandColors.grey[200] }}>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: TRABrandColors.primary.main }}
                >
                  Recent Audit Reports
                </h3>
                <p className="text-sm mt-1" style={{ color: TRABrandColors.grey[600] }}>
                  Latest auditing activities and their status
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentAudits.map((audit) => (
                    <div
                      key={audit.id}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4
                          className="font-medium mb-1"
                          style={{ color: TRABrandColors.primary.main }}
                        >
                          {audit.title}
                        </h4>
                        <div
                          className="flex items-center space-x-3 text-sm"
                          style={{ color: TRABrandColors.grey[600] }}
                        >
                          <span>{audit.date}</span>
                          <span>•</span>
                          <span className="font-medium">{audit.amount}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <StatusBadge status={audit.status} />
                          <RiskBadge risk={audit.risk} />
                        </div>
                      </div>
                      <ChevronRightIcon size={16} style={{ color: TRABrandColors.grey[400] }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div
              className="bg-white rounded-2xl shadow-sm border"
              style={{ borderColor: TRABrandColors.grey[200] }}
            >
              <div className="p-6 border-b" style={{ borderColor: TRABrandColors.grey[200] }}>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: TRABrandColors.primary.main }}
                >
                  Performance Overview
                </h3>
                <p className="text-sm mt-1" style={{ color: TRABrandColors.grey[600] }}>
                  Key performance indicators this quarter
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {[
                    { label: 'Audit Completion Rate', value: 87, target: 90 },
                    { label: 'Revenue Recovery', value: 94, target: 85 },
                    { label: 'Compliance Score', value: 92, target: 95 },
                    { label: 'Stakeholder Satisfaction', value: 89, target: 88 },
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className="text-sm font-medium"
                          style={{ color: TRABrandColors.grey[700] }}
                        >
                          {metric.label}
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: TRABrandColors.primary.main }}
                        >
                          {metric.value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${metric.value}%`,
                            background: `linear-gradient(135deg, ${TRABrandColors.secondary.main} 0%, ${TRABrandColors.accent.gold} 100%)`,
                          }}
                        />
                      </div>
                      <div
                        className="flex justify-between text-xs mt-1"
                        style={{ color: TRABrandColors.grey[500] }}
                      >
                        <span>Target: {metric.target}%</span>
                        <span
                          className={
                            metric.value >= metric.target ? 'text-green-600' : 'text-orange-600'
                          }
                        >
                          {metric.value >= metric.target ? '✓ On Track' : '⚠ Needs Attention'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TRADashboard;
