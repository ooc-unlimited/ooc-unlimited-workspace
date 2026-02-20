#!/bin/bash

# Authentication Flow Test
# Tests the complete login → create → success page flow

BASE_URL="http://localhost:3001"
COOKIE_FILE="/tmp/auth_cookies.txt"

echo "🔐 TESTING COMPLETE AUTHENTICATION FLOW"
echo ""

# Clean up any previous cookie file
rm -f "$COOKIE_FILE"

# Step 1: Test login and capture cookies
echo "🏁 Step 1: Testing login flow..."

login_response=$(curl -s -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"password":"Start345"}' \
  -c "$COOKIE_FILE" \
  -w "\nHTTP_CODE:%{http_code}")

login_http_code=$(echo "$login_response" | grep "HTTP_CODE:" | cut -d: -f2)
login_body=$(echo "$login_response" | sed '/HTTP_CODE:/d')

if [[ "$login_http_code" == "200" ]]; then
  echo "✅ Login successful"
  echo "Cookies saved to: $COOKIE_FILE"
  if [[ -f "$COOKIE_FILE" ]]; then
    echo "Cookie contents:"
    cat "$COOKIE_FILE"
  fi
else
  echo "❌ Login failed (HTTP $login_http_code)"
  echo "Response: $login_body"
  exit 1
fi

echo ""

# Step 2: Test protected dashboard with cookies
echo "🏠 Step 2: Testing dashboard access with auth cookies..."

dashboard_response=$(curl -s "$BASE_URL/admin/dashboard" \
  -b "$COOKIE_FILE" \
  -w "\nHTTP_CODE:%{http_code}")

dashboard_http_code=$(echo "$dashboard_response" | grep "HTTP_CODE:" | cut -d: -f2)

if [[ "$dashboard_http_code" == "200" ]]; then
  echo "✅ Dashboard accessible with auth cookies"
else
  echo "❌ Dashboard access failed (HTTP $dashboard_http_code)"
  echo "First 200 chars of response:"
  echo "$dashboard_response" | sed '/HTTP_CODE:/d' | head -c 200
  exit 1
fi

echo ""

# Step 3: Create Grand Opening with cookies
echo "🎊 Step 3: Creating Grand Opening with authenticated session..."

test_data='{"agent_name":"Auth Flow Test Agent","agent_email":"authtest@example.com","event_date":"2026-03-15","event_time":"19:00","target_guests":100}'

create_response=$(curl -s -X POST "$BASE_URL/api/grand-opening/events" \
  -H "Content-Type: application/json" \
  -d "$test_data" \
  -b "$COOKIE_FILE" \
  -w "\nHTTP_CODE:%{http_code}")

create_http_code=$(echo "$create_response" | grep "HTTP_CODE:" | cut -d: -f2)
create_body=$(echo "$create_response" | sed '/HTTP_CODE:/d')

if [[ "$create_http_code" == "201" ]]; then
  echo "✅ Grand Opening created successfully"
  
  # Extract event ID
  event_id=$(echo "$create_body" | grep -o '"id":[0-9]*' | cut -d: -f2)
  echo "Event ID: $event_id"
else
  echo "❌ Grand Opening creation failed (HTTP $create_http_code)"
  echo "Response: $create_body"
  exit 1
fi

echo ""

# Step 4: Test success page with cookies  
echo "🎯 Step 4: Testing success page with authenticated session..."

success_url="$BASE_URL/admin/grand-opening/$event_id"

success_response=$(curl -s "$success_url" \
  -b "$COOKIE_FILE" \
  -w "\nHTTP_CODE:%{http_code}")

success_http_code=$(echo "$success_response" | grep "HTTP_CODE:" | cut -d: -f2)
success_body=$(echo "$success_response" | sed '/HTTP_CODE:/d')

if [[ "$success_http_code" == "200" ]]; then
  echo "✅ Success page loads correctly with authentication"
  
  # Check if page contains expected content
  if echo "$success_body" | grep -q "Grand Opening" && echo "$success_body" | grep -q "Auth Flow Test Agent"; then
    echo "✅ Success page contains expected content"
  else
    echo "⚠️  Success page loaded but missing expected content"
    echo "First 300 chars:"
    echo "$success_body" | head -c 300
  fi
else
  echo "❌ Success page failed (HTTP $success_http_code)"
  echo "URL: $success_url"
  echo "First 200 chars of response:"
  echo "$success_body" | head -c 200
  exit 1
fi

echo ""

# Step 5: Test the redirect flow simulation
echo "🔄 Step 5: Simulating browser redirect behavior..."

# Test what happens when we follow redirects
redirect_test=$(curl -s -L "$BASE_URL/admin/grand-opening/$event_id" \
  -b "$COOKIE_FILE" \
  -w "\nFINAL_URL:%{url_effective}\nHTTP_CODE:%{http_code}")

final_url=$(echo "$redirect_test" | grep "FINAL_URL:" | cut -d: -f2-)
final_http_code=$(echo "$redirect_test" | grep "HTTP_CODE:" | cut -d: -f2)

echo "Final URL: $final_url"
echo "Final HTTP Code: $final_http_code"

if [[ "$final_http_code" == "200" ]] && [[ "$final_url" == *"/admin/grand-opening/$event_id"* ]]; then
  echo "✅ Redirect flow works correctly"
else
  echo "⚠️  Redirect flow may have issues"
fi

echo ""
echo "============================================================"
echo "🎉 AUTHENTICATION FLOW TEST COMPLETE"
echo "============================================================"
echo ""
echo "🔍 SUMMARY:"
echo "✅ Login works"
echo "✅ Dashboard accessible with auth"
echo "✅ Grand Opening creation works"
if [[ "$success_http_code" == "200" ]]; then
  echo "✅ Success page works with authentication"
  echo ""
  echo "🎯 CONCLUSION: The issue is likely that users lose authentication"
  echo "   between form submission and redirect, or there's a cookie issue."
else
  echo "❌ Success page still fails even with authentication"
  echo ""
  echo "🔧 The issue needs further investigation."
fi

# Clean up
rm -f "$COOKIE_FILE"