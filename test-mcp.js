#!/usr/bin/env node

// Simple MCP protocol test script
import { spawn } from 'child_process';

const server = spawn('node', ['dist/index.js'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = '';

server.stdout.on('data', (data) => {
  buffer += data.toString();

  // Try to parse complete JSON-RPC messages
  const lines = buffer.split('\n');
  buffer = lines.pop() || ''; // Keep incomplete line in buffer

  for (const line of lines) {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        console.log('Received:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('Raw output:', line);
      }
    }
  }
});

// Wait for server to initialize
setTimeout(() => {
  console.log('\n=== Testing list_tools ===');
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };

  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

  setTimeout(() => {
    console.log('\n=== Testing get_cpu_info tool ===');
    const callToolRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_cpu_info',
        arguments: {}
      }
    };

    server.stdin.write(JSON.stringify(callToolRequest) + '\n');

    // Give time for response then exit
    setTimeout(() => {
      console.log('\n=== Test complete ===');
      server.kill();
      process.exit(0);
    }, 2000);
  }, 2000);
}, 1000);

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});
