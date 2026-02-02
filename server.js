import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock authentication middleware
const authenticateToken = (req, res, next) => {
  console.log(`🔐 Auth check for: ${req.method} ${req.originalUrl}`);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      message: 'Access token required',
      context: 'Authentication',
    });
  }

  console.log('✅ Token provided, proceeding...');
  // For development, accept any token
  next();
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TRA API Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ===================== USER MANAGEMENT MODULE =====================
// Mock users storage (must be defined before routes that use it)
let USERS = [
  {
    id: 1,
    username: 'admin',
    staffId: 'STAFF001',
    email: 'admin@tra.go.tz',
    role: 'admin',
    department: 'Administration',
    is_active: true,
    last_login: new Date().toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    username: 'johndoe',
    staffId: 'STAFF002',
    email: 'john.doe@tra.go.tz',
    role: 'officer',
    department: 'Tax Collection',
    is_active: true,
    last_login: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    username: 'janedoe',
    staffId: 'STAFF003',
    email: 'jane.doe@tra.go.tz',
    role: 'auditor',
    department: 'Compliance',
    is_active: true,
    last_login: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    username: 'bobsmith',
    staffId: 'STAFF004',
    email: 'bob.smith@tra.go.tz',
    role: 'officer',
    department: 'Tax Collection',
    is_active: false,
    last_login: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Staff Registration endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, username, password, email, role, department } = req.body;

  // Validation
  if (!name || !username || !password || !email || !role || !department) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, username, password, email, role, department',
      timestamp: new Date().toISOString(),
    });
  }

  // Check if username already exists
  if (USERS.find((u) => u.username === username)) {
    return res.status(409).json({
      success: false,
      message: 'Username already exists',
      timestamp: new Date().toISOString(),
    });
  }

  // Check if email already exists
  if (USERS.find((u) => u.email === email)) {
    return res.status(409).json({
      success: false,
      message: 'Email already exists',
      timestamp: new Date().toISOString(),
    });
  }

  // Generate staffId: STAFF-2025-{timestamp}-{random}
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const staffId = `STAFF-2025-${timestamp}-${random}`;

  // Create new user
  const newUser = {
    id: USERS.length + 1,
    username,
    staffId,
    email,
    role,
    department,
    is_active: true,
    last_login: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  USERS.push(newUser);

  // Generate JWT token (mock)
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + Buffer.from(JSON.stringify({
    id: newUser.id,
    username: newUser.username,
    staffId: newUser.staffId,
    role: newUser.role,
    department: newUser.department,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  })).toString('base64') + '.mock-signature';

  // Create staff object
  const staff = {
    staffId,
    name,
    role,
    department,
    email,
  };

  return res.status(201).json({
    success: true,
    message: 'Staff member and user account created successfully',
    data: {
      user: {
        id: newUser.id,
        username: newUser.username,
        staffId: newUser.staffId,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
      },
      staff,
      token: mockToken,
    },
    timestamp: new Date().toISOString(),
  });
});

// Mock login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // For development, accept any credentials
  if (username && password) {
    // Find user in USERS array or create default
    let user = USERS.find((u) => u.username === username);
    if (!user) {
      // Create a default user for login
      user = {
        id: 1,
        username: username,
        staffId: 'STAFF001',
        email: `${username}@tra.go.tz`,
        role: 'admin',
        department: 'Administration',
      };
    }

    const mockToken = 'mock-jwt-token-' + Date.now();
    
    // Match real backend response structure
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: mockToken,
        user: {
          id: user.id,
          username: user.username,
          staffId: user.staffId,
          email: user.email,
          role: user.role,
          department: user.department,
        },
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
  }
});

// Mock user info endpoint
app.get('/api/staff/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: 1,
      username: 'admin',
      name: 'TRA Admin User',
      role: 'admin',
      permissions: ['read', 'write', 'admin'],
      lastLogin: new Date().toISOString(),
    },
  });
});

app.get('/api/staff/:staffId', authenticateToken, (req, res) => {
  const { staffId } = req.params;
  const staff = USERS.find(
    (u) => u.staffId === staffId || String(u.id) === staffId || u.username === staffId,
  );

  if (!staff) {
    return res.status(404).json({
      success: false,
      message: `Staff with id ${staffId} does not exist`,
      context: 'StaffLookup',
    });
  }

  return res.json({
    success: true,
    data: {
      id: staff.id,
      staffId: staff.staffId,
      username: staff.username,
      email: staff.email,
      role: staff.role,
      department: staff.department,
      is_active: staff.is_active,
      last_login: staff.last_login,
      created_at: staff.created_at,
      updated_at: staff.updated_at,
    },
  });
});

// Compliance Dashboard
app.get('/api/compliance/dashboard', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      totalTaxpayers: 15420,
      compliantTaxpayers: 14230,
      nonCompliantTaxpayers: 1190,
      complianceRate: 92.3,
      pendingAudits: 45,
      completedAudits: 1234,
      totalPenalties: 890,
      revenueCollected: 4567890000,
      blockchainTransactions: 12345,
      recentAlerts: [
        { id: 1, type: 'compliance', message: 'New audit scheduled', severity: 'medium' },
        { id: 2, type: 'payment', message: 'Payment received', severity: 'low' },
      ],
    },
    blockchainTxId: 'mock-tx-12345',
    timestamp: new Date().toISOString(),
  });
});

// Revenue Dashboard
app.get('/api/reports/revenue/dashboard', authenticateToken, (req, res) => {
  const { period = 'monthly' } = req.query;

  res.json({
    success: true,
    data: {
      period,
      totalRevenue: 4567890000,
      vatRevenue: 2345670000,
      incomeTaxRevenue: 1234560000,
      corporateTaxRevenue: 987660000,
      monthlyGrowth: 12.5,
      quarterlyGrowth: 8.3,
      yearlyGrowth: 15.7,
      topContributors: [
        { name: 'Company A', amount: 123456000 },
        { name: 'Company B', amount: 98765000 },
        { name: 'Company C', amount: 76543000 },
      ],
      revenueBySector: [
        { sector: 'Manufacturing', amount: 1234560000 },
        { sector: 'Services', amount: 987650000 },
        { sector: 'Trade', amount: 765430000 },
      ],
    },
    blockchainTxId: 'mock-tx-67890',
    timestamp: new Date().toISOString(),
  });
});

// Blockchain Stats
app.get('/api/blockchain/stats', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      totalTransactions: 123456,
      totalBlocks: 5678,
      activeNodes: 25,
      averageBlockTime: 2.5,
      networkHashRate: '1.2 TH/s',
      pendingTransactions: 45,
      blockchainSize: '2.3 GB',
      lastBlockHash: '0x1234567890abcdef',
      consensusAlgorithm: 'Proof of Authority',
      smartContracts: 234,
      verifiedTransactions: 123400,
      failedTransactions: 56,
    },
    blockchainTxId: 'mock-tx-11111',
    timestamp: new Date().toISOString(),
  });
});

// Taxpayers - GET list (must be before /register route)
app.get('/api/taxpayers', authenticateToken, (req, res) => {
  console.log('GET /api/taxpayers - Request received');
  console.log('Query params:', req.query);
  console.log('Auth token:', req.headers.authorization ? 'Present' : 'Missing');
  
  res.json({
    success: true,
    data: {
      taxpayers: [
        {
          id: 'TP001',
          name: 'ABC Company Ltd',
          tin: '123456789',
          vrn: 'VRN001',
          type: 'Corporate',
          complianceScore: 95,
          riskLevel: 'LOW',
        },
        {
          id: 'TP002',
          name: 'XYZ Trading Co',
          tin: '987654321',
          vrn: 'VRN002',
          type: 'Corporate',
          complianceScore: 78,
          riskLevel: 'MEDIUM',
        },
      ],
      total: 15420,
      page: 1,
      limit: 10,
    },
    blockchainTxId: 'mock-tx-22222',
    timestamp: new Date().toISOString(),
  });
});

// Register new taxpayer
app.post('/api/taxpayers/register', authenticateToken, (req, res) => {
  try {
    const {
      name,
      nin,
      tin,
      type,
      businessCategory,
      registrationAddress,
      contactEmail,
      phoneNumber,
      authorizedSignatories,
      nidaVerification,
      tinVerification,
      complianceScore,
      registrationType,
    } = req.body;

    // Validate required fields
    if (!name || !tin || !type || !businessCategory || !registrationAddress || !contactEmail || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: 'Name, TIN, type, businessCategory, registrationAddress, contactEmail, and phoneNumber are required',
        },
      });
    }

    // Mock blockchain registration (backend should handle this)
    // In real implementation, backend would:
    // 1. Transform registrationAddress → address
    // 2. Transform nin → nationalId for transient data
    // 3. Call blockchain service
    const blockchainResult = {
      success: true,
      transactionId: 'mock-tx-' + Date.now(),
      blockNumber: Math.floor(Math.random() * 10000) + 1000,
      timestamp: new Date().toISOString(),
      blockchainAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
    };

    // Create taxpayer record
    const taxpayer = {
      id: 'TP' + String(Math.floor(Math.random() * 10000)).padStart(3, '0'),
      name,
      nin: nin || null,
      tin,
      type,
      businessCategory,
      registrationAddress,
      contactEmail,
      phoneNumber,
      authorizedSignatories: authorizedSignatories || [],
      nidaVerification: nidaVerification || null,
      tinVerification: tinVerification || null,
      blockchainRegistration: blockchainResult,
      complianceScore: complianceScore || 100,
      registrationType: registrationType || 'nin',
      registrationDate: new Date().toISOString(),
      riskLevel: complianceScore >= 80 ? 'LOW' : complianceScore >= 60 ? 'MEDIUM' : 'HIGH',
    };

    // In production, save to database here
    // await db.saveTaxpayer(taxpayer);

    res.json({
      success: true,
      data: taxpayer,
      blockchainTxId: blockchainResult.transactionId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'Taxpayer registration failed',
        details: error.message,
      },
    });
  }
});

// Update taxpayer (audited edits)
app.put('/api/taxpayers/:taxpayerId', authenticateToken, (req, res) => {
  try {
    const { taxpayerId } = req.params;
    const { updates } = req.body;

    // Validate taxpayerId
    if (!taxpayerId || taxpayerId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Invalid taxpayer ID format',
        timestamp: new Date().toISOString(),
      });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: 'Request body must contain an "updates" object',
        },
      });
    }

    // Mock: Get current taxpayer data (in production, fetch from database/blockchain)
    const currentTaxpayer = {
      ID: taxpayerId,
      Name: 'ABC Company Ltd',
      ContactEmail: 'alpha@traders.co.tz',
      PhoneNumber: '+255789123456',
      RegistrationAddress: '123 Business St, Dar es Salaam',
      BusinessCategory: 'Retail',
      Type: 'Company',
      RegisteredDate: '2024-01-01',
      Status: 'Active',
    };

    // Track changes for audit
    const changes = [];
    const updatedTaxpayer = { ...currentTaxpayer };

    // Apply updates and track changes
    Object.keys(updates).forEach((field) => {
      const oldValue = currentTaxpayer[field];
      const newValue = updates[field];
      
      if (oldValue !== newValue) {
        changes.push({
          field,
          from: oldValue || null,
          to: newValue,
        });
        updatedTaxpayer[field] = newValue;
      }
    });

    // Mock blockchain transaction
    const blockchainTxId = '5d90aa' + Math.random().toString(16).substr(2, 10) + 'bc32';

    // Extract user from token (mock - in production, decode JWT)
    const updatedBy = req.headers.authorization 
      ? 'auditor.kassim@tra.go.tz' // Mock user from token
      : 'system';

    const audit = {
      updatedBy,
      updatedAt: new Date().toISOString(),
      blockchainTxId,
      changes,
    };

    // In production, save to database/blockchain here
    // await db.updateTaxpayer(taxpayerId, updatedTaxpayer, audit);

    res.json({
      success: true,
      taxpayer: {
        ID: updatedTaxpayer.ID,
        ...updates, // Return only updated fields
      },
      audit,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Update taxpayer error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Taxpayer update failed',
        details: error.message,
      },
    });
  }
});

// VAT Transactions
app.get('/api/vat/transactions', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      transactions: [
        {
          id: 'VAT001',
          taxpayerId: 'TP001',
          amount: 1000000,
          vatAmount: 180000,
          transactionType: 'Sale',
          date: '2024-01-15',
        },
        {
          id: 'VAT002',
          taxpayerId: 'TP002',
          amount: 500000,
          vatAmount: 90000,
          transactionType: 'Purchase',
          date: '2024-01-14',
        },
      ],
      total: 1234,
      page: 1,
      limit: 10,
    },
    blockchainTxId: 'mock-tx-33333',
    timestamp: new Date().toISOString(),
  });
});

// ===================== TAX ASSESSMENTS (MOCK) =====================
let TAX_ASSESSMENTS = [
  {
    ID: 'TAXASMT-2025-000123',
    Tin: '123456789',
    TaxpayerId: 'TP-2025-000123',
    TaxType: 'VAT',
    Year: 2025,
    Period: '2025-Q1',
    Amount: 1500000,
    AssessedAmount: 1500000,
    Penalties: 0,
    Interest: 0,
    TotalDue: 1500000,
    Currency: 'TZS',
    Status: 'OPEN',
    CreatedBy: 'admin',
    Description: 'Quarterly VAT Assessment',
    DueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
    docType: 'taxAssessment',
  },
];

// GET /api/tax-assessments (with filters & pagination)
app.get('/api/tax-assessments', authenticateToken, (req, res) => {
  const {
    tin,
    taxpayerId,
    status,
    taxType,
    from,
    to,
    page = 1,
    pageSize = 50,
  } = req.query;

  let data = [...TAX_ASSESSMENTS];
  if (tin) data = data.filter((a) => (a.Tin || '').includes(tin));
  if (taxpayerId) data = data.filter((a) => (a.TaxpayerId || '') === taxpayerId);
  if (status) data = data.filter((a) => (a.Status || '') === status);
  if (taxType) data = data.filter((a) => (a.TaxType || '') === taxType);
  if (from) data = data.filter((a) => new Date(a.DueDate) >= new Date(from));
  if (to) data = data.filter((a) => new Date(a.DueDate) <= new Date(to));

  const p = Math.max(parseInt(page, 10) || 1, 1);
  const ps = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 100);
  const start = (p - 1) * ps;
  const paged = data.slice(start, start + ps);

  return res.json({
    success: true,
    data: paged,
    pagination: {
      page: p,
      pageSize: ps,
      total: data.length,
      totalPages: Math.ceil(data.length / ps) || 1,
    },
    timestamp: new Date().toISOString(),
  });
});

// POST /api/tax-assessments (create)
app.post('/api/tax-assessments', authenticateToken, (req, res) => {
  const body = req.body || {};
  // 'id' is NOT required; backend auto-generates if not provided
  const required = ['tin', 'taxType', 'year', 'amount', 'currency', 'status', 'createdBy', 'description', 'dueDate'];
  const missing = required.filter((f) => !body[f]);
  if (missing.length) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields (${missing.join(', ')})`,
      context: 'ValidationError',
      timestamp: new Date().toISOString(),
    });
  }

  // Auto-generate Assessment ID if not provided
  const safeYear = Number(body.year) || new Date().getFullYear();
  const genSuffix = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  const newId = body.id || `TAXASMT-${safeYear}-${genSuffix}`;

  if (TAX_ASSESSMENTS.some((a) => a.ID === newId)) {
    return res.status(409).json({
      success: false,
      error: `The tax assessment ${newId} already exists`,
      context: 'ConflictError',
      timestamp: new Date().toISOString(),
    });
  }

  const now = new Date().toISOString();
  const penalties = Number(body.penalties) || 0;
  const interest = Number(body.interest) || 0;
  const amount = Number(body.amount) || 0;

  // Compute Period from year and optional quarter if period not provided
  let period = body.period;
  const q = Number(body.quarter);
  if (!period && safeYear && [1, 2, 3, 4].includes(q)) {
    period = `${safeYear}-Q${q}`;
  }

  const record = {
    ID: newId,
    Tin: body.tin,
    // TIN and TaxpayerId are the same
    TaxpayerId: body.tin,
    TaxType: body.taxType,
    Year: Number(body.year),
    Period: period || '',
    Amount: amount,
    AssessedAmount: amount,
    Penalties: penalties,
    Interest: interest,
    TotalDue: amount + penalties + interest,
    Currency: body.currency,
    Status: body.status,
    CreatedBy: body.createdBy,
    Description: body.description,
    DueDate: body.dueDate,
    CreatedAt: now,
    UpdatedAt: now,
    docType: 'taxAssessment',
  };

  TAX_ASSESSMENTS.unshift(record);

  return res.status(201).json({
    success: true,
    taxAssessment: record,
    timestamp: now,
  });
});

// GET /api/tax-assessments/:id
app.get('/api/tax-assessments/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const found = TAX_ASSESSMENTS.find((a) => a.ID === id);
  if (!found) {
    return res.status(404).json({
      success: false,
      error: `The tax assessment ${id} does not exist`,
      context: 'ChaincodeInvokeError',
      timestamp: new Date().toISOString(),
    });
  }
  return res.json({ success: true, taxAssessment: found, timestamp: new Date().toISOString() });
});

// GET /api/tax-assessments/tin/:tin
app.get('/api/tax-assessments/tin/:tin', authenticateToken, (req, res) => {
  const tin = req.params.tin;
  const list = TAX_ASSESSMENTS.filter((a) => a.Tin === tin);
  if (!list.length) {
    return res.status(404).json({
      success: false,
      error: 'No tax assessments found for this TIN',
      timestamp: new Date().toISOString(),
    });
  }
  return res.json({ success: true, assessments: list, timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    context: 'ServerError',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler - Log for debugging
app.use('*', (req, res, next) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  console.log('Available routes (partial list):', [
    'GET /api/health',
    'POST /api/auth/register',
    'POST /api/auth/login',
    'GET /api/staff/me',
    'GET /api/compliance/dashboard',
    'GET /api/reports/revenue/dashboard',
    'GET /api/blockchain/stats',
    'GET /api/taxpayers',
    'POST /api/taxpayers/register',
    'GET /api/vat/transactions',
    'GET /api/audit/logs',
    'GET /api/audit/high-risk',
    'GET /api/audit/statistics',
    'GET /api/audit/user/:userId',
    'GET /api/audit/transaction/:transactionId',
    'POST /api/audit/search',
    'POST /api/audit/archive',
    'DELETE /api/audit/delete',
    'GET /api/audit/archived',
  ]);
  return res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  });
});

// ===================== AUDIT MODULE (ENTERPRISE) =====================
// Mock audit logs storage
let AUDIT_LOGS = [];
let ARCHIVED_LOGS = [];

// Generate mock audit logs
const generateMockAuditLogs = () => {
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'APPROVE', 'REJECT'];
  const entityTypes = ['TAXPAYER', 'ASSESSMENT', 'PAYMENT', 'COMPLIANCE', 'USER'];
  const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses = ['SUCCESS', 'FAILED', 'PENDING'];
  const users = [
    { id: 'user1', name: 'John Admin', role: 'admin', msp: 'Org1' },
    { id: 'user2', name: 'Jane Auditor', role: 'auditor', msp: 'Org1' },
    { id: 'user3', name: 'Bob Manager', role: 'manager', msp: 'Org2' },
  ];

  const logs = [];
  for (let i = 0; i < 500; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(Date.now() - Math.random() * 90 * 24 * 3600 * 1000);
    
    logs.push({
      id: `AUDIT-${Date.now()}-${i}`,
      timestamp: date.toISOString(),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        msp: user.msp,
      },
      action,
      entityType,
      entityId: `${entityType}-${Math.floor(Math.random() * 10000)}`,
      status,
      riskLevel,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        platform: 'Windows',
        browser: 'Chrome',
      },
      location: {
        country: 'Tanzania',
        region: ['Dar es Salaam', 'Arusha', 'Mwanza'][Math.floor(Math.random() * 3)],
        city: 'Dar es Salaam',
      },
      executionTime: Math.floor(Math.random() * 500) + 10,
      details: {
        description: `${action} operation on ${entityType}`,
        changes: action === 'UPDATE' ? { field: 'status', oldValue: 'PENDING', newValue: 'APPROVED' } : null,
      },
      blockchainTxId: `TX-${Date.now()}-${i}`,
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

AUDIT_LOGS = generateMockAuditLogs();

// Helper: apply common filters to logs
const filterAuditLogs = (logs, filters = {}) => {
  let filtered = [...logs];

  const {
    action,
    userId,
    entityType,
    entityId,
    fromDate,
    toDate,
    riskLevel,
    status,
  } = filters;

  if (action) filtered = filtered.filter((log) => log.action === action);
  if (userId) filtered = filtered.filter((log) => log.user.id === userId);
  if (entityType) filtered = filtered.filter((log) => log.entityType === entityType);
  if (entityId) filtered = filtered.filter((log) => log.entityId === entityId);
  if (riskLevel) filtered = filtered.filter((log) => log.riskLevel === riskLevel);
  if (status) filtered = filtered.filter((log) => log.status === status);
  if (fromDate) filtered = filtered.filter((log) => new Date(log.timestamp) >= new Date(fromDate));
  if (toDate) filtered = filtered.filter((log) => new Date(log.timestamp) <= new Date(toDate));

  return filtered;
};

// GET /api/audit/logs
app.get('/api/audit/logs', authenticateToken, (req, res) => {
  const {
    action,
    userId,
    entityType,
    entityId,
    fromDate,
    toDate,
    riskLevel,
    status,
    page = 1,
    pageSize = 50,
  } = req.query;

  let filtered = [...AUDIT_LOGS];
  
  if (action) filtered = filtered.filter((log) => log.action === action);
  if (userId) filtered = filtered.filter((log) => log.user.id === userId);
  if (entityType) filtered = filtered.filter((log) => log.entityType === entityType);
  if (entityId) filtered = filtered.filter((log) => log.entityId === entityId);
  if (riskLevel) filtered = filtered.filter((log) => log.riskLevel === riskLevel);
  if (status) filtered = filtered.filter((log) => log.status === status);
  if (fromDate) filtered = filtered.filter((log) => new Date(log.timestamp) >= new Date(fromDate));
  if (toDate) filtered = filtered.filter((log) => new Date(log.timestamp) <= new Date(toDate));

  const p = Math.max(parseInt(page, 10) || 1, 1);
  const ps = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 100);
  const start = (p - 1) * ps;
  const paged = filtered.slice(start, start + ps);

  return res.json({
    success: true,
    logs: paged,
    pagination: {
      page: p,
      pageSize: ps,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / ps) || 1,
    },
    timestamp: new Date().toISOString(),
  });
});

// POST /api/audit/archive
// Archives logs (moves from AUDIT_LOGS to ARCHIVED_LOGS)
app.post('/api/audit/archive', authenticateToken, (req, res) => {
  const { logType, filters = {}, dryRun = false } = req.body || {};

  if (!logType || !['high-risk', 'normal'].includes(logType)) {
    return res.status(400).json({
      success: false,
      error: "Invalid or missing logType. Expected 'high-risk' or 'normal'.",
      timestamp: new Date().toISOString(),
    });
  }

  // Apply base filters
  let candidates = filterAuditLogs(AUDIT_LOGS, filters);

  // Apply logType-specific filters
  if (logType === 'high-risk') {
    candidates = candidates.filter(
      (log) => log.riskLevel === 'HIGH' || log.riskLevel === 'CRITICAL' || log.requiresReview === true,
    );
  } else {
    // normal logs
    candidates = candidates.filter(
      (log) => (log.riskLevel !== 'HIGH' && log.riskLevel !== 'CRITICAL') && log.requiresReview !== true,
    );
  }

  if (dryRun) {
    return res.json({
      success: true,
      message: 'Dry run completed',
      wouldArchive: candidates.length,
      logType,
      filters,
      timestamp: new Date().toISOString(),
    });
  }

  const now = new Date().toISOString();
  const archivedBy = req.user?.email || req.user?.username || 'system';

  const archiveEntries = candidates.map((log) => ({
    ...log,
    original_id: log.id,
    archived_at: now,
    archived_by: archivedBy,
    archive_reason: `Archived by ${archivedBy} - ${logType} logs`,
  }));

  ARCHIVED_LOGS = ARCHIVED_LOGS.concat(archiveEntries);

  const archivedIds = new Set(candidates.map((log) => log.id));
  AUDIT_LOGS = AUDIT_LOGS.filter((log) => !archivedIds.has(log.id));

  return res.json({
    success: true,
    message: `Successfully archived ${archiveEntries.length} ${logType} logs`,
    archived: archiveEntries.length,
    deleted: archiveEntries.length,
    logType,
    filters,
    archivedBy,
    timestamp: now,
  });
});

// DELETE /api/audit/delete
// Permanently deletes logs from AUDIT_LOGS
app.delete('/api/audit/delete', authenticateToken, (req, res) => {
  const { logType, filters = {}, confirm = false, dryRun = false } = req.body || {};

  if (!logType || !['high-risk', 'normal'].includes(logType)) {
    return res.status(400).json({
      success: false,
      error: "Invalid or missing logType. Expected 'high-risk' or 'normal'.",
      timestamp: new Date().toISOString(),
    });
  }

  if (!confirm && !dryRun) {
    return res.status(400).json({
      success: false,
      error:
        'Permanent deletion requires explicit confirmation. Set confirm: true in request body.',
      warning: 'This action cannot be undone!',
      timestamp: new Date().toISOString(),
    });
  }

  let candidates = filterAuditLogs(AUDIT_LOGS, filters);

  if (logType === 'high-risk') {
    candidates = candidates.filter(
      (log) => log.riskLevel === 'HIGH' || log.riskLevel === 'CRITICAL' || log.requiresReview === true,
    );
  } else {
    candidates = candidates.filter(
      (log) => (log.riskLevel !== 'HIGH' && log.riskLevel !== 'CRITICAL') && log.requiresReview !== true,
    );
  }

  if (dryRun) {
    return res.json({
      success: true,
      message: 'Dry run completed',
      wouldDelete: candidates.length,
      logType,
      filters,
      warning: 'This action cannot be undone!',
      timestamp: new Date().toISOString(),
    });
  }

  const deleteIds = new Set(candidates.map((log) => log.id));
  AUDIT_LOGS = AUDIT_LOGS.filter((log) => !deleteIds.has(log.id));

  const now = new Date().toISOString();

  return res.json({
    success: true,
    message: `Successfully deleted ${candidates.length} ${logType} logs permanently`,
    deleted: candidates.length,
    logType,
    filters,
    warning: 'This action cannot be undone!',
    timestamp: now,
  });
});

// GET /api/audit/archived
// Retrieve archived logs with pagination
app.get('/api/audit/archived', authenticateToken, (req, res) => {
  const {
    logType,
    fromDate,
    toDate,
    archivedBy,
    page = 1,
    pageSize = 50,
  } = req.query;

  let filtered = [...ARCHIVED_LOGS];

  if (logType === 'high-risk') {
    filtered = filtered.filter(
      (log) => log.riskLevel === 'HIGH' || log.riskLevel === 'CRITICAL' || log.requiresReview === true,
    );
  } else if (logType === 'normal') {
    filtered = filtered.filter(
      (log) => (log.riskLevel !== 'HIGH' && log.riskLevel !== 'CRITICAL') && log.requiresReview !== true,
    );
  }

  if (fromDate) filtered = filtered.filter((log) => new Date(log.archived_at) >= new Date(fromDate));
  if (toDate) filtered = filtered.filter((log) => new Date(log.archived_at) <= new Date(toDate));
  if (archivedBy) filtered = filtered.filter((log) => log.archived_by === archivedBy);

  const p = Math.max(parseInt(page, 10) || 1, 1);
  const ps = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 1000);
  const start = (p - 1) * ps;
  const paged = filtered.slice(start, start + ps);

  return res.json({
    success: true,
    data: paged,
    pagination: {
      total: filtered.length,
      page: p,
      pageSize: ps,
      totalPages: Math.ceil(filtered.length / ps) || 1,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/audit/trail/:entityType/:entityId
app.get('/api/audit/trail/:entityType/:entityId', authenticateToken, (req, res) => {
  const { entityType, entityId } = req.params;
  
  const trail = AUDIT_LOGS
    .filter((log) => log.entityType === entityType && log.entityId === entityId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return res.json({
    success: true,
    trail,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/audit/high-risk
app.get('/api/audit/high-risk', authenticateToken, (req, res) => {
  const { riskLevel = 'HIGH', fromDate, toDate, page = 1, pageSize = 50 } = req.query;
  
  let filtered = AUDIT_LOGS.filter(
    (log) => log.riskLevel === riskLevel || log.riskLevel === 'CRITICAL'
  );
  
  if (fromDate) filtered = filtered.filter((log) => new Date(log.timestamp) >= new Date(fromDate));
  if (toDate) filtered = filtered.filter((log) => new Date(log.timestamp) <= new Date(toDate));

  const p = Math.max(parseInt(page, 10) || 1, 1);
  const ps = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 100);
  const start = (p - 1) * ps;
  const paged = filtered.slice(start, start + ps);

  return res.json({
    success: true,
    transactions: paged,
    pagination: {
      page: p,
      pageSize: ps,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / ps) || 1,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/audit/statistics
app.get('/api/audit/statistics', authenticateToken, (req, res) => {
  const { fromDate, toDate } = req.query;
  
  let filtered = [...AUDIT_LOGS];
  if (fromDate) filtered = filtered.filter((log) => new Date(log.timestamp) >= new Date(fromDate));
  if (toDate) filtered = filtered.filter((log) => new Date(log.timestamp) <= new Date(toDate));

  const stats = {
    totalLogs: filtered.length,
    byAction: {},
    byStatus: {},
    byRiskLevel: {},
    byEntityType: {},
    byUser: {},
    averageExecutionTime: 0,
    totalExecutionTime: 0,
    timeline: [],
  };

  filtered.forEach((log) => {
    stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
    stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
    stats.byRiskLevel[log.riskLevel] = (stats.byRiskLevel[log.riskLevel] || 0) + 1;
    stats.byEntityType[log.entityType] = (stats.byEntityType[log.entityType] || 0) + 1;
    stats.byUser[log.user.id] = (stats.byUser[log.user.id] || 0) + 1;
    stats.totalExecutionTime += log.executionTime;
  });

  stats.averageExecutionTime = filtered.length > 0 ? stats.totalExecutionTime / filtered.length : 0;

  // Generate timeline (last 30 days)
  const timeline = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = filtered.filter((log) => log.timestamp.startsWith(dateStr)).length;
    timeline.push({ date: dateStr, count });
  }
  stats.timeline = timeline;

  return res.json({
    success: true,
    statistics: stats,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/audit/user/:userId
app.get('/api/audit/user/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;
  const { fromDate, toDate } = req.query;
  
  let filtered = AUDIT_LOGS.filter((log) => log.user.id === userId);
  
  if (fromDate) filtered = filtered.filter((log) => new Date(log.timestamp) >= new Date(fromDate));
  if (toDate) filtered = filtered.filter((log) => new Date(log.timestamp) <= new Date(toDate));

  const activity = {
    userId,
    totalActions: filtered.length,
    byAction: {},
    byEntityType: {},
    byStatus: {},
    byRiskLevel: {},
    sessions: [],
    devices: [],
    locations: [],
    timeline: filtered.map((log) => ({
      timestamp: log.timestamp,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      status: log.status,
      riskLevel: log.riskLevel,
    })),
  };

  filtered.forEach((log) => {
    activity.byAction[log.action] = (activity.byAction[log.action] || 0) + 1;
    activity.byEntityType[log.entityType] = (activity.byEntityType[log.entityType] || 0) + 1;
    activity.byStatus[log.status] = (activity.byStatus[log.status] || 0) + 1;
    activity.byRiskLevel[log.riskLevel] = (activity.byRiskLevel[log.riskLevel] || 0) + 1;
  });

  return res.json({
    success: true,
    activity,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/audit/search
app.post('/api/audit/search', authenticateToken, (req, res) => {
  const { query, filters = {} } = req.body;
  
  let filtered = [...AUDIT_LOGS];
  
  if (query) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(
      (log) =>
        log.user.name.toLowerCase().includes(searchTerm) ||
        log.action.toLowerCase().includes(searchTerm) ||
        log.entityType.toLowerCase().includes(searchTerm) ||
        log.entityId.toLowerCase().includes(searchTerm) ||
        (log.details?.description || '').toLowerCase().includes(searchTerm)
    );
  }

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      filtered = filtered.filter((log) => log[key] === filters[key]);
    }
  });

  const page = filters.page || 1;
  const pageSize = filters.pageSize || 50;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return res.json({
    success: true,
    logs: paged,
    pagination: {
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/audit/transaction/:transactionId
app.get('/api/audit/transaction/:transactionId', authenticateToken, (req, res) => {
  const { transactionId } = req.params;
  
  const transaction = AUDIT_LOGS.find((log) => log.blockchainTxId === transactionId || log.id === transactionId);
  
  if (!transaction) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found',
      timestamp: new Date().toISOString(),
    });
  }

  return res.json({
    success: true,
    transaction,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/auth/users (Note: Use /api/auth/register for new staff registration)
app.post('/api/auth/users', authenticateToken, (req, res) => {
  const { username, email, role, department, staffId } = req.body;

  // Validation
  if (!username || !email || !role || !department) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: username, email, role, department',
      timestamp: new Date().toISOString(),
    });
  }

  // Check if username already exists
  if (USERS.find((u) => u.username === username)) {
    return res.status(409).json({
      success: false,
      error: 'Username already exists',
      timestamp: new Date().toISOString(),
    });
  }

  // Check if email already exists
  if (USERS.find((u) => u.email === email)) {
    return res.status(409).json({
      success: false,
      error: 'Email already exists',
      timestamp: new Date().toISOString(),
    });
  }

  // Generate staffId if not provided
  const finalStaffId = staffId || `STAFF${String(USERS.length + 1).padStart(3, '0')}`;

  // Create new user
  const newUser = {
    id: USERS.length + 1,
    username,
    staffId: finalStaffId,
    email,
    role,
    department,
    is_active: true,
    last_login: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  USERS.push(newUser);

  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/auth/users
app.get('/api/auth/users', authenticateToken, (req, res) => {
  console.log('✅ GET /api/auth/users - Request received');
  console.log('Query params:', req.query);
  console.log('Auth header:', req.headers['authorization'] ? 'Present' : 'Missing');
  
  const { role, department, isActive, limit = 50, offset = 0 } = req.query;
  
  let filtered = [...USERS];
  
  if (role) filtered = filtered.filter((u) => u.role === role);
  if (department) filtered = filtered.filter((u) => u.department === department);
  if (isActive !== undefined) {
    const active = isActive === 'true';
    filtered = filtered.filter((u) => u.is_active === active);
  }

  const lim = Math.max(parseInt(limit, 10) || 50, 1);
  const off = Math.max(parseInt(offset, 10) || 0, 0);
  const paged = filtered.slice(off, off + lim);

  console.log(`Returning ${paged.length} users out of ${filtered.length} total`);

  return res.json({
    success: true,
    data: paged,
    pagination: {
      limit: lim,
      offset: off,
      count: filtered.length,
      total: filtered.length,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/auth/users/:username
app.get('/api/auth/users/:username', authenticateToken, (req, res) => {
  const { username } = req.params;
  const user = USERS.find((u) => u.username === username);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      timestamp: new Date().toISOString(),
    });
  }

  return res.json({
    success: true,
    data: user,
    timestamp: new Date().toISOString(),
  });
});

// PUT /api/auth/users/:username
app.put('/api/auth/users/:username', authenticateToken, (req, res) => {
  const { username } = req.params;
  const updates = req.body;
  
  const userIndex = USERS.findIndex((u) => u.username === username);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      timestamp: new Date().toISOString(),
    });
  }

  USERS[userIndex] = {
    ...USERS[userIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return res.json({
    success: true,
    message: 'User updated successfully',
    data: USERS[userIndex],
    timestamp: new Date().toISOString(),
  });
});

// PUT /api/auth/users/:username/activate
app.put('/api/auth/users/:username/activate', authenticateToken, (req, res) => {
  const { username } = req.params;
  const userIndex = USERS.findIndex((u) => u.username === username);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      timestamp: new Date().toISOString(),
    });
  }

  USERS[userIndex].is_active = true;
  USERS[userIndex].updated_at = new Date().toISOString();

  return res.json({
    success: true,
    message: 'User activated successfully',
    data: {
      username: USERS[userIndex].username,
      is_active: true,
    },
    timestamp: new Date().toISOString(),
  });
});

// PUT /api/auth/users/:username/deactivate
app.put('/api/auth/users/:username/deactivate', authenticateToken, (req, res) => {
  const { username } = req.params;
  const userIndex = USERS.findIndex((u) => u.username === username);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      timestamp: new Date().toISOString(),
    });
  }

  USERS[userIndex].is_active = false;
  USERS[userIndex].updated_at = new Date().toISOString();

  return res.json({
    success: true,
    message: 'User deactivated successfully',
    data: {
      username: USERS[userIndex].username,
      is_active: false,
    },
    timestamp: new Date().toISOString(),
  });
});

// DELETE /api/auth/users/:username
app.delete('/api/auth/users/:username', authenticateToken, (req, res) => {
  const { username } = req.params;
  const userIndex = USERS.findIndex((u) => u.username === username);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      timestamp: new Date().toISOString(),
    });
  }

  USERS.splice(userIndex, 1);

  return res.json({
    success: true,
    message: 'User deleted successfully',
    data: {
      username,
    },
    timestamp: new Date().toISOString(),
  });
});

// ===================== DATA INTEGRITY VERIFICATION =====================
// Mock blockchain staff records (simulating blockchain data)
const BLOCKCHAIN_STAFF = {
  'STAFF001': {
    staffId: 'STAFF001',
    name: 'Admin User',
    email: 'admin@tra.go.tz',
    role: 'admin',
    department: 'Administration',
    createdAt: USERS[0].created_at,
  },
  'STAFF002': {
    staffId: 'STAFF002',
    name: 'John Doe',
    email: 'john.doe@tra.go.tz',
    role: 'officer',
    department: 'Tax Collection',
    createdAt: USERS[1].created_at,
  },
  'STAFF003': {
    staffId: 'STAFF003',
    name: 'Jane Doe',
    email: 'jane.doe@tra.go.tz',
    role: 'auditor',
    department: 'Compliance',
    createdAt: USERS[2].created_at,
  },
  'STAFF004': {
    staffId: 'STAFF004',
    name: 'Bob Smith',
    email: 'bob.smith@tra.go.tz',
    role: 'officer',
    department: 'Tax Collection',
    createdAt: USERS[3].created_at,
  },
};

// GET /api/verify/staff/:staffId
app.get('/api/verify/staff/:staffId', authenticateToken, (req, res) => {
  const { staffId } = req.params;
  const user = USERS.find((u) => u.staffId === staffId);
  const blockchain = BLOCKCHAIN_STAFF[staffId];

  if (!user && !blockchain) {
    return res.status(404).json({
      success: false,
      error: 'Staff record not found',
      timestamp: new Date().toISOString(),
    });
  }

  if (!blockchain) {
    return res.json({
      success: false,
      message: 'Staff record not found in blockchain',
      data: {
        verified: false,
        staffId,
        database: user || null,
        blockchain: null,
        discrepancies: user ? ['Record exists in database but not in blockchain'] : null,
      },
      timestamp: new Date().toISOString(),
    });
  }

  if (!user) {
    return res.json({
      success: false,
      message: 'Data discrepancies detected',
      warning: 'Database and blockchain records do not match',
      data: {
        verified: false,
        staffId,
        database: null,
        blockchain,
        discrepancies: ['Record exists in blockchain but not in database'],
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Compare fields
  const discrepancies = [];
  if (user.email !== blockchain.email) {
    discrepancies.push({
      field: 'email',
      database: user.email,
      blockchain: blockchain.email,
    });
  }
  if (user.role !== blockchain.role) {
    discrepancies.push({
      field: 'role',
      database: user.role,
      blockchain: blockchain.role,
    });
  }
  if (user.department !== blockchain.department) {
    discrepancies.push({
      field: 'department',
      database: user.department,
      blockchain: blockchain.department,
    });
  }

  const verified = discrepancies.length === 0;

  return res.json({
    success: verified,
    message: verified ? 'Staff record verified successfully' : 'Data discrepancies detected',
    warning: verified ? null : 'Database and blockchain records do not match',
    data: {
      verified,
      staffId,
      database: {
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        is_active: user.is_active,
      },
      blockchain,
      discrepancies: discrepancies.length > 0 ? discrepancies : null,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/verify/user/:username
app.get('/api/verify/user/:username', authenticateToken, (req, res) => {
  const { username } = req.params;
  const user = USERS.find((u) => u.username === username);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      timestamp: new Date().toISOString(),
    });
  }

  if (!user.staffId) {
    return res.json({
      success: false,
      message: 'User has no staffId linked to blockchain',
      data: {
        verified: false,
        staffId: null,
        database: user,
        blockchain: null,
        discrepancies: ['User not registered on blockchain'],
      },
      timestamp: new Date().toISOString(),
    });
  }

  const blockchain = BLOCKCHAIN_STAFF[user.staffId];
  if (!blockchain) {
    return res.json({
      success: false,
      message: 'Staff record not found in blockchain',
      data: {
        verified: false,
        staffId: user.staffId,
        database: user,
        blockchain: null,
        discrepancies: ['Staff ID exists but not found in blockchain'],
      },
      timestamp: new Date().toISOString(),
    });
  }

  const discrepancies = [];
  if (user.email !== blockchain.email) {
    discrepancies.push({
      field: 'email',
      database: user.email,
      blockchain: blockchain.email,
    });
  }
  if (user.role !== blockchain.role) {
    discrepancies.push({
      field: 'role',
      database: user.role,
      blockchain: blockchain.role,
    });
  }
  if (user.department !== blockchain.department) {
    discrepancies.push({
      field: 'department',
      database: user.department,
      blockchain: blockchain.department,
    });
  }

  const verified = discrepancies.length === 0;

  return res.json({
    success: verified,
    message: verified ? 'User record verified successfully' : 'Data discrepancies detected',
    data: {
      verified,
      staffId: user.staffId,
      database: {
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      blockchain,
      discrepancies: discrepancies.length > 0 ? discrepancies : null,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/verify/all
app.get('/api/verify/all', authenticateToken, (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  const lim = Math.max(parseInt(limit, 10) || 100, 1);
  const off = Math.max(parseInt(offset, 10) || 0, 0);
  
  const usersWithStaffId = USERS.filter((u) => u.staffId);
  const paged = usersWithStaffId.slice(off, off + lim);

  const details = paged.map((user) => {
    const blockchain = BLOCKCHAIN_STAFF[user.staffId];
    if (!blockchain) {
      return {
        verified: false,
        staffId: user.staffId,
        database: user,
        blockchain: null,
        discrepancies: ['Not found in blockchain'],
      };
    }

    const discrepancies = [];
    if (user.email !== blockchain.email) {
      discrepancies.push({
        field: 'email',
        database: user.email,
        blockchain: blockchain.email,
      });
    }
    if (user.role !== blockchain.role) {
      discrepancies.push({
        field: 'role',
        database: user.role,
        blockchain: blockchain.role,
      });
    }
    if (user.department !== blockchain.department) {
      discrepancies.push({
        field: 'department',
        database: user.department,
        blockchain: blockchain.department,
      });
    }

    return {
      verified: discrepancies.length === 0,
      staffId: user.staffId,
      database: user,
      blockchain,
      discrepancies: discrepancies.length > 0 ? discrepancies : null,
    };
  });

  const verified = details.filter((d) => d.verified).length;
  const failed = details.filter((d) => !d.verified).length;
  const discrepancies = details.filter((d) => d.discrepancies && d.discrepancies.length > 0).length;

  return res.json({
    success: true,
    message: 'Verification completed',
    data: {
      total: paged.length,
      verified,
      failed,
      discrepancies,
      details,
    },
    summary: {
      total: paged.length,
      verified,
      failed,
      discrepancies,
      integrity: paged.length > 0 ? `${((verified / paged.length) * 100).toFixed(2)}%` : '0%',
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/verify/staff/:staffId/history
app.get('/api/verify/staff/:staffId/history', authenticateToken, (req, res) => {
  const { staffId } = req.params;
  const blockchain = BLOCKCHAIN_STAFF[staffId];
  
  if (!blockchain) {
    return res.status(404).json({
      success: false,
      error: 'Staff record not found in blockchain',
      timestamp: new Date().toISOString(),
    });
  }

  // Mock transaction history
  const history = [
    {
      txId: `tx-${staffId}-${Date.now()}`,
      timestamp: blockchain.createdAt,
      action: 'createStaff',
      details: blockchain,
    },
  ];

  return res.json({
    success: true,
    message: 'Transaction history retrieved successfully',
    data: {
      success: true,
      staffId,
      history,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/verify/integrity
app.get('/api/verify/integrity', authenticateToken, (req, res) => {
  const usersWithStaffId = USERS.filter((u) => u.staffId);
  const activeUsers = USERS.filter((u) => u.is_active);

  return res.json({
    success: true,
    message: 'Data integrity report generated',
    data: {
      database: {
        totalUsers: USERS.length,
        usersWithStaffId: usersWithStaffId.length,
        activeUsers: activeUsers.length,
      },
      blockchain: {
        totalStaff: Object.keys(BLOCKCHAIN_STAFF).length,
      },
      verification: {
        canVerify: usersWithStaffId.length,
        needsVerification: usersWithStaffId.length,
      },
    },
    recommendation: 'Run /api/verify/all to perform full verification',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler (must be last)
app.use((req, res) => {
  console.log(`❌ 404 - ${req.method} ${req.originalUrl}`);
  console.log('Request headers:', req.headers);
  console.log('Available routes:', [
    'GET /api/health',
    'POST /api/auth/register',
    'POST /api/auth/login',
    'GET /api/taxpayers',
    'POST /api/taxpayers/register',
    'PUT /api/taxpayers/:taxpayerId',
    'GET /api/vat/transactions',
    'GET /api/audit/logs',
    'GET /api/audit/trail/:entityType/:entityId',
    'GET /api/audit/high-risk',
    'GET /api/audit/statistics',
    'GET /api/audit/user/:userId',
    'POST /api/audit/search',
    'GET /api/audit/transaction/:transactionId',
    'POST /api/auth/users',
    'GET /api/auth/users',
    'GET /api/auth/users/:username',
    'PUT /api/auth/users/:username',
    'PUT /api/auth/users/:username/activate',
    'PUT /api/auth/users/:username/deactivate',
    'DELETE /api/auth/users/:username',
    'GET /api/verify/staff/:staffId',
    'GET /api/verify/user/:username',
    'GET /api/verify/all',
    'GET /api/verify/staff/:staffId/history',
    'GET /api/verify/integrity',
  ]);
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    context: 'NotFound',
    requestedMethod: req.method,
    requestedUrl: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TRA Mock API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 All endpoints require Authorization: Bearer <token>`);
});
