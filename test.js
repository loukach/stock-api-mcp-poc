#!/usr/bin/env node

// Quick test script for Stock API MCP
const { spawn } = require('child_process');

console.log('Testing Stock API MCP Server...\n');

// Test 1: Direct API call
async function testDirectAPI() {
  console.log('=== Test 1: Direct Stock API Call ===');
  
  const fetch = require('node-fetch');
  const API_KEY = process.env.STOCK_API_KEY || 'your-api-key-here';
  const COUNTRY = 'it';
  const BASE_URL = 'https://stock-api.dealerk.com';
  
  try {
    const url = `${BASE_URL}/${COUNTRY}/${API_KEY}/classified/search?limit=3`;
    console.log(`Calling: ${url}`);
    
    const response = await fetch(url);
    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Response data keys: ${Object.keys(data)}`);
      console.log(`Results count: ${data.results ? data.results.length : 'no results field'}`);
      
      if (data.results && data.results[0]) {
        console.log(`First vehicle: ${JSON.stringify(data.results[0], null, 2)}`);
      }
    } else {
      console.log(`API Error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.log(`Error body: ${text.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`Network error: ${error.message}`);
  }
  
  console.log('\n');
}

// Test 2: MCP Server startup
async function testMCPStartup() {
  console.log('=== Test 2: MCP Server Startup ===');
  
  return new Promise((resolve) => {
    const child = spawn('node', ['src/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let startupComplete = false;
    
    child.stdout.on('data', (data) => {
      output += data.toString();
      console.log(data.toString().trim());
      
      if (data.toString().includes('Stock API MCP Server started successfully')) {
        startupComplete = true;
        setTimeout(() => {
          child.kill();
          resolve(startupComplete);
        }, 1000);
      }
    });
    
    child.stderr.on('data', (data) => {
      console.error('STDERR:', data.toString().trim());
    });
    
    child.on('close', (code) => {
      console.log(`Server exited with code: ${code}`);
      if (!startupComplete) {
        resolve(false);
      }
    });
    
    // Timeout after 5 seconds
    setTimeout(() => {
      if (!startupComplete) {
        child.kill();
        console.log('Server startup timed out');
        resolve(false);
      }
    }, 5000);
  });
}

// Run tests
async function runAllTests() {
  await testDirectAPI();
  
  const mcpStarted = await testMCPStartup();
  console.log(`\nMCP Server startup: ${mcpStarted ? 'SUCCESS' : 'FAILED'}\n`);
  
  console.log('=== Test Summary ===');
  console.log('1. Direct API test: Check output above');
  console.log(`2. MCP server startup: ${mcpStarted ? 'PASSED' : 'FAILED'}`);
  console.log('\nTo test with MCP Inspector:');
  console.log('npx @modelcontextprotocol/inspector src/index.js');
}

runAllTests().catch(console.error);