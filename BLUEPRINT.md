# System Info MCP Server - Blueprint

## Overview
A comprehensive Model Context Protocol (MCP) server that provides detailed system information, monitoring, and diagnostics capabilities. This server exposes system metrics, hardware details, network information, and process data through MCP tools and resources.

## Architecture

### Technology Stack
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **MCP SDK**: @modelcontextprotocol/sdk
- **System Libraries**:
  - `systeminformation` - Cross-platform system info
  - `os` (built-in) - Basic OS utilities
  - `node-disk-info` - Disk information
  - `network` - Network utilities

### Server Type
**Stdio Transport** - Communicates via standard input/output streams

---

## Features & Capabilities

### 1. **CPU Information** (Basic)
- **Tool**: `get_cpu_info`
- **Data Points**:
  - Number of cores (physical & logical)
  - CPU model/brand
  - CPU speed (GHz)
  - Architecture (x64, arm64, etc.)
  - CPU usage percentage (current)
  - CPU temperature (if available)

### 2. **Memory Information** (Basic)
- **Tool**: `get_memory_info`
- **Data Points**:
  - Total RAM (GB)
  - Free RAM (GB)
  - Used RAM (GB)
  - Memory usage percentage
  - Swap memory (total/free/used)

### 3. **Operating System Info** (Basic)
- **Tool**: `get_os_info`
- **Data Points**:
  - Platform (Windows, macOS, Linux)
  - OS version/release
  - OS build number
  - Hostname
  - System uptime
  - Boot time

### 4. **System Uptime** (Basic)
- **Tool**: `get_uptime`
- **Data Points**:
  - Uptime in seconds
  - Uptime formatted (days, hours, minutes)
  - Boot timestamp

### 5. **Disk/Storage Information** (Basic)
- **Tool**: `get_disk_info`
- **Data Points**:
  - All disk drives/partitions
  - Total capacity per drive
  - Used space per drive
  - Free space per drive
  - Filesystem type
  - Mount points

### 6. **Network Information** (Basic)
- **Tool**: `get_network_info`
- **Data Points**:
  - Network interfaces (WiFi, Ethernet, etc.)
  - Local IP addresses (IPv4 & IPv6)
  - MAC addresses
  - Network interface status (up/down)
  - Default gateway
  - DNS servers

### 7. **Hostname & User** (Basic)
- **Tool**: `get_system_identity`
- **Data Points**:
  - Hostname
  - Current username
  - Home directory path
  - Temp directory path

### 8. **Process Information** (Basic)
- **Tool**: `get_process_info`
- **Data Points**:
  - Total running processes count
  - Current process ID (PID)
  - Node.js version
  - Process memory usage

### 9. **Process List** (Intermediate)
- **Tool**: `list_processes`
- **Parameters**:
  - `limit` (optional): Number of processes to return
  - `sortBy` (optional): 'cpu' | 'memory' | 'name'
- **Data Points**:
  - Process name
  - PID
  - CPU usage
  - Memory usage
  - Status

### 10. **System Load** (Basic)
- **Tool**: `get_system_load`
- **Data Points**:
  - Load average (1 min, 5 min, 15 min)
  - CPU load percentage

### 11. **Battery Information** (Intermediate)
- **Tool**: `get_battery_info`
- **Data Points**:
  - Battery present (yes/no)
  - Battery percentage
  - Charging status
  - Time remaining
  - Battery health/capacity

### 12. **Hardware Information** (Intermediate)
- **Tool**: `get_hardware_info`
- **Data Points**:
  - Number of displays
  - Graphics card info
  - USB devices count
  - System manufacturer
  - System model

### 13. **Environment Variables** (Basic)
- **Tool**: `get_environment_info`
- **Parameters**:
  - `variable` (optional): Specific env var to retrieve
- **Data Points**:
  - All environment variables (or specific one)
  - PATH directories
  - Shell info

### 14. **Network Connectivity** (Intermediate)
- **Tool**: `check_internet_connectivity`
- **Data Points**:
  - Internet connected (yes/no)
  - Response time (ping)
  - Connection type

### 15. **Port Information** (Advanced)
- **Tool**: `get_open_ports`
- **Parameters**:
  - `limit` (optional): Max ports to return
- **Data Points**:
  - Open/listening ports
  - Process using port
  - Protocol (TCP/UDP)

### 16. **System Temperature** (Advanced)
- **Tool**: `get_temperature_info`
- **Data Points**:
  - CPU temperature
  - GPU temperature (if available)
  - System temperatures
  - Fan speeds

### 17. **WiFi Networks** (Advanced)
- **Tool**: `scan_wifi_networks`
- **Data Points**:
  - Available WiFi networks
  - Signal strength (RSSI)
  - Security type
  - Currently connected network

### 18. **Bluetooth Devices** (Advanced)
- **Tool**: `get_bluetooth_devices`
- **Data Points**:
  - Paired Bluetooth devices
  - Connected devices
  - Device types

---

## Resources

MCP Resources provide read-only data that can be accessed by clients.

### Resource 1: System Overview
- **URI**: `system://overview`
- **Description**: Complete system snapshot
- **Returns**: JSON with CPU, memory, OS, uptime, disk summary

### Resource 2: Real-time Stats
- **URI**: `system://stats/realtime`
- **Description**: Live system metrics
- **Returns**: CPU usage, memory usage, load averages (updates every second)

### Resource 3: Hardware Profile
- **URI**: `system://hardware`
- **Description**: Hardware specifications
- **Returns**: CPU specs, memory specs, GPU, storage devices

---

## Implementation Structure

```
mcp-system-info/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── tools/
│   │   ├── cpu.ts           # CPU-related tools
│   │   ├── memory.ts        # Memory tools
│   │   ├── disk.ts          # Disk/storage tools
│   │   ├── network.ts       # Network tools
│   │   ├── process.ts       # Process tools
│   │   ├── battery.ts       # Battery tools
│   │   ├── hardware.ts      # Hardware tools
│   │   └── system.ts        # General system tools
│   ├── resources/
│   │   └── systemResources.ts  # MCP resources
│   └── utils/
│       ├── formatters.ts    # Data formatting utilities
│       └── systemInfo.ts    # System info helpers
├── package.json
├── tsconfig.json
├── README.md
├── BLUEPRINT.md             # This file
└── SPECIFICATION.md         # Detailed spec
```

---

## Error Handling

### Error Types
1. **PermissionError**: Insufficient permissions to access system info
2. **NotAvailableError**: Feature not available on current platform
3. **TimeoutError**: System query took too long
4. **UnknownError**: Unexpected error

### Error Response Format
```json
{
  "error": {
    "code": "NOT_AVAILABLE",
    "message": "Battery info not available on desktop systems",
    "tool": "get_battery_info"
  }
}
```

---

## Platform Support

| Feature | Windows | macOS | Linux |
|---------|---------|-------|-------|
| CPU Info | ✅ | ✅ | ✅ |
| Memory | ✅ | ✅ | ✅ |
| Disk Info | ✅ | ✅ | ✅ |
| Network | ✅ | ✅ | ✅ |
| Processes | ✅ | ✅ | ✅ |
| Battery | ✅ | ✅ | ⚠️ (Limited) |
| Temperature | ⚠️ (Limited) | ✅ | ✅ |
| WiFi Scan | ✅ | ✅ | ⚠️ (Requires tools) |
| Bluetooth | ✅ | ✅ | ⚠️ (Limited) |

---

## Security Considerations

1. **Read-Only**: All operations are read-only, no system modifications
2. **No Credentials**: Never exposes passwords or auth tokens
3. **Environment Variables**: Filter sensitive env vars (API keys, passwords)
4. **Process List**: Don't expose command-line arguments (may contain secrets)
5. **Rate Limiting**: Prevent excessive system queries

---

## Performance

### Response Times (Target)
- Basic info (CPU, memory, OS): < 100ms
- Disk info: < 500ms
- Process list: < 1000ms
- Temperature/advanced: < 2000ms

### Caching Strategy
- Static data (CPU model, OS version): Cache indefinitely
- Semi-static (disk space): Cache for 30 seconds
- Dynamic (CPU usage, memory): No caching

---

## Use Cases

1. **System Monitoring**: AI assistants can check system health
2. **Diagnostics**: Troubleshoot performance issues
3. **Resource Planning**: Check available resources before tasks
4. **Documentation**: Generate system specifications
5. **Automation**: Make decisions based on system state

---

## Future Enhancements

### Phase 2 (Advanced)
- Docker container stats
- System log access
- Service/daemon status
- Scheduled task info
- Firewall status

### Phase 3 (Professional)
- Historical metrics
- Alerting thresholds
- Performance profiling
- System benchmarking
- Resource predictions

---

## Getting Started

### Prerequisites
- Node.js 18+
- TypeScript 5+
- Administrator/root access (for some features)

### Installation
```bash
npm install
npm run build
```

### Usage with Claude Desktop
Add to `claude_desktop_config.json`:
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

---

## Testing Strategy

1. **Unit Tests**: Test each tool individually
2. **Integration Tests**: Test MCP communication
3. **Platform Tests**: Test on Windows/macOS/Linux
4. **Permission Tests**: Test with/without admin rights
5. **Error Tests**: Test error handling

---

## Documentation

- README.md: Quick start guide
- BLUEPRINT.md: This document
- SPECIFICATION.md: Technical specification
- API.md: Tool and resource reference
- EXAMPLES.md: Usage examples

---

**Version**: 1.0.0
**Last Updated**: October 2025
**Author**: System Info MCP Server Team
