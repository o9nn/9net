const llamanet = require("../../index");

/**
 * Stream of Consciousness Demo
 * 
 * This demo shows the 3-threaded stream of consciousness system where:
 * - 3 parallel llama servers run concurrently
 * - Each thread goes through a 12-step cycle (7 expressive + 5 reflective)
 * - Threads start 4 steps apart (120 degrees out of phase)
 * - At any moment:
 *   - One thread is in expressive mode (generating/expressing)
 *   - Another thread is in reflective mode (perceiving/analyzing)
 *   - The third thread is mediating (active inference between the two)
 */

async function main() {
  console.log('Stream of Consciousness Demo\n');
  console.log('Initializing llamanet...\n');
  
  // Initialize llamanet
  await llamanet.run();
  
  console.log('Starting Stream of Consciousness with 3 threads...\n');
  console.log('Configuration:');
  console.log('  - 3 concurrent threads (Alpha, Beta, Gamma)');
  console.log('  - 12-step cycle (7 expressive + 5 reflective)');
  console.log('  - Phase offset: 4 steps (120°)');
  console.log('  - Running 2 complete cycles\n');
  
  // Start the consciousness stream
  // This will run 2 complete cycles (24 steps total)
  const response = await llamanet.run([
    "consciousness",
    "start",
    "--cycles", 2,
    "--delay", 3000  // 3 seconds per step
  ]);
  
  console.log('Stream initiated:', response);
  
  // Wait for the cycles to complete
  // 2 cycles * 12 steps * 3 seconds = 72 seconds
  console.log('\nWaiting for cycles to complete (this will take about 72 seconds)...\n');
  
  await new Promise(resolve => setTimeout(resolve, 75000));
  
  // Check final status
  console.log('\nChecking final status...\n');
  const status = await llamanet.run(["consciousness", "status"]);
  console.log('Final status:', JSON.stringify(status, null, 2));
  
  console.log('\nDemo complete!');
}

main().catch(console.error);
