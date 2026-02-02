// Simple HTTP server for TRA API mock
import http from 'http';
import url from 'url';

const PORT = 3000;

// Mock data
const mockData = {
  compliance: {
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
  revenue: {
    totalRevenue: 4567890000,
    vatRevenue: 2345670000,
    incomeTaxRevenue: 1234560000,
    corporateTaxRevenue: 987660000,
    monthlyGrowth: 12.5,
    quarterlyGrowth: 8.3,
    yearlyGrowth: 15.7,
  },
  blockchain: {
    totalTransactions: 123456,
    totalBlocks: 5678,
    activeNodes: 25,
    averageBlockTime: 2.5,
    networkHashRate: '1.2 TH/s',
    pendingTransactions: 45,
    blockchainSize: '2.3 GB',
  },
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Simple authentication check
const checkAuth = (headers) => {
  const authHeader = headers.authorization;
  return authHeader && authHeader.startsWith('Bearer ');
};

// Create server
const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Health check
  if (path === '/api/health') {
    res.writeHead(200, corsHeaders);
    res.end(
      JSON.stringify({
        success: true,
        message: 'TRA API Server is running',
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  // Mock login
  if (path === '/api/auth/login' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        if (username && password) {
          const mockToken = 'mock-jwt-token-' + Date.now();
          res.writeHead(200, corsHeaders);
          res.end(
            JSON.stringify({
              success: true,
              token: mockToken,
              user: {
                id: 1,
                username: username,
                name: 'TRA Admin User',
                role: 'admin',
              },
              message: 'Login successful',
            }),
          );
        } else {
          res.writeHead(400, corsHeaders);
          res.end(
            JSON.stringify({
              success: false,
              message: 'Username and password are required',
            }),
          );
        }
      } catch (error) {
        res.writeHead(400, corsHeaders);
        res.end(
          JSON.stringify({
            success: false,
            message: 'Invalid JSON',
          }),
        );
      }
    });
    return;
  }

  // Check authentication for protected routes
  if (!checkAuth(req.headers)) {
    res.writeHead(401, corsHeaders);
    res.end(
      JSON.stringify({
        success: false,
        message: 'Access token required',
        context: 'Authentication',
      }),
    );
    return;
  }

  // API endpoints
  if (path === '/api/compliance/dashboard') {
    res.writeHead(200, corsHeaders);
    res.end(
      JSON.stringify({
        success: true,
        data: mockData.compliance,
        blockchainTxId: 'mock-tx-12345',
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  if (path === '/api/reports/revenue/dashboard') {
    const period = parsedUrl.query.period || 'monthly';
    res.writeHead(200, corsHeaders);
    res.end(
      JSON.stringify({
        success: true,
        data: { ...mockData.revenue, period },
        blockchainTxId: 'mock-tx-67890',
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  if (path === '/api/blockchain/stats') {
    res.writeHead(200, corsHeaders);
    res.end(
      JSON.stringify({
        success: true,
        data: mockData.blockchain,
        blockchainTxId: 'mock-tx-11111',
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  if (path === '/api/staff/me') {
    res.writeHead(200, corsHeaders);
    res.end(
      JSON.stringify({
        success: true,
        user: {
          id: 1,
          username: 'admin',
          name: 'TRA Admin User',
          role: 'admin',
          permissions: ['read', 'write', 'admin'],
          lastLogin: new Date().toISOString(),
        },
      }),
    );
    return;
  }

  // 404 for unknown routes
  res.writeHead(404, corsHeaders);
  res.end(
    JSON.stringify({
      success: false,
      message: 'Endpoint not found',
      context: 'NotFound',
      timestamp: new Date().toISOString(),
    }),
  );
});

server.listen(PORT, () => {
  console.log(`🚀 TRA Mock API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 All endpoints require Authorization: Bearer <token>`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
