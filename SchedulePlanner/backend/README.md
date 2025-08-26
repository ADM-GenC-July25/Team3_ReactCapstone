# Schedule Planner Backend

A Spring Boot REST API backend for the Schedule Planner application, providing endpoints to manage time blocks and scheduling activities.

## Features

- **RESTful API**: Complete CRUD operations for time blocks
- **Database Integration**: MySQL database with JPA/Hibernate
- **CORS Support**: Configured for React frontend integration
- **Validation**: Input validation using Bean Validation
- **Overlap Detection**: Automatic detection of time conflicts
- **Sample Data**: Pre-loaded with sample time blocks for testing

## Technology Stack

- **Java 17**
- **Spring Boot 3.1.5**
- **Spring Data JPA**
- **MySQL Database**
- **Maven** for dependency management
- **Bean Validation** for input validation

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

### Installation

1. Clone the repository and navigate to the backend directory

2. Set up MySQL database:
   - Install MySQL 8.0 or higher
   - Run the database setup script: `mysql -u root -p < database-setup.sql`
   - Update the database credentials in `src/main/resources/application.properties`

3. Install dependencies:
   ```bash
   mvn clean install
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

### Database Access

You can access your MySQL database using any MySQL client or through the command line:

```bash
mysql -u root -p
USE schedule_planner;
SHOW TABLES;
```

**Connection Details:**
- Host: `localhost`
- Port: `3306`
- Database: `schedule_planner`
- Username: `root` (or `schedule_user` if you created a dedicated user)
- Password: As configured in `application.properties`

## API Endpoints

### Time Blocks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/timeblocks` | Get all time blocks |
| POST | `/api/timeblocks` | Create a new time block |
| GET | `/api/timeblocks/{id}` | Get time block by ID |
| PUT | `/api/timeblocks/{id}` | Update time block |
| DELETE | `/api/timeblocks/{id}` | Delete time block |
| GET | `/api/timeblocks/day/{day}` | Get time blocks by day |
| GET | `/api/timeblocks/type/{type}` | Get time blocks by type |
| GET | `/api/timeblocks/check-overlap` | Check for time conflicts |
| GET | `/api/timeblocks/type-colors` | Get type color mappings |

### Sample API Usage

#### Create a Time Block
```http
POST /api/timeblocks
Content-Type: application/json

{
  "title": "Study Session",
  "day": "Monday",
  "startTime": "14:00",
  "endTime": "16:00",
  "type": "personal",
  "description": "Mathematics review session"
}
```

#### Get All Time Blocks
```http
GET /api/timeblocks
```

#### Check for Overlaps
```http
GET /api/timeblocks/check-overlap?day=Monday&startTime=15:00&endTime=17:00
```

## Data Model

### TimeBlock Entity
```java
{
  "id": 1,
  "title": "Chess Club",
  "day": "Monday",
  "startTime": "15:30",
  "endTime": "17:00",
  "type": "club",
  "description": "Weekly chess club meeting",
  "color": "#9C27B0"
}
```

### Activity Types
- **club**: Club/Organization activities
- **job**: Part-time job shifts
- **break**: Break/Rest periods
- **personal**: Personal activities
- **other**: Other activities

## Project Structure

```
src/
├── main/
│   ├── java/com/scheduleplanner/backend/
│   │   ├── SchedulePlannerBackendApplication.java
│   │   ├── config/
│   │   │   ├── CorsConfig.java
│   │   │   └── DataInitializer.java
│   │   ├── controller/
│   │   │   └── TimeBlockController.java
│   │   ├── model/
│   │   │   └── TimeBlock.java
│   │   ├── repository/
│   │   │   └── TimeBlockRepository.java
│   │   └── service/
│   │       └── TimeBlockService.java
│   └── resources/
│       └── application.properties
└── test/
    └── java/com/scheduleplanner/backend/
        └── SchedulePlannerBackendApplicationTests.java
```

## Configuration

### Application Properties
- Server port: `8080`
- Database: MySQL with automatic schema creation
- CORS: Configured for `http://localhost:3000`
- JPA: Hibernate with DDL auto-update

## Development

### Building the Project
```bash
mvn clean compile
```

### Running Tests
```bash
mvn test
```

### Creating a JAR
```bash
mvn clean package
```

### Running the JAR
```bash
java -jar target/schedule-planner-backend-0.0.1-SNAPSHOT.jar
```

## Frontend Integration

This backend is designed to work with the React frontend located in the parent directory. The CORS configuration allows requests from `http://localhost:3000`.

## Contributing

1. Follow Spring Boot best practices
2. Add unit tests for new features
3. Use proper HTTP status codes
4. Implement input validation
5. Follow RESTful API conventions

## License

This project is part of the Schedule Planner application.
