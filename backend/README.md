# Simnovator Backend

Go backend for Simnovator product manager with SSH connectivity features.

## Setup

### Prerequisites
- Go 1.21 or higher
- SSH private key for authentication

### Installation

1. **Add your SSH private key:**
   ```bash
   ssh-keygen -t rsa -b 4096 -f keys/id_rsa -N ""
   ```

2. **Download dependencies:**
   ```bash
   go mod download
   ```

### Configuration

Update `main.go` if you need to change:
- `sshConfig.Username` - SSH username (default: "ubuntu")
- `sshConfig.Port` - SSH port (default: "22")
- `sshConfig.PrivateKeyPath` - Path to private key (default: "./keys/id_rsa")

### Running the server

```bash
go run main.go
```

The server will start on `http://localhost:8080`

### API Endpoints

#### Health Check
```bash
GET /health
```

#### SSH Connection Test
```bash
POST /api/connect
Content-Type: application/json

{
  "serverIP": "192.168.1.100",
  "type": "ue_sim"
}
```

**Response:**
```json
{
  "connected": true,
  "message": "Successfully connected to 192.168.1.100"
}
```

## Frontend Integration

The frontend connects to this backend via the `VITE_API_URL` environment variable:

```env
VITE_API_URL=http://localhost:8080
```

## Security Notes

- ⚠️ Never commit SSH private keys to version control
- ⚠️ Always use proper host key verification in production (currently using InsecureIgnoreHostKey)
- ⚠️ Keep API credentials and sensitive data in environment variables
