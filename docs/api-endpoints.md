# Stock API Endpoints Documentation

## Base Information
- **Base URL**: `https://stock-api.dealerk.com`
- **API Version**: ttn-swagger-1.0.0
- **Authentication**: API Key (passed in URL path)
- **Country Code**: Required in path (e.g., `it` for Italy)

## Available Endpoints

### 1. Vehicle Search & Display

#### GET `/{country}/{apiKey}/classified/search`
**Purpose**: Search for vehicles with various filters
**Description**: Main endpoint for searching vehicle inventory

#### GET `/{country}/{apiKey}/classified/detail`
**Purpose**: Get detailed information about a specific vehicle
**Description**: Retrieve complete vehicle details including specs, equipment, images

#### GET `/{country}/{apiKey}/trim/search`
**Purpose**: Search vehicles grouped by trim level
**Description**: Returns vehicles organized by their trim/version

#### GET `/{country}/{apiKey}/trim/{trimId}/detail`
**Purpose**: Get all vehicles for a specific trim
**Description**: Retrieve details for all vehicles matching a specific trim ID

### 2. In-Store Features

#### POST `/{country}/{apiKey}/instore/search`
**Purpose**: Search trims with advanced filtering
**Description**: Enhanced search specifically for in-store displays

#### POST `/{country}/{apiKey}/instore/detail/{trimId}`
**Purpose**: Get trim details with associated vehicles
**Description**: Detailed trim information including all matching vehicles

#### POST `/{country}/{apiKey}/instore/filterValues`
**Purpose**: Get available filter values
**Description**: Retrieve possible values for search filters (makes, models, etc.)

#### GET `/{country}/{apiKey}/instore/vehicle/{vehicleId}/optionalsDetail`
**Purpose**: Get optional equipment for a vehicle
**Description**: List all optional features and equipment for a specific vehicle

### 3. Suggestions & Autocomplete

#### GET `/{country}/{apiKey}/suggestions/vehicle`
**Purpose**: Get vehicle suggestions
**Description**: Autocomplete/suggestions for vehicle search

#### GET `/{country}/{apiKey}/suggestions/generic`
**Purpose**: Get suggestions by characteristics
**Description**: Generic suggestions based on vehicle characteristics

### 4. Financial Services

#### POST `/{country}/{apiKey}/instore/instalments/calculate`
**Purpose**: Calculate loan/financing options
**Description**: Calculate installment plans for vehicle financing

#### POST `/{country}/{apiKey}/company/rental/cayu/discounts`
**Purpose**: Generate rental discount options
**Description**: Calculate rental discounts for Cayu integration

#### GET `/{country}/{apiKey}/loaning/disclaimer/{disclaimerId}`
**Purpose**: Get financing disclaimer text
**Description**: Retrieve legal disclaimer for financing plans

### 5. Statistics & Analytics

#### POST `/{country}/{apiKey}/stats/stockCountWithMapping`
**Purpose**: Get stock counts with mapping data
**Description**: Count vehicles using mapping/categorization data

#### POST `/{country}/{apiKey}/stats/stockCountByType`
**Purpose**: Get stock counts by vehicle type
**Description**: Count vehicles grouped by type (new/used/etc.)

### 6. Configuration & Management

#### GET `/{country}/{apiKey}/packets/{category}`
**Purpose**: Get packet configurations by category
**Description**: Retrieve groups, packets and items configuration

#### GET `/{country}/{apiKey}/company/evict`
**Purpose**: Evict company cache
**Description**: Clear cached data for companies

## Key Observations

1. **Two Main Search Approaches**:
   - `/classified/search` - Basic vehicle search
   - `/instore/search` - Advanced search with more filters

2. **Hierarchical Data Structure**:
   - Vehicles are organized by Trim (version/model variant)
   - Trims contain multiple vehicles with same specifications

3. **Mixed HTTP Methods**:
   - GET for simple queries
   - POST for complex searches with body parameters

4. **Multi-purpose API**:
   - Vehicle inventory search
   - Financial calculations
   - Statistics and analytics
   - Configuration management