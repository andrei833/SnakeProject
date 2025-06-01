# Snake Game Web Application

A web-based Snake (Worm) game where users can log in, play on a grid with obstacles, and have all their moves saved to a backend database. The server tracks the game duration and stores each game session and its moves for authenticated users.

## Features
- User authentication with username/password
- Cookie/session-based login using Spring Security
- Play Snake game with obstacles on a grid
- Client-side collects all moves during a game
- On game end, all moves and elapsed time are sent and saved in MySQL database
- Backend built with Spring Boot, Spring Data JPA, and MySQL
- Frontend built with React (TypeScript)
- REST API endpoints to support game data persistence and user session management

## Technologies Used
- **Frontend**: React, TypeScript
- **Backend**: Spring Boot 3.5, Spring Security, Spring Data JPA
- **Database**: MySQL
- **Build Tool**: Gradle
- **Others**: Lombok, Spring Session
