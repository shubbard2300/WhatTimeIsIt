#!/usr/bin/env node

/**
 * Verify Vercel Environment Variables
 * 
 * This script checks if all required environment variables are properly set in Vercel.
 * Since we can't directly access Vercel's environment variables from CLI, this script
 * tests the production endpoint to see if it has access to the required variables.
 */

const PRODUCTION_URL = 'https://what-time-is-it-amber.vercel.app';

console.log('🔍 VERIFYING VERCEL ENVIRONMENT VARIABLES\n');
console.log('═'.repeat(70));

async function verifyEnvironmentVariables() {
  console.log('\n📡 Testing production endpoint to verify environment variables...\n');
  
  try {
    // Test the process-scheduled-calls endpoint
    // This endpoint logs which env vars are present
    const response = await fetch(`${PRODUCTION_URL}/api/process-scheduled-calls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    
    if (response.status === 500 && data.error) {
      console.log('\n❌ ENVIRONMENT VARIABLE ERROR DETECTED');
      console.log('─'.repeat(70));
      
      if (data.error.includes('Missing required environment variables')) {
        console.log('\n⚠️  Missing Twilio credentials in Vercel Dashboard!\n');
        console.log('Required environment variables:');
        console.log('  • TWILIO_ACCOUNT_SID');
        console.log('  • TWILIO_AUTH_TOKEN');
        console.log('  • TWILIO_FROM_NUMBER');
        console.log('  • PUBLIC_BASE_URL (optional but recommended)');
        console.log('\n📋 TO FIX:');
        console.log('  1. Go to: https://vercel.com/dashboard');
        console.log('  2. Select your project (WhatTimeIsIt)');
        console.log('  3. Go to Settings → Environment Variables');
        console.log('  4. Add the following for "Production" environment:');
        console.log('\n     Variable Name              Value');
        console.log('     ─────────────────────────  ─────────────────────────────────────────');
        console.log('     TWILIO_ACCOUNT_SID         (copy from .env file)');
        console.log('     TWILIO_AUTH_TOKEN          (copy from .env file)');
        console.log('     TWILIO_FROM_NUMBER         (copy from .env file)');
        console.log('     PUBLIC_BASE_URL            https://what-time-is-it-amber.vercel.app');
        console.log('\n  5. Also add database connection strings if not already set');
        console.log('  6. Redeploy your app (or wait for next commit)');
        
      } else {
        console.log(`\n⚠️  Error: ${data.error}`);
      }
      
      return false;
      
    } else if (response.status === 200) {
      console.log('\n✅ ENVIRONMENT VARIABLES APPEAR TO BE SET CORRECTLY');
      console.log('─'.repeat(70));
      console.log('\nThe endpoint responded successfully, which means:');
      console.log('  ✓ Twilio credentials are accessible');
      console.log('  ✓ Database connection is working');
      console.log('  ✓ PUBLIC_BASE_URL is set (or fallback is working)');
      
      if (data.processed === 0 && data.failed === 0) {
        console.log('\n📝 No calls were processed (no calls scheduled or already processed)');
      } else {
        console.log(`\n📞 Processed: ${data.processed}, Failed: ${data.failed}`);
      }
      
      console.log('\n💡 RECOMMENDATION:');
      console.log('   Set PUBLIC_BASE_URL in Vercel Dashboard to ensure consistency:');
      console.log('   PUBLIC_BASE_URL = https://what-time-is-it-amber.vercel.app');
      
      return true;
    }
    
  } catch (error) {
    console.log('\n❌ NETWORK ERROR');
    console.log('─'.repeat(70));
    console.log(`\nError: ${error.message}`);
    console.log('\nThis could mean:');
    console.log('  • The production site is down');
    console.log('  • Network connectivity issues');
    console.log('  • The endpoint is not deployed');
    
    return false;
  }
}

async function checkDashboardAccess() {
  console.log('\n\n📋 MANUAL VERIFICATION STEPS');
  console.log('═'.repeat(70));
  console.log('\nTo manually verify environment variables in Vercel Dashboard:');
  console.log('\n1. Visit: https://vercel.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to: Settings → Environment Variables');
  console.log('4. Check that these variables exist for "Production":');
  console.log('\n   ✓ TWILIO_ACCOUNT_SID');
  console.log('   ✓ TWILIO_AUTH_TOKEN');
  console.log('   ✓ TWILIO_FROM_NUMBER');
  console.log('   ✓ PUBLIC_BASE_URL');
  console.log('   ✓ POSTGRES_URL (or DATABASE_URL)');
  console.log('\n5. If any are missing, add them and redeploy');
  console.log('\n═'.repeat(70));
}

// Run verification
verifyEnvironmentVariables()
  .then(success => {
    checkDashboardAccess();
    
    if (success) {
      console.log('\n✅ Verification complete - environment looks good!\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  Verification found issues - please fix and redeploy\n');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  });
