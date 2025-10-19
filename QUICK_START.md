# Quick Start Guide - System Info MCP Server

## Status: ✅ WORKING

Your MCP System Info Server has been successfully built and tested!

## What Was Built

A complete MCP server with **18 tools** for system monitoring:
- ✅ CPU information and usage
- ✅ Memory statistics
- ✅ Operating system details
- ✅ Disk usage
- ✅ Network interfaces
- ✅ Process management
- ✅ Battery status
- ✅ Hardware information
- ✅ Temperature monitoring
- ✅ WiFi scanning
- ✅ Bluetooth devices
- ✅ And more!

## Test Results

The server was tested on your system:
- **CPU**: Ryzen 5 5600H with Radeon Graphics (12 cores)
- **Memory**: 7.35 GB total
- **OS**: Microsoft Windows 11 Home Single Language

All core functions are working correctly! ✓

## How to Use with Claude Desktop

### Step 1: Find Your Configuration File

Open this file in a text editor:
```
%APPDATA%\Claude\claude_desktop_config.json
```

Or navigate to:
```
C:\Users\amogh\AppData\Roaming\Claude\claude_desktop_config.json
```

### Step 2: Add the MCP Server

Add this configuration to the file (or update the `mcpServers` section if it already exists):

```json
{
  "mcpServers": {
    "system-info": {
      "command": "node",
      "args": ["C:/Users/amogh/Downloads/mcp/dist/index.js"]
    }
  }
}
```

**Important**: Use forward slashes (/) in the path, not backslashes!

### Step 3: Restart Claude Desktop

Close and reopen Claude Desktop completely.

### Step 4: Test It!

In Claude Desktop, try asking:
- "What's my CPU usage?"
- "How much RAM is available?"
- "What operating system am I running?"
- "Show me the top 10 processes"
- "What's my battery level?"

## Example Commands

Here are some things you can ask Claude once the server is configured:

**System Overview**
- "Give me a complete overview of my system"
- "What are my system specs?"

**Performance Monitoring**
- "What's my current CPU and memory usage?"
- "Show me the top processes by CPU usage"
- "What's the system load?"

**Storage**
- "How much disk space do I have?"
- "Show me disk usage for all drives"

**Network**
- "What are my network interfaces?"
- "Check my internet connectivity"
- "Scan for WiFi networks"

**Hardware**
- "What's my graphics card?"
- "What's the CPU temperature?"
- "Show me my battery status"

## Troubleshooting

### Claude Desktop doesn't show the tools

1. Make sure you saved the config file correctly
2. Verify the path is correct (use forward slashes)
3. Restart Claude Desktop completely
4. Check Claude Desktop's logs for errors

### "Command not found" error

Make sure Node.js is in your PATH:
```bash
node --version
```

If not, use the full path to node.exe in the config:
```json
{
  "mcpServers": {
    "system-info": {
      "command": "C:/Program Files/nodejs/node.exe",
      "args": ["C:/Users/amogh/Downloads/mcp/dist/index.js"]
    }
  }
}
```

## Rebuilding After Changes

If you make changes to the source code:

```bash
cd C:\Users\amogh\Downloads\mcp
npm run build
```

Then restart Claude Desktop.

## What's Next?

You can now:
1. ✅ Use the server with Claude Desktop
2. ✅ Ask Claude about your system information
3. ✅ Monitor your system performance
4. ✅ Get hardware details on demand

## Support

For issues or questions, refer to:
- `README.md` - Full documentation
- `SPECIFICATION.md` - Technical details
- `BLUEPRINT.md` - Architecture overview

---

**Congratulations!** Your System Info MCP Server is ready to use! 🎉
