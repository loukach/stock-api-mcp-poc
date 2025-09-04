#!/usr/bin/env node

const fetch = require('node-fetch');

async function debugPriceFiltering() {
  const API_KEY = process.env.STOCK_API_KEY || 'your-api-key-here';
  const BASE_URL = 'https://stock-api.dealerk.com/it';
  
  console.log('=== Testing Stock API Price Filtering ===\n');
  
  // Test different price filter approaches
  const tests = [
    { name: 'No filters', url: `${BASE_URL}/${API_KEY}/classified/search?limit=5` },
    { name: 'maxPrice=20000', url: `${BASE_URL}/${API_KEY}/classified/search?maxPrice=20000&limit=5` },
    { name: 'maxPrice=15000', url: `${BASE_URL}/${API_KEY}/classified/search?maxPrice=15000&limit=5` },
    { name: 'price_to=20000', url: `${BASE_URL}/${API_KEY}/classified/search?price_to=20000&limit=5` },
    { name: 'priceMax=20000', url: `${BASE_URL}/${API_KEY}/classified/search?priceMax=20000&limit=5` },
    { name: 'condition=USED only', url: `${BASE_URL}/${API_KEY}/classified/search?condition=USED&limit=10` },
  ];
  
  for (const test of tests) {
    console.log(`--- ${test.name} ---`);
    console.log(`URL: ${test.url}`);
    
    try {
      const response = await fetch(test.url);
      
      if (response.ok) {
        const data = await response.json();
        const vehicles = data.response?.promoResults || [];
        
        console.log(`Results: ${vehicles.length}`);
        console.log(`Total found: ${data.response?.numResultFound || 'unknown'}`);
        
        if (vehicles.length > 0) {
          console.log('Prices found:');
          vehicles.forEach((v, i) => {
            console.log(`  ${i+1}. ${v.make} ${v.model} - €${v.price} (${v.type})`);
          });
        }
        
        // Check facet results for price distribution
        if (data.response?.facetResults) {
          console.log(`Available makes: ${data.response.facetResults.make?.length || 0}`);
          console.log(`Available types: ${JSON.stringify(data.response.facetResults.type || [])}`);
        }
      } else {
        console.log(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Network error: ${error.message}`);
    }
    
    console.log('');
  }
}

debugPriceFiltering().catch(console.error);