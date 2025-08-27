#!/bin/bash

# Tech Stack Detection Script
# Detects project technology stacks and returns appropriate setup configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Tech Stack Detection               ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Function to detect tech stacks
detect_tech_stacks() {
    local stacks=()
    
    # Check for Rust project
    if [[ -f "Cargo.toml" ]]; then
        stacks+=("rust")
        echo -e "${GREEN}✅ Rust project detected${NC}" >&2
    fi
    
    # Check for Node.js/JavaScript/TypeScript projects
    if [[ -f "package.json" ]]; then
        # Determine if it's frontend or backend
        if grep -q "react\|vue\|angular\|svelte\|webpack\|vite\|next\|nuxt" package.json 2>/dev/null; then
            stacks+=("frontend")
            echo -e "${GREEN}✅ Frontend (TypeScript/JavaScript) project detected${NC}" >&2
        else
            stacks+=("nodejs")
            echo -e "${GREEN}✅ Node.js backend project detected${NC}" >&2
        fi
    fi
    
    # Check for TypeScript specifically
    if [[ -f "tsconfig.json" ]]; then
        if [[ ! " ${stacks[@]} " =~ " frontend " ]] && [[ ! " ${stacks[@]} " =~ " nodejs " ]]; then
            stacks+=("typescript")
            echo -e "${GREEN}✅ TypeScript project detected${NC}" >&2
        fi
    fi
    
    # Check for Golang project
    if [[ -f "go.mod" ]] || [[ -f "go.sum" ]]; then
        stacks+=("golang")
        echo -e "${GREEN}✅ Golang project detected${NC}" >&2
    fi
    
    # Check for Solidity projects (Foundry/Forge preferred, Hardhat supported)
    if [[ -f "foundry.toml" ]] || [[ -f "forge.toml" ]] || [[ -f "hardhat.config.js" ]] || [[ -f "hardhat.config.ts" ]] || [[ -f "truffle-config.js" ]] || [[ -d "contracts" && -f "contracts/"*.sol ]] 2>/dev/null; then
        stacks+=("solidity")
        if [[ -f "foundry.toml" ]] || [[ -f "forge.toml" ]]; then
            echo -e "${GREEN}✅ Solidity project detected (Foundry/Forge)${NC}" >&2
        else
            echo -e "${GREEN}✅ Solidity project detected (Hardhat/Truffle)${NC}" >&2
        fi
    fi
    
    # Check for Python projects
    if [[ -f "requirements.txt" ]] || [[ -f "pyproject.toml" ]] || [[ -f "setup.py" ]]; then
        stacks+=("python")
        echo -e "${GREEN}✅ Python project detected${NC}" >&2
    fi
    
    echo "${stacks[@]}"
}

# Function to get tools for specific tech stack
get_tools_for_stack() {
    local stack=$1
    local tools=()
    
    case $stack in
        "rust")
            tools+=("rskiller")
            ;;
        "nodejs")
            tools+=("pnpm" "nodemon" "npm-check-updates")
            ;;
        "frontend")
            tools+=("pnpm" "typescript" "npm-check-updates")
            ;;
        "typescript") 
            tools+=("typescript" "ts-node")
            ;;
        "golang")
            tools+=("gofumpt" "golangci-lint")
            ;;
        "solidity")
            tools+=("foundry" "forge" "anvil" "solhint")
            ;;
        "python")
            tools+=("black" "flake8" "mypy")
            ;;
    esac
    
    echo "${tools[@]}"
}

# Function to get setup commands for specific tech stack
get_setup_commands() {
    local stack=$1
    
    case $stack in
        "rust")
            echo "rustup update stable && cargo install rskiller"
            ;;
        "nodejs")
            echo "npm install -g pnpm && pnpm install -g nodemon npm-check-updates"
            ;;
        "frontend")
            echo "npm install -g pnpm && pnpm install -g typescript npm-check-updates"
            ;;
        "typescript")
            echo "npm install -g pnpm && pnpm install -g typescript ts-node"
            ;;
        "golang")
            echo "go install mvdan.cc/gofumpt@latest && go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest"
            ;;
        "solidity")
            echo "curl -L https://foundry.paradigm.xyz | bash && foundryup && npm install -g pnpm && pnpm install -g solhint"
            ;;
        "python")
            echo "pip install black flake8 mypy"
            ;;
    esac
}

# Main detection
DETECTED_STACKS=($(detect_tech_stacks))

if [[ ${#DETECTED_STACKS[@]} -eq 0 ]]; then
    echo -e "${YELLOW}⚠️  No recognized tech stacks detected${NC}"
    echo -e "${CYAN}Supported stacks: Rust, Node.js, Frontend (TS/JS), Golang, Solidity, Python${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Detected Tech Stacks:${NC}"
for stack in "${DETECTED_STACKS[@]}"; do
    echo -e "  ${CYAN}• $stack${NC}"
done

echo ""
echo -e "${YELLOW}Recommended Tools:${NC}"
ALL_TOOLS=()
for stack in "${DETECTED_STACKS[@]}"; do
    TOOLS=($(get_tools_for_stack "$stack"))
    for tool in "${TOOLS[@]}"; do
        if [[ ! " ${ALL_TOOLS[@]} " =~ " ${tool} " ]]; then
            ALL_TOOLS+=("$tool")
            echo -e "  ${GREEN}• $tool${NC} (for $stack)"
        fi
    done
done

echo ""
echo -e "${YELLOW}Setup Commands:${NC}"
for stack in "${DETECTED_STACKS[@]}"; do
    setup_cmd=$(get_setup_commands "$stack")
    if [[ -n "$setup_cmd" ]]; then
        echo -e "  ${BLUE}$stack:${NC} $setup_cmd"
    fi
done

# Export results for use by other scripts
export DETECTED_TECH_STACKS="${DETECTED_STACKS[*]}"
export RECOMMENDED_TOOLS="${ALL_TOOLS[*]}"

# Option to run setup for detected stacks
if [[ "$1" == "--setup" ]]; then
    echo ""
    echo -e "${YELLOW}Running setup for detected stacks...${NC}"
    for stack in "${DETECTED_STACKS[@]}"; do
        setup_cmd=$(get_setup_commands "$stack")
        if [[ -n "$setup_cmd" ]]; then
            echo -e "${BLUE}Setting up $stack...${NC}"
            eval "$setup_cmd" || echo -e "${RED}Failed to setup $stack${NC}"
        fi
    done
fi