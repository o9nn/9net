const llamanet = require("../../index");

/**
 * Stream of Consciousness Quick Demo
 * 
 * This demo shows how to start and monitor the stream of consciousness system
 */

async function main() {
  console.log('Stream of Consciousness Quick Demo\n');
  
  // Initialize llamanet
  await llamanet.run();
  
  console.log('Starting Stream of Consciousness (1 cycle)...\n');
  
  // Start the consciousness stream with 1 cycle
  const response = await llamanet.run([
    "consciousness",
    "start",
    "--cycles", 1,
    "--delay", 2000  // 2 seconds per step for faster demo
  ]);
  
  console.log('Response:', response);
  
  // Check status every 5 seconds
  console.log('\nMonitoring status (will check 6 times)...\n');
  
  for (let i = 0; i < 6; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const status = await llamanet.run(["consciousness", "status"]);
    console.log(`\n[Check ${i + 1}/6] Current step: ${status.currentStep} | Running: ${status.running}`);
    
    if (status.threads && status.threads.length > 0) {
      status.threads.forEach(thread => {
        console.log(`  ${thread.name}: ${thread.currentRole} (${thread.currentPhase.phase} phase, step ${thread.currentPhase.phaseStep})`);
      });
    }
  }
  
  console.log('\nDemo complete!');
}

main().catch(console.error);
