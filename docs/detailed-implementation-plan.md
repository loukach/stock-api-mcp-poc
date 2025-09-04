# Stock API MCP - Detailed Implementation Plan

## Implementation Phases with Tracking

### Phase 0: Project Setup ⏱️ 10 minutes

#### Tasks:
- [x] Create project directory structure
- [x] Initialize npm project with package.json
- [x] Install dependencies (@modelcontextprotocol/sdk, node-fetch@2, dotenv)
- [x] Create .env file with API key
- [x] Create basic README.md

#### Files to Create:
```
stock-api-mcp/
├── package.json
├── .env
├── README.md
└── src/
    └── index.js (empty)
```

#### Verification:
- `npm install` runs without errors
- `.env` contains `STOCK_API_KEY=<replace with your API key>`

---

### Phase 1: Basic MCP Server ⏱️ 30 minutes

#### Tasks:
- [x] Import required MCP SDK modules
- [x] Create MCP server instance with basic config
- [x] Set up environment configuration
- [x] Define server capabilities
- [x] Add basic error handling
- [x] Implement server startup and transport

#### Code Structure to Add:
```javascript
// Core imports
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

// Configuration
const API_KEY = process.env.STOCK_API_KEY;
const COUNTRY = 'it';
const BASE_URL = 'https://stock-api.dealerk.com';

// Server setup with tools capability
const server = new Server({
  name: 'stock-api-mcp',
  version: '0.1.0'
}, {
  capabilities: { tools: {} }
});

// Basic transport setup
```

#### Verification:
- Server starts without errors
- Can connect via MCP Inspector
- Server responds to basic MCP protocol messages

---

### Phase 2: Core Search Tool ⏱️ 45 minutes ✅ COMPLETED

#### Tasks:
- [x] Define `search_vehicles` tool schema
- [x] Implement HTTP client function for API calls
- [x] Create basic query parameter mapping
- [x] Implement result formatting for AI consumption
- [x] Add tool handler registration
- [x] Add basic error handling for API failures
- [x] **ENHANCEMENT**: Implemented discovery-first approach
- [x] **ENHANCEMENT**: Combined promoResults + searchResults (38 vehicles vs 12)
- [x] **ENHANCEMENT**: Added facet parsing for inventory overview
- [x] **ENHANCEMENT**: Added refinement suggestions

#### Tool Schema:
```javascript
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
      make: { type: "string", description: "Vehicle make" },
      fuel: { type: "string", description: "Fuel type (DIESEL, PETROL, ELECTRIC, HYBRID)" },
      maxPrice: { type: "number", description: "Maximum price in EUR" },
      limit: { type: "number", description: "Number of results (default 10)" }
    }
  }
}
```

#### API Integration Functions:
```javascript
async function callStockAPI(endpoint, params = {}) {
  const url = `${BASE_URL}/${COUNTRY}/${API_KEY}${endpoint}`;
  const queryString = new URLSearchParams(params).toString();
  const finalUrl = queryString ? `${url}?${queryString}` : url;
  
  // Implement fetch with error handling
}

function formatVehicleResults(apiResponse) {
  // Transform API response to AI-friendly format
}
```

#### Verification:
- [x] Tool appears in MCP Inspector
- [x] Can execute search with basic parameters
- [x] Returns formatted results with discovery-first approach
- [x] Handles API errors gracefully
- [x] **NEW**: Combines promoResults + searchResults for maximum data
- [x] **NEW**: Shows comprehensive inventory overview with facets
- [x] **NEW**: Provides intelligent refinement suggestions
- [x] **NEW**: Transparent about sample vs total vehicles available

---

### Phase 3: Vehicle Details Tool ⏱️ 30 minutes

#### Tasks:
- [ ] Define `get_vehicle_details` tool schema
- [ ] Implement vehicle details API call
- [ ] Create detailed result formatter
- [ ] Add tool handler registration
- [ ] Test with vehicle IDs from search results

#### Tool Schema:
```javascript
{
  name: "get_vehicle_details",
  description: "Get complete details for a specific vehicle",
  inputSchema: {
    type: "object",
    properties: {
      vehicleId: { 
        type: "string", 
        description: "Vehicle ID from search results",
        required: true 
      }
    },
    required: ["vehicleId"]
  }
}
```

#### Implementation:
```javascript
async function getVehicleDetails(vehicleId) {
  const response = await callStockAPI('/classified/detail', { id: vehicleId });
  return formatVehicleDetails(response);
}

function formatVehicleDetails(vehicle) {
  // Comprehensive formatting with specs, equipment, images
}
```

#### Verification:
- Tool works with vehicle IDs from search
- Returns comprehensive vehicle information
- Handles invalid vehicle IDs gracefully

---

### Phase 4: Manual Testing Setup ⏱️ 15 minutes

#### Tasks:
- [ ] Create test.js file with test scenarios
- [ ] Add direct API testing functions
- [ ] Add MCP tool testing functions
- [ ] Create npm test script
- [ ] Document test cases

#### Test File Structure:
```javascript
// test.js
async function testDirectAPI() {
  // Test Stock API directly with curl equivalent
}

async function testMCPTools() {
  // Test MCP tools programmatically
}

async function testNaturalLanguage() {
  // Test natural language queries
}

// Test scenarios
const testCases = [
  "Show me BMWs",
  "Diesel SUVs under 30000",
  "Cheapest cars available"
];
```

#### Verification:
- `npm test` runs all test scenarios
- Tests pass for basic functionality
- Error cases are handled properly

---

### Phase 5: Natural Language Enhancement ⏱️ 30 minutes

#### Tasks:
- [ ] Implement query parsing function
- [ ] Add price extraction (regex patterns)
- [ ] Add make/model extraction
- [ ] Add fuel type recognition
- [ ] Add body type recognition
- [ ] Integrate parser into search tool
- [ ] Test with natural language queries

#### Parser Implementation:
```javascript
function parseNaturalQuery(query) {
  const params = {};
  const lower = query.toLowerCase();
  
  // Price patterns: "under 30000", "max 25k", "< 20000"
  const pricePatterns = [
    /under (\d+)/,
    /max (\d+)/,
    /<\s*(\d+)/,
    /(\d+)k/
  ];
  
  // Make recognition
  const makes = ['bmw', 'audi', 'fiat', 'volkswagen', 'mercedes', 'ford', 'opel'];
  
  // Fuel type patterns
  const fuelTypes = {
    'diesel': 'DIESEL',
    'petrol': 'PETROL', 
    'gasoline': 'PETROL',
    'electric': 'ELECTRIC',
    'hybrid': 'HYBRID'
  };
  
  // Body type patterns
  const bodyTypes = {
    'suv': 'SUV',
    'sedan': 'SEDAN',
    'hatchback': 'HATCHBACK',
    'wagon': 'WAGON',
    'coupe': 'COUPE'
  };
  
  return params;
}
```

#### Verification:
- Natural language queries work correctly
- Parser extracts parameters accurately
- Combined with API filters properly

---

### Phase 6: Polish & Error Handling ⏱️ 30 minutes

#### Tasks:
- [ ] Add comprehensive error handling
- [ ] Implement request timeout handling
- [ ] Add user-friendly error messages
- [ ] Add basic response caching
- [ ] Add debug logging
- [ ] Update documentation

#### Error Handling:
```javascript
class StockAPIError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

function handleAPIError(error) {
  // Convert technical errors to user-friendly messages
}
```

#### Basic Caching:
```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedResult(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}
```

#### Verification:
- All error cases handled gracefully
- Appropriate error messages returned
- Caching improves response times
- No uncaught exceptions

---

## Implementation Checklist

### Setup Phase
- [ ] Project structure created
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Basic README written

### Core Functionality
- [ ] MCP server running
- [ ] search_vehicles tool working
- [ ] get_vehicle_details tool working
- [ ] API integration stable

### Quality & Testing
- [ ] Manual tests passing
- [ ] Error handling comprehensive
- [ ] Natural language parsing functional
- [ ] Performance acceptable (<2s response)

### Documentation
- [ ] README with quick start
- [ ] API endpoint documentation
- [ ] Tool usage examples
- [ ] Troubleshooting guide

## File Structure (Final)

```
stock-api-mcp/
├── package.json              # Dependencies & scripts
├── .env                      # API configuration  
├── README.md                 # Quick start guide
├── test.js                   # Manual testing
├── docs/                     # Design documentation
│   ├── api-endpoints.md
│   ├── use-cases.md
│   ├── mcp-design.md
│   ├── implementation-plan.md
│   └── detailed-implementation-plan.md
└── src/
    └── index.js              # Complete MCP server (~300 lines)
```

## Success Metrics

### Functional Requirements ✅
- [ ] Can search vehicles with natural language
- [ ] Can retrieve detailed vehicle information
- [ ] Handles errors gracefully
- [ ] Response time under 2 seconds
- [ ] Works with Claude Desktop/MCP clients

### Technical Requirements ✅
- [ ] No runtime errors
- [ ] Proper MCP protocol compliance
- [ ] Clean, readable code
- [ ] Comprehensive error handling
- [ ] Basic caching for performance

### User Experience ✅
- [ ] Natural language queries work intuitively
- [ ] Results are formatted for AI consumption
- [ ] Error messages are helpful
- [ ] Response format is consistent

## Next Steps After POC

### Immediate Improvements (if needed)
1. Add more vehicle makes to parser
2. Implement condition filters (NEW/USED/KM0)
3. Add sorting options (price, year, mileage)
4. Improve result formatting

### Future Enhancements
1. Add `list_makes` and `list_models` tools
2. Implement location-based search
3. Add vehicle comparison functionality
4. Integrate with dealership contact information

## Time Tracking

| Phase | Estimated | Actual | Status |
|-------|-----------|--------|---------|
| Phase 0: Setup | 10 min | 5 min | ✅ |
| Phase 1: MCP Server | 30 min | 15 min | ✅ |
| Phase 2: Search Tool | 45 min | 90 min | ✅ **ENHANCED** |
| Phase 3: Details Tool | 30 min | - | 🔄 Next |
| Phase 4: Testing | 15 min | - | 🔄 Next |
| Phase 5: Natural Language | 30 min | - | 🔄 Next |
| Phase 6: Polish | 30 min | - | 🔄 Next |
| **Total** | **3 hours** | **110 min** | **🚧 In Progress** |

---

*This detailed plan will be used to track progress during implementation phase. Each task can be marked complete and actual times recorded for future estimation improvements.*