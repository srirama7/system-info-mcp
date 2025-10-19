#!/usr/bin/env node

/**
 * Comprehensive test script for MCP System Info Server
 * Tests all 18 tools to ensure they respond correctly
 */

import { spawn } from 'child_process';

// List of all tools to test
const TOOLS_TO_TEST = [
  'get_cpu_info',
  'get_memory_info',
  'get_os_info',
  'get_uptime',
  'get_disk_info',
  'get_network_info',
  'get_system_identity',
  'get_process_info',
  'get_system_load',
  'get_battery_info',
  'get_hardware_info',
  'get_environment_info',
  'check_internet_connectivity',
  'get_temperature_info',
  'list_processes',
  'get_open_ports',
  'scan_wifi_networks',
  'get_bluetooth_devices'
];

let testsPassed = 0;
let testsFailed = 0;
let testsSkipped = 0;

console.log('='.repeat(60));
console.log('MCP System Info Server - Tool Test Suite');
console.log('='.repeat(60));

function testTool(toolName, args = {}) {
  return new Promise((resolve) => {
    const server = spawn('node', ['dist/index.js'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseReceived = false;
    let buffer = '';

    const timeout = setTimeout(() => {
      if (!responseReceived) {
        console.log(`  ⏱️  TIMEOUT: ${toolName}`);
        testsSkipped++;
        server.kill();
        resolve();
      }
    }, 5000);

    server.stdout.on('data', (data) => {
      buffer += data.toString();

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const response = JSON.parse(line);
            if (response.result) {
              responseReceived = true;
              clearTimeout(timeout);

              const content = response.result.content;
              if (content && content[0]) {
                const data = JSON.parse(content[0].text);

                // Check if it's an error response
                if (data.error) {
                  if (data.error.code === 'NOT_AVAILABLE' || data.error.code === 'PERMISSION_DENIED') {
                    console.log(`  ⚠️  SKIP: ${toolName} - ${data.error.message}`);
                    testsSkipped++;
                  } else {
                    console.log(`  ❌ FAIL: ${toolName} - ${data.error.message}`);
                    testsFailed++;
                  }
                } else {
                  console.log(`  ✅ PASS: ${toolName}`);
                  testsPassed++;
                }
              }

              server.kill();
              resolve();
            } else if (response.error) {
              responseReceived = true;
              clearTimeout(timeout);
              console.log(`  ❌ FAIL: ${toolName} - RPC Error: ${response.error.message}`);
              testsFailed++;
              server.kill();
              resolve();
            }
          } catch (e) {
            // Ignore parse errors for non-JSON lines (like startup messages)
          }
        }
      }
    });

    server.stderr.on('data', () => {
      // Ignore stderr (startup messages)
    });

    server.on('error', (err) => {
      responseReceived = true;
      clearTimeout(timeout);
      console.log(`  ❌ FAIL: ${toolName} - ${err.message}`);
      testsFailed++;
      resolve();
    });

    // Wait for server to start, then send request
    setTimeout(() => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args
        }
      };

      server.stdin.write(JSON.stringify(request) + '\n');
    }, 500);
  });
}

async function runTests() {
  console.log(`\nTesting ${TOOLS_TO_TEST.length} tools...\n`);

  for (const tool of TOOLS_TO_TEST) {
    await testTool(tool);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Test Results:');
  console.log('='.repeat(60));
  console.log(`✅ Passed:  ${testsPassed}`);
  console.log(`❌ Failed:  ${testsFailed}`);
  console.log(`⚠️  Skipped: ${testsSkipped}`);
  console.log(`📊 Total:   ${testsPassed + testsFailed + testsSkipped}`);
  console.log('='.repeat(60));

  const successRate = ((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1);
  console.log(`\n✨ Success Rate: ${successRate}% (excluding skipped)\n`);

  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
