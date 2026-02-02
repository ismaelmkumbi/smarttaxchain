import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.taxData': 'Tax Data',
      'nav.blockchain': 'Blockchain Explorer',
      'nav.reports': 'Reports',
      'nav.feedback': 'Feedback',
      'nav.education': 'Civic Education',
      'nav.language': 'Language',

      // Dashboard
      'dashboard.title': 'Public Audit Portal',
      'dashboard.subtitle': 'Tanzania Revenue Authority - Tax Transparency Dashboard',
      'dashboard.totalRevenue': 'Total Revenue Collected',
      'dashboard.taxCompliance': 'Tax Compliance Rate',
      'dashboard.activeBusinesses': 'Active Businesses',
      'dashboard.recentUpdates': 'Recent Updates',

      // Data Visualization
      'charts.revenueByRegion': 'Revenue by Region',
      'charts.complianceOverTime': 'Compliance Over Time',
      'charts.taxTypeDistribution': 'Tax Type Distribution',
      'charts.monthlyTrends': 'Monthly Revenue Trends',

      // Downloads
      'download.csv': 'Download CSV',
      'download.json': 'Download JSON',
      'download.report': 'Download Report',

      // Feedback Form
      'feedback.title': 'Submit Feedback',
      'feedback.description': 'Help us improve data quality and transparency',
      'feedback.category': 'Category',
      'feedback.message': 'Your Message',
      'feedback.submit': 'Submit Feedback',
      'feedback.anonymous': 'Submit Anonymously',

      // Education
      'education.title': 'Understanding Tax Data',
      'education.transparency': 'Why Transparency Matters',
      'education.howToRead': 'How to Read the Data',
      'education.yourRights': 'Your Rights as a Citizen',

      // Accessibility
      'a11y.skipToContent': 'Skip to main content',
      'a11y.chartDescription': 'Interactive chart showing',
      'a11y.dataTable': 'Data table with sortable columns',

      // Trust Indicators
      'trust.dataVerified': 'Data Verified',
      'trust.lastUpdated': 'Last Updated',
      'trust.complianceScore': 'Compliance Score',
      'trust.securityBadge': 'Security Verified',

      // Smart Tax Chain Simulation
      'simulation.title': 'Smart Tax Chain Simulation',
      'simulation.subtitle': 'Simulate blockchain-based tax compliance and fraud detection for TRA',
      'simulation.taxpayerPanel': 'Taxpayer Simulation Interface',
      'simulation.traDashboard': 'TRA Real-time Dashboard',
      'simulation.blockchainPanel': 'Smart Tax Chain Blockchain',
      'simulation.taxpayerInfo': 'Simulate different taxpayer scenarios to test the Smart Tax Chain system.',
      'simulation.taxpayerType': 'Taxpayer Type',
      'simulation.individual': 'Individual',
      'simulation.business': 'Business',
      'simulation.corporation': 'Corporation',
      'simulation.businessCategory': 'Business Category',
      'simulation.retail': 'Retail',
      'simulation.services': 'Services',
      'simulation.manufacturing': 'Manufacturing',
      'simulation.hospitality': 'Hospitality',
      'simulation.saleAmount': 'Sale Amount (TZS)',
      'simulation.calculatedVat': 'Calculated VAT',
      'simulation.reportedVat': 'Reported VAT',
      'simulation.transactionActions': 'Transaction Actions',
      'simulation.generateCompliantSale': 'Generate Compliant Sale',
      'simulation.simulateUnderreport': 'Simulate VAT Underreporting',
      'simulation.randomTransaction': 'Generate Random Transaction',
      'simulation.processing': 'Processing...',
      'simulation.totalTransactions': 'Total Transactions',
      'simulation.complianceRate': 'Compliance Rate',
      'simulation.totalRevenue': 'Total Revenue',
      'simulation.fraudDetected': 'Fraud Detected',
      'simulation.fraudAlerts': 'Active Fraud Alerts',
      'simulation.fraudAlertMessage': 'VAT mismatch detected for transaction {{id}}',
      'simulation.resolve': 'Resolve',
      'simulation.recentTransactions': 'Recent Transactions',
      'simulation.showRecent': 'Show Recent',
      'simulation.showAll': 'Show All',
      'simulation.timestamp': 'Time',
      'simulation.taxpayerId': 'Taxpayer ID',
      'simulation.status': 'Status',
      'simulation.fraud': 'Fraud',
      'simulation.verified': 'Verified',
      'simulation.noTransactions': 'No transactions yet. Start a simulation to see real-time data.',
      'simulation.lastUpdated': 'Last updated: {{time}}',
      'simulation.refresh': 'Refresh',
      'simulation.clearAll': 'Clear All',
      'simulation.idle': 'Idle',
      'simulation.validating': 'Validating Transaction',
      'simulation.mining': 'Mining Block',
      'simulation.confirming': 'Confirming Block',
      'simulation.confirmed': 'Added to Chain',
      'simulation.processingTransaction': 'Processing transaction of {{amount}}',
      'simulation.latestBlock': 'Latest Block',
      'simulation.block': 'Block',
      'simulation.blockchainHistory': 'Blockchain History',
      'simulation.blocks': 'blocks',
      'simulation.chainLength': 'Chain Length',
      'simulation.lastBlock': 'Last Block',
      'simulation.none': 'None',
      'simulation.integrity': 'Chain Integrity',
      'simulation.alertsActive': 'Alerts Active',
      'simulation.secure': 'Secure',
      'simulation.emptyBlockchain': 'Blockchain is empty',
      'simulation.startSimulation': 'Generate transactions to see the blockchain in action',
    },
  },
  sw: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashibodi',
      'nav.taxData': 'Data za Kodi',
      'nav.blockchain': 'Blockchain Explorer',
      'nav.reports': 'Ripoti',
      'nav.feedback': 'Maoni',
      'nav.education': 'Elimu ya Kiraia',
      'nav.language': 'Lugha',

      // Dashboard
      'dashboard.title': 'Mlango wa Ukaguzi wa Umma',
      'dashboard.subtitle': 'Mamlaka ya Mapato Tanzania - Dashibodi ya Uwazi wa Kodi',
      'dashboard.totalRevenue': 'Jumla ya Mapato Yaliyokusanywa',
      'dashboard.taxCompliance': 'Kiwango cha Kufuata Kodi',
      'dashboard.activeBusinesses': 'Biashara Zinazofanya Kazi',
      'dashboard.recentUpdates': 'Masasisho ya Hivi Karibuni',

      // Data Visualization
      'charts.revenueByRegion': 'Mapato kwa Mkoa',
      'charts.complianceOverTime': 'Kufuata Kodi kwa Wakati',
      'charts.taxTypeDistribution': 'Mgawanyo wa Aina za Kodi',
      'charts.monthlyTrends': 'Mielekeo ya Kila Mwezi',

      // Downloads
      'download.csv': 'Pakua CSV',
      'download.json': 'Pakua JSON',
      'download.report': 'Pakua Ripoti',

      // Feedback Form
      'feedback.title': 'Tuma Maoni',
      'feedback.description': 'Tusaidie kuboresha ubora wa data na uwazi',
      'feedback.category': 'Kategoria',
      'feedback.message': 'Ujumbe Wako',
      'feedback.submit': 'Tuma Maoni',
      'feedback.anonymous': 'Tuma Bila Kutambulika',

      // Education
      'education.title': 'Kuelewa Data za Kodi',
      'education.transparency': 'Kwa Nini Uwazi ni Muhimu',
      'education.howToRead': 'Jinsi ya Kusoma Data',
      'education.yourRights': 'Haki Zako kama Raia',

      // Accessibility
      'a11y.skipToContent': 'Ruka kwenda maudhui makuu',
      'a11y.chartDescription': 'Chati ya maingiliano inayoonyesha',
      'a11y.dataTable': 'Jedwali la data lenye safu zinazoweza kupangwa',

      // Trust Indicators
      'trust.dataVerified': 'Data Imethibitishwa',
      'trust.lastUpdated': 'Ilisasishwa Mwisho',
      'trust.complianceScore': 'Alama ya Kufuata Sheria',
      'trust.securityBadge': 'Usalama Umethibitishwa',

      // Smart Tax Chain Simulation
      'simulation.title': 'Jaribio la Smart Tax Chain',
      'simulation.subtitle': 'Jaribu mfumo wa blockchain kwa kufuata kodi na kugundua ulaghai wa TRA',
      'simulation.taxpayerPanel': 'Kiolesura cha Jaribio la Mlipakodi',
      'simulation.traDashboard': 'Dashibodi ya TRA ya Wakati Halisi',
      'simulation.blockchainPanel': 'Blockchain ya Smart Tax Chain',
      'simulation.taxpayerInfo': 'Jaribu mazingira mbalimbali ya walipakodi kupima mfumo wa Smart Tax Chain.',
      'simulation.taxpayerType': 'Aina ya Mlipakodi',
      'simulation.individual': 'Mtu Binafsi',
      'simulation.business': 'Biashara',
      'simulation.corporation': 'Kampuni',
      'simulation.businessCategory': 'Kategoria ya Biashara',
      'simulation.retail': 'Rejareja',
      'simulation.services': 'Huduma',
      'simulation.manufacturing': 'Utengenezaji',
      'simulation.hospitality': 'Ukaribuni',
      'simulation.saleAmount': 'Kiasi cha Mauzo (TZS)',
      'simulation.calculatedVat': 'VAT Iliyohesabiwa',
      'simulation.reportedVat': 'VAT Iliyoripotiwa',
      'simulation.transactionActions': 'Vitendo vya Muamala',
      'simulation.generateCompliantSale': 'Tengeneza Mauzo Yanayofuata Sheria',
      'simulation.simulateUnderreport': 'Jaribu Kupunguza Ripoti ya VAT',
      'simulation.randomTransaction': 'Tengeneza Muamala wa Nasibu',
      'simulation.processing': 'Inachakata...',
      'simulation.totalTransactions': 'Jumla ya Miamala',
      'simulation.complianceRate': 'Kiwango cha Kufuata Sheria',
      'simulation.totalRevenue': 'Jumla ya Mapato',
      'simulation.fraudDetected': 'Ulaghai Umegunduliwa',
      'simulation.fraudAlerts': 'Tahadhari za Ulaghai Zinazofanya Kazi',
      'simulation.fraudAlertMessage': 'Kutofautiana kwa VAT kumegunduliwa kwa muamala {{id}}',
      'simulation.resolve': 'Tatua',
      'simulation.recentTransactions': 'Miamala ya Hivi Karibuni',
      'simulation.showRecent': 'Onyesha ya Hivi Karibuni',
      'simulation.showAll': 'Onyesha Zote',
      'simulation.timestamp': 'Wakati',
      'simulation.taxpayerId': 'Kitambulisho cha Mlipakodi',
      'simulation.status': 'Hali',
      'simulation.fraud': 'Ulaghai',
      'simulation.verified': 'Imethibitishwa',
      'simulation.noTransactions': 'Hakuna miamala bado. Anza jaribio kuona data ya wakati halisi.',
      'simulation.lastUpdated': 'Ilisasishwa mwisho: {{time}}',
      'simulation.refresh': 'Onyesha Upya',
      'simulation.clearAll': 'Futa Zote',
      'simulation.idle': 'Tulivu',
      'simulation.validating': 'Inathibitisha Muamala',
      'simulation.mining': 'Inachimba Block',
      'simulation.confirming': 'Inathibitisha Block',
      'simulation.confirmed': 'Imeongezwa kwenye Mnyororo',
      'simulation.processingTransaction': 'Inachakata muamala wa {{amount}}',
      'simulation.latestBlock': 'Block ya Hivi Karibuni',
      'simulation.block': 'Block',
      'simulation.blockchainHistory': 'Historia ya Blockchain',
      'simulation.blocks': 'blocks',
      'simulation.chainLength': 'Urefu wa Mnyororo',
      'simulation.lastBlock': 'Block ya Mwisho',
      'simulation.none': 'Hakuna',
      'simulation.integrity': 'Uongozi wa Mnyororo',
      'simulation.alertsActive': 'Tahadhari Zinafanya Kazi',
      'simulation.secure': 'Salama',
      'simulation.emptyBlockchain': 'Blockchain ni tupu',
      'simulation.startSimulation': 'Tengeneza miamala kuona blockchain ikifanya kazi',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
