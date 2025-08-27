<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Schedule Planner Backend - Copilot Instructions

This is a Spring Boot backend application for the Schedule Planner project. The application provides REST APIs for managing time blocks and scheduling activities.

## Project Structure
- **Entity Models**: Located in `src/main/java/com/scheduleplanner/backend/model/`
- **Repositories**: Located in `src/main/java/com/scheduleplanner/backend/repository/`
- **Services**: Located in `src/main/java/com/scheduleplanner/backend/service/`
- **Controllers**: Located in `src/main/java/com/scheduleplanner/backend/controller/`
- **Configuration**: Located in `src/main/java/com/scheduleplanner/backend/config/`

## Key Features
- RESTful API endpoints for TimeBlock CRUD operations
- H2 in-memory database for development
- CORS configuration for React frontend integration
- JPA/Hibernate for data persistence
- Bean validation for input validation
- Overlap detection for time block conflicts

## API Endpoints
- `GET /api/timeblocks` - Get all time blocks
- `POST /api/timeblocks` - Create a new time block
- `GET /api/timeblocks/{id}` - Get time block by ID
- `PUT /api/timeblocks/{id}` - Update time block
- `DELETE /api/timeblocks/{id}` - Delete time block
- `GET /api/timeblocks/day/{day}` - Get time blocks by day
- `GET /api/timeblocks/type/{type}` - Get time blocks by type
- `GET /api/timeblocks/check-overlap` - Check for time conflicts
- `GET /api/timeblocks/type-colors` - Get type color mappings

## Development Guidelines
- Follow Spring Boot best practices
- Use proper HTTP status codes in responses
- Implement proper error handling
- Add input validation using Bean Validation annotations
- Use DTOs for complex request/response objects when needed
- Follow RESTful naming conventions
- Add comprehensive unit and integration tests
