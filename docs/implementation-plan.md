# Stock API MCP - POC Implementation Plan

## Goal
Build a minimal, working MCP server that enables AI agents to search vehicles via Stock API in 2-3 hours.

## Implementation Phases

### Phase 0: Project Setup (10 mins)
```bash
# Create structure
stock-api-mcp/
├── src/
│   └── index.js       # Everything in one file for POC
├── package.json
├── .env
└── test.js           # Quick manual testing
```

**Actions:**
1. Create folder structure
2. Initialize npm project
3. Install only essential dependencies:
   - `@modelcontextprotocol/sdk`
   - `node-fetch@2` (for Node.js compatibility)
   - `dotenv`
4. Create `.env` with API key

### Phase 1: Minimal MCP Server (30 mins)

**Single file `src/index.js` with:**
```javascript
// 1. Basic MCP server setup
const server = new Server({
  name: 'stock-api-mcp',
  version: '0.1.0'
});

// 2. Hardcoded configuration
const API_KEY = process.env.STOCK_API_KEY || 'YOUR_API_KEY';
const COUNTRY = 'it';
const BASE_URL = 'https://stock-api.dealerk.com';

// 3. Single tool: search_vehicles
const tools = [{
  name: "search_vehicles",
  description: "Search vehicles with natural language",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      limit: { type: "number", default: 10 }
    }
  }
}];
```

### Phase 2: Core Search Implementation (45 mins)

**Add to the same file:**
```javascript
// Simple API client function
async function searchVehicles(params) {
  const url = `${BASE_URL}/${COUNTRY}/${API_KEY}/classified/search`;
  
  // Basic query parameter mapping
  const queryParams = new URLSearchParams();
  if (params.query) {
    // Simple keyword extraction
    if (params.query.includes('BMW')) queryParams.append('make', 'BMW');
    if (params.query.includes('diesel')) queryParams.append('fuel', 'DIESEL');
    // Add more simple rules
  }
  
  const response = await fetch(url + '?' + queryParams);
  const data = await response.json();
  
  // Format for AI consumption
  return formatResults(data);
}

// Minimal result formatter
function formatResults(data) {
  return data.vehicles?.slice(0, 10).map(v => ({
    id: v.id,
    title: `${v.make} ${v.model}`,
    price: `€${v.price}`,
    year: v.year,
    fuel: v.fuel,
    mileage: `${v.mileage}km`
  }));
}
```

### Phase 3: Add Second Tool (30 mins)

**Add vehicle details tool:**
```javascript
{
  name: "get_vehicle_details",
  description: "Get full details of a specific vehicle",
  inputSchema: {
    type: "object",
    properties: {
      vehicleId: { type: "string", required: true }
    }
  }
}

async function getVehicleDetails(vehicleId) {
  const url = `${BASE_URL}/${COUNTRY}/${API_KEY}/classified/detail`;
  const response = await fetch(url + '?id=' + vehicleId);
  return await response.json();
}
```

### Phase 4: Testing Setup (15 mins)

**Create `test.js`:**
```javascript
// Quick test script
async function testMCP() {
  // Test search
  console.log('Testing search...');
  const results = await searchVehicles({ query: 'BMW diesel' });
  console.log(results);
  
  // Test details
  if (results[0]) {
    console.log('Testing details...');
    const details = await getVehicleDetails(results[0].id);
    console.log(details);
  }
}
```

### Phase 5: Natural Language Enhancement (30 mins)

**Add simple query parser:**
```javascript
function parseNaturalQuery(query) {
  const params = {};
  const lower = query.toLowerCase();
  
  // Price extraction
  const priceMatch = lower.match(/under (\d+)|max (\d+)|<(\d+)/);
  if (priceMatch) params.maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]);
  
  // Make extraction
  const makes = ['bmw', 'audi', 'fiat', 'volkswagen', 'mercedes'];
  makes.forEach(make => {
    if (lower.includes(make)) params.make = make.toUpperCase();
  });
  
  // Fuel type
  if (lower.includes('diesel')) params.fuel = 'DIESEL';
  if (lower.includes('electric')) params.fuel = 'ELECTRIC';
  if (lower.includes('hybrid')) params.fuel = 'HYBRID';
  
  // Body type
  if (lower.includes('suv')) params.bodyType = 'SUV';
  if (lower.includes('sedan')) params.bodyType = 'SEDAN';
  
  return params;
}
```

### Phase 6: Quick Iteration Features (30 mins)

**Add based on testing feedback:**
1. Error handling (try-catch, user-friendly messages)
2. Response caching (simple in-memory Map)
3. Additional query patterns
4. Debug logging

## File Structure (Final POC)

```
stock-api-mcp/
├── src/
│   └── index.js       # ~250 lines total
├── package.json       # Minimal dependencies
├── .env              # API_KEY only
├── test.js           # Manual testing
└── README.md         # Quick start guide
```

## package.json (Minimal)
```json
{
  "name": "stock-api-mcp",
  "version": "0.1.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "node test.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.1",
    "dotenv": "^16.5.0",
    "node-fetch": "^2.7.0"
  }
}
```

## Testing Approach

### Manual Testing Commands
```bash
# 1. Test API directly
curl "https://stock-api.dealerk.com/it/YOUR_API_KEY/classified/search?limit=5"

# 2. Run test script
npm test

# 3. Test with MCP client
npx @modelcontextprotocol/inspector src/index.js

# 4. Test with Claude Desktop
# Add to claude_desktop_config.json and restart
```

### Test Scenarios
1. ✅ "Show me BMWs"
2. ✅ "Diesel SUVs under 30000"
3. ✅ "Get details for vehicle [ID]"
4. ✅ "Cheapest cars"
5. ✅ Handle API errors gracefully

## Success Criteria
- [ ] Server starts without errors
- [ ] Search returns results
- [ ] Natural language queries work
- [ ] Details retrieval works
- [ ] Errors are handled gracefully
- [ ] Response time < 2 seconds

## Iteration Opportunities

### Quick Wins (5-10 mins each)
1. Add more makes to parser
2. Add condition filter (NEW/USED)
3. Add sorting (price, year, mileage)
4. Add pagination support

### Next Features (15-30 mins each)
1. `list_makes` tool for discovery
2. `search_similar` tool
3. Caching layer
4. Better natural language parsing

### Advanced (if needed)
1. Multi-language support
2. Location-based search
3. Image URLs in results
4. Fuzzy matching for makes/models

## Development Timeline

**Total: 2.5 hours for working POC**
- 0:00-0:10 - Setup
- 0:10-0:40 - Basic MCP server
- 0:40-1:25 - Search implementation
- 1:25-1:55 - Details tool
- 1:55-2:10 - Testing
- 2:10-2:40 - Natural language parsing

**Additional iterations based on feedback**

## Key Decisions for Speed

1. **Single file** - Everything in index.js
2. **No abstractions** - Direct implementation
3. **Hardcoded values** - API key, country, URL
4. **Simple parsing** - Regex and string matching
5. **No build process** - Direct Node.js execution
6. **Minimal dependencies** - Only essentials

## Next Steps
1. Implement Phase 0-2 (basic working search)
2. Test with real API
3. Add natural language parsing
4. Test with AI agent
5. Iterate based on what works/doesn't work