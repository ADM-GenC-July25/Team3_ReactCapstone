#!/bin/bash

# Test runner script for the Schedule Planner Backend
# This script runs all tests and generates a coverage report

echo "=== Schedule Planner Backend Test Suite ==="
echo "Running all tests..."
echo

# Navigate to the backend directory
cd "$(dirname "$0")"

# Clean and run tests
echo "Cleaning project..."
./apache-maven-3.9.5/bin/mvn clean

echo
echo "Running unit tests..."
./apache-maven-3.9.5/bin/mvn test

echo
echo "Running integration tests..."
./apache-maven-3.9.5/bin/mvn failsafe:integration-test

echo
echo "Generating test report..."
./apache-maven-3.9.5/bin/mvn surefire-report:report

echo
echo "=== Test Summary ==="
echo "Check target/site/surefire-report.html for detailed test results"
echo "Check target/surefire-reports/ for individual test reports"
echo

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
    exit 0
else
    echo "❌ Some tests failed!"
    exit 1
fi
