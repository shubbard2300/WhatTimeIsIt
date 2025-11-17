#!/bin/bash

# Update PUBLIC_BASE_URL for all Vercel environments
# This fixes the issue where Twilio calls were hitting preview URLs with 403 errors

PRODUCTION_URL="https://what-time-is-it-amber.vercel.app"

echo "🔧 Updating PUBLIC_BASE_URL to: $PRODUCTION_URL"
echo ""

# Remove old PUBLIC_BASE_URL from all environments
echo "📝 Removing old PUBLIC_BASE_URL from production..."
echo "y" | vercel env rm PUBLIC_BASE_URL production 2>/dev/null || echo "   (no existing production var)"

echo "📝 Removing old PUBLIC_BASE_URL from preview..."
echo "y" | vercel env rm PUBLIC_BASE_URL preview 2>/dev/null || echo "   (no existing preview var)"

echo "📝 Removing old PUBLIC_BASE_URL from development..."
echo "y" | vercel env rm PUBLIC_BASE_URL development 2>/dev/null || echo "   (no existing development var)"

echo ""
echo "✅ Old variables removed"
echo ""

# Add new PUBLIC_BASE_URL to all environments
echo "📝 Adding PUBLIC_BASE_URL to production..."
echo "$PRODUCTION_URL" | vercel env add PUBLIC_BASE_URL production

echo "📝 Adding PUBLIC_BASE_URL to preview..."
echo "$PRODUCTION_URL" | vercel env add PUBLIC_BASE_URL preview

echo "📝 Adding PUBLIC_BASE_URL to development..."
echo "$PRODUCTION_URL" | vercel env add PUBLIC_BASE_URL development

echo ""
echo "✅ PUBLIC_BASE_URL updated for all environments!"
echo ""
echo "🚀 Now redeploying to production..."
vercel --prod

echo ""
echo "✅ Done! Test the call with: node test-call.js"
