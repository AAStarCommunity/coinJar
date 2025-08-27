#!/bin/bash

# Smart Multi-Stack Development Automation Setup
# Automatically detects tech stacks and sets up appropriate tools

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Smart Multi-Stack Automation Setup     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run tech stack detection
echo -e "${YELLOW}Detecting project tech stacks...${NC}"
source "$SCRIPT_DIR/detect-tech-stack.sh"

# Get detected stacks from the detection script
IFS=' ' read -ra DETECTED_STACKS <<< "$DETECTED_TECH_STACKS"

if [[ ${#DETECTED_STACKS[@]} -eq 0 ]]; then
    echo -e "${RED}❌ No supported tech stacks detected. Please run this in a project directory.${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}Setting up automation for: ${DETECTED_STACKS[*]}${NC}"
echo ""

# Setup TaskMaster if not already installed
echo -e "${YELLOW}Setting up TaskMaster AI...${NC}"
if ! command_exists task-master; then
    echo -e "${BLUE}Installing TaskMaster AI globally...${NC}"
    npm install -g task-master-ai
    echo -e "${GREEN}✅ TaskMaster AI installed${NC}"
else
    echo -e "${GREEN}✅ TaskMaster AI already installed${NC}"
fi

# Initialize TaskMaster for the project
PROJECT_NAME="${PWD##*/}"
echo -e "${BLUE}Initializing TaskMaster for project: $PROJECT_NAME${NC}"
task-master init \
    --rules claude,cursor \
    --aliases \
    --name="$PROJECT_NAME" \
    --description="Multi-stack project with automated development environment" \
    -y

# Configure models
task-master models --set-main sonnet

echo ""

# Tech stack specific setup
for stack in "${DETECTED_STACKS[@]}"; do
    echo -e "${MAGENTA}Setting up $stack environment...${NC}"
    
    case $stack in
        "rust")
            # Install rskiller for Rust cache management
            if ! command_exists rskiller; then
                echo -e "${BLUE}Installing rskiller for Rust cache management...${NC}"
                cargo install rskiller
                echo -e "${GREEN}✅ rskiller installed${NC}"
            fi
            
            # Setup Rust automation
            if [[ -f "$SCRIPT_DIR/setup-rust-automation.sh" ]]; then
                echo -e "${BLUE}Configuring Rust automation...${NC}"
                bash "$SCRIPT_DIR/setup-rust-automation.sh"
            fi
            ;;
            
        "nodejs")
            # Install Node.js development tools with pnpm
            echo -e "${BLUE}Installing Node.js development tools with pnpm...${NC}"
            npm install -g pnpm
            pnpm install -g nodemon npm-check-updates
            
            # Setup package.json scripts optimization for pnpm
            if [[ -f "package.json" ]]; then
                echo -e "${BLUE}Analyzing package.json for pnpm optimization...${NC}"
                # Add common development scripts if missing
                npx json -I -f package.json -e 'this.scripts=this.scripts||{}'
                npx json -I -f package.json -e 'this.scripts.dev=this.scripts.dev||"nodemon src/index.js"'
                npx json -I -f package.json -e 'this.scripts.clean=this.scripts.clean||"rm -rf node_modules pnpm-lock.yaml && pnpm install"'
                npx json -I -f package.json -e 'this.scripts.update=this.scripts.update||"pnpm update"'
            fi
            echo -e "${GREEN}✅ Node.js environment configured with pnpm${NC}"
            ;;
            
        "frontend")
            # Install frontend development tools with pnpm
            echo -e "${BLUE}Installing frontend development tools with pnpm...${NC}"
            npm install -g pnpm
            pnpm install -g typescript npm-check-updates
            
            if [[ -f "package.json" ]]; then
                echo -e "${BLUE}Optimizing frontend build configuration for pnpm...${NC}"
                # Suggest modern build optimizations
                npx json -I -f package.json -e 'this.scripts=this.scripts||{}'
                npx json -I -f package.json -e 'this.scripts.analyze=this.scripts.analyze||"pnpm run build -- --analyze"'
                npx json -I -f package.json -e 'this.scripts.clean=this.scripts.clean||"rm -rf node_modules pnpm-lock.yaml dist && pnpm install"'
            fi
            echo -e "${GREEN}✅ Frontend environment configured with pnpm${NC}"
            ;;
            
        "golang")
            # Install Go development tools
            echo -e "${BLUE}Installing Go development tools...${NC}"
            go install mvdan.cc/gofumpt@latest
            go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
            
            # Setup Go module optimization
            if [[ -f "go.mod" ]]; then
                echo -e "${BLUE}Optimizing Go module configuration...${NC}"
                go mod tidy
            fi
            echo -e "${GREEN}✅ Golang environment configured${NC}"
            ;;
            
        "solidity")
            # Install Solidity development tools (Foundry + pnpm)
            echo -e "${BLUE}Installing Solidity development tools (Foundry/Forge + Anvil)...${NC}"
            
            # Install Foundry
            if ! command_exists forge; then
                echo -e "${BLUE}Installing Foundry...${NC}"
                curl -L https://foundry.paradigm.xyz | bash
                source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null || true
                foundryup
            fi
            
            # Install pnpm and solhint
            npm install -g pnpm
            pnpm install -g solhint
            
            # Configure project scripts based on framework
            if [[ -f "foundry.toml" ]]; then
                echo -e "${BLUE}Foundry project detected, configuring scripts...${NC}"
                # Create Makefile for common Foundry operations
                cat > Makefile << 'EOF'
# Foundry project Makefile
.PHONY: build test clean deploy anvil

build:
	forge build

test:
	forge test -vvv

clean:
	forge clean

anvil:
	anvil

deploy-local:
	forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
EOF
            elif [[ -f "package.json" ]]; then
                echo -e "${BLUE}Configuring Hardhat/npm project scripts...${NC}"
                npx json -I -f package.json -e 'this.scripts=this.scripts||{}'
                npx json -I -f package.json -e 'this.scripts.compile=this.scripts.compile||"hardhat compile"'
                npx json -I -f package.json -e 'this.scripts.test=this.scripts.test||"hardhat test"'
                npx json -I -f package.json -e 'this.scripts.node=this.scripts.node||"hardhat node"'
            fi
            echo -e "${GREEN}✅ Solidity environment configured with Foundry + pnpm${NC}"
            ;;
            
        "python")
            # Install Python development tools
            echo -e "${BLUE}Installing Python development tools...${NC}"
            pip install black flake8 mypy
            echo -e "${GREEN}✅ Python environment configured${NC}"
            ;;
    esac
    echo ""
done

# Create universal development workflow commands
echo -e "${YELLOW}Setting up universal development commands...${NC}"
mkdir -p .claude/commands

# Multi-stack clean command
cat > .claude/commands/clean-project.md << 'EOF'
Clean project artifacts for all detected tech stacks: $ARGUMENTS

Steps:

1. Detect project tech stacks automatically
2. Clean based on detected stacks:
   - Rust: Run `rskiller --clean --safe`
   - Node.js/Frontend: Remove `node_modules`, `.next`, `dist` folders
   - Golang: Run `go clean -cache -modcache`
   - Solidity: Remove `artifacts`, `cache` folders
   - Python: Remove `__pycache__`, `.pytest_cache`, `dist` folders
3. Show cleaned space and provide recommendations
EOF

# Multi-stack optimize command
cat > .claude/commands/optimize-project.md << 'EOF'
Optimize project for all detected tech stacks.

Steps:

1. Run tech stack detection: `./scripts/detect-tech-stack.sh`
2. For each detected stack, run appropriate optimizations:
   - Rust: Check dependencies, optimize Cargo.toml, run benchmarks
   - Node.js: Update dependencies, check for vulnerabilities
   - Golang: Format code, run linter, check for unused dependencies
   - Solidity: Optimize contracts, check for vulnerabilities
   - Python: Format with black, check types with mypy
3. Provide performance and security recommendations
EOF

# Multi-stack build command  
cat > .claude/commands/build-project.md << 'EOF'
Build project for all detected tech stacks.

Steps:

1. Detect tech stacks and run appropriate builds:
   - Rust: `cargo build --release`
   - Node.js: `npm run build` or `npm run compile`
   - Frontend: `npm run build`
   - Golang: `go build ./...`
   - Solidity: `npx hardhat compile`
   - Python: `python -m build`
2. Run tests for each stack
3. Show build artifacts and deployment readiness
EOF

echo -e "${GREEN}✅ Universal commands created${NC}"

# Setup automated cleaning based on detected stacks
echo -e "${YELLOW}Setting up automated maintenance...${NC}"

# Detect OS for scheduling setup
OS_TYPE=$(uname -s)

if [[ "$OS_TYPE" == "Darwin" ]]; then
    # macOS - launchd setup for multi-stack cleaning
    LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
    PLIST_FILE="$LAUNCH_AGENTS_DIR/com.user.multi-stack-clean.plist"
    
    mkdir -p "$LAUNCH_AGENTS_DIR"
    
    cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.multi-stack-clean</string>
    <key>ProgramArguments</key>
    <array>
        <string>$SCRIPT_DIR/clean-multi-stack.sh</string>
        <string>--safe</string>
        <string>--auto</string>
    </array>
    <key>StartInterval</key>
    <integer>7200</integer>
    <key>RunAtLoad</key>
    <false/>
    <key>StandardOutPath</key>
    <string>$HOME/.multi-stack-clean.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME/.multi-stack-clean.error.log</string>
</dict>
</plist>
EOF
    
    # Create the cleaning script
    cat > "$SCRIPT_DIR/clean-multi-stack.sh" << 'EOF'
#!/bin/bash

# Multi-stack automated cleaning script
source "$(dirname "$0")/detect-tech-stack.sh"

IFS=' ' read -ra STACKS <<< "$DETECTED_TECH_STACKS"

for stack in "${STACKS[@]}"; do
    case $stack in
        "rust")
            if command -v rskiller >/dev/null 2>&1; then
                rskiller --clean --safe --no-confirm
            fi
            ;;
        "nodejs"|"frontend")
            find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
            ;;
        "golang")
            go clean -cache -modcache 2>/dev/null || true
            ;;
        "python")
            find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
            ;;
    esac
done
EOF
    
    chmod +x "$SCRIPT_DIR/clean-multi-stack.sh"
    
    # Load the launch agent
    launchctl unload "$PLIST_FILE" 2>/dev/null || true
    launchctl load "$PLIST_FILE"
    
    echo -e "${GREEN}✅ macOS automated cleaning configured${NC}"
    
elif [[ "$OS_TYPE" == "Linux" ]]; then
    # Linux - cron setup for multi-stack cleaning
    CRON_COMMAND="0 */2 * * * $SCRIPT_DIR/clean-multi-stack.sh --safe --auto >> $HOME/.multi-stack-clean.log 2>&1"
    
    if ! crontab -l 2>/dev/null | grep -q "clean-multi-stack"; then
        (crontab -l 2>/dev/null; echo "$CRON_COMMAND") | crontab -
        echo -e "${GREEN}✅ Linux automated cleaning configured${NC}"
    fi
fi

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            Setup Complete! 🎉                ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}Multi-Stack Development Environment Configured:${NC}"
echo ""
echo -e "${YELLOW}Detected Stacks:${NC}"
for stack in "${DETECTED_STACKS[@]}"; do
    echo -e "  ✅ $stack"
done

echo ""
echo -e "${YELLOW}Available Commands:${NC}"
echo "  ./scripts/detect-tech-stack.sh     # Detect tech stacks"
echo "  ./scripts/detect-tech-stack.sh --setup   # Auto-install tools"
echo ""
echo -e "${YELLOW}Claude Code Commands:${NC}"
echo "  /clean-project                      # Clean all stack artifacts"
echo "  /optimize-project                   # Optimize all stacks"  
echo "  /build-project                      # Build all stacks"
echo ""
echo -e "${YELLOW}TaskMaster Commands:${NC}"
echo "  task-master next                    # Get next task"
echo "  task-master list                    # List all tasks"
echo ""
echo -e "${GREEN}Happy multi-stack development! 🚀${NC}"