# Deployment Guide - AAStar CoinJar

## Project Architecture
This project uses a **monorepo structure with independent packages**, where each package can be deployed and scaled independently:

```
aastar-start/
├── packages/
│   ├── coinjar-demo/     # React frontend (independent deployment)
│   ├── fake-backend/     # Node.js API server (independent deployment)  
│   └── aastar-sdk/       # TypeScript SDK (npm package)
└── docs/                 # Project documentation
```

## Package Independence
Each package maintains its own:
- `package.json` with specific dependencies
- `node_modules/` directory
- Build and deployment configuration
- Independent versioning capability

This architecture enables:
- **Microservice deployment**: Each service can be deployed separately
- **Independent scaling**: Scale frontend and backend based on different needs
- **Technology flexibility**: Each package can use different tech stacks
- **Team autonomy**: Different teams can work on different packages

## Development Environment Setup

### Prerequisites
- **Node.js**: 23.0+ (latest LTS)
- **pnpm**: 10.14.0+ (package manager)
- **Git**: Latest version

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd aastar-start

# Install all packages
pnpm install:all

# Build all packages
pnpm build:all
```

## Individual Package Development

### 1. Backend Development (fake-backend)
```bash
# Navigate to backend package
cd packages/fake-backend

# Install dependencies (independent)
pnpm install

# Start development server
pnpm start
# Server runs at: http://localhost:4000
```

**Available Endpoints**:
- `POST /register/start` - Start Passkey registration
- `POST /register/finish` - Complete registration
- `POST /transaction/prepare` - Prepare transaction
- `POST /transaction/broadcast` - Broadcast transaction
- `GET /prices` - Get crypto prices
- `GET /history` - Get transaction history

### 2. Frontend Development (coinjar-demo)
```bash
# Navigate to frontend package
cd packages/coinjar-demo

# Install dependencies (independent)
pnpm install

# Start development server
pnpm run dev
# Server runs at: http://localhost:5173
```

**Available Scripts**:
- `pnpm run dev` - Development server with hot reload
- `pnpm run build` - Production build
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Code linting

### 3. SDK Development (aastar-sdk)
```bash
# Navigate to SDK package
cd packages/aastar-sdk

# Install dependencies (independent)
pnpm install

# Build SDK
pnpm run build
# Output: dist/index.js and dist/index.d.ts
```

## Root-Level Scripts (Optional Convenience)

For development convenience, you can use root-level scripts:

```bash
# From project root
pnpm dev:backend    # Start backend server
pnpm dev:frontend   # Start frontend server
pnpm dev:sdk        # Build SDK in watch mode
pnpm build:all      # Build all packages
pnpm install:all    # Install all dependencies
pnpm clean          # Clean all node_modules
```

## Production Deployment

### Backend Deployment (fake-backend)
```bash
cd packages/fake-backend

# Production dependencies only
pnpm install --prod

# Start production server
NODE_ENV=production pnpm start
```

**Environment Variables**:
```bash
PORT=4000                    # Server port
NODE_ENV=production         # Environment
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Deployment (coinjar-demo)
```bash
cd packages/coinjar-demo

# Build for production
pnpm run build

# Deploy dist/ folder to CDN/static hosting
# Examples: Vercel, Netlify, AWS S3 + CloudFront
```

**Environment Variables**:
```bash
VITE_API_URL=https://your-backend-domain.com
VITE_CHAIN_ID=10           # Optimism mainnet
```

### SDK Publishing (aastar-sdk)
```bash
cd packages/aastar-sdk

# Build the SDK
pnpm run build

# Publish to npm (if public)
npm publish

# Or publish to private registry
npm publish --registry=https://your-private-registry.com
```

## Docker Deployment

### Backend Dockerfile
```dockerfile
# packages/fake-backend/Dockerfile
FROM node:23-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY . .
EXPOSE 4000
CMD ["pnpm", "start"]
```

### Frontend Dockerfile
```dockerfile
# packages/coinjar-demo/Dockerfile
FROM node:23-alpine as builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Monitoring and Logs

### Backend Monitoring
```bash
# Check backend health
curl http://localhost:4000/prices

# View logs
cd packages/fake-backend
pm2 logs fake-backend
```

### Frontend Monitoring
```bash
# Check frontend
curl http://localhost:5173

# Build size analysis
cd packages/coinjar-demo
pnpm run build
npx vite-bundle-analyzer
```

## Scaling Considerations

### Horizontal Scaling
- **Backend**: Load balancer + multiple instances
- **Frontend**: CDN + edge locations
- **SDK**: Distributed via npm registry

### Database Integration
When replacing fake-backend with real backend:
```bash
# Add database dependencies to backend package only
cd packages/fake-backend
pnpm add postgresql redis
```

### Microservice Migration
Each package can be extracted to separate repositories:
```bash
# Example: Extract backend to separate repo
cp -r packages/fake-backend ../aastar-backend
cd ../aastar-backend
git init
# Continue with independent repository setup
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Each service uses different ports (4000, 5173)
2. **Cross-package dependencies**: Use `workspace:*` in package.json
3. **Build failures**: Ensure each package builds independently

### Debug Commands
```bash
# Check all package dependencies
pnpm -r list

# Rebuild all packages
pnpm clean && pnpm install:all && pnpm build:all

# Check workspace configuration
pnpm list --depth=0
```

## Security Considerations

### Production Security
- Use HTTPS for all communications
- Implement proper CORS policies
- Secure API endpoints with authentication
- Use environment variables for sensitive data
- Regular dependency updates

### Development Security
- Never commit private keys or secrets
- Use `.env.example` files for environment templates
- Implement proper input validation
- Regular security audits with `pnpm audit`