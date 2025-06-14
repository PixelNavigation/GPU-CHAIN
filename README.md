# GPU Chain - Peer-to-Peer GPU Sharing Platform

A decentralized platform for sharing GPU computing resources through peer-to-peer connections.

## Features

- **User Authentication**: Secure login/signup system
- **Peer-to-Peer Communication**: Direct connection between users using WebRTC
- **GPU Job Distribution**: Send computational tasks to connected peers
- **Real-time Messaging**: Chat with connected peers
- **Modern UI**: Responsive design with dark theme

## Architecture

- **Frontend**: React + Vite (Port 5173)
- **Backend**: Node.js + Express (Port 5000)
  - User authentication
  - PostgreSQL database integration
  - Automatically starts GPU worker
- **GPU Worker**: Node.js + Python (Port 5001)
  - Processes computational jobs
  - Integrates with CUDA for GPU acceleration
- **P2P Communication**: PeerJS for WebRTC connections

## Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- Python (for GPU worker)

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Database:**
   - Update database credentials in `backend/app.js`
   - Ensure PostgreSQL is running

3. **Start the application:**
   ```bash
   npm start
   ```

This will start:
- Backend server (http://localhost:5000)
- GPU Worker server (http://localhost:5001) 
- Frontend dev server (http://localhost:5173)

### Manual Start

If you prefer to start services individually:

```bash
# Backend (includes GPU worker)
cd backend
npm start

# Frontend  
cd client
npm run dev
```

## Usage

1. **Access the app**: Open http://localhost:5173
2. **Sign up/Login**: Create account or login with existing credentials
3. **Get Peer ID**: After login, your unique peer ID will be displayed
4. **Connect to Peers**: Enter another user's peer ID to connect
5. **Send Messages**: Chat with connected peers
6. **Send GPU Jobs**: Click "Send GPU Job" to distribute computational tasks

## API Endpoints

### Backend (Port 5000)
- `POST /signup` - Create new user account
- `POST /login` - User authentication

### GPU Worker (Port 5001)  
- `POST /run-job` - Execute computational job

## File Structure

```
gpu-chain/
├── backend/          # Express server & auth
├── client/           # React frontend
├── gpu-worker/       # GPU processing server
├── peer-server/      # P2P connection server
└── smart-contracts/  # Blockchain contracts
```

## Development

The application uses:
- **React 19** with hooks for state management
- **PeerJS** for WebRTC peer-to-peer connections
- **Express** for REST API
- **PostgreSQL** for user data
- **Python** for GPU computations

## Database Schema

```sql
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL
);
```
