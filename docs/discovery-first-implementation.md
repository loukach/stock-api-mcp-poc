# Discovery-First Vehicle Search Implementation

## Problem Statement
The Stock API returns limited vehicle samples (~50 max) but provides comprehensive inventory statistics via facets. Users expect to see "all BMWs" but API can only show a sample. Solution: Transform into an inventory discovery tool.

## Design Decision: Option 3 - Discovery-First Approach

### Core Concept
Instead of pretending to show "all results," be transparent about showing a **sample** while providing **comprehensive inventory insights** and **guided refinement suggestions**.

## Response Structure

### Before (Current)
```
Found 12 vehicles:
1. BMW X1 - €18,900
2. Volvo XC40 - €23,900
...
```

### After (Discovery-First)
```
📊 INVENTORY OVERVIEW
Found 123 vehicles total across all dealers

🏷️ BY CONDITION: Used (115), New (7), Km0 (1)
⛽ BY FUEL TYPE: Diesel (68), Petrol (20), Hybrid (17), Electric (3)
🚗 BY MAKE: Peugeot (11), Audi (9), BMW (8), Fiat (8), Mercedes (8)
🚙 BY BODY TYPE: SUV (75), Sedan (29), Hatchback (7), Van (5)

📋 SAMPLE VEHICLES (showing 15 of 123)
1. BMW X1 2020 • Diesel • 45,000km • €18,900
2. Volvo XC40 2019 • Petrol • 32,000km • €23,900
...

💡 REFINE YOUR SEARCH
• Try "BMW diesel" for 6+ BMW diesel options
• Search "SUV under 25000" for affordable SUVs  
• Filter by "Hybrid" for 17 eco-friendly vehicles
```

## Implementation Plan

### Phase 1: Core Function Updates

#### 1.1 Add Facet Parser
```javascript
function parseFacetResults(facetResults) {
  const breakdown = {};
  
  // Parse each facet category
  if (facetResults.type) {
    breakdown.conditions = facetResults.type.reduce((acc, item) => {
      acc[item.value] = item.count;
      return acc;
    }, {});
  }
  
  // Similar for fuel, make, bodyType
  return breakdown;
}
```

#### 1.2 Enhance Vehicle Results Parser
```javascript
function formatVehicleResults(apiResponse) {
  // Combine promoResults + searchResults
  const promoResults = apiResponse.response?.promoResults || [];
  const searchResults = apiResponse.response?.searchResults || [];
  
  // Deduplicate and limit to sample size
  const allVehicles = [...promoResults, ...searchResults];
  const uniqueVehicles = deduplicateByVehicleId(allVehicles);
  
  return uniqueVehicles.slice(0, 15); // Reasonable sample size
}
```

#### 1.3 Add Suggestion Generator
```javascript
function generateRefinementSuggestions(breakdown, currentFilters) {
  const suggestions = [];
  
  // Suggest high-inventory makes
  const topMakes = Object.entries(breakdown.makes || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
    
  topMakes.forEach(([make, count]) => {
    if (count > 5) {
      suggestions.push(`Try "${make}" for ${count}+ ${make} vehicles`);
    }
  });
  
  return suggestions;
}
```

### Phase 2: Response Format Update

#### 2.1 New Response Structure
```javascript
function createDiscoveryResponse(apiResponse, vehicles, args) {
  const facets = apiResponse.response?.facetResults || {};
  const breakdown = parseFacetResults(facets);
  const total = apiResponse.response?.numResultFound || 0;
  
  return {
    inventory_overview: {
      total_vehicles: total,
      sample_shown: vehicles.length,
      breakdown: breakdown
    },
    sample_vehicles: vehicles,
    refinement_suggestions: generateRefinementSuggestions(breakdown, args),
    search_context: {
      applied_filters: extractAppliedFilters(args),
      showing_sample: vehicles.length < total,
      more_available: total > vehicles.length
    }
  };
}
```

#### 2.2 User-Friendly Text Formatting
```javascript
function formatDiscoveryText(discoveryData) {
  let text = `📊 INVENTORY OVERVIEW\n`;
  text += `Found ${discoveryData.inventory_overview.total_vehicles} vehicles total\n\n`;
  
  // Add breakdown sections
  text += formatBreakdownSection("🏷️ BY CONDITION", discoveryData.inventory_overview.breakdown.conditions);
  text += formatBreakdownSection("⛽ BY FUEL TYPE", discoveryData.inventory_overview.breakdown.fuel_types);
  
  // Add sample vehicles
  text += `\n📋 SAMPLE VEHICLES (showing ${discoveryData.sample_vehicles.length} of ${discoveryData.inventory_overview.total_vehicles})\n`;
  
  // Add refinement suggestions
  text += `\n💡 REFINE YOUR SEARCH\n`;
  discoveryData.refinement_suggestions.forEach(suggestion => {
    text += `• ${suggestion}\n`;
  });
  
  return text;
}
```

### Phase 3: Integration & Testing

#### 3.1 Update Main Handler
```javascript
async function handleSearchVehicles(args) {
  // Call API (unchanged)
  const apiResponse = await callStockAPI('/classified/search', searchParams);
  
  // Parse with new discovery approach
  const vehicles = formatVehicleResults(apiResponse);
  const discoveryData = createDiscoveryResponse(apiResponse, vehicles, args);
  const responseText = formatDiscoveryText(discoveryData);
  
  return {
    content: [{ type: 'text', text: responseText }]
  };
}
```

#### 3.2 Testing Scenarios
- Empty results: Should show "No vehicles found" with suggestions
- Single filter: Should highlight relevant refinements
- Multiple filters: Should show applied filters and suggest alternatives
- Large result set: Should emphasize sample nature

## POC Constraints & Simplifications

### Keep Simple
- Single API call (no pagination)
- Fixed sample size (15 vehicles)
- Basic refinement logic (no ML/AI suggestions)
- Text-only output (no JSON data structures exposed)

### Future Enhancements (Not in POC)
- Vehicle details tool using specific vehicle IDs
- Pagination/offset support for browsing more results  
- Saved searches and alerts
- Image thumbnails in results
- Price analysis and market insights

## Success Criteria

### Functional
- [x] API response parsing works for both facets and vehicles
- [ ] Users understand they're seeing a sample, not all results
- [ ] Refinement suggestions guide users to better searches
- [ ] Total inventory context helps decision making

### Technical  
- [ ] No runtime errors with various API responses
- [ ] Response time under 3 seconds
- [ ] Graceful handling of missing facet data
- [ ] Clear separation of concerns in code

### User Experience
- [ ] Response feels informative, not limited
- [ ] Suggestions are actionable and relevant
- [ ] Users can easily refine their search
- [ ] Context about total inventory is valuable

## Implementation Checklist

- [ ] Add `parseFacetResults()` function
- [ ] Update `formatVehicleResults()` to combine arrays
- [ ] Add `generateRefinementSuggestions()` function  
- [ ] Create `createDiscoveryResponse()` function
- [ ] Add `formatDiscoveryText()` for user output
- [ ] Update `handleSearchVehicles()` main handler
- [ ] Test with various search scenarios
- [ ] Update tool description to reflect discovery-first approach