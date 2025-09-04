# Backend Testing Guide

This document describes the testing setup and how to run tests for the Schedule Planner Backend.

## Test Structure

The backend includes comprehensive tests covering:

### 1. Unit Tests
- **Controller Tests** (`ScheduleControllerTest.java`)
  - Tests all REST endpoints
  - Mocks service layer dependencies
  - Validates HTTP responses and status codes
  - Tests error handling scenarios

- **Service Tests** (`ScheduleServiceTest.java`)
  - Tests business logic
  - Mocks repository dependencies
  - Validates data transformation
  - Tests edge cases and error conditions

- **Repository Tests** (`ScheduleRepositoryImplTest.java`)
  - Tests data access layer
  - Mocks JdbcTemplate
  - Validates SQL query execution
  - Tests database exception handling

### 2. Integration Tests
- **Full Application Tests** (`ScheduleIntegrationTest.java`)
  - Tests complete request-response cycle
  - Uses in-memory H2 database
  - Validates API contracts
  - Tests CORS configuration

## Test Configuration

### Dependencies
- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework
- **Spring Boot Test** - Spring testing support
- **H2 Database** - In-memory database for integration tests
- **TestRestTemplate** - REST API testing

### Test Data
- `test-data.sql` - SQL script with test data
- `application-test.properties` - Test-specific configuration

## Running Tests

### Option 1: Using Maven Commands

```bash
# Run all tests
./apache-maven-3.9.5/bin/mvn test

# Run only unit tests
./apache-maven-3.9.5/bin/mvn test -Dtest="**/*Test"

# Run only integration tests
./apache-maven-3.9.5/bin/mvn test -Dtest="**/*IntegrationTest"

# Run specific test class
./apache-maven-3.9.5/bin/mvn test -Dtest="ScheduleControllerTest"

# Run with coverage report
./apache-maven-3.9.5/bin/mvn test jacoco:report
```

### Option 2: Using Test Runner Scripts

**Windows:**
```cmd
run-tests.bat
```

**Linux/Mac:**
```bash
chmod +x run-tests.sh
./run-tests.sh
```

### Option 3: Using IDE
- Import the project in your IDE (IntelliJ IDEA, Eclipse, VS Code)
- Right-click on test classes and select "Run Tests"
- Use IDE's built-in test runner

## Test Coverage

The tests cover:

### Controller Layer (ScheduleController)
- ✅ GET `/api/schedule/timeblocks` - All time blocks
- ✅ GET `/api/schedule/courses` - All courses
- ✅ GET `/api/schedule/timeblocks/student/{id}` - Student time blocks
- ✅ GET `/api/schedule/courses/student/{id}` - Student courses
- ✅ GET `/api/schedule/student/{id}` - Complete student schedule
- ✅ GET `/api/schedule/student-id?email=` - Student ID by email
- ✅ Error handling and HTTP status codes
- ✅ JSON response validation

### Service Layer (ScheduleService)
- ✅ Business logic for all operations
- ✅ Data aggregation (complete schedule)
- ✅ Error handling and edge cases
- ✅ Null/empty data scenarios

### Repository Layer (ScheduleRepositoryImpl)
- ✅ Database queries
- ✅ Result set mapping
- ✅ Exception handling
- ✅ Parameter binding

### Integration Tests
- ✅ Full request-response cycle
- ✅ Database integration
- ✅ API contract validation
- ✅ Error scenarios

## Test Reports

After running tests, you can find reports in:

- `target/surefire-reports/` - Individual test reports
- `target/site/surefire-report.html` - HTML test report
- `target/site/jacoco/` - Code coverage report (if jacoco is configured)

## Test Data

The integration tests use an in-memory H2 database with test data:

- **Students**: 2 test students
- **Courses**: 2 test courses
- **Time Blocks**: 3 test time blocks
- **Instructors**: 2 test instructors
- **Locations**: 2 test locations

## Common Issues and Solutions

### 1. Tests Fail Due to Database Connection
- **Issue**: Integration tests fail to connect to database
- **Solution**: Ensure H2 dependency is included and test properties are correct

### 2. Mocking Issues
- **Issue**: Mock objects not working as expected
- **Solution**: Verify @MockBean and @Mock annotations are used correctly

### 3. Test Data Issues
- **Issue**: Integration tests fail due to missing test data
- **Solution**: Check that `test-data.sql` is in the correct location and syntax is valid

### 4. Port Conflicts
- **Issue**: Integration tests fail due to port already in use
- **Solution**: Use `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)`

## Adding New Tests

### For New Controller Endpoints:
1. Add test methods to `ScheduleControllerTest`
2. Mock the service layer dependencies
3. Test both success and error scenarios
4. Validate response structure and status codes

### For New Service Methods:
1. Add test methods to `ScheduleServiceTest`
2. Mock repository dependencies
3. Test business logic and edge cases
4. Verify repository method calls

### For New Repository Methods:
1. Add test methods to `ScheduleRepositoryImplTest`
2. Mock JdbcTemplate
3. Test SQL execution and result mapping
4. Handle database exceptions

### For Integration Tests:
1. Add test methods to `ScheduleIntegrationTest`
2. Update test data if needed
3. Test complete request-response flow
4. Validate API contracts

## Best Practices

1. **Test Naming**: Use descriptive names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Independent Tests**: Each test should be independent and not rely on others
4. **Mock External Dependencies**: Mock databases, APIs, and other external services
5. **Test Edge Cases**: Include tests for null values, empty collections, and error conditions
6. **Keep Tests Fast**: Use in-memory databases and minimal setup
7. **Maintain Test Data**: Keep test data minimal and relevant

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Backend Tests
  run: |
    cd backend
    ./apache-maven-3.9.5/bin/mvn clean test
```

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add integration tests for new endpoints
4. Update this documentation if needed
5. Maintain test coverage above 80%
