# Stock API MCP Server Design

## Overview
Minimal MCP server to expose Stock API vehicle search capabilities to AI agents, enabling natural language vehicle queries.

## Core Principles
- **Simplicity**: Focus only on search/read operations
- **Minimal Dependencies**: Just MCP SDK and fetch
- **Direct Integration**: Simple API key authentication
- **AI-Optimized**: Natural language parameter mapping

## Architecture

### Project Structure
```
stock-api-mcp/
├── src/
│   ├── index.js           # MCP server entry
│   ├── api-client.js      # HTTP client with API key
│   └── tools.js           # MCP tool definitions
├── docs/
│   ├── api-endpoints.md   # API documentation
│   └── mcp-design.md      # This file
├── package.json
├── .env                   # API configuration
└── README.md
```

### Configuration
```env
STOCK_API_KEY=YOUR_API_KEY
STOCK_API_COUNTRY=it
STOCK_API_BASE_URL=https://stock-api.dealerk.com
```

## MCP Tools (Minimal Set)

### 1. Primary Search Tools

#### `search_vehicles`
```javascript
{
  name: "search_vehicles",
  description: "Search vehicles with filters",
  parameters: {
    query: "string",      // Natural language query
    make: "string",       // Optional: specific make
    model: "string",      // Optional: specific model
    maxPrice: "number",   // Optional: max price
    minPrice: "number",   // Optional: min price
    fuel: "string",       // Optional: fuel type
    condition: "string",  // Optional: NEW/USED/KM0
    limit: "number"       // Optional: result limit (default 10)
  }
}
```
Maps to: `GET /{country}/{apiKey}/classified/search`

#### `get_vehicle_details`
```javascript
{
  name: "get_vehicle_details",
  description: "Get complete vehicle information",
  parameters: {
    vehicleId: "string"   // Required: vehicle ID
  }
}
```
Maps to: `GET /{country}/{apiKey}/classified/detail`

#### `search_by_trim`
```javascript
{
  name: "search_by_trim",
  description: "Find vehicles grouped by trim/version",
  parameters: {
    make: "string",       // Optional: filter by make
    model: "string"       // Optional: filter by model
  }
}
```
Maps to: `GET /{country}/{apiKey}/trim/search`

### 2. Supporting Tools

#### `get_filter_values`
```javascript
{
  name: "get_filter_values",
  description: "Get available makes, models, and filter options",
  parameters: {
    filterType: "string"  // Optional: "makes", "models", "fuel", etc.
  }
}
```
Maps to: `POST /{country}/{apiKey}/instore/filterValues`

#### `get_suggestions`
```javascript
{
  name: "get_suggestions",
  description: "Get vehicle suggestions for autocomplete",
  parameters: {
    query: "string"       // Partial search term
  }
}
```
Maps to: `GET /{country}/{apiKey}/suggestions/vehicle`

## Implementation Approach

### Phase 1: Core MVP (2-3 hours)
1. Basic MCP server setup
2. API client with key authentication
3. `search_vehicles` tool
4. `get_vehicle_details` tool
5. Basic error handling

### Phase 2: Enhanced Search (1-2 hours)
1. `search_by_trim` tool
2. `get_filter_values` tool
3. Natural language query parsing
4. Response formatting for AI

### Phase 3: Polish (1 hour)
1. `get_suggestions` tool
2. Result caching
3. Documentation
4. Testing

## Key Implementation Details

### API Client
```javascript
class StockAPIClient {
  constructor(apiKey, country = 'it') {
    this.apiKey = apiKey;
    this.country = country;
    this.baseURL = 'https://stock-api.dealerk.com';
  }

  async request(endpoint, params = {}) {
    const url = `${this.baseURL}/${this.country}/${this.apiKey}${endpoint}`;
    // Add query parameters
    // Handle response
    // Format for MCP
  }
}
```

### Natural Language Processing
```javascript
function parseSearchQuery(query) {
  // Extract intent from natural language
  // "BMW SUV under 50000" -> { make: "BMW", bodyType: "SUV", maxPrice: 50000 }
  // Use simple keyword matching, no AI needed
}
```

### Response Formatting
```javascript
function formatVehicleForAI(vehicle) {
  return {
    id: vehicle.id,
    title: `${vehicle.make} ${vehicle.model} ${vehicle.version}`,
    price: vehicle.price,
    year: vehicle.year,
    mileage: vehicle.mileage,
    fuel: vehicle.fuel,
    condition: vehicle.condition,
    summary: generateSummary(vehicle)
  };
}
```

## Usage Examples

### AI Agent Queries
```
User: "Find BMW sedans under 40000 euros"
→ search_vehicles({ make: "BMW", bodyType: "sedan", maxPrice: 40000 })

User: "Show me diesel SUVs"
→ search_vehicles({ fuel: "DIESEL", bodyType: "SUV" })

User: "Get details for vehicle ABC123"
→ get_vehicle_details({ vehicleId: "ABC123" })

User: "What makes are available?"
→ get_filter_values({ filterType: "makes" })
```

## Success Metrics
- ✅ AI can search vehicles naturally
- ✅ Results are concise and relevant
- ✅ Fast response times (<1s)
- ✅ Clear error messages
- ✅ Minimal configuration required

## Not In Scope
- ❌ Vehicle creation/editing
- ❌ Image management
- ❌ User authentication
- ❌ Multi-tenancy
- ❌ Analytics/reporting
- ❌ Financial calculations

## Next Steps
1. Validate API endpoints with actual requests
2. Implement core MVP
3. Test with AI agents
4. Iterate based on usage patterns