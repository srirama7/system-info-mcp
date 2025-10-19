// Test any tool from your MCP server
import { getBatteryInfo } from './dist/tools/battery.js';
import { getCPUInfo } from './dist/tools/cpu.js';
import { getMemoryInfo } from './dist/tools/memory.js';
import { getOSInfo } from './dist/tools/system.js';
import { getDiskInfo } from './dist/tools/disk.js';
import { getNetworkInfo } from './dist/tools/network.js';
import { listProcesses } from './dist/tools/process.js';

async function testTools() {
  console.log('='.repeat(60));
  console.log('SYSTEM INFORMATION REPORT');
  console.log('='.repeat(60));

  // Battery
  console.log('\n🔋 BATTERY:');
  const battery = await getBatteryInfo();
  const batteryData = JSON.parse(battery.content[0].text);
  if (batteryData.hasBattery) {
    console.log(`   ${batteryData.percent}% ${batteryData.isCharging ? '(Charging)' : '(On Battery)'}`);
  } else {
    console.log('   Desktop system (no battery)');
  }

  // CPU
  console.log('\n💻 CPU:');
  const cpu = await getCPUInfo();
  const cpuData = JSON.parse(cpu.content[0].text);
  console.log(`   ${cpuData.brand}`);
  console.log(`   ${cpuData.cores} cores @ ${cpuData.speed} GHz`);
  console.log(`   Usage: ${cpuData.usage}%`);

  // Memory
  console.log('\n🧠 MEMORY:');
  const mem = await getMemoryInfo();
  const memData = JSON.parse(mem.content[0].text);
  console.log(`   Total: ${memData.totalGB} GB`);
  console.log(`   Used: ${memData.usedGB} GB (${memData.usagePercent}%)`);
  console.log(`   Free: ${memData.freeGB} GB`);

  // OS
  console.log('\n🖥️  OPERATING SYSTEM:');
  const os = await getOSInfo();
  const osData = JSON.parse(os.content[0].text);
  console.log(`   ${osData.distro}`);
  console.log(`   Version: ${osData.release}`);
  console.log(`   Hostname: ${osData.hostname}`);
  console.log(`   Uptime: ${osData.uptimeFormatted}`);

  // Disk
  console.log('\n💾 DISKS:');
  const disk = await getDiskInfo();
  const diskData = JSON.parse(disk.content[0].text);
  diskData.disks.forEach(d => {
    console.log(`   ${d.mount}: ${d.usedGB}/${d.sizeGB} GB (${d.usagePercent}% used)`);
  });

  // Network
  console.log('\n🌐 NETWORK:');
  const net = await getNetworkInfo();
  const netData = JSON.parse(net.content[0].text);
  netData.interfaces.forEach(iface => {
    if (iface.status === 'up' && iface.ipv4) {
      console.log(`   ${iface.name}: ${iface.ipv4} (${iface.type})`);
    }
  });

  // Top Processes
  console.log('\n⚡ TOP 5 PROCESSES (by CPU):');
  const procs = await listProcesses(5, 'cpu');
  const procData = JSON.parse(procs.content[0].text);
  procData.processes.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.name} - CPU: ${p.cpu}%, RAM: ${p.memoryPercent}%`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('✅ Report complete!\n');
}

testTools().catch(console.error);
