// Simple test script to verify the MCP server tools work
import { getCPUInfo } from './dist/tools/cpu.js';
import { getMemoryInfo } from './dist/tools/memory.js';
import { getOSInfo } from './dist/tools/system.js';

async function testServer() {
  console.log('Testing System Info MCP Server...\n');

  try {
    // Test CPU Info
    console.log('1. Testing get_cpu_info...');
    const cpuResult = await getCPUInfo();
    if (cpuResult.content && cpuResult.content[0]) {
      const cpuData = JSON.parse(cpuResult.content[0].text);
      console.log('✓ CPU Info:', cpuData.brand, '-', cpuData.cores, 'cores');
    }

    // Test Memory Info
    console.log('\n2. Testing get_memory_info...');
    const memResult = await getMemoryInfo();
    if (memResult.content && memResult.content[0]) {
      const memData = JSON.parse(memResult.content[0].text);
      console.log('✓ Memory Info:', memData.totalGB, 'GB total,', memData.freeGB, 'GB free');
    }

    // Test OS Info
    console.log('\n3. Testing get_os_info...');
    const osResult = await getOSInfo();
    if (osResult.content && osResult.content[0]) {
      const osData = JSON.parse(osResult.content[0].text);
      console.log('✓ OS Info:', osData.distro, osData.release);
    }

    console.log('\n✓ All tests passed! The MCP server is working correctly.');
    console.log('\nYou can now use this server with Claude Desktop.');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  }
}

testServer();
