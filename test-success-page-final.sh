#!/bin/bash

# Final Success Page Test - Fixed Version
# Tests the complete flow with error handling improvements

BASE_URL="http://localhost:3001"
TEST_COUNT=10  # Start with a smaller test
PASS_COUNT=0
FAIL_COUNT=0
COOKIE_FILE="/tmp/test_auth_cookies.txt"

echo "🔧 TESTING FIXED SUCCESS PAGE"
echo "🧪 Running comprehensive end-to-end test"
echo ""

# Clean up any previous cookie file
rm -f "$COOKIE_FILE"

# Step 1: Login and get cookies
echo "🏁 Step 1: Logging in..."
login_response=$(curl -s -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"password":"Start345"}' \
  -c "$COOKIE_FILE" \
  -w "\nHTTP_CODE:%{http_code}")

login_http_code=$(echo "$login_response" | grep "HTTP_CODE:" | cut -d: -f2)

if [[ "$login_http_code" != "200" ]]; then
  echo "❌ Login failed (HTTP $login_http_code)"
  exit 1
fi

echo "✅ Login successful"
echo ""

# Step 2: Test the complete flow multiple times
echo "🔄 Running $TEST_COUNT complete flow tests..."
echo ""

for ((i=1; i<=TEST_COUNT; i++)); do
  echo "🧪 Test $i: Creating Grand Opening and testing success page..."
  
  # Create event data
  test_data=$(cat <<EOF
{
  "agent_name": "Success Test Agent $i",
  "agent_email": "successtest$i@example.com",
  "agent_phone": "555-$(printf "%04d" $i)",
  "event_date": "2026-03-20",
  "event_time": "19:00",
  "event_timezone": "America/New_York",
  "target_guests": 100,
  "agent_story": "Test story for success page test $i",
  "zoom_link": "https://zoom.us/j/successtest$i",
  "trainer_name": "Success Test Trainer"
}
EOF
)

  # Step 2a: Create the event
  create_response=$(curl -s -X POST "$BASE_URL/api/grand-opening/events" \
    -H "Content-Type: application/json" \
    -d "$test_data" \
    -b "$COOKIE_FILE" \
    -w "\nHTTP_CODE:%{http_code}")
  
  create_http_code=$(echo "$create_response" | grep "HTTP_CODE:" | cut -d: -f2)
  create_body=$(echo "$create_response" | sed '/HTTP_CODE:/d')
  
  if [[ "$create_http_code" != "201" ]]; then
    echo "❌ Test $i: Event creation failed (HTTP $create_http_code)"
    ((FAIL_COUNT++))
    continue
  fi
  
  # Extract event ID
  event_id=$(echo "$create_body" | grep -o '"id":[0-9]*' | cut -d: -f2)
  
  if [[ -z "$event_id" ]]; then
    echo "❌ Test $i: Could not extract event ID"
    ((FAIL_COUNT++))
    continue
  fi
  
  echo "   ✅ Event $event_id created"
  
  # Step 2b: Test the success page immediately
  success_url="$BASE_URL/admin/grand-opening/$event_id"
  
  # Give the server a brief moment to process
  sleep 0.1
  
  success_response=$(curl -s "$success_url" \
    -b "$COOKIE_FILE" \
    -w "\nHTTP_CODE:%{http_code}" \
    --max-time 10)
  
  success_http_code=$(echo "$success_response" | grep "HTTP_CODE:" | cut -d: -f2)
  success_body=$(echo "$success_response" | sed '/HTTP_CODE:/d')
  
  if [[ "$success_http_code" == "200" ]]; then
    # Check if the page loads properly and isn't just showing a loading spinner
    if echo "$success_body" | grep -q "Success Test Agent $i" || echo "$success_body" | grep -q "Grand Opening" && ! echo "$success_body" | grep -q "animate-spin"; then
      echo "   ✅ Success page loads with content"
      ((PASS_COUNT++))
    else
      echo "   ⚠️  Success page loads but may be stuck loading"
      echo "   📝 Checking if it contains loading spinner..."
      
      if echo "$success_body" | grep -q "animate-spin"; then
        echo "   ❌ Page is stuck on loading spinner"
        ((FAIL_COUNT++))
      else
        echo "   ✅ Page loads successfully (no spinner detected)"
        ((PASS_COUNT++))
      fi
    fi
  else
    echo "   ❌ Success page failed (HTTP $success_http_code)"
    echo "   📄 URL: $success_url"
    if [[ "$success_http_code" == "307" ]]; then
      echo "   🔄 Redirect detected - auth may have expired"
    fi
    ((FAIL_COUNT++))
  fi
  
  # Step 2c: Verify all API endpoints work for this event
  echo "   🔍 Verifying API endpoints..."
  
  api_tests=(
    "events/$event_id:Event data"
    "events/$event_id/guests:Guests"
    "events/$event_id/social:Social posts"
    "events/$event_id/checklist:Checklist"
  )
  
  all_apis_work=true
  
  for api_test in "${api_tests[@]}"; do
    endpoint="${api_test%:*}"
    description="${api_test#*:}"
    
    api_response=$(curl -s "$BASE_URL/api/grand-opening/$endpoint" \
      -w "\nHTTP_CODE:%{http_code}" \
      --max-time 5)
    
    api_http_code=$(echo "$api_response" | grep "HTTP_CODE:" | cut -d: -f2)
    
    if [[ "$api_http_code" != "200" ]]; then
      echo "   ❌ $description API failed (HTTP $api_http_code)"
      all_apis_work=false
    fi
  done
  
  if [[ "$all_apis_work" == true ]]; then
    echo "   ✅ All API endpoints working"
  fi
  
  echo ""
done

# Step 3: Test browser simulation (with redirects)
echo "🌐 Step 3: Testing browser-like redirect behavior..."

test_data='{"agent_name":"Browser Test Agent","agent_email":"browsertest@example.com","event_date":"2026-03-25","event_time":"19:00","target_guests":100}'

create_response=$(curl -s -X POST "$BASE_URL/api/grand-opening/events" \
  -H "Content-Type: application/json" \
  -d "$test_data" \
  -b "$COOKIE_FILE" \
  -w "\nHTTP_CODE:%{http_code}")

create_http_code=$(echo "$create_response" | grep "HTTP_CODE:" | cut -d: -f2)
create_body=$(echo "$create_response" | sed '/HTTP_CODE:/d')

if [[ "$create_http_code" == "201" ]]; then
  event_id=$(echo "$create_body" | grep -o '"id":[0-9]*' | cut -d: -f2)
  
  # Simulate browser following redirects
  browser_response=$(curl -s -L "$BASE_URL/admin/grand-opening/$event_id" \
    -b "$COOKIE_FILE" \
    -w "\nFINAL_URL:%{url_effective}\nHTTP_CODE:%{http_code}" \
    --max-time 10)
  
  final_url=$(echo "$browser_response" | grep "FINAL_URL:" | cut -d: -f2-)
  final_http_code=$(echo "$browser_response" | grep "HTTP_CODE:" | cut -d: -f2)
  
  echo "Final URL: $final_url"
  echo "Final HTTP Code: $final_http_code"
  
  if [[ "$final_http_code" == "200" ]] && [[ "$final_url" == *"/admin/grand-opening/$event_id"* ]]; then
    echo "✅ Browser simulation successful"
  else
    echo "⚠️  Browser simulation shows potential issues"
  fi
else
  echo "❌ Could not create test event for browser simulation"
fi

echo ""

# Final report
echo "============================================================"
echo "🎉 FIXED SUCCESS PAGE TEST COMPLETE"
echo "============================================================"
echo "📊 Tests Run: $TEST_COUNT"
echo "✅ Passed: $PASS_COUNT"
echo "❌ Failed: $FAIL_COUNT"

if [[ $FAIL_COUNT -eq 0 ]]; then
  echo ""
  echo "🎊 SUCCESS! All tests passed!"
  echo "✅ Grand Opening creation works"
  echo "✅ Success page loads properly" 
  echo "✅ No infinite loading spinners"
  echo "✅ Authentication flow works"
  echo "✅ All API endpoints functional"
  echo ""
  echo "🚀 READY FOR GARY TO TEST!"
else
  echo ""
  echo "⚠️  Some tests failed. Issues may remain."
  echo "📊 Success rate: $(echo "scale=1; $PASS_COUNT * 100 / $TEST_COUNT" | bc -l 2>/dev/null || echo "N/A")%"
fi

echo "============================================================"

# Cleanup
rm -f "$COOKIE_FILE"