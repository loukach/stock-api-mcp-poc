# Claude Desktop MCP Setup Instructions

## Adding Stock API MCP to Claude Desktop

### Step 1: Locate Claude Desktop Config File

The configuration file location depends on your operating system:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Step 2: Edit Configuration File

Open the `claude_desktop_config.json` file in a text editor and add the Stock API MCP server:

#### For Windows:
```json
{
  "mcpServers": {
    "stock-api-mcp": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\path\\to\\your\\stock-api-mcp\\src\\index.js"],
      "env": {
        "STOCK_API_KEY": "YOUR_API_KEY",
        "STOCK_API_COUNTRY": "it",
        "STOCK_API_BASE_URL": "https://stock-api.dealerk.com"
      }
    }
  }
}
```

#### For macOS/Linux:
```json
{
  "mcpServers": {
    "stock-api-mcp": {
      "command": "node",
      "args": ["/home/lucasgros/projects/stock-api-mcp/src/index.js"],
      "env": {
        "STOCK_API_KEY": "YOUR_API_KEY",
        "STOCK_API_COUNTRY": "it",
        "STOCK_API_BASE_URL": "https://stock-api.dealerk.com"
      }
    }
  }
}
```

**Important**: 
- Replace the paths with your actual absolute paths
- On Windows, use double backslashes `\\` or forward slashes `/`
- On Windows, specify the full path to `node.exe`

### Step 3: If You Have Existing MCP Servers

If you already have other MCP servers configured, add the stock-api-mcp entry to your existing configuration:

```json
{
  "mcpServers": {
    "your-existing-server": {
      "command": "existing-command",
      "args": ["existing-args"]
    },
    "stock-api-mcp": {
      "command": "node",
      "args": ["/home/lucasgros/projects/stock-api-mcp/src/index.js"],
      "env": {
        "STOCK_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### Step 4: Restart Claude Desktop

1. Completely quit Claude Desktop
2. Restart Claude Desktop
3. The Stock API MCP server should now be available

### Step 5: Verify Setup

In Claude Desktop, you should be able to use natural language queries like:

- "Show me BMW vehicles"
- "Find diesel SUVs under 30,000 euros"
- "What Fiat models are available?"
- "Search for electric cars"

### Troubleshooting

#### Server Not Loading
- Check that the path in `args` is correct and absolute
- Verify Node.js is installed: `node --version`
- Test server manually: `node /path/to/stock-api-mcp/src/index.js`

#### API Errors
- Verify the API key is correct in the env section
- Check network connectivity to `https://stock-api.dealerk.com`

#### Permission Issues
- Make sure Claude Desktop has read access to the project directory
- On macOS/Linux, you might need to set file permissions: `chmod +r src/index.js`

### Alternative Configuration (Using .env file)

If you prefer to keep the API key in the `.env` file instead of the config:

```json
{
  "mcpServers": {
    "stock-api-mcp": {
      "command": "node",
      "args": ["/home/lucasgros/projects/stock-api-mcp/src/index.js"]
    }
  }
}
```

Make sure your `.env` file contains:
```
STOCK_API_KEY=YOUR_API_KEY
STOCK_API_COUNTRY=it
STOCK_API_BASE_URL=https://stock-api.dealerk.com
```

### Example Usage

Once configured, you can interact with the Stock API through Claude Desktop:

**User**: "Find me some BMW cars"
**Claude**: *Uses search_vehicles tool to find BMW vehicles and displays results*

**User**: "Show me diesel vehicles under 25000 euros"
**Claude**: *Searches with fuel=DIESEL and maxPrice=25000 filters*

**User**: "What's available from Fiat?"
**Claude**: *Searches for Fiat vehicles and shows available models*

### Configuration Template

Copy this template and adjust the path:

```json
{
  "mcpServers": {
    "stock-api-mcp": {
      "command": "node",
      "args": ["PUT_YOUR_ABSOLUTE_PATH_HERE/src/index.js"],
      "env": {
        "STOCK_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### Getting the Absolute Path

**On macOS/Linux:**
```bash
cd /path/to/stock-api-mcp
pwd
# Copy the output and append /src/index.js
```

**On Windows:**
```cmd
cd C:\path\to\stock-api-mcp
cd
# Copy the output and append \src\index.js (use forward slashes in JSON)
```

---

**Note**: After any changes to the configuration file, you must restart Claude Desktop for the changes to take effect.