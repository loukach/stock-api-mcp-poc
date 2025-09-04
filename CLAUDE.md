# Stock API MCP - Implementation Guide

## 🎯 Project Overview
This is a Model Context Protocol (MCP) server that enables AI agents to search vehicles through the Stock API using natural language queries. The goal is to create a minimal POC that allows customers to discover vehicles through conversational AI.

## 📋 Implementation Instructions

### Core Implementation Rules
1. **Follow the detailed implementation plan** in `docs/detailed-implementation-plan.md`
2. **Implement ONE task at a time** - Do not skip ahead or batch multiple tasks
3. **Update progress tracking** after each completed task by marking checkboxes in the documentation
4. **Test each phase** before moving to the next one
5. **Keep it simple** - This is a POC, avoid over-engineering

### Task Tracking System
- Use TodoWrite tool to track current task status
- Mark tasks as `in_progress` when starting
- Mark tasks as `completed` when finished
- Update the corresponding checkbox in `docs/detailed-implementation-plan.md`

### Implementation Order

#### Phase 0: Project Setup (Tasks 1-5)
1. ✅ Create project directory structure
2. ✅ Initialize npm project with package.json
3. ✅ Install dependencies (@modelcontextprotocol/sdk, node-fetch@2, dotenv)
4. ✅ Create .env file with API key
5. ✅ Create basic README.md

#### Phase 1: Basic MCP Server (Tasks 6-11)
6. ✅ Import required MCP SDK modules
7. ✅ Create MCP server instance with basic config
8. ✅ Set up environment configuration
9. ✅ Define server capabilities
10. ✅ Add basic error handling
11. ✅ Implement server startup and transport

#### Phase 2: Core Search Tool (Tasks 12-17)
12. ✅ Define search_vehicles tool schema
13. ✅ Implement HTTP client function for API calls
14. ✅ Create basic query parameter mapping
15. ✅ Implement result formatting for AI consumption
16. ✅ Add search tool handler registration
17. ✅ Add basic error handling for API failures

#### Phase 3: Vehicle Details Tool (Tasks 18-21)
18. ⏳ Define get_vehicle_details tool schema
19. ⏳ Implement vehicle details API call
20. ⏳ Create detailed result formatter
21. ⏳ Add details tool handler registration

#### Phase 4: Testing Setup (Tasks 22-25)
22. ⏳ Create test.js file with test scenarios
23. ⏳ Add direct API testing functions
24. ⏳ Add MCP tool testing functions
25. ⏳ Create npm test script

#### Phase 5: Natural Language Enhancement (Tasks 26-31)
26. ⏳ Implement query parsing function
27. ⏳ Add price extraction (regex patterns)
28. ⏳ Add make/model extraction
29. ⏳ Add fuel type recognition
30. ⏳ Add body type recognition
31. ⏳ Integrate parser into search tool
32. ⏳ Test with natural language queries

#### Phase 6: Polish & Error Handling (Tasks 33-36)
33. ⏳ Add comprehensive error handling
34. ⏳ Implement request timeout handling
35. ⏳ Add user-friendly error messages
36. ⏳ Add basic response caching
37. ⏳ Add debug logging
38. ⏳ Update documentation

## 🔧 Technical Specifications

### Project Structure
```
stock-api-mcp/
├── package.json              # Dependencies & scripts
├── .env                      # API configuration  
├── README.md                 # Quick start guide
├── test.js                   # Manual testing
├── CLAUDE.md                 # This file
├── docs/                     # Design documentation
└── src/
    └── index.js              # Complete MCP server (~300 lines)
```

### Key Dependencies
```json
{
  "@modelcontextprotocol/sdk": "^1.12.1",
  "node-fetch": "^2.7.0",
  "dotenv": "^16.5.0"
}
```

### API Configuration
```env
STOCK_API_KEY=<replace with your API key>
STOCK_API_COUNTRY=it
STOCK_API_BASE_URL=https://stock-api.dealerk.com
```

## 🛠️ Implementation Guidelines

### Coding Standards
- **Single file approach** - Keep everything in `src/index.js` for simplicity
- **No abstractions** - Direct implementation for POC speed
- **Comprehensive error handling** - Always provide user-friendly error messages
- **Comments for clarity** - Document complex logic and API integrations

### Testing Strategy
- Test each phase immediately after implementation
- Use `test.js` for manual testing scenarios
- Verify with MCP Inspector tool
- Test real API calls with actual Stock API

### API Integration Patterns
```javascript
// Standard API call pattern
async function callStockAPI(endpoint, params = {}) {
  const url = `${BASE_URL}/${COUNTRY}/${API_KEY}${endpoint}`;
  const queryString = new URLSearchParams(params).toString();
  const finalUrl = queryString ? `${url}?${queryString}` : url;
  
  try {
    const response = await fetch(finalUrl);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new StockAPIError(`Failed to fetch ${endpoint}`, error);
  }
}
```

### Result Formatting Pattern
```javascript
// AI-optimized result formatting
function formatVehicleForAI(vehicle) {
  return {
    id: vehicle.id,
    title: `${vehicle.make} ${vehicle.model} ${vehicle.version || ''}`.trim(),
    price: vehicle.price ? `€${vehicle.price.toLocaleString()}` : 'Price on request',
    summary: `${vehicle.year} ${vehicle.make} ${vehicle.model}, ${vehicle.fuel}, ${vehicle.mileage || 0}km`
  };
}
```

## ✅ Progress Tracking Commands

### After Completing Each Task:
1. **Update TodoWrite** - Mark current task as completed
2. **Update Documentation** - Check the corresponding box in `detailed-implementation-plan.md`
3. **Test the functionality** - Ensure the implemented feature works
4. **Move to next task** - Mark next task as in_progress

### Phase Completion Verification:
- **Phase 0**: npm install works, files created
- **Phase 1**: MCP server starts without errors
- **Phase 2**: search_vehicles tool works via MCP Inspector
- **Phase 3**: get_vehicle_details tool works with real vehicle IDs
- **Phase 4**: npm test runs and passes basic scenarios
- **Phase 5**: Natural language queries like "BMW diesel under 30k" work
- **Phase 6**: All error cases handled gracefully, caching works

## 🎯 Success Criteria

### Functional Requirements
- [ ] Can search vehicles with natural language queries
- [ ] Can retrieve detailed vehicle information by ID
- [ ] Handles API errors gracefully with user-friendly messages
- [ ] Response time under 2 seconds for typical queries
- [ ] Works with Claude Desktop and other MCP clients

### Technical Quality
- [ ] No runtime errors or uncaught exceptions
- [ ] Proper MCP protocol compliance
- [ ] Clean, readable code structure
- [ ] Comprehensive error handling
- [ ] Basic performance optimizations (caching)

## 🚀 Getting Started

1. **Start with Phase 0** - Set up the basic project structure
2. **Follow the task order** - Don't skip ahead
3. **Test frequently** - Verify each phase works before proceeding
4. **Track progress** - Update checkboxes and todo items
5. **Keep it simple** - Remember this is a POC for rapid iteration

## 📞 API Endpoints to Implement

### Primary Endpoints:
- `GET /{country}/{apiKey}/classified/search` - Vehicle search
- `GET /{country}/{apiKey}/classified/detail` - Vehicle details

### Supporting Endpoints (future):
- `POST /{country}/{apiKey}/instore/filterValues` - Available filters
- `GET /{country}/{apiKey}/suggestions/vehicle` - Search suggestions

## 🔍 Testing Scenarios

### Manual Test Cases:
1. "Show me BMWs" → Should return BMW vehicles
2. "Diesel SUVs under 30000" → Should filter by fuel, body type, and price
3. "Get details for vehicle [ID]" → Should return comprehensive vehicle info
4. "Cheapest cars available" → Should sort by price ascending
5. Invalid queries → Should return helpful error messages

## 🧪 Testing the Current POC

### Current Status: Phase 2 Complete
We have a working MCP server with `search_vehicles` tool that can:
- Connect to Stock API with API key authentication
- Accept natural language and structured search parameters
- Format results for AI consumption
- Handle errors gracefully

### Testing Methods

#### 1. Direct API Test
```bash
# Test the underlying Stock API directly
curl "https://stock-api.dealerk.com/it/YOUR_API_KEY/classified/search?limit=5"
```

#### 2. MCP Server Startup Test
```bash
# Verify MCP server starts correctly
timeout 3s npm start
# Should show: "Stock API MCP Server started successfully"
```

#### 3. Manual Test Script
```bash
# Run comprehensive test suite
node test.js
# Tests: Direct API call + MCP server startup
```

#### 4. MCP Inspector (Recommended)
```bash
# Interactive tool testing with MCP protocol
npx @modelcontextprotocol/inspector src/index.js
# Then test: search_vehicles with parameters like { "make": "BMW", "limit": 5 }
```

#### 5. Claude Desktop Integration
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "stock-api-mcp": {
      "command": "node",
      "args": ["/path/to/stock-api-mcp/src/index.js"]
    }
  }
}
```
Then restart Claude Desktop and test queries like "Show me BMW cars"

### Test Scenarios
1. **Basic search**: `{ "make": "BMW", "limit": 5 }`
2. **Price filter**: `{ "maxPrice": 30000, "limit": 10 }`
3. **Fuel type**: `{ "fuel": "DIESEL", "limit": 5 }`
4. **Combined filters**: `{ "make": "FIAT", "fuel": "PETROL", "maxPrice": 25000 }`
5. **Error handling**: Invalid parameters or network issues

## 📝 Documentation Updates Required

As you implement, keep these files updated:
- `README.md` - Installation and usage instructions
- `docs/detailed-implementation-plan.md` - Progress checkboxes
- This file (`CLAUDE.md`) - Any lessons learned or deviations from plan

---

**Remember: Implement one task at a time, test thoroughly, and track progress visually. The goal is a working POC that demonstrates vehicle search via natural language through an MCP server.**