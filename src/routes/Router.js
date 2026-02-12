import React, { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import Loadable from '../layouts/full/shared/loadable/Loadable';
import UserRegistration from '../views/taaxchain/UserRegistration';
import EnhancedUserRegistration from '../views/taaxchain/EnhancedUserRegistration';

/* ***Layouts**** */
import ProtectedRoute from './ProtectedRoute';
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const EnhancedModernDash = Loadable(lazy(() => import('../views/dashboard/EnhancedModern')));
const EcommerceDash = Loadable(lazy(() => import('../views/dashboard/Ecommerce')));
const TRADashboard = Loadable(lazy(() => import('../views/dashboard/TRADashboard')));
const DashboardHub = Loadable(lazy(() => import('../views/dashboard/DashboardHub')));
const TestPage = Loadable(lazy(() => import('../views/dashboard/TestPage')));

/* ****Apps***** */
const Chats = Loadable(lazy(() => import('../views/apps/chat/Chat')));
const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes')));
const Calendar = Loadable(lazy(() => import('../views/apps/calendar/BigCalendar')));
const Email = Loadable(lazy(() => import('../views/apps/email/Email')));
// const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog')));
// const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogPost')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
const Contacts = Loadable(lazy(() => import('../views/apps/contacts/Contacts')));
const Ecommerce = Loadable(lazy(() => import('../views/apps/eCommerce/Ecommerce')));
const EcommerceDetail = Loadable(lazy(() => import('../views/apps/eCommerce/EcommerceDetail')));
const EcommerceAddProduct = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceAddProduct')),
);
const EcommerceEditProduct = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceEditProduct')),
);
const EcomProductList = Loadable(lazy(() => import('../views/apps/eCommerce/EcomProductList')));
const EcomProductCheckout = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceCheckout')),
);
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));
const Followers = Loadable(lazy(() => import('../views/apps/user-profile/Followers')));
const Friends = Loadable(lazy(() => import('../views/apps/user-profile/Friends')));
const Gallery = Loadable(lazy(() => import('../views/apps/user-profile/Gallery')));
const InvoiceList = Loadable(lazy(() => import('../views/apps/invoice/List')));
const InvoiceCreate = Loadable(lazy(() => import('../views/apps/invoice/Create')));
const InvoiceDetail = Loadable(lazy(() => import('../views/apps/invoice/Detail')));
const TaxAssessmentList = Loadable(lazy(() => import('../views/apps/assessment/List')));
const TaxAssessmentDetail = Loadable(lazy(() => import('../views/apps/assessment/Detail')));
const AssessmentAccountPage = Loadable(lazy(() => import('../views/apps/assessment/Account')));
const TaxTypeManagementPage = Loadable(
  lazy(() => import('../views/apps/system/TaxTypeManagement')),
);
const LogManagementPage = Loadable(lazy(() => import('../views/apps/system/LogManagement')));
const UserListPage = Loadable(lazy(() => import('../views/apps/user/UserList')));
const DataIntegrityPage = Loadable(lazy(() => import('../views/apps/user/DataIntegrity')));
const SystemUsersPage = Loadable(lazy(() => import('../views/apps/system/users/SystemUsers')));
const RoleManagementPage = Loadable(
  lazy(() => import('../views/apps/system/users/RoleManagement')),
);
const PermissionsPage = Loadable(lazy(() => import('../views/apps/system/users/Permissions')));
const TaxpayerAssessmentsPage = Loadable(
  lazy(() => import('../views/apps/assessment/TaxpayerAssessments')),
);
const TaxpayerSearchPage = Loadable(lazy(() => import('../views/apps/assessment/TaxpayerSearch')));
const AssessmentHubPage = Loadable(lazy(() => import('../views/apps/assessment/Hub')));
const PublicAuditPortal = Loadable(
  lazy(() => import('../components/PublicAuditPortal/PublicAuditDashboard')),
);
//for payment
const TaxPayment = Loadable(lazy(() => import('../views/apps/payment/index')));
const TaxPaymentDetail = Loadable(lazy(() => import('../views/apps/assessment/Detail')));
const Auditing = Loadable(lazy(() => import('../views/apps/auditing/List')));
const AuditLogs = Loadable(lazy(() => import('../views/apps/audit/AuditLogs')));
const AuditTrail = Loadable(lazy(() => import('../views/apps/audit/AuditTrail')));
const HighRisk = Loadable(lazy(() => import('../views/apps/audit/HighRisk')));
const AuditStatistics = Loadable(lazy(() => import('../views/apps/audit/Statistics')));
const UserActivity = Loadable(lazy(() => import('../views/apps/audit/UserActivity')));
const VATManagement = Loadable(lazy(() => import('../components/apps/vat/VATManagement')));
const ComplianceMonitoring = Loadable(
  lazy(() => import('../components/apps/compliance/ComplianceMonitoring')),
);
const TaxpayerComplianceReportPage = Loadable(
  lazy(() => import('../views/apps/compliance/TaxpayerComplianceReport')),
);
const ReportsPage = Loadable(lazy(() => import('../views/apps/reports/index')));
const BlockchainExplorer = Loadable(
  lazy(() => import('../components/apps/blockchain/BlockchainExplorer')),
);
const HyperledgerTaxDemo = Loadable(
  lazy(() => import('../components/apps/tax-operations/HyperledgerTaxDemo')),
);

const InvoiceEdit = Loadable(lazy(() => import('../views/apps/invoice/Edit')));
const Kanban = Loadable(lazy(() => import('../views/apps/kanban/Kanban')));

// Pages
const RollbaseCASL = Loadable(lazy(() => import('../views/pages/rollbaseCASL/RollbaseCASL')));

const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing')));
const AccountSetting = Loadable(
  lazy(() => import('../views/pages/account-setting/AccountSetting')),
);
const Faq = Loadable(lazy(() => import('../views/pages/faq/Faq')));

// widget
const WidgetCards = Loadable(lazy(() => import('../views/widgets/cards/WidgetCards')));
const WidgetBanners = Loadable(lazy(() => import('../views/widgets/banners/WidgetBanners')));
const WidgetCharts = Loadable(lazy(() => import('../views/widgets/charts/WidgetCharts')));

// form elements
const MuiAutoComplete = Loadable(
  lazy(() => import('../views/forms/form-elements/MuiAutoComplete')),
);
const MuiButton = Loadable(lazy(() => import('../views/forms/form-elements/MuiButton')));
const MuiCheckbox = Loadable(lazy(() => import('../views/forms/form-elements/MuiCheckbox')));
const MuiRadio = Loadable(lazy(() => import('../views/forms/form-elements/MuiRadio')));
const MuiSlider = Loadable(lazy(() => import('../views/forms/form-elements/MuiSlider')));
const MuiDateTime = Loadable(lazy(() => import('../views/forms/form-elements/MuiDateTime')));
const MuiSwitch = Loadable(lazy(() => import('../views/forms/form-elements/MuiSwitch')));

// form layout
const FormLayouts = Loadable(lazy(() => import('../views/forms/FormLayouts')));
const FormCustom = Loadable(lazy(() => import('../views/forms/FormCustom')));
const FormWizard = Loadable(lazy(() => import('../views/forms/FormWizard')));
const FormValidation = Loadable(lazy(() => import('../views/forms/FormValidation')));
const TiptapEditor = Loadable(lazy(() => import('../views/forms/from-tiptap/TiptapEditor')));
const FormHorizontal = Loadable(lazy(() => import('../views/forms/FormHorizontal')));
const FormVertical = Loadable(lazy(() => import('../views/forms/FormVertical')));

// tables
const BasicTable = Loadable(lazy(() => import('../views/tables/BasicTable')));
const CollapsibleTable = Loadable(lazy(() => import('../views/tables/CollapsibleTable')));
const EnhancedTable = Loadable(lazy(() => import('../views/tables/EnhancedTable')));
const FixedHeaderTable = Loadable(lazy(() => import('../views/tables/FixedHeaderTable')));
const PaginationTable = Loadable(lazy(() => import('../views/tables/PaginationTable')));
const SearchTable = Loadable(lazy(() => import('../views/tables/SearchTable')));

//react tables
const ReactBasicTable = Loadable(lazy(() => import('../views/react-tables/basic/page')));
const ReactColumnVisibilityTable = Loadable(
  lazy(() => import('../views/react-tables/columnvisibility/page')),
);
const ReactDenseTable = Loadable(lazy(() => import('../views/react-tables/dense/page')));
const ReactDragDropTable = Loadable(lazy(() => import('../views/react-tables/drag-drop/page')));
const ReactEditableTable = Loadable(lazy(() => import('../views/react-tables/editable/page')));
const ReactEmptyTable = Loadable(lazy(() => import('../views/react-tables/empty/page')));
const ReactExpandingTable = Loadable(lazy(() => import('../views/react-tables/expanding/page')));
const ReactFilterTable = Loadable(lazy(() => import('../views/react-tables/filtering/page')));
const ReactPaginationTable = Loadable(lazy(() => import('../views/react-tables/pagination/page')));
const ReactRowSelectionTable = Loadable(
  lazy(() => import('../views/react-tables/row-selection/page')),
);
const ReactSortingTable = Loadable(lazy(() => import('../views/react-tables/sorting/page')));
const ReactStickyTable = Loadable(lazy(() => import('../views/react-tables/sticky/page')));

// chart
const LineChart = Loadable(lazy(() => import('../views/charts/LineChart')));
const GredientChart = Loadable(lazy(() => import('../views/charts/GredientChart')));
const DoughnutChart = Loadable(lazy(() => import('../views/charts/DoughnutChart')));
const AreaChart = Loadable(lazy(() => import('../views/charts/AreaChart')));
const ColumnChart = Loadable(lazy(() => import('../views/charts/ColumnChart')));
const CandlestickChart = Loadable(lazy(() => import('../views/charts/CandlestickChart')));
const RadialbarChart = Loadable(lazy(() => import('../views/charts/RadialbarChart')));

// ui
const MuiAlert = Loadable(lazy(() => import('../views/ui-components/MuiAlert')));
const MuiAccordion = Loadable(lazy(() => import('../views/ui-components/MuiAccordion')));
const MuiAvatar = Loadable(lazy(() => import('../views/ui-components/MuiAvatar')));
const MuiChip = Loadable(lazy(() => import('../views/ui-components/MuiChip')));
const MuiDialog = Loadable(lazy(() => import('../views/ui-components/MuiDialog')));
const MuiList = Loadable(lazy(() => import('../views/ui-components/MuiList')));
const MuiPopover = Loadable(lazy(() => import('../views/ui-components/MuiPopover')));
const MuiRating = Loadable(lazy(() => import('../views/ui-components/MuiRating')));
const MuiTabs = Loadable(lazy(() => import('../views/ui-components/MuiTabs')));
const MuiTooltip = Loadable(lazy(() => import('../views/ui-components/MuiTooltip')));
const MuiTransferList = Loadable(lazy(() => import('../views/ui-components/MuiTransferList')));
const MuiTypography = Loadable(lazy(() => import('../views/ui-components/MuiTypography')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

// landingpage
const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage')));

// presentation (PPT-style executive deck)
const SmartTaxChainPresentation = Loadable(
  lazy(() => import('../views/pages/presentation/SmartTaxChainPresentation')),
);

// front end pages
const Homepage = Loadable(lazy(() => import('../views/pages/frontend-pages/Homepage')));
const About = Loadable(lazy(() => import('../views/pages/frontend-pages/About')));
const Contact = Loadable(lazy(() => import('../views/pages/frontend-pages/Contact')));
const Portfolio = Loadable(lazy(() => import('../views/pages/frontend-pages/Portfolio')));
const PagePricing = Loadable(lazy(() => import('../views/pages/frontend-pages/Pricing')));
const BlogPage = Loadable(lazy(() => import('../views/pages/frontend-pages/Blog')));
const BlogPost = Loadable(lazy(() => import('../views/pages/frontend-pages/BlogPost')));

//mui charts
const BarCharts = Loadable(lazy(() => import('../views/muicharts/barcharts/page')));
const GaugeCharts = Loadable(lazy(() => import('../views/muicharts/gaugecharts/page')));
const AreaCharts = Loadable(lazy(() => import('../views/muicharts/linecharts/area/page')));
const LineCharts = Loadable(lazy(() => import('../views/muicharts/linecharts/line/page')));
const PieCharts = Loadable(lazy(() => import('../views/muicharts/piecharts/page')));
const ScatterCharts = Loadable(lazy(() => import('../views/muicharts/scattercharts/page')));
const SparklineCharts = Loadable(lazy(() => import('../views/muicharts/sparklinecharts/page')));

//mui tree
const SimpletreeCustomization = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-customization/page')),
);
const SimpletreeExpansion = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-expansion/page')),
);
const SimpletreeFocus = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-focus/page')),
);
const SimpletreeItems = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-items/page')),
);
const SimpletreeSelection = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-selection/page')),
);

const SmartTaxChainSimulation = Loadable(
  lazy(() => import('../views/taaxchain/SmartTaxChainSimulation')),
);
const VerificationPage = Loadable(lazy(() => import('../views/verification/VerificationPage')));

const Router = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboards/enhanced-modern" /> },
      { path: '/dashboard-hub', exact: true, element: <DashboardHub /> },
      { path: '/dashboards/modern', exact: true, element: <ModernDash /> },
      { path: '/dashboards/enhanced-modern', exact: true, element: <EnhancedModernDash /> },
      { path: '/dashboards/ecommerce', exact: true, element: <EcommerceDash /> },
      { path: '/dashboards/tra', exact: true, element: <TRADashboard /> },
      { path: '/test', exact: true, element: <TestPage /> },
      { path: '/apps/chats', element: <Chats /> },
      { path: '/apps/notes', element: <Notes /> },
      { path: '/apps/calendar', element: <Calendar /> },
      { path: '/apps/email', element: <Email /> },
      { path: '/apps/tickets', element: <Tickets /> },
      { path: '/apps/contacts', element: <Contacts /> },
      { path: '/apps/ecommerce/shop', element: <Ecommerce /> },
      { path: '/apps/ecommerce/eco-product-list', element: <EcomProductList /> },
      { path: '/apps/ecommerce/eco-checkout', element: <EcomProductCheckout /> },
      { path: '/apps/ecommerce/add-product', element: <EcommerceAddProduct /> },
      { path: '/apps/ecommerce/edit-product', element: <EcommerceEditProduct /> },
      { path: '/apps/ecommerce/detail/:id', element: <EcommerceDetail /> },
      { path: '/apps/kanban', element: <Kanban /> },
      { path: '/apps/invoice/list', element: <InvoiceList /> },
      { path: '/apps/invoice/create', element: <InvoiceCreate /> },
      { path: '/apps/invoice/detail/:id', element: <InvoiceDetail /> },
      { path: '/apps/invoice/edit/:id', element: <InvoiceEdit /> },
      { path: '/apps/followers', element: <Followers /> },
      { path: '/apps/friends', element: <Friends /> },
      { path: '/apps/gallery', element: <Gallery /> },
      { path: '/user-profile', element: <UserProfile /> },

      /*custom*/
      { path: '/taxpayer-registration', element: <UserRegistration /> },
      { path: '/enhanced-taxpayer-registration', element: <EnhancedUserRegistration /> },
      { path: '/apps/assessment', element: <TaxAssessmentList /> },
      { path: '/apps/assessment/list', element: <TaxAssessmentList /> },
      { path: '/apps/assessment/by-taxpayer', element: <TaxpayerSearchPage /> },
      { path: '/apps/invoice/create', element: <InvoiceCreate /> },
      { path: '/tax/assessment/detail/:id', element: <TaxAssessmentDetail /> },
      { path: '/apps/assessment/:id/account', element: <AssessmentAccountPage /> },
      { path: '/tax/taxpayer/:tin/assessments', element: <TaxpayerAssessmentsPage /> },
      { path: '/tax/payments/list', element: <TaxPayment /> },
      { path: '/system/tax-types', element: <TaxTypeManagementPage /> },
      { path: '/tax/auditing/list', element: <Auditing /> },
      { path: '/apps/audit/logs', element: <AuditLogs /> },
      { path: '/apps/audit/trail/:entityType/:entityId', element: <AuditTrail /> },
      { path: '/apps/audit/high-risk', element: <HighRisk /> },
      { path: '/apps/audit/statistics', element: <AuditStatistics /> },
      { path: '/apps/audit/user/:userId', element: <UserActivity /> },
      { path: '/apps/user/list', element: <UserListPage /> },
      { path: '/apps/user', element: <UserListPage /> },
      { path: '/apps/user/integrity', element: <DataIntegrityPage /> },
      { path: '/system/users', element: <SystemUsersPage /> },
      { path: '/system/users/roles', element: <RoleManagementPage /> },
      { path: '/system/users/permissions', element: <PermissionsPage /> },
      { path: '/system/log-management', element: <LogManagementPage /> },
      { path: '/apps/vat', element: <VATManagement /> },
      { path: '/apps/compliance', element: <ComplianceMonitoring /> },
      { path: '/apps/compliance/reports', element: <ComplianceMonitoring /> },
      { path: '/apps/compliance/taxpayer-report', element: <TaxpayerComplianceReportPage /> },
      { path: '/apps/reports', element: <ReportsPage /> },
      { path: '/apps/blockchain', element: <BlockchainExplorer /> },
      { path: '/apps/hyperledger-tax-demo', element: <HyperledgerTaxDemo /> },

      //TaxPayment

      { path: '/pages/casl', element: <RollbaseCASL /> },

      { path: '/pages/pricing', element: <Pricing /> },
      { path: '/pages/account-settings', element: <AccountSetting /> },
      { path: '/pages/faq', element: <Faq /> },
      { path: '/forms/form-elements/autocomplete', element: <MuiAutoComplete /> },
      { path: '/forms/form-elements/button', element: <MuiButton /> },
      { path: '/forms/form-elements/checkbox', element: <MuiCheckbox /> },
      { path: '/forms/form-elements/radio', element: <MuiRadio /> },
      { path: '/forms/form-elements/slider', element: <MuiSlider /> },
      { path: '/forms/form-elements/date-time', element: <MuiDateTime /> },
      { path: '/forms/form-elements/date-range', element: <MuiDateTime /> },
      { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      { path: '/forms/form-tiptap', element: <TiptapEditor /> },
      { path: '/forms/form-layouts', element: <FormLayouts /> },
      { path: '/forms/form-horizontal', element: <FormHorizontal /> },
      { path: '/forms/form-vertical', element: <FormVertical /> },
      { path: '/forms/form-custom', element: <FormCustom /> },
      { path: '/forms/form-wizard', element: <FormWizard /> },
      { path: '/forms/form-validation', element: <FormValidation /> },
      { path: '/tables/basic', element: <BasicTable /> },
      { path: '/tables/collapsible', element: <CollapsibleTable /> },
      { path: '/tables/enhanced', element: <EnhancedTable /> },
      { path: '/tables/fixed-header', element: <FixedHeaderTable /> },
      { path: '/tables/pagination', element: <PaginationTable /> },
      { path: '/tables/search', element: <SearchTable /> },
      { path: '/charts/line-chart', element: <LineChart /> },
      { path: '/charts/gredient-chart', element: <GredientChart /> },
      { path: '/charts/doughnut-pie-chart', element: <DoughnutChart /> },
      { path: '/charts/area-chart', element: <AreaChart /> },
      { path: '/charts/column-chart', element: <ColumnChart /> },
      { path: '/charts/candlestick-chart', element: <CandlestickChart /> },
      { path: '/charts/radialbar-chart', element: <RadialbarChart /> },
      { path: '/ui-components/alert', element: <MuiAlert /> },
      { path: '/ui-components/accordion', element: <MuiAccordion /> },
      { path: '/ui-components/avatar', element: <MuiAvatar /> },
      { path: '/ui-components/chip', element: <MuiChip /> },
      { path: '/ui-components/dialog', element: <MuiDialog /> },
      { path: '/ui-components/list', element: <MuiList /> },
      { path: '/ui-components/popover', element: <MuiPopover /> },
      { path: '/ui-components/rating', element: <MuiRating /> },
      { path: '/ui-components/tabs', element: <MuiTabs /> },
      { path: '/ui-components/tooltip', element: <MuiTooltip /> },
      { path: '/ui-components/transfer-list', element: <MuiTransferList /> },
      { path: '/ui-components/typography', element: <MuiTypography /> },
      { path: '/widgets/cards', element: <WidgetCards /> },
      { path: '/widgets/banners', element: <WidgetBanners /> },
      { path: '/widgets/charts', element: <WidgetCharts /> },
      { path: '/react-tables/basic', element: <ReactBasicTable /> },
      { path: '/react-tables/column-visiblity', element: <ReactColumnVisibilityTable /> },
      { path: '/react-tables/drag-drop', element: <ReactDragDropTable /> },
      { path: '/react-tables/dense', element: <ReactDenseTable /> },
      { path: '/react-tables/editable', element: <ReactEditableTable /> },
      { path: '/react-tables/empty', element: <ReactEmptyTable /> },
      { path: '/react-tables/expanding', element: <ReactExpandingTable /> },
      { path: '/react-tables/filter', element: <ReactFilterTable /> },
      { path: '/react-tables/pagination', element: <ReactPaginationTable /> },
      { path: '/react-tables/row-selection', element: <ReactRowSelectionTable /> },
      { path: '/react-tables/sorting', element: <ReactSortingTable /> },
      { path: '/react-tables/sticky', element: <ReactStickyTable /> },

      { path: '/muicharts/barcharts', element: <BarCharts /> },
      { path: '/muicharts/gaugecharts', element: <GaugeCharts /> },
      { path: '/muicharts/linecharts/area', element: <AreaCharts /> },
      { path: '/muicharts/linecharts/line', element: <LineCharts /> },
      { path: '/muicharts/piecharts', element: <PieCharts /> },
      { path: '/muicharts/scattercharts', element: <ScatterCharts /> },
      { path: '/muicharts/sparklinecharts', element: <SparklineCharts /> },

      {
        path: '*',
        element: <Navigate to="/auth/404" />,
      },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'two-steps', element: <TwoSteps /> },
      { path: 'maintenance', element: <Maintenance /> },
      {
        path: 'maintenance',
        element: <Maintenance />,
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/landingpage',
    element: <Landingpage />,
  },
  {
    path: '/presentation',
    element: <SmartTaxChainPresentation />,
  },
  {
    path: '/frontend-pages/homepage',
    element: <Homepage />,
  },
  {
    path: '/frontend-pages/about',
    element: <About />,
  },
  {
    path: '/frontend-pages/contact',
    element: <Contact />,
  },
  {
    path: '/frontend-pages/portfolio',
    element: <Portfolio />,
  },
  {
    path: '/frontend-pages/pricing',
    element: <PagePricing />,
  },
  {
    path: '/frontend-pages/blog',
    element: <BlogPage />,
  },
  {
    path: '/frontend-pages/blog/detail/:id',
    element: <BlogPost />,
  },
  {
    path: '/public-audit-portal/*',
    element: <PublicAuditPortal />,
  },
  {
    path: '/simulation',
    element: (
      <ProtectedRoute>
        <SmartTaxChainSimulation />
      </ProtectedRoute>
    ),
  },
  {
    path: '/verify',
    element: <VerificationPage />,
  },
];

const RouterComponent = () => {
  return useRoutes(Router);
};

export default RouterComponent;
