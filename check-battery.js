// Quick battery check script
import { getBatteryInfo } from './dist/tools/battery.js';

async function checkBattery() {
  console.log('Checking battery status...\n');

  const result = await getBatteryInfo();

  if (result.isError) {
    console.log('❌ Error:', result.content[0].text);
  } else {
    const batteryData = JSON.parse(result.content[0].text);

    if (!batteryData.hasBattery) {
      console.log('🖥️  No battery detected - this appears to be a desktop system');
    } else {
      console.log('🔋 Battery Status:');
      console.log('   Percentage:', batteryData.percent + '%');
      console.log('   Charging:', batteryData.isCharging ? 'Yes' : 'No');
      console.log('   Time Remaining:', batteryData.timeRemaining, 'minutes');

      if (batteryData.health) {
        console.log('   Health:', batteryData.health + '%');
      }
      if (batteryData.cycleCount) {
        console.log('   Cycle Count:', batteryData.cycleCount);
      }
    }
  }
}

checkBattery().catch(console.error);
