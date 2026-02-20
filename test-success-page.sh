#!/bin/bash

# Success Page Test Suite
# Tests the Grand Opening success page "100 times" as requested

BASE_URL="http://localhost:3001"
TEST_COUNT=100
PASS_COUNT=0
FAIL_COUNT=0
ERROR_LOG="success-page-errors.log"

# Clear previous error log
> "$ERROR_LOG"

echo "🎯 TESTING GRAND OPENING SUCCESS PAGE"
echo "🧪 Running $TEST_COUNT end-to-end tests (create → success page)"
echo "⏱️  This will test the complete flow..."
echo ""

# Health check function
test_health_check() {
  echo "🏥 Performing health check..."
  
  local response_code
  response_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login" --max-time 10)
  
  if [[ "$response_code" == "200" ]]; then
    echo "✅ Server is healthy (HTTP $response_code)"
    return 0
  else
    echo "❌ CRITICAL: Server health check failed (HTTP $response_code)"
    return 1
  fi
}

# Test complete flow: create event → test success page
test_success_page_flow() {
  local test_num=$1
  
  # Step 1: Create a Grand Opening event
  local test_data=$(cat <<EOF
{
  "agent_name": "Success Test Agent $test_num",
  "agent_email": "successtest$test_num@example.com",
  "agent_phone": "555-$(printf "%04d" $test_num)",
  "event_date": "2026-03-15",
  "event_time": "19:00",
  "event_timezone": "America/New_York",
  "target_guests": 100,
  "agent_story": "Test story for success page test $test_num",
  "zoom_link": "https://zoom.us/j/successtest$test_num",
  "trainer_name": "Success Test Trainer"
}
EOF
)

  # Create the event
  local create_response
  local create_http_code
  
  create_response=$(curl -s -X POST "$BASE_URL/api/grand-opening/events" \
    -H "Content-Type: application/json" \
    -d "$test_data" \
    --max-time 15 \
    -w "\nHTTP_CODE:%{http_code}")
  
  create_http_code=$(echo "$create_response" | grep "HTTP_CODE:" | cut -d: -f2)
  create_body=$(echo "$create_response" | sed '/HTTP_CODE:/d')
  
  if [[ "$create_http_code" != "201" ]]; then
    ((FAIL_COUNT++))
    echo "❌ Test $test_num: FAIL - Event creation failed (HTTP $create_http_code)" | tee -a "$ERROR_LOG"
    return 1
  fi
  
  # Extract event ID from response
  local event_id
  event_id=$(echo "$create_body" | grep -o '"id":[0-9]*' | cut -d: -f2)
  
  if [[ -z "$event_id" ]]; then
    ((FAIL_COUNT++))
    echo "❌ Test $test_num: FAIL - Could not extract event ID from response" | tee -a "$ERROR_LOG"
    echo "Response: $create_body" >> "$ERROR_LOG"
    return 1
  fi
  
  # Step 2: Test the success page URL
  local success_url="$BASE_URL/admin/grand-opening/$event_id"
  local success_response
  local success_http_code
  
  success_response=$(curl -s "$success_url" \
    --max-time 10 \
    -w "\nHTTP_CODE:%{http_code}")
  
  success_http_code=$(echo "$success_response" | grep "HTTP_CODE:" | cut -d: -f2)
  success_body=$(echo "$success_response" | sed '/HTTP_CODE:/d')
  
  # Step 3: Test the API endpoint too
  local api_url="$BASE_URL/api/grand-opening/events/$event_id"
  local api_response
  local api_http_code
  
  api_response=$(curl -s "$api_url" \
    --max-time 10 \
    -w "\nHTTP_CODE:%{http_code}")
  
  api_http_code=$(echo "$api_response" | grep "HTTP_CODE:" | cut -d: -f2)
  api_body=$(echo "$api_response" | sed '/HTTP_CODE:/d')
  
  # Check results
  if [[ "$success_http_code" == "200" ]] && [[ "$api_http_code" == "200" ]]; then
    # Verify the page contains expected content
    if echo "$success_body" | grep -q "Grand Opening" && echo "$api_body" | grep -q "Success Test Agent $test_num"; then
      ((PASS_COUNT++))
      
      # Show progress every 10 tests
      if (( test_num % 10 == 0 )); then
        echo "✅ Test $test_num: PASS - Event $event_id success page works"
      fi
      
      return 0
    else
      ((FAIL_COUNT++))
      echo "❌ Test $test_num: FAIL - Success page missing expected content" | tee -a "$ERROR_LOG"
      echo "API Response: $api_body" >> "$ERROR_LOG"
      return 1
    fi
  else
    ((FAIL_COUNT++))
    echo "❌ Test $test_num: FAIL - Success page HTTP $success_http_code, API HTTP $api_http_code" | tee -a "$ERROR_LOG"
    echo "Success URL: $success_url" >> "$ERROR_LOG"
    echo "API URL: $api_url" >> "$ERROR_LOG"
    echo "Success Response: $success_body" >> "$ERROR_LOG"
    echo "API Response: $api_body" >> "$ERROR_LOG"
    return 1
  fi
}

# Test individual components
test_components() {
  echo "🧪 Testing individual components..."
  
  # Test 1: Create an event and get its ID
  local test_data='{"agent_name":"Component Test","agent_email":"test@example.com","event_date":"2026-03-15","event_time":"19:00","target_guests":100}'
  
  local response
  response=$(curl -s -X POST "$BASE_URL/api/grand-opening/events" \
    -H "Content-Type: application/json" \
    -d "$test_data" \
    --max-time 10 \
    -w "\nHTTP_CODE:%{http_code}")
  
  local http_code
  http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
  
  if [[ "$http_code" != "201" ]]; then
    echo "❌ Component test failed: Cannot create test event ($http_code)"
    return 1
  fi
  
  local event_id
  event_id=$(echo "$response" | sed '/HTTP_CODE:/d' | grep -o '"id":[0-9]*' | cut -d: -f2)
  
  echo "✅ Created test event with ID: $event_id"
  
  # Test 2: Direct API call
  local api_response
  api_response=$(curl -s "$BASE_URL/api/grand-opening/events/$event_id" --max-time 10 -w "\nHTTP_CODE:%{http_code}")
  local api_http_code
  api_http_code=$(echo "$api_response" | grep "HTTP_CODE:" | cut -d: -f2)
  
  if [[ "$api_http_code" == "200" ]]; then
    echo "✅ API endpoint works: /api/grand-opening/events/$event_id"
  else
    echo "❌ API endpoint failed: HTTP $api_http_code"
    echo "$api_response" | sed '/HTTP_CODE:/d'
    return 1
  fi
  
  # Test 3: Success page HTML
  local page_response
  page_response=$(curl -s "$BASE_URL/admin/grand-opening/$event_id" --max-time 10 -w "\nHTTP_CODE:%{http_code}")
  local page_http_code
  page_http_code=$(echo "$page_response" | grep "HTTP_CODE:" | cut -d: -f2)
  
  if [[ "$page_http_code" == "200" ]]; then
    echo "✅ Success page loads: /admin/grand-opening/$event_id"
    
    # Check for common error indicators in HTML
    local page_body
    page_body=$(echo "$page_response" | sed '/HTTP_CODE:/d')
    
    if echo "$page_body" | grep -qi "404\|not found\|error"; then
      echo "⚠️  Success page contains error indicators"
      echo "First 200 chars: $(echo "$page_body" | head -c 200)"
    else
      echo "✅ Success page appears healthy"
    fi
  else
    echo "❌ Success page failed: HTTP $page_http_code"
    echo "First 200 chars: $(echo "$page_response" | sed '/HTTP_CODE:/d' | head -c 200)"
    return 1
  fi
  
  echo ""
}

# Main test execution
main() {
  local start_time=$(date +%s)
  
  # Health check first
  if ! test_health_check; then
    echo "🛑 Cannot proceed with tests - server is not responding"
    exit 1
  fi
  echo ""
  
  # Component tests first
  test_components
  
  # Main test loop
  echo "🔄 Running $TEST_COUNT end-to-end success page tests..."
  echo ""
  
  for ((i=1; i<=TEST_COUNT; i++)); do
    test_success_page_flow $i
    
    # Progress reporting every 10 tests
    if (( i % 10 == 0 )); then
      local elapsed=$(($(date +%s) - start_time))
      local rate=$(echo "scale=1; $i / $elapsed" | bc -l 2>/dev/null || echo "N/A")
      echo "📊 Progress: $i/$TEST_COUNT ($(echo "scale=1; $i * 100 / $TEST_COUNT" | bc -l 2>/dev/null || echo "N/A")%) - $rate tests/sec - $PASS_COUNT passed, $FAIL_COUNT failed"
    fi
    
    # Brief pause every 5 tests
    if (( i % 5 == 0 )); then
      sleep 0.05
    fi
  done
  
  local end_time=$(date +%s)
  local total_time=$((end_time - start_time))
  local avg_rate=$(echo "scale=1; $TEST_COUNT / $total_time" | bc -l 2>/dev/null || echo "N/A")
  
  # Final report
  echo ""
  echo "============================================================"
  echo "🎉 SUCCESS PAGE TEST SUITE COMPLETE"
  echo "============================================================"
  echo "📊 Tests Run: $TEST_COUNT"
  echo "✅ Passed: $PASS_COUNT ($(echo "scale=1; $PASS_COUNT * 100 / $TEST_COUNT" | bc -l 2>/dev/null || echo "N/A")%)"
  echo "❌ Failed: $FAIL_COUNT ($(echo "scale=1; $FAIL_COUNT * 100 / $TEST_COUNT" | bc -l 2>/dev/null || echo "N/A")%)"
  echo "⏱️  Total Time: $total_time seconds"
  echo "🚀 Average Rate: $avg_rate tests/second"
  
  if [[ $FAIL_COUNT -eq 0 ]]; then
    echo "🎊 ALL SUCCESS PAGE TESTS PASSED! Ready for Gary to test."
  else
    echo ""
    echo "⚠️  FAILURE SUMMARY (first 10 errors):"
    head -10 "$ERROR_LOG" | sed 's/^/   • /'
    if [[ $(wc -l < "$ERROR_LOG") -gt 10 ]]; then
      echo "   • ... and $(($(wc -l < "$ERROR_LOG") - 10)) more errors (see $ERROR_LOG)"
    fi
    
    echo ""
    echo "🔧 DIAGNOSTIC INFO:"
    echo "   • Server health: $(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login")"
    echo "   • Last created event ID available for manual testing"
  fi
  
  echo "============================================================"
}

# Handle interruption
trap 'echo -e "\n🛑 Test suite interrupted by user"; echo "📊 Partial Results: $PASS_COUNT passed, $FAIL_COUNT failed"; exit 1' INT

# Check dependencies
if ! command -v curl &> /dev/null; then
  echo "❌ curl is required but not installed"
  exit 1
fi

# Run the tests
main