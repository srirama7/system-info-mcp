# System Info MCP Server - Technical Specification

## Document Information
- **Version**: 1.0.0
- **Status**: Draft
- **Last Updated**: October 16, 2025
- **Target MCP Version**: 1.0

---

## 1. Introduction

### 1.1 Purpose
This specification defines the technical requirements, API contracts, and implementation details for the System Info MCP Server - a comprehensive system monitoring and information retrieval service using the Model Context Protocol.

### 1.2 Scope
The server provides 18 tools and 3 resources covering CPU, memory, disk, network, processes, battery, hardware, and environmental information across Windows, macOS, and Linux platforms.

### 1.3 Target Audience
- MCP Server Developers
- System Integrators
- AI Application Developers
- Technical Architects

---

## 2. System Architecture

### 2.1 Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 18+ | JavaScript execution |
| Language | TypeScript | 5.0+ | Type safety |
| MCP SDK | @modelcontextprotocol/sdk | Latest | MCP protocol implementation |
| System Info | systeminformation | 5.21+ | Cross-platform system data |
| Disk Info | node-disk-info | 1.3+ | Disk/partition information |

### 2.2 Transport Protocol
**Stdio Transport**: Server communicates via standard input/output streams, suitable for local execution and Claude Desktop integration.

### 2.3 Project Structure
```
mcp-system-info/
├── src/
│   ├── index.ts                    # Server entry point & initialization
│   ├── types/
│   │   ├── tools.ts               # Tool type definitions
│   │   └── responses.ts           # Response type definitions
│   ├── tools/
│   │   ├── cpu.ts                 # CPU tools implementation
│   │   ├── memory.ts              # Memory tools
│   │   ├── disk.ts                # Disk/storage tools
│   │   ├── network.ts             # Network tools
│   │   ├── process.ts             # Process management tools
│   │   ├── battery.ts             # Battery tools
│   │   ├── hardware.ts            # Hardware detection tools
│   │   ├── system.ts              # System identity tools
│   │   ├── environment.ts         # Environment variables
│   │   ├── temperature.ts         # Temperature sensors
│   │   ├── wifi.ts                # WiFi scanning
│   │   └── bluetooth.ts           # Bluetooth devices
│   ├── resources/
│   │   └── systemResources.ts     # MCP resource handlers
│   ├── utils/
│   │   ├── formatters.ts          # Data formatting utilities
│   │   ├── cache.ts               # Caching mechanism
│   │   ├── platform.ts            # Platform detection
│   │   └── errors.ts              # Error handling
│   └── config/
│       └── constants.ts           # Configuration constants
├── dist/                           # Compiled JavaScript output
├── tests/
│   ├── unit/                      # Unit tests
│   └── integration/               # Integration tests
├── package.json
├── tsconfig.json
├── README.md
├── BLUEPRINT.md
├── SPECIFICATION.md               # This file
└── API.md
```

---

## 3. Tool Specifications

### 3.1 Tool: `get_cpu_info`

**Description**: Retrieves comprehensive CPU information including cores, model, speed, architecture, and current usage.

**Parameters**: None

**Response Schema**:
```typescript
{
  manufacturer: string;      // "Intel", "AMD", "Apple"
  brand: string;            // "Intel(R) Core(TM) i7-9750H"
  speed: number;            // GHz (e.g., 2.6)
  cores: number;            // Physical cores
  physicalCores: number;    // Physical cores
  logicalCores: number;     // Logical cores (with hyperthreading)
  architecture: string;     // "x64", "arm64"
  usage: number;            // Current usage percentage (0-100)
  temperature?: number;     // Celsius (if available)
}
```

**Error Conditions**:
- `PERMISSION_DENIED`: Insufficient permissions for CPU usage/temperature
- `NOT_AVAILABLE`: CPU temperature not available on platform

**Example Response**:
```json
{
  "manufacturer": "Intel",
  "brand": "Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz",
  "speed": 2.6,
  "cores": 6,
  "physicalCores": 6,
  "logicalCores": 12,
  "architecture": "x64",
  "usage": 23.5,
  "temperature": 55
}
```

---

### 3.2 Tool: `get_memory_info`

**Description**: Returns memory (RAM) information including total, free, used, and swap memory.

**Parameters**: None

**Response Schema**:
```typescript
{
  total: number;           // Total RAM in bytes
  free: number;            // Free RAM in bytes
  used: number;            // Used RAM in bytes
  usagePercent: number;    // Usage percentage (0-100)
  totalGB: number;         // Total RAM in GB (formatted)
  freeGB: number;          // Free RAM in GB
  usedGB: number;          // Used RAM in GB
  swap: {
    total: number;         // Total swap in bytes
    free: number;          // Free swap in bytes
    used: number;          // Used swap in bytes
  }
}
```

**Example Response**:
```json
{
  "total": 17179869184,
  "free": 4294967296,
  "used": 12884901888,
  "usagePercent": 75.0,
  "totalGB": 16.0,
  "freeGB": 4.0,
  "usedGB": 12.0,
  "swap": {
    "total": 2147483648,
    "free": 1073741824,
    "used": 1073741824
  }
}
```

---

### 3.3 Tool: `get_os_info`

**Description**: Operating system information including platform, version, hostname, and uptime.

**Parameters**: None

**Response Schema**:
```typescript
{
  platform: string;        // "Windows", "macOS", "Linux"
  distro: string;          // "Windows 11 Pro", "macOS Sonoma"
  release: string;         // "10.0.22621"
  codename: string;        // OS codename
  kernel: string;          // Kernel version
  arch: string;            // "x64", "arm64"
  hostname: string;        // Computer name
  build: string;           // Build number
  uptime: number;          // Uptime in seconds
  uptimeFormatted: string; // "2 days, 5 hours, 23 minutes"
  bootTime: string;        // ISO timestamp of boot
}
```

**Example Response**:
```json
{
  "platform": "Windows",
  "distro": "Microsoft Windows 11 Pro",
  "release": "10.0.22621",
  "codename": "",
  "kernel": "10.0.22621",
  "arch": "x64",
  "hostname": "DESKTOP-ABC123",
  "build": "22621",
  "uptime": 186420,
  "uptimeFormatted": "2 days, 3 hours, 47 minutes",
  "bootTime": "2025-10-14T13:30:00.000Z"
}
```

---

### 3.4 Tool: `get_uptime`

**Description**: System uptime information.

**Parameters**: None

**Response Schema**:
```typescript
{
  seconds: number;         // Total uptime in seconds
  formatted: string;       // Human-readable format
  days: number;
  hours: number;
  minutes: number;
  bootTime: string;        // ISO timestamp
}
```

**Example Response**:
```json
{
  "seconds": 186420,
  "formatted": "2 days, 3 hours, 47 minutes",
  "days": 2,
  "hours": 3,
  "minutes": 47,
  "bootTime": "2025-10-14T13:30:00.000Z"
}
```

---

### 3.5 Tool: `get_disk_info`

**Description**: Disk and storage device information for all mounted drives.

**Parameters**: None

**Response Schema**:
```typescript
{
  disks: Array<{
    filesystem: string;    // "NTFS", "APFS", "ext4"
    mount: string;         // "C:", "/", "/home"
    type: string;          // "local", "network"
    size: number;          // Total size in bytes
    used: number;          // Used space in bytes
    available: number;     // Available space in bytes
    usagePercent: number;  // Usage percentage
    sizeGB: number;        // Size in GB
    usedGB: number;        // Used in GB
    availableGB: number;   // Available in GB
  }>
}
```

**Example Response**:
```json
{
  "disks": [
    {
      "filesystem": "NTFS",
      "mount": "C:",
      "type": "local",
      "size": 512110190592,
      "used": 358485377024,
      "available": 153624813568,
      "usagePercent": 70.0,
      "sizeGB": 476.9,
      "usedGB": 333.8,
      "availableGB": 143.1
    }
  ]
}
```

---

### 3.6 Tool: `get_network_info`

**Description**: Network interface information including IP addresses, MAC addresses, and status.

**Parameters**: None

**Response Schema**:
```typescript
{
  interfaces: Array<{
    name: string;          // "eth0", "Wi-Fi", "en0"
    type: string;          // "wired", "wireless"
    mac: string;           // MAC address
    ipv4: string;          // IPv4 address
    ipv6: string;          // IPv6 address
    netmask: string;       // Subnet mask
    status: string;        // "up", "down"
    speed: number;         // Speed in Mbps
  }>,
  defaultGateway: string;  // Default gateway IP
  dnsServers: string[];    // DNS server IPs
}
```

**Example Response**:
```json
{
  "interfaces": [
    {
      "name": "Wi-Fi",
      "type": "wireless",
      "mac": "AA:BB:CC:DD:EE:FF",
      "ipv4": "192.168.1.100",
      "ipv6": "fe80::1234:5678:abcd:ef01",
      "netmask": "255.255.255.0",
      "status": "up",
      "speed": 867
    }
  ],
  "defaultGateway": "192.168.1.1",
  "dnsServers": ["8.8.8.8", "8.8.4.4"]
}
```

---

### 3.7 Tool: `get_system_identity`

**Description**: System identity information including hostname, username, and directory paths.

**Parameters**: None

**Response Schema**:
```typescript
{
  hostname: string;        // Computer hostname
  username: string;        // Current user
  homeDir: string;         // Home directory path
  tempDir: string;         // Temp directory path
  shell?: string;          // Default shell (Unix/Mac)
}
```

**Example Response**:
```json
{
  "hostname": "DESKTOP-ABC123",
  "username": "amogh",
  "homeDir": "C:\\Users\\amogh",
  "tempDir": "C:\\Users\\amogh\\AppData\\Local\\Temp",
  "shell": "powershell.exe"
}
```

---

### 3.8 Tool: `get_process_info`

**Description**: Information about the current Node.js process and total system processes.

**Parameters**: None

**Response Schema**:
```typescript
{
  currentPid: number;      // Current process ID
  parentPid: number;       // Parent process ID
  nodeVersion: string;     // Node.js version
  totalProcesses: number;  // Total running processes
  processMemory: {
    rss: number;           // Resident set size
    heapTotal: number;     // Total heap
    heapUsed: number;      // Used heap
    external: number;      // External memory
  }
}
```

---

### 3.9 Tool: `list_processes`

**Description**: Lists running processes with CPU and memory usage.

**Parameters**:
```typescript
{
  limit?: number;          // Max processes to return (default: 20)
  sortBy?: "cpu" | "memory" | "name"; // Sort order (default: "cpu")
}
```

**Response Schema**:
```typescript
{
  processes: Array<{
    pid: number;           // Process ID
    name: string;          // Process name
    cpu: number;           // CPU usage %
    memory: number;        // Memory usage in bytes
    memoryPercent: number; // Memory usage %
    state: string;         // "running", "sleeping", "stopped"
  }>,
  total: number;           // Total processes found
}
```

**Example Response**:
```json
{
  "processes": [
    {
      "pid": 1234,
      "name": "chrome.exe",
      "cpu": 15.3,
      "memory": 524288000,
      "memoryPercent": 3.2,
      "state": "running"
    }
  ],
  "total": 156
}
```

---

### 3.10 Tool: `get_system_load`

**Description**: System load averages and CPU load.

**Parameters**: None

**Response Schema**:
```typescript
{
  avgLoad: number;         // Average load percentage
  currentLoad: number;     // Current CPU load %
  loadAverage: {
    1: number;             // 1-minute load average
    5: number;             // 5-minute load average
    15: number;            // 15-minute load average
  }
}
```

**Example Response**:
```json
{
  "avgLoad": 2.5,
  "currentLoad": 34.2,
  "loadAverage": {
    "1": 2.5,
    "5": 2.1,
    "15": 1.8
  }
}
```

---

### 3.11 Tool: `get_battery_info`

**Description**: Battery status and health information (laptops/mobile devices).

**Parameters**: None

**Response Schema**:
```typescript
{
  hasBattery: boolean;     // Battery present
  isCharging: boolean;     // Currently charging
  percent: number;         // Battery percentage (0-100)
  timeRemaining: number;   // Minutes remaining
  cycleCount?: number;     // Battery cycle count
  health?: number;         // Battery health %
  capacity?: number;       // Design capacity
  voltage?: number;        // Current voltage
}
```

**Error Conditions**:
- `NOT_AVAILABLE`: No battery detected (desktop systems)

**Example Response**:
```json
{
  "hasBattery": true,
  "isCharging": false,
  "percent": 67,
  "timeRemaining": 180,
  "cycleCount": 245,
  "health": 85,
  "capacity": 5000,
  "voltage": 11.4
}
```

---

### 3.12 Tool: `get_hardware_info`

**Description**: Hardware device information including graphics, displays, and peripherals.

**Parameters**: None

**Response Schema**:
```typescript
{
  graphics: Array<{
    vendor: string;        // "NVIDIA", "AMD", "Intel"
    model: string;         // GPU model
    vram: number;          // VRAM in MB
  }>,
  displays: Array<{
    vendor: string;
    model: string;
    resolutionX: number;
    resolutionY: number;
    main: boolean;         // Primary display
  }>,
  manufacturer: string;    // System manufacturer
  model: string;           // System model
  uuid: string;            // System UUID
  usbDevices: number;      // Number of USB devices
}
```

---

### 3.13 Tool: `get_environment_info`

**Description**: Environment variables and system paths.

**Parameters**:
```typescript
{
  variable?: string;       // Optional: specific variable name
}
```


**Response Schema**:
```typescript
{
  variables: Record<string, string>; // All env vars (filtered)
  path: string[];          // PATH directories
  shell: string;           // Shell executable
  editor?: string;         // Default editor
}
```

**Security**: Automatically filters sensitive variables (API_KEY, PASSWORD, SECRET, TOKEN, etc.)

---

### 3.14 Tool: `check_internet_connectivity`

**Description**: Tests internet connectivity and measures latency.

**Parameters**: None

**Response Schema**:
```typescript
{
  connected: boolean;      // Internet accessible
  latency: number;         // Ping time in ms
  timestamp: string;       // ISO timestamp of check
}
```

---

### 3.15 Tool: `get_open_ports`

**Description**: Lists open/listening network ports.

**Parameters**:
```typescript
{
  limit?: number;          // Max ports to return (default: 50)
}
```

**Response Schema**:
```typescript
{
  ports: Array<{
    port: number;          // Port number
    protocol: string;      // "TCP", "UDP"
    process: string;       // Process using port
    state: string;         // "LISTEN", "ESTABLISHED"
  }>
}
```

**Permissions**: May require elevated privileges on some platforms.

---

### 3.16 Tool: `get_temperature_info`

**Description**: Hardware temperature sensors (CPU, GPU, drives).

**Parameters**: None

**Response Schema**:
```typescript
{
  cpu?: number;            // CPU temp (°C)
  cpuMax?: number;         // Max safe CPU temp
  gpu?: number;            // GPU temp (°C)
  drives?: Array<{
    name: string;
    temperature: number;
  }>,
  fans?: Array<{
    name: string;
    rpm: number;           // Fan speed
  }>
}
```

**Platform Support**: Best on Linux, limited on Windows, good on macOS.

---

### 3.17 Tool: `scan_wifi_networks`

**Description**: Scans for available WiFi networks.

**Parameters**: None

**Response Schema**:
```typescript
{
  networks: Array<{
    ssid: string;          // Network name
    bssid: string;         // MAC address
    signalLevel: number;   // Signal strength (dBm)
    security: string;      // "WPA2", "Open", etc.
    channel: number;       // WiFi channel
    frequency: number;     // Frequency (MHz)
    connected: boolean;    // Currently connected
  }>
}
```

**Permissions**: Requires admin/root on most platforms.

---

### 3.18 Tool: `get_bluetooth_devices`

**Description**: Lists paired and connected Bluetooth devices.

**Parameters**: None

**Response Schema**:
```typescript
{
  devices: Array<{
    name: string;          // Device name
    address: string;       // MAC address
    connected: boolean;    // Connection status
    paired: boolean;       // Pairing status
    type: string;          // "audio", "input", "phone", etc.
  }>
}
```

**Platform Support**: Windows and macOS fully supported, Linux requires `bluez`.

---

## 4. Resource Specifications

### 4.1 Resource: `system://overview`

**Description**: Complete system snapshot with all basic metrics.

**MIME Type**: `application/json`

**Response**: JSON object containing CPU, memory, OS, disk summary, and network info.

**Cache Duration**: 30 seconds

---

### 4.2 Resource: `system://stats/realtime`

**Description**: Real-time system statistics (updates every second).

**MIME Type**: `application/json`

**Response**: CPU usage, memory usage, load averages, network throughput.

**Cache Duration**: None (always fresh)

---

### 4.3 Resource: `system://hardware`

**Description**: Hardware specifications profile.

**MIME Type**: `application/json`

**Response**: CPU specs, memory specs, GPU info, storage devices, display info.

**Cache Duration**: Indefinite (static data)

---

## 5. Error Handling

### 5.1 Error Codes

| Code | Description | HTTP Equivalent |
|------|-------------|-----------------|
| `PERMISSION_DENIED` | Insufficient permissions | 403 |
| `NOT_AVAILABLE` | Feature unavailable on platform | 404 |
| `TIMEOUT` | Operation timed out | 408 |
| `INVALID_PARAMETER` | Invalid input parameter | 400 |
| `INTERNAL_ERROR` | Unexpected internal error | 500 |

### 5.2 Error Response Format

```typescript
{
  isError: true,
  content: [{
    type: "text",
    text: JSON.stringify({
      error: {
        code: string,
        message: string,
        tool: string,
        details?: any
      }
    })
  }]
}
```

---

## 6. Performance Requirements

### 6.1 Response Time Targets

| Category | Target | Maximum |
|----------|--------|---------|
| Basic info (CPU, Memory, OS) | < 100ms | < 250ms |
| Disk info | < 500ms | < 1s |
| Process list | < 1s | < 2s |
| Network scan | < 2s | < 5s |
| WiFi scan | < 3s | < 10s |

### 6.2 Caching Strategy

| Data Type | Cache Duration | Rationale |
|-----------|---------------|-----------|
| CPU model, OS version | Infinite | Static |
| Disk capacity | 5 minutes | Semi-static |
| Network interfaces | 1 minute | Semi-static |
| CPU usage, memory | None | Dynamic |
| Process list | None | Dynamic |

---

## 7. Security Considerations

### 7.1 Data Filtering
- **Environment Variables**: Filter sensitive keys (API_KEY, PASSWORD, SECRET, TOKEN, AWS_, GOOGLE_)
- **Process List**: Exclude command-line arguments (may contain secrets)
- **File Paths**: Sanitize user directory paths

### 7.2 Permissions
- Request minimum necessary permissions
- Gracefully degrade when permissions denied
- Document which features require elevated privileges

### 7.3 Rate Limiting
- Limit process list queries to 1 per second
- Limit network scans to 1 per 5 seconds
- Prevent resource exhaustion

---

## 8. Testing Requirements

### 8.1 Unit Tests
- Test each tool individually
- Mock system calls
- Coverage target: 80%

### 8.2 Integration Tests
- Test MCP protocol communication
- Test error handling
- Test cross-platform compatibility

### 8.3 Platform Tests
- Test on Windows 10/11
- Test on macOS 12+
- Test on Ubuntu 20.04+

---

## 9. Deployment

### 9.1 Build Process
```bash
npm install
npm run build
npm test
```

### 9.2 Distribution
- NPM package: `@your-org/mcp-system-info`
- Standalone executable (optional)

### 9.3 Configuration
Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "system-info": {
      "command": "node",
      "args": ["path/to/dist/index.js"]
    }
  }
}
```

---

## 10. Dependencies

### 10.1 Production Dependencies
```json
{
  "@modelcontextprotocol/sdk": "^1.0.0",
  "systeminformation": "^5.21.0",
  "node-disk-info": "^1.3.0"
}
```

### 10.2 Development Dependencies
```json
{
  "typescript": "^5.0.0",
  "@types/node": "^20.0.0",
  "jest": "^29.0.0",
  "@types/jest": "^29.0.0",
  "ts-jest": "^29.0.0"
}
```

---

## 11. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-16 | Initial specification |

---

## 12. References

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [systeminformation Documentation](https://systeminformation.io)
- [Node.js OS Module](https://nodejs.org/api/os.html)

---

**Document Status**: Draft
**Review Status**: Pending
**Approval**: Pending
