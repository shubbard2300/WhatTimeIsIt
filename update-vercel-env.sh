#!/bin/bash

# Remove old Twilio environment variables
echo "Removing old TWILIO_ACCOUNT_SID..."
echo "y" | vercel env rm TWILIO_ACCOUNT_SID production

echo "Removing old TWILIO_AUTH_TOKEN..."
echo "y" | vercel env rm TWILIO_AUTH_TOKEN production

echo "Removing old TWILIO_FROM_NUMBER..."
echo "y" | vercel env rm TWILIO_FROM_NUMBER production

# Add new Twilio environment variables
echo "Adding new TWILIO_ACCOUNT_SID..."
echo "YOUR_TWILIO_ACCOUNT_SID" | vercel env add TWILIO_ACCOUNT_SID production

echo "Adding new TWILIO_AUTH_TOKEN..."
echo "YOUR_TWILIO_AUTH_TOKEN" | vercel env add TWILIO_AUTH_TOKEN production

echo "Adding new TWILIO_FROM_NUMBER..."
echo "YOUR_TWILIO_PHONE_NUMBER" | vercel env add TWILIO_FROM_NUMBER production

echo "✅ Vercel environment variables updated!"
echo "Now redeploying..."
vercel --prod
