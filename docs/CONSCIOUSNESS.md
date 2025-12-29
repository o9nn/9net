# Stream of Consciousness

The Stream of Consciousness system is a sophisticated orchestration layer that manages 3 concurrent llama.cpp servers working in synchronized phases to create a continuous stream of consciousness through active inference.

## Overview

The system implements a 12-step cycle where each of the 3 threads (named Alpha, Beta, and Gamma) progresses through different phases:

- **7 Expressive Steps** (Steps 0-6): Active generation and expression
- **5 Reflective Steps** (Steps 7-11): Reflective perception and analysis

### Phase Synchronization

The threads are offset by 4 steps (120 degrees out of phase), ensuring that at any given moment:

1. **One thread is expressing** - Actively generating content
2. **One thread is reflecting** - Perceiving and analyzing
3. **One thread is mediating** - Performing active inference between the expressive and reflective threads

This creates a continuous stream where different cognitive processes are always active simultaneously.

## Architecture

```
Step:      0  1  2  3  4  5  6  7  8  9  10 11 | 0  1  2  ...
           ├──────────────┼──────────┤
Alpha:     [Expressive   ][Reflective]
Beta:                  [Expressive   ][Reflective]
Gamma:                          [Expressive   ][Reflective]

Cycle repeats every 12 steps
```

At any step, the threads have different roles:
- **Expressive**: Generating creative output
- **Reflective**: Analyzing and perceiving patterns
- **Mediating**: Integrating insights through active inference

## Usage

### Command Line

Start the stream of consciousness:

```bash
npx llamanet consciousness start --cycles 2 --delay 3000
```

Check status:

```bash
npx llamanet consciousness status
```

Stop the stream:

```bash
npx llamanet consciousness stop
```

### Node.js API

```javascript
const llamanet = require('llamanet');

async function main() {
  await llamanet.run();
  
  // Start with 2 cycles, 3 second delay per step
  await llamanet.run([
    "consciousness",
    "start",
    "--cycles", 2,
    "--delay", 3000
  ]);
  
  // Check status
  const status = await llamanet.run(["consciousness", "status"]);
  console.log(status);
  
  // Stop
  await llamanet.run(["consciousness", "stop"]);
}

main();
```

### Python API

```python
import llamanet

# Initialize
llamanet.run()

# Start with 1 cycle, 2 second delay per step
llamanet.run([
    "consciousness",
    "start",
    "--cycles", "1",
    "--delay", "2000"
])

# Check status
status = llamanet.run(["consciousness", "status"])
print(status)

# Stop
llamanet.run(["consciousness", "stop"])
```

## Configuration Options

- `--cycles`: Number of complete 12-step cycles to run (default: Infinity, runs continuously)
- `--delay`: Milliseconds to wait between steps (default: 5000)
- `--models`: Array of model URLs, one for each thread (uses default model if not specified)

## Examples

### Run indefinitely with 5-second intervals

```bash
npx llamanet consciousness start --delay 5000
```

### Run 3 cycles with 2-second intervals

```bash
npx llamanet consciousness start --cycles 3 --delay 2000
```

### Use specific models for each thread

```javascript
await llamanet.run([
  "consciousness",
  "start",
  "--models", [
    "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf",
    "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf",
    "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf"
  ],
  "--cycles", 2
]);
```

## Status Response

The status command returns detailed information about the current state:

```json
{
  "running": true,
  "currentStep": 5,
  "threads": [
    {
      "name": "Thread-Alpha",
      "offset": 0,
      "port": 42425,
      "model": "https://...",
      "currentPhase": {
        "localStep": 5,
        "phase": "expressive",
        "phaseStep": 5,
        "isExpressive": true,
        "isReflective": false
      },
      "currentRole": "expressive",
      "historyLength": 5
    },
    {
      "name": "Thread-Beta",
      "offset": 4,
      "port": 42426,
      "model": "https://...",
      "currentPhase": {
        "localStep": 9,
        "phase": "reflective",
        "phaseStep": 2,
        "isExpressive": false,
        "isReflective": true
      },
      "currentRole": "reflective",
      "historyLength": 5
    },
    {
      "name": "Thread-Gamma",
      "offset": 8,
      "port": 42427,
      "model": "https://...",
      "currentPhase": {
        "localStep": 1,
        "phase": "expressive",
        "phaseStep": 1,
        "isExpressive": true,
        "isReflective": false
      },
      "currentRole": "mediating",
      "historyLength": 5
    }
  ]
}
```

## Theory: Active Inference and Stream of Consciousness

The Stream of Consciousness system is based on the concept of **active inference**, where:

1. **Expressive threads** generate predictions and hypotheses
2. **Reflective threads** compare predictions with observations
3. **Mediating threads** minimize prediction errors and update beliefs

This creates a continuous cycle of:
- Generation (expression)
- Verification (reflection)
- Integration (mediation)

The 120-degree phase offset ensures that these processes happen continuously and simultaneously, creating an emergent stream of consciousness that's greater than the sum of its parts.

## Performance Considerations

- Each thread runs a separate llama.cpp server instance
- Memory usage scales with the number of threads (3 servers)
- CPU/GPU usage depends on the models used
- Use smaller quantized models (e.g., Q4 variants) for better performance

## Advanced Usage

### Extending the System

The `ConsciousnessOrchestrator` class can be extended to:
- Add custom prompt generation for each phase
- Implement actual LLM inference calls
- Store and analyze the conversation history
- Add inter-thread communication mechanisms
- Implement memory and attention mechanisms

### Integration with Existing Code

The consciousness system integrates seamlessly with existing llamanet functionality:

```javascript
const llamanet = require('llamanet');
const OpenAI = require('openai');

// Start consciousness system in background
await llamanet.run();
await llamanet.run(["consciousness", "start", "--cycles", 1]);

// Continue making regular OpenAI API calls
const openai = new OpenAI();
const response = await openai.chat.completions.create({
  model: "https://huggingface.co/...",
  messages: [{ role: "user", content: "Hello" }]
});
```

## Demos

Try the included demos:

**JavaScript:**
```bash
cd demos/js
node consciousness.js
node consciousness_quick.js
```

**Python:**
```bash
cd demos/python
python consciousness.py
```
