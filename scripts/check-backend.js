#!/usr/bin/env node

/**
 * Backend Health Check Script
 * 
 * This script checks if your StockFlowPro backend is running and accessible.
 * Run this script to diagnose connection issues.
 * 
 * Usage: node scripts/check-backend.js
 */

/* eslint-disable no-console */

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:5131';
const ENDPOINTS_TO_CHECK = [
  '/api/health',
  '/api/products',
  '/api/dashboard/stats',
  '/api/auth/login',
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      reject({
        error: error.message,
        code: error.code,
        url: url
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        code: 'TIMEOUT',
        url: url
      });
    });
  });
}

async function checkBackend() {
  console.log('🔍 Checking StockFlowPro Backend...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  for (const endpoint of ENDPOINTS_TO_CHECK) {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      console.log(`⏳ Checking ${endpoint}...`);
      const response = await makeRequest(url);
      
      if (response.status === 200) {
        console.log(`✅ ${endpoint} - OK (${response.status})`);
      } else if (response.status === 401) {
        console.log(`🔐 ${endpoint} - Requires Authentication (${response.status})`);
      } else if (response.status === 404) {
        console.log(`❌ ${endpoint} - Not Found (${response.status})`);
      } else {
        console.log(`⚠️  ${endpoint} - Status: ${response.status}`);
      }
      
      // Show response headers for debugging
      if (response.headers['content-type']) {
        console.log(`   Content-Type: ${response.headers['content-type']}`);
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${endpoint} - Connection Refused (Server not running?)`);
      } else if (error.code === 'TIMEOUT') {
        console.log(`⏰ ${endpoint} - Request Timeout`);
      } else {
        console.log(`❌ ${endpoint} - Error: ${error.error}`);
      }
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('📋 Summary:');
  console.log('- If you see "Connection Refused", your backend server is not running');
  console.log('- If you see "Not Found (404)", the endpoint doesn\'t exist on your backend');
  console.log('- If you see "Requires Authentication (401)", the endpoint exists but needs login');
  console.log('- If you see "OK (200)", the endpoint is working correctly');
  console.log('\n💡 To start your backend server:');
  console.log('1. Navigate to your backend project directory');
  console.log('2. Run: dotnet run (for .NET) or npm start (for Node.js)');
  console.log('3. Ensure it\'s running on port 5131');
}

// Run the check
checkBackend().catch(console.error);