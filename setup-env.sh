#!/bin/bash

# Environment Setup Script for bolt.new
# This script creates a .env.local file with dummy values for development

echo "Setting up environment variables for bolt.new..."

# Create .env.local file with dummy values
cat > .env.local << EOF
# OpenAI Configuration (dummy)
OPENAI_API_KEY=sk-dummy-openai-key-1234567890abcdef1234567890abcdef1234567890abcdef

# Anthropic Configuration (dummy)
ANTHROPIC_API_KEY=sk-ant-dummy-anthropic-key-1234567890abcdef1234567890abcdef1234567890abcdef

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo "✅ Created .env.local with dummy values"
echo "📝 Remember to replace with real API keys when ready for production"
echo "🔒 Never commit .env.local to version control"

# Make the script executable
chmod +x setup-env.sh

echo "🚀 Environment setup complete!"
