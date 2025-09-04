#!/usr/bin/env node

// Direct API test to see what Stock API returns
const fetch = require('node-fetch');

async function testStockAPI() {
  const API_KEY = process.env.STOCK_API_KEY || 'your-api-key-here';
  const COUNTRY = 'it';
  const BASE_URL = 'https://stock-api.dealerk.com';
  
  console.log('Testing Stock API directly...\n');
  
  // Test 1: Basic search with no filters
  console.log('=== Test 1: Basic search (no filters) ===');
  try {
    const url1 = `${BASE_URL}/${COUNTRY}/${API_KEY}/classified/search?limit=5`;
    console.log(`URL: ${url1}`);
    
    const response1 = await fetch(url1);
    console.log(`Status: ${response1.status} ${response1.statusText}`);
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log(`Response keys: ${Object.keys(data1)}`);
      console.log(`Full response: ${JSON.stringify(data1, null, 2)}`);
    } else {
      const error1 = await response1.text();
      console.log(`Error: ${error1}`);
    }
  } catch (error) {
    console.log(`Network error: ${error.message}`);
  }
  
  console.log('\n=== Test 2: Search with filters ===');
  try {
    const url2 = `${BASE_URL}/${COUNTRY}/${API_KEY}/classified/search?limit=5&fuel=DIESEL`;
    console.log(`URL: ${url2}`);
    
    const response2 = await fetch(url2);
    console.log(`Status: ${response2.status} ${response2.statusText}`);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log(`Response keys: ${Object.keys(data2)}`);
      console.log(`Full response: ${JSON.stringify(data2, null, 2)}`);
    } else {
      const error2 = await response2.text();
      console.log(`Error: ${error2}`);
    }
  } catch (error) {
    console.log(`Network error: ${error.message}`);
  }
}

testStockAPI().catch(console.error);