const { exec, spawnSync } = require('child_process')
const path = require('path')

// Simulated GPU job worker for Node.js
// Receives jobs, processes them, and returns results

console.log('GPU Worker ready. Waiting for jobs...');
// Implementation will be added for job receiving and processing

// Split the job into chunks using Python script
function splitTaskPython(data, numChunks) {
  console.log('Calling task_splitter.py with:', JSON.stringify(data), 'chunks:', numChunks)
  const result = spawnSync('python', ['task_splitter.py', JSON.stringify(data), numChunks], { encoding: 'utf-8', cwd: __dirname })
  console.log('task_splitter.py stdout:', result.stdout)
  console.log('task_splitter.py stderr:', result.stderr)
  console.log('task_splitter.py exit code:', result.status)
  
  if (result.error) {
    console.error('task_splitter.py spawn error:', result.error)
    throw result.error
  }
  
  if (result.status !== 0) {
    console.error('task_splitter.py non-zero exit:', result.status)
    throw new Error(`task_splitter.py exited with code ${result.status}`)
  }
  
  if (!result.stdout.trim()) {
    console.error('task_splitter.py returned empty output')
    throw new Error('task_splitter.py returned empty output')
  }
  
  try {
    return JSON.parse(result.stdout)
  } catch (err) {
    console.error('Failed to parse task_splitter.py output as JSON:', result.stdout)
    throw new Error('Invalid JSON from task_splitter.py: ' + err.message)
  }
}

// Aggregate results using Python script
function aggregateResultsPython(results, operation) {
  const result = spawnSync('python', ['task_aggregator.py', JSON.stringify(results), operation], { encoding: 'utf-8', cwd: __dirname })
  if (result.error) throw result.error
  return parseFloat(result.stdout)
}

// Simulate receiving a job (in real use, this would be from Peer.js or another channel)
function receiveJob(job, callback) {
  console.log('=== receiveJob called ===')
  console.log('Job payload:', job.payload)
  
  // Split the job into chunks using Python
  const chunks = splitTaskPython(job.payload.numbers, job.numPeers || 2)
  console.log('Split into chunks:', chunks)

  // For each chunk, run the GPU task runner as a subprocess
  let results = []
  let completed = 0
  chunks.forEach((chunk, idx) => {
    console.log(`\n--- Processing chunk ${idx + 1} ---`)
    const chunkStr = JSON.stringify(chunk)
    console.log('Chunk:', chunkStr)
    
    const result = spawnSync('python', ['gpu_task_runner.py', chunkStr, job.payload.operation || 'sum'], { encoding: 'utf-8', cwd: __dirname })
    
    console.log('stdout:', result.stdout)
    console.log('stderr:', result.stderr)
    console.log('exit code:', result.status)
    
    if (result.error) {
      console.error('Subprocess error:', result.error)
      results[idx] = null
    } else if (result.status !== 0) {
      console.error('Subprocess non-zero exit code:', result.status)
      results[idx] = null
    } else {
      results[idx] = parseFloat(result.stdout)
    }
    completed++
    console.log(`Chunk ${idx + 1} result:`, results[idx])
    
    if (completed === chunks.length) {
      console.log('All chunks completed, aggregating results:', results)
      // Aggregate results using Python
      const final = aggregateResultsPython(results, job.payload.operation || 'sum')
      console.log('Final aggregated result:', final)
      callback(final)
    }
  })
}

// Export the receiveJob function so it can be used by server.js
module.exports = { receiveJob }

// For testing: simulate a job
if (require.main === module) {
  const job = {
    payload: {
      numbers: [1,2,3,4,5,6,7,8,9,10],
      operation: 'sum',
    },
    numPeers: 3,
  }
  receiveJob(job, (result) => {
    console.log('Final aggregated result:', result)
  })
}
