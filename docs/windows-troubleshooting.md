# Windows MCP Troubleshooting Guide

## Debugging Failed MCP Server

### Step 1: Check the Log File
The log file is located at: `C:\Users\lucas.gros\AppData\Roaming\Claude\logs\mcp-server-stock-api-mcp.log`

**Please share the content of this log file to see the exact error.**

### Step 2: Find Your Node.js Installation

Open Command Prompt and run:
```cmd
where node
```

Common locations:
- `C:\Program Files\nodejs\node.exe`
- `C:\Program Files (x86)\nodejs\node.exe`
- `C:\Users\[username]\AppData\Roaming\npm\node.exe`

### Step 3: Find Your Project Path

Navigate to your project and get the full path:
```cmd
cd C:\path\to\your\stock-api-mcp
echo %cd%
```

### Step 4: Test Node.js and Script Manually

Test if Node.js can run the script:
```cmd
"C:\Program Files\nodejs\node.exe" "C:\your\full\path\to\stock-api-mcp\src\index.js"
```

This should show:
```
Stock API MCP Server starting...
API Key: b50e31aa...
Country: it
Base URL: https://stock-api.dealerk.com
Stock API MCP Server started successfully
```

### Step 5: Correct Configuration Format

Based on your paths, create this configuration:

```json
{
  "mcpServers": {
    "stock-api-mcp": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\lucas.gros\\path\\to\\stock-api-mcp\\src\\index.js"],
      "env": {
        "STOCK_API_KEY": "YOUR_API_KEY",
        "STOCK_API_COUNTRY": "it",
        "STOCK_API_BASE_URL": "https://stock-api.dealerk.com"
      }
    }
  }
}
```

### Step 6: Alternative - Use npm start

If direct node path is problematic, you can use npm:

```json
{
  "mcpServers": {
    "stock-api-mcp": {
      "command": "npm",
      "args": ["start"],
      "cwd": "C:\\Users\\lucas.gros\\path\\to\\stock-api-mcp",
      "env": {
        "STOCK_API_KEY": "YOUR_API_KEY",
        "STOCK_API_COUNTRY": "it",
        "STOCK_API_BASE_URL": "https://stock-api.dealerk.com"
      }
    }
  }
}
```

### Common Issues and Solutions

#### Issue: "node is not recognized"
**Solution**: Use full path to node.exe in the command field

#### Issue: "Cannot find module"
**Solution**: Make sure you ran `npm install` in the project directory

#### Issue: "ENOENT" error
**Solution**: Check that all paths are correct and use Windows path format

#### Issue: "Permission denied"
**Solution**: Make sure Claude Desktop has permissions to execute Node.js and access the project directory

### Quick Debug Commands

Run these in Command Prompt to gather info:

```cmd
:: Check Node.js
node --version
where node

:: Check npm
npm --version
where npm

:: Test project
cd C:\path\to\stock-api-mcp
npm install
npm start
```

### Example Working Configuration

Replace the paths with your actual paths:

```json
{
  "mcpServers": {
    "stock-api-mcp": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\lucas.gros\\Documents\\stock-api-mcp\\src\\index.js"],
      "env": {
        "STOCK_API_KEY": "YOUR_API_KEY",
        "STOCK_API_COUNTRY": "it",
        "STOCK_API_BASE_URL": "https://stock-api.dealerk.com"
      }
    }
  }
}
```

---

**Next Steps:**
1. Share the content of the log file: `C:\Users\lucas.gros\AppData\Roaming\Claude\logs\mcp-server-stock-api-mcp.log`
2. Run the debug commands above
3. Update the configuration with correct paths
4. Restart Claude Desktop