# System Info MCP Server

A comprehensive Model Context Protocol (MCP) server for system information, monitoring, and diagnostics. This server provides 18 tools to retrieve detailed information about CPU, memory, disk, network, processes, battery, hardware, and more.

## Features

- **CPU Information**: Get CPU model, cores, speed, architecture, and usage
- **Memory Information**: Retrieve RAM and swap memory statistics
- **Operating System**: Get OS details, version, hostname, and uptime
- **Disk Information**: View disk usage for all mounted drives
- **Network Information**: List network interfaces with IP addresses and status
- **Process Management**: List running processes and system load
- **Battery Status**: Check battery level, charging status, and health (laptops)
- **Hardware Details**: Get graphics card, display, and peripheral information
- **Temperature Monitoring**: Monitor CPU and GPU temperatures
- **Network Scanning**: Scan for WiFi networks and Bluetooth devices
- **Port Information**: List open network ports

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

## Usage

### Running the Server

The server runs on stdio transport and is designed to be used with MCP-compatible clients like Claude Desktop.

```bash
node dist/index.js
```

### Claude Desktop Integration

To use this MCP server with Claude Desktop, add it to your Claude Desktop configuration:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

Add the following configuration:

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

**Note**: Replace the path with the actual path to your `dist/index.js` file.

## Available Tools

| Tool | Description |
|------|-------------|
| `get_cpu_info` | CPU information including cores, model, speed, and usage |
| `get_memory_info` | RAM and swap memory statistics |
| `get_os_info` | Operating system details and version |
| `get_uptime` | System uptime information |
| `get_disk_info` | Disk usage for all mounted drives |
| `get_network_info` | Network interface information |
| `get_system_identity` | Hostname, username, and directory paths |
| `get_process_info` | Current process and total system processes |
| `list_processes` | List running processes with CPU/memory usage |
| `get_system_load` | System load averages |
| `get_battery_info` | Battery status and health (laptops) |
| `get_hardware_info` | Graphics, displays, and peripherals |
| `get_environment_info` | Environment variables (sensitive vars filtered) |
| `check_internet_connectivity` | Test internet connectivity and latency |
| `get_open_ports` | List open network ports |
| `get_temperature_info` | Hardware temperature sensors |
| `scan_wifi_networks` | Scan for available WiFi networks |
| `get_bluetooth_devices` | List paired Bluetooth devices |

## Example Usage with Claude

Once configured in Claude Desktop, you can ask Claude questions like:

- "What's my CPU usage right now?"
- "How much RAM do I have available?"
- "Show me the top 10 processes by CPU usage"
- "What's my battery level?"
- "List all network interfaces"
- "What's the temperature of my CPU?"
- "Scan for WiFi networks"

## Development

### Project Structure

```
mcp-system-info/
├── src/
│   ├── index.ts           # Main server entry point
│   ├── types/             # TypeScript type definitions
│   ├── tools/             # Tool implementations
│   ├── utils/             # Utility functions
│   └── config/            # Configuration constants
├── dist/                  # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

### Build Scripts

```bash
# Build the project
npm run build

# Watch mode for development
npm run watch

# Run tests
npm test

# Lint code
npm run lint
```

## Platform Support

- **Windows**: Full support (Windows 10/11)
- **macOS**: Full support (macOS 12+)
- **Linux**: Full support (Ubuntu 20.04+, other distros)

Some features may have limited functionality on certain platforms:
- Temperature monitoring is best on Linux
- WiFi/Bluetooth scanning may require elevated privileges
- Some hardware details vary by platform

## Security

- Environment variables containing sensitive keywords (API_KEY, PASSWORD, SECRET, TOKEN) are automatically filtered
- Process command-line arguments are excluded to prevent secret exposure
- No data is sent externally - all information stays local

## Troubleshooting

### Server won't start

1. Make sure you've built the project: `npm run build`
2. Check Node.js version: `node --version` (should be 18+)
3. Check for errors in stderr output

### Tools return "NOT_AVAILABLE" errors

Some tools require:
- Elevated permissions (admin/root)
- Specific hardware (battery, WiFi adapter, etc.)
- Platform support (some features are OS-specific)

### Claude Desktop doesn't see the server

1. Verify the path in `claude_desktop_config.json` is correct
2. Make sure the path uses forward slashes (/) or escaped backslashes (\\\\)
3. Restart Claude Desktop after configuration changes

## License

MIT

## Version

1.0.0
