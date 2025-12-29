const colors = require('colors')
const util = require('./util')

// Stream of Consciousness Orchestrator
// Manages 3 concurrent threads cycling through 12 steps:
// - 7 expressive steps (steps 0-6): active generation/expression
// - 5 reflective steps (steps 7-11): reflective perception
// Threads are offset by 4 steps (120 degrees out of phase)

class ConsciousnessOrchestrator {
  constructor(handler) {
    this.handler = handler
    this.threads = []
    this.currentStep = 0
    this.running = false
    this.stepDelay = 5000 // 5 seconds per step by default
    
    // Define the 12-step cycle
    this.totalSteps = 12
    this.expressiveSteps = 7  // Steps 0-6
    this.reflectiveSteps = 5  // Steps 7-11
    this.phaseOffset = 4      // 120 degrees = 4 steps in a 12-step cycle
    
    // Thread configuration
    this.threadCount = 3
    this.threadConfigs = [
      { id: 0, name: 'Thread-Alpha', offset: 0, model: null },
      { id: 1, name: 'Thread-Beta', offset: 4, model: null },
      { id: 2, name: 'Thread-Gamma', offset: 8, model: null }
    ]
  }

  /**
   * Get the current phase for a thread at a given step
   * @param {number} threadOffset - Thread's phase offset
   * @param {number} currentStep - Current global step
   * @returns {Object} Phase info
   */
  getThreadPhase(threadOffset, currentStep) {
    const localStep = (currentStep + threadOffset) % this.totalSteps
    const isExpressive = localStep < this.expressiveSteps
    const phase = isExpressive ? 'expressive' : 'reflective'
    const phaseStep = isExpressive ? localStep : localStep - this.expressiveSteps
    
    return {
      localStep,
      phase,
      phaseStep,
      isExpressive,
      isReflective: !isExpressive
    }
  }

  /**
   * Get the role of a thread in the current step
   * @param {number} threadId - Thread ID
   * @param {number} currentStep - Current global step
   * @returns {string} Role: 'expressive', 'reflective', or 'mediating'
   */
  getThreadRole(threadId, currentStep) {
    const thread = this.threadConfigs[threadId]
    const phase = this.getThreadPhase(thread.offset, currentStep)
    
    // Determine roles based on phases
    const roles = this.threadConfigs.map((t, idx) => {
      const p = this.getThreadPhase(t.offset, currentStep)
      return { threadId: idx, phase: p.phase }
    })
    
    const expressiveThreads = roles.filter(r => r.phase === 'expressive')
    const reflectiveThreads = roles.filter(r => r.phase === 'reflective')
    
    // Active inference: when one is expressive and another is reflective,
    // the third mediates
    if (expressiveThreads.length === 1 && reflectiveThreads.length === 1) {
      // Find the mediating thread
      const mediatingThread = roles.find(r => 
        r.threadId !== expressiveThreads[0].threadId && 
        r.threadId !== reflectiveThreads[0].threadId
      )
      if (mediatingThread && mediatingThread.threadId === threadId) {
        return 'mediating'
      }
    }
    
    return phase.phase
  }

  /**
   * Initialize the three threads with models
   * @param {Array} models - Array of model URLs for each thread
   */
  async initialize(models = []) {
    await util.logLine(colors.cyan('\n█ Initializing Stream of Consciousness System...\n'))
    
    // Use default model if none provided
    const defaultModel = this.handler.default_model
    
    for (let i = 0; i < this.threadCount; i++) {
      const modelUrl = models[i] || defaultModel
      this.threadConfigs[i].model = modelUrl
      
      await util.logLine(colors.blue(`  Starting ${this.threadConfigs[i].name} (offset: ${this.threadConfigs[i].offset} steps)`))
      await util.logLine(colors.gray(`    Model: ${modelUrl}`))
      
      // Start the llama server for this thread
      try {
        const response = await this.handler.call({ 
          _: ["start", modelUrl] 
        }, (event) => {
          // Silent callback for initialization
        })
        
        this.threads.push({
          ...this.threadConfigs[i],
          port: response.port,
          url: response.url,
          lastOutput: null,
          history: []
        })
        
        await util.logLine(colors.green(`  ✓ ${this.threadConfigs[i].name} ready on port ${response.port}\n`))
      } catch (error) {
        await util.logLine(colors.red(`  ✗ Failed to start ${this.threadConfigs[i].name}: ${error.message}\n`))
        throw error
      }
    }
    
    await util.logLine(colors.cyan('█ All threads initialized and ready\n'))
  }

  /**
   * Execute a single step of the consciousness cycle
   */
  async executeStep() {
    const step = this.currentStep
    
    await util.logLine(colors.yellow(`\n═══ CYCLE STEP ${step} / ${this.totalSteps} ═══\n`))
    
    // Determine the state of each thread
    const threadStates = this.threads.map((thread, idx) => {
      const phase = this.getThreadPhase(thread.offset, step)
      const role = this.getThreadRole(idx, step)
      
      return {
        thread,
        phase,
        role
      }
    })
    
    // Display current state
    for (const state of threadStates) {
      const { thread, phase, role } = state
      const roleColor = role === 'expressive' ? colors.yellow : 
                        role === 'reflective' ? colors.cyan : 
                        colors.magenta
      
      await util.logLine(
        colors.blue(`${thread.name}`) + 
        ` [Step ${phase.localStep}] ` + 
        roleColor(`${role.toUpperCase()}`) + 
        colors.gray(` (${phase.phase} phase, step ${phase.phaseStep})`)
      )
    }
    
    // Find the threads in each role
    const expressiveThread = threadStates.find(s => s.role === 'expressive')
    const reflectiveThread = threadStates.find(s => s.role === 'reflective')
    const mediatingThread = threadStates.find(s => s.role === 'mediating')
    
    await util.logLine('')
    
    // Stream of Consciousness Action:
    // The expressive thread generates, the reflective thread perceives,
    // and the mediating thread integrates through active inference
    
    if (expressiveThread && mediatingThread) {
      await util.logLine(colors.yellow(`→ ${expressiveThread.thread.name} expressing...`))
      const prompt = this.getExpressivePrompt(step, expressiveThread.thread)
      // In a real implementation, this would make an actual LLM call
      expressiveThread.thread.lastOutput = `Expression from ${expressiveThread.thread.name} at step ${step}`
      expressiveThread.thread.history.push({
        step,
        role: 'expressive',
        content: prompt
      })
    }
    
    if (reflectiveThread && mediatingThread) {
      await util.logLine(colors.cyan(`← ${reflectiveThread.thread.name} reflecting...`))
      const prompt = this.getReflectivePrompt(step, reflectiveThread.thread)
      // In a real implementation, this would make an actual LLM call
      reflectiveThread.thread.lastOutput = `Reflection from ${reflectiveThread.thread.name} at step ${step}`
      reflectiveThread.thread.history.push({
        step,
        role: 'reflective',
        content: prompt
      })
    }
    
    if (mediatingThread) {
      await util.logLine(colors.magenta(`⟷ ${mediatingThread.thread.name} mediating (active inference)...`))
      const prompt = this.getMediatingPrompt(step, mediatingThread.thread, expressiveThread, reflectiveThread)
      // In a real implementation, this would make an actual LLM call
      mediatingThread.thread.lastOutput = `Mediation from ${mediatingThread.thread.name} at step ${step}`
      mediatingThread.thread.history.push({
        step,
        role: 'mediating',
        content: prompt
      })
    }
    
    // Advance to next step
    this.currentStep = (this.currentStep + 1) % this.totalSteps
  }

  /**
   * Generate expressive prompt
   */
  getExpressivePrompt(step, thread) {
    return `[${thread.name} - Expressive Mode] Generate creative and expressive output for step ${step}`
  }

  /**
   * Generate reflective prompt
   */
  getReflectivePrompt(step, thread) {
    return `[${thread.name} - Reflective Mode] Reflect on and analyze the previous expressions at step ${step}`
  }

  /**
   * Generate mediating prompt (active inference)
   */
  getMediatingPrompt(step, thread, expressive, reflective) {
    const expressiveName = expressive ? expressive.thread.name : 'none'
    const reflectiveName = reflective ? reflective.thread.name : 'none'
    return `[${thread.name} - Mediating Mode] Integrate insights from ${expressiveName} (expressive) and ${reflectiveName} (reflective) through active inference at step ${step}`
  }

  /**
   * Start the consciousness stream
   * @param {Object} options - Configuration options
   */
  async start(options = {}) {
    if (this.running) {
      await util.logLine(colors.yellow('Stream of Consciousness already running'))
      return
    }
    
    this.stepDelay = options.stepDelay || this.stepDelay
    const cycles = options.cycles || Infinity
    const models = options.models || []
    
    await this.initialize(models)
    
    this.running = true
    await util.logLine(colors.cyan('\n█ Starting Stream of Consciousness...\n'))
    
    let completedCycles = 0
    
    while (this.running && completedCycles < cycles) {
      await this.executeStep()
      
      // Check if we completed a full cycle
      if (this.currentStep === 0) {
        completedCycles++
        await util.logLine(colors.green(`\n✓ Completed cycle ${completedCycles}\n`))
      }
      
      // Wait before next step
      await new Promise(resolve => setTimeout(resolve, this.stepDelay))
    }
    
    await util.logLine(colors.cyan('\n█ Stream of Consciousness completed\n'))
  }

  /**
   * Stop the consciousness stream
   */
  async stop() {
    this.running = false
    await util.logLine(colors.yellow('\n█ Stopping Stream of Consciousness...\n'))
    
    // Stop all thread servers
    for (const thread of this.threads) {
      try {
        await this.handler.stop([thread.url])
        await util.logLine(colors.gray(`  Stopped ${thread.name}`))
      } catch (error) {
        await util.logLine(colors.red(`  Error stopping ${thread.name}: ${error.message}`))
      }
    }
    
    this.threads = []
    this.currentStep = 0
  }

  /**
   * Get current status of the consciousness system
   */
  getStatus() {
    return {
      running: this.running,
      currentStep: this.currentStep,
      threads: this.threads.map(thread => ({
        name: thread.name,
        offset: thread.offset,
        port: thread.port,
        model: thread.model,
        currentPhase: this.getThreadPhase(thread.offset, this.currentStep),
        currentRole: this.getThreadRole(thread.id, this.currentStep),
        historyLength: thread.history.length
      }))
    }
  }
}

module.exports = ConsciousnessOrchestrator
