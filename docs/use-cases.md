# Stock API MCP - Customer Use Cases

## Overview
Customer interactions with an AI assistant powered by the Stock API MCP server, enabling natural conversational vehicle discovery and research.

## Primary Use Cases

### 1. 🔍 **Vehicle Discovery & Search**

#### Basic Search
```
Customer: "Show me SUVs under 35,000 euros"
Assistant: [Searches and presents 5-10 matching SUVs with key details]

Customer: "I'm looking for a family car"
Assistant: "What's your budget range?"
Customer: "Around 25,000 euros"
Assistant: [Shows sedans, wagons, and compact SUVs in that range]
```

#### Brand-Specific Search
```
Customer: "Do you have any BMW 3 Series?"
Assistant: [Lists available BMW 3 Series with prices and years]

Customer: "What Fiat models do you have?"
Assistant: [Shows all available Fiat models grouped by type]
```

#### Advanced Filtering
```
Customer: "I need a diesel car with low mileage under 20,000 euros"
Assistant: [Filters for diesel, sorts by mileage, applies price cap]

Customer: "Show me electric vehicles"
Assistant: [Lists all EVs with range and charging info]
```

### 2. 🚗 **Vehicle Comparison & Research**

#### Detailed Information
```
Customer: "Tell me more about that BMW 320d"
Assistant: [Provides full specs, features, mileage, year, price, condition]

Customer: "What equipment does it have?"
Assistant: [Lists standard and optional equipment]
```

#### Model Comparison
```
Customer: "What's the difference between the 318d and 320d?"
Assistant: [Compares power, fuel economy, price difference, available units]

Customer: "Should I get a Golf or a Focus?"
Assistant: [Shows available units of each with comparative details]
```

### 3. 💰 **Budget-Focused Shopping**

#### Price Exploration
```
Customer: "What's the cheapest automatic car you have?"
Assistant: [Finds lowest-priced automatic transmission vehicles]

Customer: "What can I get for 15,000 euros?"
Assistant: [Shows best options within budget, categorized by type]
```

#### Value Discovery
```
Customer: "Show me cars with the best value"
Assistant: [Presents newer models with low mileage at competitive prices]

Customer: "Any good deals on nearly-new cars?"
Assistant: [Filters for KM0 or low-mileage recent models]
```

### 4. 🎯 **Specific Needs Matching**

#### Lifestyle Requirements
```
Customer: "I need a car for long commutes"
Assistant: "For long commutes, diesel or hybrid would be economical. What's your daily distance?"
Customer: "About 100km"
Assistant: [Shows efficient diesel/hybrid options with comfort features]
```

#### Family Needs
```
Customer: "I have 3 kids, what do you recommend?"
Assistant: [Shows 7-seaters, large SUVs, and minivans with safety features]

Customer: "I need a small city car for my daughter"
Assistant: [Presents compact cars with good safety ratings]
```

### 5. 🔄 **Trade-In Scenarios**

#### Upgrade Paths
```
Customer: "I have a 2015 Golf, what's a good upgrade?"
Assistant: [Shows newer Golfs or similar segment vehicles with improvements]

Customer: "I want something bigger than my Fiat 500"
Assistant: [Presents next-size-up options like Tipo, 500X]
```

### 6. 📋 **Inventory Browsing**

#### General Exploration
```
Customer: "What's new in stock?"
Assistant: [Shows recently added vehicles]

Customer: "Show me your premium cars"
Assistant: [Filters for luxury brands: BMW, Mercedes, Audi]
```

#### Availability Checks
```
Customer: "Do you have any red cars?"
Assistant: [Filters inventory by color]

Customer: "Any manual transmission sports cars?"
Assistant: [Searches for manual, sporty models]
```

## Conversational Patterns

### Natural Language Understanding
```
Customer: "Something reliable for my daily commute that won't break the bank"
Assistant interprets: 
- Reliable = Japanese/German brands, lower mileage
- Daily commute = Good fuel economy
- Won't break the bank = Mid-range pricing
→ Shows Toyota, VW, Honda under 20,000€ with <80,000km
```

### Progressive Refinement
```
Customer: "Show me cars"
Assistant: "What type are you looking for? SUV, sedan, compact?"
Customer: "SUV"
Assistant: "What's your budget range?"
Customer: "Under 30k"
Assistant: "Any preference for fuel type?"
Customer: "Diesel would be good"
Assistant: [Shows diesel SUVs under 30,000€]
```

### Contextual Memory
```
Customer: "Show me BMWs"
[Assistant shows BMWs]
Customer: "Just the diesels"
[Assistant filters previous results]
Customer: "Any with leather seats?"
[Assistant further refines based on equipment]
```

## Key Interaction Features

### 1. **Intelligent Suggestions**
- Alternatives when exact match unavailable
- Similar vehicles in different price ranges
- Comparable models from different brands

### 2. **Educational Responses**
```
Customer: "What's the difference between KM0 and used?"
Assistant: [Explains KM0 as dealer-registered nearly-new cars]
```

### 3. **Proactive Assistance**
```
Customer: "I need a car urgently"
Assistant: "I can show you vehicles available for immediate delivery. What size do you need?"
```

### 4. **Multi-Criteria Optimization**
```
Customer: "Best car for a young family on a budget"
Assistant considers: Safety + Space + Reliability + Price
→ Presents optimal matches with reasoning
```

## Conversation Flow Examples

### Complete Purchase Journey
```
1. Discovery: "I'm looking for a car"
2. Qualification: Assistant asks budget, usage, preferences
3. Exploration: Shows matching vehicles
4. Refinement: Customer narrows choices
5. Deep-dive: Detailed info on shortlist
6. Decision Support: Comparison of final options
7. Next Steps: "How do I see this car?"
```

### Quick Information Lookup
```
1. Direct Query: "Do you have a white Golf diesel?"
2. Instant Result: Yes/No with available alternatives
3. Details: Specific vehicle information if requested
```

## Limitations & Handoffs

### What the Assistant CAN'T Do
- Schedule test drives (handoff to dealer)
- Process financing (needs financial calculator)
- Hold/reserve vehicles (requires dealer system)
- Negotiate prices (dealer discretion)

### Smooth Transitions
```
Customer: "Can I test drive the BMW?"
Assistant: "I'll help you arrange that. The BMW 320d is at our Milan location. Would you like me to connect you with the sales team there?"
```

## Success Metrics

1. **Query Resolution Rate**: Customer finds suitable vehicles
2. **Conversation Depth**: Multiple refinements show engagement
3. **Information Completeness**: All questions answered
4. **Lead Quality**: Customer ready for dealer contact
5. **User Satisfaction**: Natural, helpful interactions

## Technical Requirements

For these use cases to work smoothly:
- Fast response times (<2 seconds)
- Natural language parsing
- Context retention within conversation
- Graceful handling of no results
- Clear, concise formatting
- Mobile-friendly responses