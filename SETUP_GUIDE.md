# MCP System Info Server - Setup Guide

This guide will help you set up and configure the System Info MCP Server for use with Claude Desktop.

## Quick Start

### 1. Build the Server

```bash
cd C:\Users\amogh\Downloads\mcp
npm install
npm run build
```

### 2. Test the Server

Test that the server is working:

```bash
npm start
```

You should see:
```
MCP System Info Server running on stdio
Available tools: 18
```

Press `Ctrl+C` to stop.

### 3. Configure Claude Desktop

#### Windows Configuration

1. Open File Explorer and navigate to: `%APPDATA%\Claude`
   - Or type `%APPDATA%\Claude` in the Windows Explorer address bar

2. Open or create the file: `claude_desktop_config.json`

3. Add the following configuration:

```json
{
  "mcpServers": {
    "system-info": {
      "command": "node",
      "args": ["C:\\Users\\amogh\\Downloads\\mcp\\dist\\index.js"]
    }
  }
}
```

**Important Notes:**
- Use double backslashes (`\\`) in Windows paths
- Or use forward slashes: `"C:/Users/amogh/Downloads/mcp/dist/index.js"`
- Make sure the path is **absolute**, not relative
- The file must be valid JSON (use a JSON validator if unsure)

#### macOS Configuration

1. Open Terminal

2. Edit the config file:
```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

3. Add this configuration:
```json
{
  "mcpServers": {
    "system-info": {
      "command": "node",
      "args": ["/Users/yourusername/path/to/mcp/dist/index.js"]
    }
  }
}
```

Replace `/Users/yourusername/path/to/mcp` with your actual path.

#### Linux Configuration

1. Open Terminal

2. Edit the config file:
```bash
nano ~/.config/Claude/claude_desktop_config.json
```

3. Add this configuration:
```json
{
  "mcpServers": {
    "system-info": {
      "command": "node",
      "args": ["/home/yourusername/path/to/mcp/dist/index.js"]
    }
  }
}
```

Replace `/home/yourusername/path/to/mcp` with your actual path.

### 4. Restart Claude Desktop

1. Completely quit Claude Desktop (check system tray)
2. Start Claude Desktop again
3. The MCP server should now be available

### 5. Test with Claude

Try asking Claude:

- "What's my CPU information?"
- "How much RAM do I have?"
- "Show me my disk usage"
- "What processes are using the most CPU?"
- "What's my system uptime?"

## Verification

To verify the server is connected in Claude Desktop:

1. Start a new conversation
2. Ask: "Can you see the system-info MCP server?"
3. Claude should confirm it has access to system information tools

## Troubleshooting

### Claude Desktop doesn't see the server

**Check the config file:**
```bash
# Windows (PowerShell)
Get-Content $env:APPDATA\Claude\claude_desktop_config.json

# macOS/Linux
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
# or
cat ~/.config/Claude/claude_desktop_config.json
```

**Common issues:**
- Invalid JSON syntax (missing commas, brackets, quotes)
- Incorrect file path (must be absolute)
- Wrong path separators (use `\\` or `/` on Windows)
- File not saved
- Claude Desktop not restarted

**Validate your JSON:**
```bash
# Windows (PowerShell)
Get-Content $env:APPDATA\Claude\claude_desktop_config.json | ConvertFrom-Json

# macOS/Linux - use a JSON validator online
```

### Server won't start manually

**Check Node.js version:**
```bash
node --version
```

Should be v18 or higher. If not:
```bash
# Windows (with chocolatey)
choco install nodejs

# macOS (with homebrew)
brew install node

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Rebuild the project:**
```bash
cd C:\Users\amogh\Downloads\mcp
npm install
npm run build
```

### Tools return errors

**Permission Errors:**
- Some tools (WiFi scan, port listing) may require admin/root privileges
- Run Claude Desktop as administrator if needed (Windows)
- Or use `sudo` on macOS/Linux (not recommended for desktop apps)

**NOT_AVAILABLE Errors:**
- Some features are platform-specific (e.g., battery info on desktops)
- Temperature monitoring limited on Windows
- This is expected behavior

**Slow responses:**
- Process listing can be slow on systems with many processes
- Network scans take time
- This is normal

### Check Claude Desktop Logs

**Windows:**
```
%APPDATA%\Claude\logs
```

**macOS:**
```
~/Library/Logs/Claude
```

**Linux:**
```
~/.config/Claude/logs
```

Look for error messages related to the MCP server.

## Advanced Configuration

### Multiple MCP Servers

You can add multiple MCP servers:

```json
{
  "mcpServers": {
    "system-info": {
      "command": "node",
      "args": ["C:\\Users\\amogh\\Downloads\\mcp\\dist\\index.js"]
    },
    "another-server": {
      "command": "python",
      "args": ["path/to/another/server.py"]
    }
  }
}
```

### Environment Variables

Pass environment variables to the server:

```json
{
  "mcpServers": {
    "system-info": {
      "command": "node",
      "args": ["C:\\Users\\amogh\\Downloads\\mcp\\dist\\index.js"],
      "env": {
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

## Testing Tools

### Manual Test

Test a specific tool manually:

```bash
cd C:\Users\amogh\Downloads\mcp
echo {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_cpu_info","arguments":{}}} | node dist/index.js
```

### Comprehensive Test

Run the test suite:

```bash
node test-tools.js
```

This will test all 18 tools and show which ones work on your system.

### MCP Inspector

Use the official MCP Inspector for debugging:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a web interface for testing the MCP server.

## Development

### Watch Mode

For development, use watch mode to auto-rebuild on changes:

```bash
npm run watch
```

In another terminal, restart the server when files change.

### Debugging

Add debug logging to `src/index.ts`:

```typescript
console.error('Debug: Tool called:', name);
console.error('Debug: Arguments:', args);
```

Logs go to stderr and won't interfere with MCP protocol (which uses stdout).

## Updating the Server

To update after making changes:

1. Stop Claude Desktop
2. Make your code changes
3. Rebuild: `npm run build`
4. Restart Claude Desktop

## Uninstalling

1. Remove the server configuration from `claude_desktop_config.json`
2. Restart Claude Desktop
3. Optionally delete the `mcp` folder

## Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review the README.md for general information
3. Check the SPECIFICATION.md for technical details
4. Review Claude Desktop logs
5. Test the server manually with the test scripts

## Platform-Specific Notes

### Windows
- Some features require administrator privileges
- Temperature monitoring may be limited
- WiFi scanning requires admin rights

### macOS
- Most features work well
- Some tools may require accessibility permissions
- Battery info works great on MacBooks

### Linux
- Best platform for temperature monitoring
- May need additional packages for Bluetooth (`bluez`)
- WiFi scanning may need root access

## Security

- The server runs locally and doesn't send data externally
- Sensitive environment variables are automatically filtered
- Process command-line arguments are excluded
- No data is logged or stored

## Performance

Expected response times:
- Basic info (CPU, Memory, OS): < 100ms
- Disk info: < 500ms
- Process list: 1-5s (varies by system)
- Network scans: 2-10s

Slow responses are normal for:
- Process enumeration on busy systems
- WiFi network scanning
- Port scanning

---

**Version:** 1.0.0
**Last Updated:** October 17, 2025
**Status:** Ready for use
