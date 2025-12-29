#!/usr/bin/env python3
"""
Stream of Consciousness Demo (Python)

This demo shows the 3-threaded stream of consciousness system where:
- 3 parallel llama servers run concurrently
- Each thread goes through a 12-step cycle (7 expressive + 5 reflective)
- Threads start 4 steps apart (120 degrees out of phase)
"""

import llamanet
import time
import json

def main():
    print('Stream of Consciousness Demo (Python)\n')
    print('Initializing llamanet...\n')
    
    # Initialize llamanet
    llamanet.run()
    
    print('Starting Stream of Consciousness with 3 threads...\n')
    print('Configuration:')
    print('  - 3 concurrent threads (Alpha, Beta, Gamma)')
    print('  - 12-step cycle (7 expressive + 5 reflective)')
    print('  - Phase offset: 4 steps (120°)')
    print('  - Running 1 complete cycle\n')
    
    # Start the consciousness stream
    response = llamanet.run([
        "consciousness",
        "start",
        "--cycles", "1",
        "--delay", "2000"  # 2 seconds per step
    ])
    
    print('Stream initiated:', response)
    print('\nMonitoring status every 5 seconds...\n')
    
    # Monitor status for 30 seconds
    for i in range(6):
        time.sleep(5)
        
        status = llamanet.run(["consciousness", "status"])
        print(f'\n[Check {i + 1}/6] Current step: {status.get("currentStep", "N/A")} | Running: {status.get("running", False)}')
        
        threads = status.get('threads', [])
        for thread in threads:
            role = thread.get('currentRole', 'unknown')
            phase = thread.get('currentPhase', {})
            print(f'  {thread.get("name", "Thread")}: {role} ({phase.get("phase", "unknown")} phase, step {phase.get("phaseStep", "N/A")})')
    
    print('\nDemo complete!')

if __name__ == '__main__':
    main()
