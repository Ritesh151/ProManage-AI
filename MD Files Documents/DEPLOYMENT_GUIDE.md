# Deployment Guide - Python AI Microservice + MERN

## Production Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                   │
│                    (Port 80/443)                         │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼──┐    ┌───▼──┐    ┌───▼──┐
    │React  │    │Node   │    │Python │
    │Build  │    │Backend│    │Service│
    │(3000) │    │(5000) │    │(8000) │
    └───────┘    └───────┘    └───────┘
        │            │            │
        └────────────┼────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼──┐    ┌───▼──┐    ┌───▼──┐
    │MongoDB│   │Chroma │   │LLM API│
    │       │   │Vector │   │       │
    │       │   │DB     │   │       │
    └───────┘    └───────┘    └───────┘
```

## Prerequisites

- Node.js 14+
- Python 3.8+
- MongoDB
- Chroma (optional, can use in-memory)
- Docker (optional)
- Nginx (optional)

## Step 1: Prepare Environment

### Create Production .env Files

**backend/.env**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://mongo:27017/ai-knowledge
PYTHON_AI_URL=http://python-ai:8000

AI_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

**python-ai/.env**
```env
ENVIRONMENT=production
DEBUG=false
PYTHON_AI_HOST=0.0.0.0
PYTHON_AI_PORT=8000
NODE_BACKEND_URL=http://node-backend:5000

AI_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...

MONGODB_URI=mongodb://mongo:27017/ai-knowledge
CHROMA_HOST=chroma
CHROMA_PORT=8000

AI_LOG_LEVEL=warn
```

## Step 2: Build Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a `build/` directory with optimized production files.

## Step 3: Deploy with Docker

### Create Dockerfile for Node Backend

**backend/Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Create Dockerfile for Python Service

**python-ai/Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

### Create docker-compose.yml

**docker-compose.yml**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: ai-knowledge

  chroma:
    image: ghcr.io/chroma-core/chroma:latest
    ports:
      - "8000:8000"
    volumes:
      - chroma_data:/chroma/data

  python-ai:
    build: ./python-ai
    ports:
      - "8001:8000"
    environment:
      ENVIRONMENT: production
      PYTHON_AI_HOST: 0.0.0.0
      PYTHON_AI_PORT: 8000
      NODE_BACKEND_URL: http://node-backend:5000
      MONGODB_URI: mongodb://mongodb:27017/ai-knowledge
      CHROMA_HOST: chroma
      CHROMA_PORT: 8000
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - mongodb
      - chroma
    volumes:
      - ./python-ai/logs:/app/logs

  node-backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://mongodb:27017/ai-knowledge
      PYTHON_AI_URL: http://python-ai:8000
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - mongodb
      - python-ai
    volumes:
      - ./backend/logs:/app/logs

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./frontend/build:/usr/share/nginx/html:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - node-backend

volumes:
  mongo_data:
  chroma_data:
```

### Create nginx.conf

**nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream node_backend {
        server node-backend:5000;
    }

    upstream python_ai {
        server python-ai:8000;
    }

    server {
        listen 80;
        server_name _;

        # Frontend
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }

        # Node Backend API
        location /api/ {
            proxy_pass http://node_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Python AI Service (optional direct access)
        location /ai/ {
            proxy_pass http://python_ai/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
        }
    }
}
```

## Step 4: Deploy

### Using Docker Compose

```bash
# Set environment variables
export OPENAI_API_KEY=sk-...

# Build and start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Using Kubernetes

**kubernetes/deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: python-ai
spec:
  replicas: 2
  selector:
    matchLabels:
      app: python-ai
  template:
    metadata:
      labels:
        app: python-ai
    spec:
      containers:
      - name: python-ai
        image: python-ai:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: ai-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

## Step 5: Monitoring

### Health Checks

```bash
# Check Python service
curl http://localhost:8001/health

# Check Node backend
curl http://localhost:5000/api/health

# Check AI status
curl http://localhost:5000/api/ai/status
```

### Logging

```bash
# View Python logs
docker-compose logs python-ai

# View Node logs
docker-compose logs node-backend

# View Nginx logs
docker-compose logs nginx
```

### Metrics

Monitor these metrics:
- CPU usage
- Memory usage
- Request latency
- Error rate
- Training progress

## Step 6: Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  python-ai:
    deploy:
      replicas: 3
    
  node-backend:
    deploy:
      replicas: 2
```

### Load Balancing

Use Nginx or HAProxy to distribute traffic:

```nginx
upstream python_ai_cluster {
    server python-ai-1:8000;
    server python-ai-2:8000;
    server python-ai-3:8000;
}
```

## Step 7: Backup & Recovery

### Database Backup

```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Backup Chroma
docker-compose exec chroma cp -r /chroma/data /backup/chroma
```

### Restore

```bash
# Restore MongoDB
docker-compose exec mongodb mongorestore /backup

# Restore Chroma
docker-compose exec chroma cp -r /backup/chroma /chroma/data
```

## Step 8: Security

### SSL/TLS

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Update nginx.conf
listen 443 ssl;
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;
```

### Environment Variables

Never commit `.env` files. Use secrets management:

```bash
# Docker Secrets
docker secret create openai_key -

# Kubernetes Secrets
kubectl create secret generic ai-secrets --from-literal=openai-api-key=sk-...
```

### Rate Limiting

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    proxy_pass http://node_backend;
}
```

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Check network
docker network ls

# Restart services
docker-compose restart
```

### High memory usage

```bash
# Check memory
docker stats

# Reduce replicas
docker-compose down
# Edit docker-compose.yml
docker-compose up -d
```

### Slow responses

```bash
# Check CPU
docker stats

# Check database
docker-compose exec mongodb mongosh

# Check Python service
curl http://localhost:8001/health
```

## Performance Optimization

### Caching

```nginx
# Cache static files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Connection Pooling

```python
# python-ai/.env
MONGODB_POOL_SIZE=10
CHROMA_POOL_SIZE=5
```

## Maintenance

### Regular Tasks

- Monitor logs daily
- Check disk space weekly
- Backup database weekly
- Update dependencies monthly
- Review performance metrics monthly

### Updates

```bash
# Update dependencies
docker-compose pull
docker-compose up -d

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

## Support

- **Logs**: Check `docker-compose logs`
- **Health**: Check `/health` endpoints
- **Status**: Check `/status` endpoints
- **Documentation**: See `PYTHON_AI_INTEGRATION.md`

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Date**: May 20, 2026
