#!/usr/bin/env tsx

import { DriveSearch, ListDriveFiles } from '../packages/google/src/drive';
import type { GoogleServiceConfig } from '../packages/google/src/types';

/**
 * Test script to debug Google Drive description field issue
 * 
 * Usage:
 * 1. Set your environment variables:
 *    export GOOGLE_ACCESS_TOKEN="your_access_token"
 *    export GOOGLE_REFRESH_TOKEN="your_refresh_token" 
 *    export GOOGLE_SERVICE_API_URL="your_api_url"
 * 
 * 2. Run the script:
 *    npx tsx examples/drive.ts
 */

async function testDriveDescriptions() {
  // Configuration from environment variables
  const config: GoogleServiceConfig = {
    accessToken: process.env.GOOGLE_ACCESS_TOKEN || '',
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN || '',
    googleServiceApiUrl: process.env.GOOGLE_SERVICE_API_URL || 'http://localhost:8080'
  };

  // Validate configuration
  if (!config.accessToken) {
    console.error('❌ GOOGLE_ACCESS_TOKEN environment variable is required');
    process.exit(1);
  }
  if (!config.googleServiceApiUrl) {
    console.error('❌ GOOGLE_SERVICE_API_URL environment variable is required');
    process.exit(1);
  }

  console.log('🔧 Configuration:');
  console.log(`  Access Token: ${config.accessToken.substring(0, 20)}...`);
  console.log(`  API URL: ${config.googleServiceApiUrl}`);
  console.log('');

  // Test 1: DriveSearch
  console.log('🔍 Testing DriveSearch...');
  try {
    const driveSearch = new DriveSearch(config);
    const searchFunction = driveSearch.toFunction();
    
    // Search for all files (no filter) to get a broad sample
    const searchResult = await searchFunction.func({ query: '' }) as any;
    
    console.log(`✅ DriveSearch Success: ${searchResult.success}`);
    if (searchResult.success && searchResult.files && searchResult.files.length > 0) {
      console.log(`📁 Found ${searchResult.files.length} files`);
      
      // Show the first file with all its fields
      const firstFile = searchResult.files[0];
      console.log('📄 First file details:');
      console.log(`   Available fields: [${Object.keys(firstFile).join(', ')}]`);
      console.log(`   ID: ${firstFile.id}`);
      console.log(`   Name: ${firstFile.name}`);
      console.log(`   Description: ${firstFile.description || '[NO DESCRIPTION FIELD]'}`);
      console.log(`   MimeType: ${firstFile.mimeType}`);
      console.log(`   Modified: ${firstFile.modifiedTime}`);
      console.log(`   Size: ${firstFile.size || '[NO SIZE FIELD]'}`);
      console.log(`   WebViewLink: ${firstFile.webViewLink}`);
      
      // Check if any files have descriptions
      const filesWithDescriptions = searchResult.files.filter((file: any) => 
        file.description && file.description.trim() !== ''
      );
      console.log(`📝 Files with descriptions: ${filesWithDescriptions.length}/${searchResult.files.length}`);
      
      if (filesWithDescriptions.length > 0) {
        console.log('📝 Sample file with description:');
        const sampleFile = filesWithDescriptions[0];
        console.log(`   Name: ${sampleFile.name}`);
        console.log(`   Description: "${sampleFile.description}"`);
      }
    } else {
      console.log('❌ Search failed or returned no files');
      console.log('Error:', searchResult.error);
    }
  } catch (error) {
    console.error('❌ DriveSearch Error:', error);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: ListDriveFiles
  console.log('📋 Testing ListDriveFiles...');
  try {
    const listFiles = new ListDriveFiles(config);
    const listFunction = listFiles.toFunction();
    
    const listResult = await listFunction.func({ pageSize: '10' }) as any;
    
    console.log(`✅ ListDriveFiles Success: ${listResult.success}`);
    if (listResult.success && listResult.files && listResult.files.length > 0) {
      console.log(`📁 Found ${listResult.files.length} files`);
      
      // Show the first file with all its fields
      const firstFile = listResult.files[0];
      console.log('📄 First file details:');
      console.log(`   Available fields: [${Object.keys(firstFile).join(', ')}]`);
      console.log(`   ID: ${firstFile.id}`);
      console.log(`   Name: ${firstFile.name}`);
      console.log(`   Description: ${firstFile.description || '[NO DESCRIPTION FIELD]'}`);
      console.log(`   MimeType: ${firstFile.mimeType}`);
      console.log(`   Modified: ${firstFile.modifiedTime}`);
      console.log(`   Size: ${firstFile.size || '[NO SIZE FIELD]'}`);
      console.log(`   WebViewLink: ${firstFile.webViewLink}`);
      
      // Check if any files have descriptions
      const filesWithDescriptions = listResult.files.filter((file: any) => 
        file.description && file.description.trim() !== ''
      );
      console.log(`📝 Files with descriptions: ${filesWithDescriptions.length}/${listResult.files.length}`);
      
      if (filesWithDescriptions.length > 0) {
        console.log('📝 Sample file with description:');
        const sampleFile = filesWithDescriptions[0];
        console.log(`   Name: ${sampleFile.name}`);
        console.log(`   Description: "${sampleFile.description}"`);
      }
    } else {
      console.log('❌ List failed or returned no files');
      console.log('Error:', listResult.error);
    }
  } catch (error) {
    console.error('❌ ListDriveFiles Error:', error);
  }

  console.log('\n' + '='.repeat(60) + '\n');
  console.log('🔍 Debug Summary:');
  console.log('If descriptions are showing as "[NO DESCRIPTION FIELD]", the issue is likely:');
  console.log('1. 📡 API not returning description field (check scopes/permissions)');
  console.log('2. 🔧 Backend service filtering out descriptions');
  console.log('3. 📝 Files genuinely don\'t have descriptions set');
  console.log('4. 🔑 Insufficient OAuth scopes for metadata access');
}

// Run the test
testDriveDescriptions().catch(console.error);