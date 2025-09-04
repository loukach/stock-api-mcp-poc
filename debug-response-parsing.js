#!/usr/bin/env node

const fetch = require('node-fetch');

async function debugResponseParsing() {
  const API_KEY = process.env.STOCK_API_KEY || 'your-api-key-here';
  const BASE_URL = 'https://stock-api.dealerk.com/it';
  
  // Simulate the same call that was failing
  const url = `${BASE_URL}/${API_KEY}/classified/search?condition=USED&maxPrice=20000&limit=15`;
  
  console.log('=== Debugging MCP Response Parsing ===');
  console.log(`URL: ${url}\n`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('=== API Response Structure ===');
    console.log(`Total found: ${data.response?.numResultFound}`);
    console.log(`Response keys: ${Object.keys(data)}`);
    console.log(`Response.response keys: ${Object.keys(data.response || {})}`);
    
    // Check what's in promoResults
    const promoResults = data.response?.promoResults;
    console.log(`\npromoResults type: ${Array.isArray(promoResults) ? 'Array' : typeof promoResults}`);
    console.log(`promoResults length: ${promoResults?.length || 'undefined'}`);
    
    if (promoResults && promoResults.length > 0) {
      console.log('\n=== First few vehicles in promoResults ===');
      promoResults.slice(0, 5).forEach((vehicle, i) => {
        console.log(`${i+1}. ${vehicle.make} ${vehicle.model} - €${vehicle.price} (${vehicle.type}) [ID: ${vehicle.vehicleId}]`);
      });
    } else {
      console.log('\n❌ promoResults is empty or undefined!');
      
      // Check for other possible result arrays
      console.log('\n=== Checking for other result arrays ===');
      const responseKeys = Object.keys(data.response || {});
      responseKeys.forEach(key => {
        const value = data.response[key];
        if (Array.isArray(value)) {
          console.log(`Found array: ${key} (length: ${value.length})`);
          if (value.length > 0 && value[0].make) {
            console.log(`  First item: ${value[0].make} ${value[0].model || 'unknown'}`);
          }
        }
      });
    }
    
    // Simulate our formatVehicleResults function
    console.log('\n=== Testing Our Parsing Logic ===');
    function testFormatVehicleResults(apiResponse) {
      if (!apiResponse || !apiResponse.response || !apiResponse.response.promoResults || !Array.isArray(apiResponse.response.promoResults)) {
        console.log('❌ Our condition failed:');
        console.log(`  apiResponse exists: ${!!apiResponse}`);
        console.log(`  apiResponse.response exists: ${!!apiResponse.response}`);
        console.log(`  apiResponse.response.promoResults exists: ${!!apiResponse.response?.promoResults}`);
        console.log(`  is Array: ${Array.isArray(apiResponse.response?.promoResults)}`);
        return [];
      }
      return apiResponse.response.promoResults;
    }
    
    const testResults = testFormatVehicleResults(data);
    console.log(`Our parsing would return: ${testResults.length} vehicles`);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

debugResponseParsing().catch(console.error);