#!/bin/bash

# Grand Opening Factory Test Suite
# Tests the complete flow "at least 100 times" as requested

BASE_URL="http://localhost:3001"
TEST_COUNT=150
PASS_COUNT=0
FAIL_COUNT=0
ERROR_LOG="test-errors.log"

# Clear previous error log
> "$ERROR_LOG"

echo "🎯 STARTING COMPREHENSIVE GRAND OPENING FACTORY TEST SUITE"
echo "🧪 Running $TEST_COUNT creation tests + validation + health checks"
echo "⏱️  This will take several minutes..."
echo ""

# Test agent names for variety
AGENT_NAMES=(
  "Test Agent Alpha"
  "Beta Testing User"
  "Gamma Test Person"
  "Sarah Johnson"
  "Mike Rodriguez"
  "Ashley Chen"
  "David Thompson"
  "Maria Garcia"
  "Chris Williams"
  "Jennifer Davis"
)

# Generate random date (7-60 days from now)
get_random_date() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    date -v +${1}d +%Y-%m-%d
  else
    # Linux
    date -d "+${1} days" +%Y-%m-%d
  fi
}

# Generate random time
get_random_time() {
  local hours=(17 18 19 20 21)  # 5-9 PM
  local hour=${hours[$RANDOM % ${#hours[@]}]}
  local minute=$([ $((RANDOM % 2)) -eq 0 ] && echo "00" || echo "30")
  printf "%02d:%s" "$hour" "$minute"
}

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

# Test Grand Opening creation
test_grand_opening_creation() {
  local test_num=$1
  local agent_name="${AGENT_NAMES[$((RANDOM % ${#AGENT_NAMES[@]}))]}"
  local event_date
  local event_time
  local days_ahead=$((RANDOM % 54 + 7))  # 7-60 days ahead
  
  event_date=$(get_random_date $days_ahead)
  event_time=$(get_random_time)
  
  # Create test data JSON
  local test_data=$(cat <<EOF
{
  "agent_name": "$agent_name (Test $test_num)",
  "agent_email": "test$test_num@example.com",
  "agent_phone": "555-$(printf "%04d" $test_num)",
  "event_date": "$event_date",
  "event_time": "$event_time",
  "event_timezone": "America/New_York",
  "target_guests": $((RANDOM % 100 + 50)),
  "agent_story": "Test story for agent $test_num. This is my why...",
  "zoom_link": "https://zoom.us/j/test$test_num",
  "trainer_name": "Test Trainer"
}
EOF
)

  # Make API request
  local response
  local http_code
  
  response=$(curl -s -X POST "$BASE_URL/api/grand-opening/events" \
    -H "Content-Type: application/json" \
    -d "$test_data" \
    --max-time 15 \
    -w "\nHTTP_CODE:%{http_code}")
  
  http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
  response_body=$(echo "$response" | sed '/HTTP_CODE:/d')
  
  if [[ "$http_code" == "201" ]]; then
    # Verify response contains expected fields
    if echo "$response_body" | grep -q '"id"' && echo "$response_body" | grep -q '"agent_name"'; then
      ((PASS_COUNT++))
      
      # Show progress every 10 tests
      if (( test_num % 10 == 0 )); then
        echo "✅ Test $test_num: PASS - Created event for $agent_name (Test $test_num)"
      fi
      
      return 0
    else
      ((FAIL_COUNT++))
      echo "❌ Test $test_num: FAIL - Response missing required fields" | tee -a "$ERROR_LOG"
      echo "Response: $response_body" >> "$ERROR_LOG"
      return 1
    fi
  else
    ((FAIL_COUNT++))
    echo "❌ Test $test_num: FAIL - HTTP $http_code" | tee -a "$ERROR_LOG"
    echo "Response: $response_body" >> "$ERROR_LOG"
    return 1
  fi
}

# Test form validation
test_form_validation() {
  echo "🧪 Testing form validation..."
  
  local validation_tests=(
    '{}:400'  # Empty data should fail
    '{"agent_name":"Test"}:400'  # Missing event_date should fail
    '{"event_date":"2026-03-01"}:400'  # Missing agent_name should fail
    '{"agent_name":"Valid Test","event_date":"2026-03-01"}:201'  # Valid minimal data should pass
  )
  
  local validation_pass=0
  local validation_fail=0
  
  for test_case in "${validation_tests[@]}"; do
    local data="${test_case%:*}"
    local expected_code="${test_case#*:}"
    
    local response
    local http_code
    
    response=$(curl -s -X POST "$BASE_URL/api/grand-opening/events" \
      -H "Content-Type: application/json" \
      -d "$data" \
      --max-time 10 \
      -w "\nHTTP_CODE:%{http_code}")
    
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    
    if [[ "$http_code" == "$expected_code" ]]; then
      ((validation_pass++))
      echo "✅ Validation test: PASS (expected $expected_code, got $http_code)"
    else
      ((validation_fail++))
      echo "❌ Validation test: FAIL (expected $expected_code, got $http_code)" | tee -a "$ERROR_LOG"
    fi
  done
  
  echo "📊 Validation results: $validation_pass passed, $validation_fail failed"
  echo ""
}

# Test concurrent requests
test_concurrent_requests() {
  echo "🚀 Testing concurrent requests (10 simultaneous)..."
  
  local pids=()
  local temp_dir=$(mktemp -d)
  
  # Launch 10 tests simultaneously
  for i in {1..10}; do
    (
      test_grand_opening_creation "CONCURRENT-$i"
      echo $? > "$temp_dir/result_$i"
    ) &
    pids+=($!)
  done
  
  # Wait for all background processes
  for pid in "${pids[@]}"; do
    wait "$pid"
  done
  
  # Count results
  local concurrent_pass=0
  local concurrent_fail=0
  
  for i in {1..10}; do
    if [[ -f "$temp_dir/result_$i" ]] && [[ "$(cat "$temp_dir/result_$i")" == "0" ]]; then
      ((concurrent_pass++))
    else
      ((concurrent_fail++))
    fi
  done
  
  echo "✅ Concurrent tests: $concurrent_pass passed, $concurrent_fail failed"
  echo ""
  
  # Cleanup
  rm -rf "$temp_dir"
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
  
  # Form validation tests
  test_form_validation
  
  # Concurrent request tests
  test_concurrent_requests
  
  # Main test loop
  echo "🔄 Running $TEST_COUNT individual creation tests..."
  echo ""
  
  for ((i=1; i<=TEST_COUNT; i++)); do
    test_grand_opening_creation $i
    
    # Progress reporting every 25 tests
    if (( i % 25 == 0 )); then
      local elapsed=$(($(date +%s) - start_time))
      local rate=$(echo "scale=1; $i / $elapsed" | bc -l 2>/dev/null || echo "N/A")
      echo "📊 Progress: $i/$TEST_COUNT ($(echo "scale=1; $i * 100 / $TEST_COUNT" | bc -l)%) - $rate tests/sec - $PASS_COUNT passed, $FAIL_COUNT failed"
    fi
    
    # Brief pause every 10 tests to avoid overwhelming server
    if (( i % 10 == 0 )); then
      sleep 0.1
    fi
  done
  
  local end_time=$(date +%s)
  local total_time=$((end_time - start_time))
  local avg_rate=$(echo "scale=1; $TEST_COUNT / $total_time" | bc -l 2>/dev/null || echo "N/A")
  
  # Final report
  echo ""
  echo "============================================================"
  echo "🎉 GRAND OPENING FACTORY TEST SUITE COMPLETE"
  echo "============================================================"
  echo "📊 Tests Run: $TEST_COUNT"
  echo "✅ Passed: $PASS_COUNT ($(echo "scale=1; $PASS_COUNT * 100 / $TEST_COUNT" | bc -l)%)"
  echo "❌ Failed: $FAIL_COUNT ($(echo "scale=1; $FAIL_COUNT * 100 / $TEST_COUNT" | bc -l)%)"
  echo "⏱️  Total Time: $total_time seconds"
  echo "🚀 Average Rate: $avg_rate tests/second"
  
  if [[ $FAIL_COUNT -eq 0 ]]; then
    echo "🎊 ALL TESTS PASSED! Grand Opening Factory is ready for production use."
  else
    echo ""
    echo "⚠️  FAILURE SUMMARY (first 10 errors):"
    head -10 "$ERROR_LOG" | sed 's/^/   • /'
    if [[ $(wc -l < "$ERROR_LOG") -gt 10 ]]; then
      echo "   • ... and $(($(wc -l < "$ERROR_LOG") - 10)) more errors (see $ERROR_LOG)"
    fi
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

if ! command -v bc &> /dev/null; then
  echo "⚠️  bc not found - percentage calculations will show N/A"
fi

# Run the tests
main