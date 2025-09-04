#!/usr/bin/env node

// Import required modules
require('dotenv').config();
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { 
  ListToolsRequestSchema,
  CallToolRequestSchema 
} = require('@modelcontextprotocol/sdk/types.js');
const fetch = require('node-fetch');

// Configuration from environment
const API_KEY = process.env.STOCK_API_KEY;
const COUNTRY = process.env.STOCK_API_COUNTRY || 'it';
const BASE_URL = process.env.STOCK_API_BASE_URL || 'https://stock-api.dealerk.com';

// Create MCP server instance
const server = new Server(
  {
    name: 'stock-api-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Validate configuration
if (!API_KEY) {
  console.error('ERROR: STOCK_API_KEY is required');
  process.exit(1);
}

// Define tools
const tools = [
  {
    name: "search_vehicles", 
    description: "Discover vehicle inventory with comprehensive overview and sample listings. Shows total counts by make, fuel, condition plus representative vehicle examples with refinement suggestions.",
    inputSchema: {
      type: "object",
      properties: {
        query: { 
          type: "string", 
          description: "Natural language search query (e.g., 'BMW diesel under 30000')" 
        },
        make: { 
          type: "string", 
          description: "Vehicle make/brand (e.g., BMW, Fiat, Audi)" 
        },
        fuel: { 
          type: "string", 
          description: "Fuel type: DIESEL, PETROL, ELECTRIC, HYBRID" 
        },
        maxPrice: { 
          type: "number", 
          description: "Maximum price in EUR" 
        },
        minPrice: { 
          type: "number", 
          description: "Minimum price in EUR" 
        },
        condition: { 
          type: "string", 
          description: "Vehicle condition: NEW, USED, KM0" 
        },
        limit: { 
          type: "number", 
          description: "Number of results to return (default 10, max 50)" 
        }
      }
    }
  }
];

// Custom error class for Stock API errors
class StockAPIError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.name = 'StockAPIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// HTTP client for Stock API calls
async function callStockAPI(endpoint, params = {}) {
  const url = `${BASE_URL}/${COUNTRY}/${API_KEY}${endpoint}`;
  const queryString = new URLSearchParams(params).toString();
  const finalUrl = queryString ? `${url}?${queryString}` : url;
  
  console.error(`Calling Stock API: ${finalUrl}`);
  
  try {
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Stock-API-MCP/0.1.0'
      },
      timeout: 10000 // 10 second timeout
    });
    
    if (!response.ok) {
      throw new StockAPIError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        { url: finalUrl }
      );
    }
    
    const data = await response.json();
    console.error(`Stock API response: ${JSON.stringify(data).substring(0, 200)}...`);
    return data;
    
  } catch (error) {
    if (error instanceof StockAPIError) {
      throw error;
    }
    throw new StockAPIError(
      `Network error calling Stock API: ${error.message}`,
      0,
      { url: finalUrl, originalError: error.message }
    );
  }
}

// Map search parameters to Stock API query parameters
function buildSearchParams(args) {
  const params = {};
  
  // Direct parameter mapping
  if (args.make) params.make = args.make.toUpperCase();
  if (args.fuel) params.fuel = args.fuel.toUpperCase();
  if (args.condition) params.condition = args.condition.toUpperCase();
  if (args.minPrice) params.minPrice = args.minPrice;
  
  // Don't send maxPrice to API since it doesn't filter properly - we'll filter client-side
  // if (args.maxPrice) params.maxPrice = args.maxPrice;
  
  // Set higher limit to get more results for client-side filtering
  params.limit = Math.min((args.limit || 10) * 3, 50); // Get 3x requested to allow for filtering
  
  console.error('Mapped search parameters:', params);
  return params;
}

// Format vehicle results for AI consumption - combine all available vehicles
function formatVehicleResults(apiResponse) {
  if (!apiResponse || !apiResponse.response) {
    return [];
  }
  
  // Combine promoResults and searchResults for comprehensive sample
  const promoResults = Array.isArray(apiResponse.response.promoResults) ? apiResponse.response.promoResults : [];
  const searchResults = Array.isArray(apiResponse.response.searchResults) ? apiResponse.response.searchResults : [];
  
  console.error(`Combining results: ${promoResults.length} promo + ${searchResults.length} search`);
  
  // Combine arrays and deduplicate by vehicle ID
  const allVehicles = [...promoResults, ...searchResults];
  const uniqueVehicles = allVehicles.filter((vehicle, index, array) => {
    // Deduplicate by vehicleId or id
    const vehicleId = vehicle.vehicleId || vehicle.id;
    return array.findIndex(v => (v.vehicleId || v.id) === vehicleId) === index;
  });
  
  // Limit to reasonable sample size for discovery approach
  const sampleVehicles = uniqueVehicles.slice(0, 15);
  
  console.error(`Final sample: ${uniqueVehicles.length} unique → ${sampleVehicles.length} shown`);
  
  return sampleVehicles.map(vehicle => {
    const formattedVehicle = {
      id: vehicle.id || vehicle.vehicleId,
      title: `${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.version || ''}`.trim(),
      make: vehicle.make,
      model: vehicle.model,
      version: vehicle.version,
      year: vehicle.year,
      price: vehicle.price ? `€${vehicle.price.toLocaleString()}` : 'Price on request',
      priceNumber: vehicle.price || 0, // Keep numeric price for filtering
      fuel: vehicle.fuel,
      condition: vehicle.condition,
      mileage: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : null,
      transmission: vehicle.transmission,
      summary: generateVehicleSummary(vehicle)
    };
    
    // Remove null/undefined values
    return Object.fromEntries(
      Object.entries(formattedVehicle).filter(([_, value]) => value != null)
    );
  });
}

// Generate a concise summary for each vehicle
function generateVehicleSummary(vehicle) {
  const parts = [];
  
  if (vehicle.year) parts.push(vehicle.year);
  if (vehicle.make) parts.push(vehicle.make);
  if (vehicle.model) parts.push(vehicle.model);
  if (vehicle.fuel) parts.push(vehicle.fuel);
  if (vehicle.mileage) parts.push(`${vehicle.mileage.toLocaleString()}km`);
  if (vehicle.condition && vehicle.condition !== 'USED') parts.push(vehicle.condition);
  
  return parts.join(' • ');
}

// Parse facet results for inventory overview
function parseFacetResults(facetResults) {
  const breakdown = {};
  
  // Parse condition/type facets (USED, NEW, KM0)
  if (facetResults.type && Array.isArray(facetResults.type)) {
    breakdown.conditions = {};
    facetResults.type.forEach(item => {
      breakdown.conditions[item.value] = item.count;
    });
  }
  
  // Parse fuel type facets
  if (facetResults.fuelType && Array.isArray(facetResults.fuelType)) {
    breakdown.fuel_types = {};
    facetResults.fuelType.forEach(item => {
      breakdown.fuel_types[item.value] = item.count;
    });
  }
  
  // Parse make/brand facets
  if (facetResults.make && Array.isArray(facetResults.make)) {
    breakdown.makes = {};
    facetResults.make.forEach(item => {
      breakdown.makes[item.value] = item.count;
    });
  }
  
  // Parse body type facets
  if (facetResults.bodyType && Array.isArray(facetResults.bodyType)) {
    breakdown.body_types = {};
    facetResults.bodyType.forEach(item => {
      breakdown.body_types[item.value] = item.count;
    });
  }
  
  return breakdown;
}

// Generate refinement suggestions based on available inventory
function generateRefinementSuggestions(breakdown, currentFilters = {}) {
  const suggestions = [];
  
  // Suggest high-inventory makes (top 3)
  if (breakdown.makes) {
    const topMakes = Object.entries(breakdown.makes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
      
    topMakes.forEach(([make, count]) => {
      if (count > 5 && !currentFilters.make) {
        suggestions.push(`Try "${make}" for ${count}+ ${make} vehicles`);
      }
    });
  }
  
  // Suggest fuel types with good inventory
  if (breakdown.fuel_types) {
    const fuelOptions = Object.entries(breakdown.fuel_types)
      .filter(([fuel, count]) => count > 10)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
      
    fuelOptions.forEach(([fuel, count]) => {
      if (!currentFilters.fuel) {
        suggestions.push(`Filter by "${fuel}" for ${count} ${fuel.toLowerCase()} vehicles`);
      }
    });
  }
  
  // Suggest body types for high-inventory categories
  if (breakdown.body_types) {
    const topBodyTypes = Object.entries(breakdown.body_types)
      .filter(([type, count]) => count > 10)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
      
    topBodyTypes.forEach(([bodyType, count]) => {
      suggestions.push(`Search "${bodyType}" for ${count} ${bodyType.toLowerCase()} options`);
    });
  }
  
  // Suggest price ranges if no price filter applied
  if (!currentFilters.minPrice && !currentFilters.maxPrice) {
    suggestions.push('Add "under 25000" for budget-friendly options');
    suggestions.push('Add "over 30000" for premium vehicles');
  }
  
  return suggestions.slice(0, 4); // Limit to 4 suggestions
}

// Error handling for server
server.onerror = (error) => {
  console.error('MCP Server Error:', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
};

// Server handlers (basic setup)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    if (name === 'search_vehicles') {
      return await handleSearchVehicles(args);
    }
    
    throw new Error(`Tool "${name}" not implemented`);
  } catch (error) {
    console.error(`Tool ${name} error:`, error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Handle search_vehicles tool
async function handleSearchVehicles(args) {
  try {
    console.error('Handling search_vehicles with args:', args);
    
    // Build search parameters
    const searchParams = buildSearchParams(args);
    
    // Call Stock API
    const apiResponse = await callStockAPI('/classified/search', searchParams);
    
    // Format results
    let formattedResults = formatVehicleResults(apiResponse);
    
    // Apply client-side price filtering (API doesn't filter properly)
    if (args.minPrice || args.maxPrice) {
      const beforeCount = formattedResults.length;
      formattedResults = formattedResults.filter(vehicle => {
        const price = vehicle.priceNumber || 0;
        if (args.minPrice && price < args.minPrice) return false;
        if (args.maxPrice && price > args.maxPrice) return false;
        return true;
      });
      console.error(`Price filtering: ${beforeCount} → ${formattedResults.length} vehicles`);
    }
    
    // Limit results to requested amount
    if (args.limit && formattedResults.length > args.limit) {
      formattedResults = formattedResults.slice(0, args.limit);
    }
    
    // Create discovery-first response
    let responseText = '';
    if (formattedResults.length === 0) {
      responseText = 'No vehicles found matching your criteria.';
    } else {
      // Parse facets for inventory overview
      const facetResults = apiResponse.response?.facetResults || {};
      const breakdown = parseFacetResults(facetResults);
      const total = apiResponse.response?.numResultFound || formattedResults.length;
      
      // Generate refinement suggestions
      const currentFilters = {
        make: args.make,
        fuel: args.fuel,
        minPrice: args.minPrice,
        maxPrice: args.maxPrice
      };
      const suggestions = generateRefinementSuggestions(breakdown, currentFilters);
      
      // Format discovery-first response
      responseText = `📊 INVENTORY OVERVIEW\n`;
      responseText += `Found ${total} vehicles total across all dealers\n\n`;
      
      // Add breakdown sections
      if (breakdown.conditions) {
        const conditionEntries = Object.entries(breakdown.conditions);
        if (conditionEntries.length > 0) {
          responseText += `🏷️ BY CONDITION: `;
          responseText += conditionEntries.map(([cond, count]) => `${cond} (${count})`).join(', ') + '\n';
        }
      }
      
      if (breakdown.fuel_types) {
        const fuelEntries = Object.entries(breakdown.fuel_types);
        if (fuelEntries.length > 0) {
          responseText += `⛽ BY FUEL TYPE: `;
          responseText += fuelEntries.map(([fuel, count]) => `${fuel} (${count})`).join(', ') + '\n';
        }
      }
      
      if (breakdown.makes) {
        const makeEntries = Object.entries(breakdown.makes).slice(0, 8); // Show top 8
        if (makeEntries.length > 0) {
          responseText += `🚗 BY MAKE: `;
          responseText += makeEntries.map(([make, count]) => `${make} (${count})`).join(', ') + '\n';
        }
      }
      
      if (breakdown.body_types) {
        const bodyEntries = Object.entries(breakdown.body_types);
        if (bodyEntries.length > 0) {
          responseText += `🚙 BY BODY TYPE: `;
          responseText += bodyEntries.map(([body, count]) => `${body} (${count})`).join(', ') + '\n';
        }
      }
      
      // Add sample vehicles section
      responseText += `\n📋 SAMPLE VEHICLES (showing ${formattedResults.length} of ${total})\n`;
      formattedResults.forEach((vehicle, index) => {
        responseText += `${index + 1}. ${vehicle.summary}\n`;
        responseText += `   Price: ${vehicle.price}`;
        if (vehicle.id) responseText += ` • ID: ${vehicle.id}`;
        responseText += '\n';
      });
      
      // Add refinement suggestions
      if (suggestions.length > 0) {
        responseText += `\n💡 REFINE YOUR SEARCH\n`;
        suggestions.forEach(suggestion => {
          responseText += `• ${suggestion}\n`;
        });
      }
    }
    
    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };
  } catch (error) {
    if (error instanceof StockAPIError) {
      // Handle different types of API errors with user-friendly messages
      let userMessage = 'Unable to search vehicles at this time.';
      
      if (error.statusCode === 401 || error.statusCode === 403) {
        userMessage = 'Authentication failed. Please check API configuration.';
      } else if (error.statusCode === 404) {
        userMessage = 'Search endpoint not found. Please check API configuration.';
      } else if (error.statusCode >= 500) {
        userMessage = 'Stock API is currently unavailable. Please try again later.';
      } else if (error.statusCode === 0) {
        userMessage = 'Network error: Unable to connect to Stock API.';
      } else {
        userMessage = `Search failed: ${error.message}`;
      }
      
      return {
        content: [
          {
            type: 'text',
            text: userMessage,
          },
        ],
        isError: true,
      };
    }
    
    // Handle other errors
    return {
      content: [
        {
          type: 'text',
          text: `Unexpected error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Stock API MCP Server started successfully');
}

console.error('Stock API MCP Server starting...');
console.error(`API Key (env): ${process.env.STOCK_API_KEY ? process.env.STOCK_API_KEY.substring(0, 8) + '...' : 'NOT SET'}`);
console.error(`API Key (used): ${API_KEY.substring(0, 8)}...`);
console.error(`Country: ${COUNTRY}`);
console.error(`Base URL: ${BASE_URL}`);

// Start the server
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});