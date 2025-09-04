#!/usr/bin/env node

const fetch = require('node-fetch');

async function debugBothKeys() {
  const OLD_KEY = 'old-key-placeholder'; // From your log
  const NEW_KEY = process.env.STOCK_API_KEY || 'your-api-key-here'; // From .env
  const BASE_URL = 'https://stock-api.dealerk.com/it';
  
  console.log('=== Comparing Old vs New API Key ===\n');
  
  const testUrl = '/classified/search?condition=USED&maxPrice=20000&limit=15';
  
  // Test old key
  console.log('--- OLD KEY (from your log) ---');
  console.log(`Key: ${OLD_KEY}`);
  try {
    const oldResponse = await fetch(`${BASE_URL}/${OLD_KEY}${testUrl}`);
    const oldData = await oldResponse.json();
    const oldVehicles = oldData.response?.promoResults || [];
    
    console.log(`Total found: ${oldData.response?.numResultFound}`);
    console.log(`Vehicles returned: ${oldVehicles.length}`);
    if (oldVehicles.length > 0) {
      console.log('Vehicles:');
      oldVehicles.forEach((v, i) => {
        console.log(`  ${i+1}. ${v.make} ${v.model} - €${v.price}`);
      });
    }
  } catch (error) {
    console.log(`Error with old key: ${error.message}`);
  }
  
  console.log('\n--- NEW KEY (from .env) ---');
  console.log(`Key: ${NEW_KEY}`);
  try {
    const newResponse = await fetch(`${BASE_URL}/${NEW_KEY}${testUrl}`);
    const newData = await newResponse.json();
    const newVehicles = newData.response?.promoResults || [];
    
    console.log(`Total found: ${newData.response?.numResultFound}`);
    console.log(`Vehicles returned: ${newVehicles.length}`);
    if (newVehicles.length > 0) {
      console.log('Vehicles:');
      newVehicles.slice(0, 5).forEach((v, i) => {
        console.log(`  ${i+1}. ${v.make} ${v.model} - €${v.price}`);
      });
      if (newVehicles.length > 5) {
        console.log(`  ... and ${newVehicles.length - 5} more`);
      }
    }
  } catch (error) {
    console.log(`Error with new key: ${error.message}`);
  }
}

debugBothKeys().catch(console.error);