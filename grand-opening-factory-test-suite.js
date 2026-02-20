#!/usr/bin/env node

/**
 * Grand Opening Factory Test Suite
 * Tests the complete flow "at least 100 times" as requested
 */

const axios = require('axios');
const { execSync } = require('child_process');

const BASE_URL = 'http://localhost:3001';
const TEST_COUNT = 150; // More than 100 as requested
let passCount = 0;
let failCount = 0;
let errors = [];

// Test data variations
const testAgents = [
  { name: 'Test Agent 1', email: 'test1@example.com', phone: '555-0001' },
  { name: 'Test Agent 2', email: 'test2@example.com', phone: '555-0002' },
  { name: 'Test Agent 3', email: 'test3@example.com', phone: '555-0003' },
  { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0101' },
  { name: 'Mike Rodriguez', email: 'mike@example.com', phone: '555-0102' },
  { name: 'Ashley Chen', email: 'ashley@example.com', phone: '555-0103' },
  { name: 'David Thompson', email: 'david@example.com', phone: '555-0104' },
  { name: 'Maria Garcia', email: 'maria@example.com', phone: '555-0105' },
];

function randomAgent() {
  return testAgents[Math.floor(Math.random() * testAgents.length)];
}

function randomDate() {
  const start = new Date();
  start.setDate(start.getDate() + 7); // At least 1 week from now
  const end = new Date();
  end.setDate(end.getDate() + 60); // Up to 2 months from now
  
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function randomTime() {
  const hours = [17, 18, 19, 20, 21]; // 5-9 PM
  const hour = hours[Math.floor(Math.random() * hours.length)];
  const minute = Math.random() < 0.5 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
}

async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/login`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error(`❌ Health check failed:`, error.message);
    return false;
  }
}

async function testGrandOpeningCreation(testNumber) {
  const agent = randomAgent();
  const testData = {
    agent_name: `${agent.name} (Test ${testNumber})`,
    agent_email: agent.email,
    agent_phone: agent.phone,
    event_date: randomDate(),
    event_time: randomTime(),
    event_timezone: 'America/New_York',
    target_guests: Math.floor(Math.random() * 100) + 50, // 50-150 guests
    agent_story: `Test story for agent ${testNumber}. This is my why...`,
    zoom_link: `https://zoom.us/j/test${testNumber}`,
    trainer_name: 'Test Trainer'
  };

  try {
    // Test the API endpoint
    const response = await axios.post(`${BASE_URL}/api/grand-opening/events`, testData, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status !== 201) {
      throw new Error(`Expected 201, got ${response.status}`);
    }

    const event = response.data;
    
    // Verify response structure
    if (!event.id || !event.agent_name || !event.event_date) {
      throw new Error('Response missing required fields');
    }

    // Verify data integrity
    if (event.agent_name !== testData.agent_name) {
      throw new Error(`Agent name mismatch: expected ${testData.agent_name}, got ${event.agent_name}`);
    }

    if (event.event_date !== testData.event_date) {
      throw new Error(`Event date mismatch: expected ${testData.event_date}, got ${event.event_date}`);
    }

    // Test retrieval
    const getResponse = await axios.get(`${BASE_URL}/api/grand-opening/events`);
    if (getResponse.status !== 200) {
      throw new Error(`Failed to retrieve events: ${getResponse.status}`);
    }

    const events = getResponse.data;
    const createdEvent = events.find(e => e.id === event.id);
    if (!createdEvent) {
      throw new Error('Created event not found in list');
    }

    passCount++;
    if (testNumber % 10 === 0) {
      console.log(`✅ Test ${testNumber}: PASS - Created event ${event.id} for ${event.agent_name}`);
    }

    return { success: true, eventId: event.id };

  } catch (error) {
    failCount++;
    const errorMsg = `Test ${testNumber} FAILED: ${error.message}`;
    errors.push(errorMsg);
    console.error(`❌ ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

async function testFormValidation() {
  const validationTests = [
    // Missing required fields
    { data: {}, expectedError: 'agent_name and event_date required' },
    { data: { agent_name: 'Test' }, expectedError: 'agent_name and event_date required' },
    { data: { event_date: '2026-03-01' }, expectedError: 'agent_name and event_date required' },
    
    // Valid minimal data
    { data: { agent_name: 'Valid Test', event_date: '2026-03-01' }, shouldPass: true },
  ];

  console.log('🧪 Testing form validation...');
  
  for (let i = 0; i < validationTests.length; i++) {
    const test = validationTests[i];
    try {
      const response = await axios.post(`${BASE_URL}/api/grand-opening/events`, test.data, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });

      if (test.shouldPass) {
        if (response.status === 201) {
          console.log(`✅ Validation test ${i + 1}: PASS (valid data accepted)`);
        } else {
          console.error(`❌ Validation test ${i + 1}: FAIL (valid data rejected with ${response.status})`);
        }
      } else {
        console.error(`❌ Validation test ${i + 1}: FAIL (invalid data accepted with ${response.status})`);
      }

    } catch (error) {
      if (test.shouldPass) {
        console.error(`❌ Validation test ${i + 1}: FAIL (valid data threw error: ${error.message})`);
      } else {
        if (error.response && error.response.status === 400) {
          console.log(`✅ Validation test ${i + 1}: PASS (invalid data properly rejected)`);
        } else {
          console.error(`❌ Validation test ${i + 1}: FAIL (wrong error type: ${error.message})`);
        }
      }
    }
  }
}

async function testConcurrentRequests() {
  console.log('🚀 Testing concurrent requests...');
  
  const concurrentTests = [];
  for (let i = 0; i < 10; i++) {
    concurrentTests.push(testGrandOpeningCreation(`CONCURRENT-${i + 1}`));
  }

  const results = await Promise.allSettled(concurrentTests);
  const concurrentPasses = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const concurrentFails = results.length - concurrentPasses;

  console.log(`✅ Concurrent tests: ${concurrentPasses} passed, ${concurrentFails} failed`);
}

async function runFullTestSuite() {
  console.log('🎯 STARTING COMPREHENSIVE GRAND OPENING FACTORY TEST SUITE');
  console.log(`🧪 Running ${TEST_COUNT} creation tests + validation + concurrent tests`);
  console.log('⏱️  This will take several minutes...\n');

  // Health check first
  console.log('🏥 Health check...');
  const isHealthy = await testHealthCheck();
  if (!isHealthy) {
    console.error('❌ CRITICAL: Server is not responding. Tests cannot proceed.');
    return;
  }
  console.log('✅ Server is healthy\n');

  // Form validation tests
  await testFormValidation();
  console.log('');

  // Concurrent request tests
  await testConcurrentRequests();
  console.log('');

  // Main test loop
  console.log(`🔄 Running ${TEST_COUNT} individual creation tests...`);
  
  const startTime = Date.now();
  
  for (let i = 1; i <= TEST_COUNT; i++) {
    await testGrandOpeningCreation(i);
    
    // Progress reporting
    if (i % 25 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (i / elapsed).toFixed(1);
      console.log(`📊 Progress: ${i}/${TEST_COUNT} (${((i/TEST_COUNT)*100).toFixed(1)}%) - ${rate} tests/sec - ${passCount} passed, ${failCount} failed`);
    }
    
    // Brief pause to avoid overwhelming the server
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const avgRate = (TEST_COUNT / totalTime).toFixed(1);

  // Final report
  console.log('\n' + '='.repeat(60));
  console.log('🎉 GRAND OPENING FACTORY TEST SUITE COMPLETE');
  console.log('='.repeat(60));
  console.log(`📊 Tests Run: ${TEST_COUNT}`);
  console.log(`✅ Passed: ${passCount} (${((passCount/TEST_COUNT)*100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failCount} (${((failCount/TEST_COUNT)*100).toFixed(1)}%)`);
  console.log(`⏱️  Total Time: ${totalTime} seconds`);
  console.log(`🚀 Average Rate: ${avgRate} tests/second`);
  
  if (failCount === 0) {
    console.log('🎊 ALL TESTS PASSED! Grand Opening Factory is ready for production use.');
  } else {
    console.log(`\n⚠️  FAILURE SUMMARY:`);
    errors.slice(0, 10).forEach(error => console.log(`   • ${error}`));
    if (errors.length > 10) {
      console.log(`   • ... and ${errors.length - 10} more errors`);
    }
  }
  
  console.log('='.repeat(60));
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Test suite interrupted by user');
  console.log(`📊 Partial Results: ${passCount} passed, ${failCount} failed`);
  process.exit(1);
});

// Run the tests
runFullTestSuite().catch(error => {
  console.error('💥 Fatal error in test suite:', error);
  process.exit(1);
});