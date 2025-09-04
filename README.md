# Stock API MCP Server

A Model Context Protocol server that provides **discovery-first vehicle inventory search** through the Stock API. Instead of simple vehicle listings, it offers comprehensive inventory insights with sample vehicles and intelligent refinement suggestions.

## 🎯 What Makes This Different

This POC implements a **discovery-first approach** that transforms vehicle search from a simple list into an informative inventory exploration:

- **📊 Inventory Overview**: See total counts by make, fuel type, condition, and body type
- **📋 Representative Sample**: View 10-15 example vehicles from available inventory  
- **💡 Smart Suggestions**: Get refinement ideas based on actual inventory
- **🔍 Transparent Sampling**: Understand you're seeing examples, not exhaustive results

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API access:**
   ```bash
   # .env file is already configured with:
   # STOCK_API_KEY=<replace with your API key>
   # STOCK_API_COUNTRY=it
   # STOCK_API_BASE_URL=https://stock-api.dealerk.com
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

4. **Test manually:**
   ```bash
   npm test
   ```

## Available Tools

### 🔍 search_vehicles
**Discover vehicle inventory** with comprehensive overview and sample listings. Shows total counts by make, fuel, condition plus representative vehicle examples with refinement suggestions.

**Example Response Format:**
```
📊 INVENTORY OVERVIEW
Found 123 vehicles total across all dealers

🏷️ BY CONDITION: USED (115), NEW (7), KM0 (1)
⛽ BY FUEL TYPE: Diesel (68), Petrol (20), Hybrid (17)
🚗 BY MAKE: Peugeot (11), Audi (9), BMW (8), Fiat (8)
🚙 BY BODY TYPE: SUV (75), Sedan (29), Hatchback (7)

📋 SAMPLE VEHICLES (showing 15 of 123)
1. 2022 Volvo XC40 • Diesel • 32,000km • €23,900
2. 2025 Dfsk Glory 500 • Petrol • 5,000km • €16,500
3. 2021 Mercedes-Benz Classe A • Hybrid • 28,000km • €19,900

💡 REFINE YOUR SEARCH
• Try "Peugeot" for 11+ Peugeot vehicles
• Filter by "Diesel" for 68 diesel vehicles  
• Add "under 25000" for budget-friendly options
```

**Parameters:**
- `make` - Vehicle brand filter (BMW, Audi, Fiat, etc.)
- `fuel` - Fuel type (DIESEL, PETROL, HYBRID, ELECTRIC)
- `maxPrice` - Maximum price in EUR
- `minPrice` - Minimum price in EUR  
- `condition` - Vehicle condition (NEW, USED, KM0)
- `limit` - Sample size (default 10, max 15)

### 🚗 get_vehicle_details *(Coming Soon)*
Get complete information about a specific vehicle by ID.

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

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

## Recent Updates

### ✅ Discovery-First Implementation Complete (September 2025)
- **Fixed API Response Parsing**: Now combines `promoResults` + `searchResults` (38 vehicles vs 12 previously)
- **Added Inventory Overview**: Shows total counts with breakdowns by condition, fuel, make, body type
- **Smart Refinement Suggestions**: Provides intelligent next steps based on available inventory  
- **Transparent Sampling**: Clear indication when showing sample vs total available vehicles

### Technical Improvements
- Proper deduplication of vehicle results by ID
- Enhanced error handling and logging
- User-friendly response formatting with emojis and structure
- Discovery-first approach optimized for POC constraints

## Testing the Server

### Option 1: MCP Inspector (Recommended)
```bash
npx @modelcontextprotocol/inspector src/index.js
```

Then test with queries like:
- `{"make": "BMW", "limit": 5}`
- `{"fuel": "DIESEL", "maxPrice": 30000}`
- `{"limit": 10}` (for full inventory overview)

### Option 2: Direct API Testing  
```bash
node test.js
```

### Option 3: Claude Desktop Integration
Works seamlessly with Claude Desktop - just ask natural language queries like:
- "Show me the available inventory"
- "What BMWs are available?"
- "Find diesel cars under 25000 euros"

## Development Status

✅ **Phase 1-2 Complete**: Core search functionality with discovery-first approach
🔄 **Phase 3-6 Next**: Vehicle details tool, natural language parsing, enhanced testing

## Architecture Notes

The server implements a **discovery-first design pattern** that:
1. Embraces API pagination limitations transparently
2. Maximizes value from facet data for inventory insights  
3. Provides actionable refinement suggestions
4. Sets clear expectations about sample vs comprehensive results

Perfect for POCs where comprehensive search isn't feasible but inventory discovery is valuable.

## License

MIT