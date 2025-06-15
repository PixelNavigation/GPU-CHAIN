import Peer from 'peerjs'

// Handles peer-to-peer connections using Peer.js
// Will be implemented to manage peer discovery, job distribution, and result collection

export default class PeerManager {
  constructor(onJobResult) {
    this.peer = new Peer()
    this.conn = null
    this.peerId = ''
    this.onJobResult = onJobResult
    this.peer.on('open', id => {
      this.peerId = id
      if (this.onPeerId) this.onPeerId(id)
    })
    this.peer.on('connection', conn => {
      this.conn = conn
      conn.on('data', async data => {
        if (data.job) {
          // Send job to backend GPU worker
          const result = await this.runJobOnBackend(data.job)
          // Use jobId from the job object
          conn.send({ result, jobId: data.job.jobId })
        } else if (data.result !== undefined) {
          if (this.onJobResult) this.onJobResult(data)
        }
      })
    })
  }

  connectToPeer(connId) {
    this.conn = this.peer.connect(connId)
    this.conn.on('data', data => {
      if (data.result !== undefined && this.onJobResult) {
        this.onJobResult(data)
      }
    })
  }

  sendJob(job) {
    if (this.conn) {
      this.conn.send({ job })
    }
  }

  onPeerId(cb) {
    this.onPeerId = cb
  }

  // Call the Node.js backend to run the job
  async runJobOnBackend(job) {
    const res = await fetch('http://localhost:5001/run-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    })
    const data = await res.json()
    return data.result
  }
}
