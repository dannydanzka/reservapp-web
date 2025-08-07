#!/bin/bash

# ReservApp Vercel Setup Script
# This script configures the project for deployment on Vercel

echo "🚀 Setting up ReservApp for Vercel deployment..."

# Set the API token
export VERCEL_TOKEN="IxaRWKJhrt2h2IfrZmpIL5Z7"

# Project configuration
PROJECT_NAME="reservapp-web"
FRAMEWORK="nextjs"

echo "📋 Project Configuration:"
echo "  Name: $PROJECT_NAME"
echo "  Framework: $FRAMEWORK"
echo "  Token: ${VERCEL_TOKEN:0:10}..."
echo ""

# Create project link file
echo "📝 Creating Vercel project configuration..."
mkdir -p .vercel

cat > .vercel/project.json << EOF
{
  "projectId": "",
  "orgId": "",
  "settings": {
    "framework": "$FRAMEWORK",
    "buildCommand": "yarn build",
    "devCommand": "yarn dev",
    "installCommand": "yarn install",
    "outputDirectory": ".next"
  }
}
EOF

echo "✅ Vercel configuration files created!"
echo ""

echo "🔧 Next steps:"
echo "1. Run 'npx vercel login' to authenticate"
echo "2. Run 'npx vercel link' to link your project"
echo "3. Run 'yarn vercel:preview' to deploy preview"
echo "4. Run 'yarn vercel:deploy' to deploy to production"
echo ""

echo "📚 Environment Variables to set in Vercel dashboard:"
echo "  - NODE_ENV=production"
echo "  - NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api"
echo "  - NEXT_PUBLIC_APP_ENV=production"
echo ""

echo "🎉 Setup complete! Your ReservApp is ready for Vercel deployment."