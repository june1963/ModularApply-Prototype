#!/bin/bash

echo "🚀 ModularApply Setup Script"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Fixing npm permissions...${NC}"
# Fix npm permissions if needed
if [ -d "$HOME/.npm" ]; then
    echo "Checking npm cache permissions..."
    sudo chown -R $(whoami) "$HOME/.npm" 2>/dev/null || true
fi

echo ""
echo -e "${YELLOW}Step 2: Cleaning npm cache...${NC}"
npm cache clean --force 2>/dev/null || true

echo ""
echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"
echo "This may take a few minutes..."

# Try npm install
if npm install; then
    echo -e "${GREEN}✓ Dependencies installed successfully!${NC}"
else
    echo -e "${RED}✗ npm install failed. Trying alternative methods...${NC}"
    
    # Try with legacy peer deps
    echo "Trying with --legacy-peer-deps..."
    if npm install --legacy-peer-deps; then
        echo -e "${GREEN}✓ Dependencies installed with --legacy-peer-deps!${NC}"
    else
        echo -e "${RED}✗ Installation failed.${NC}"
        echo ""
        echo "Please try one of the following manually:"
        echo "1. sudo chown -R \$(whoami) ~/.npm && npm install"
        echo "2. npm install -g pnpm && pnpm install"
        echo "3. rm -rf node_modules && npm install"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}=============================="
echo "✓ Setup Complete!"
echo -e "==============================${NC}"
echo ""
echo "To start the development server:"
echo -e "${YELLOW}npm run dev${NC}"
echo ""
echo "Then open: ${GREEN}http://localhost:5173${NC}"
echo ""
