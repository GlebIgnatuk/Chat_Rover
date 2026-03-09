# Rover Chat

Rover Chat is a modern, feature-rich chat application designed to provide seamless communication and collaboration. This repository contains the source code for the Rover Chat application, including the client, server, and supporting functions.

## Features

- **Real-time Chat**: Instant messaging with support for multiple chat rooms.
- **User Profiles**: Customizable user profiles with avatars and status updates.
- **Internationalization**: Support for multiple languages.
- **Shop Integration**: In-app shop for purchasing virtual goods.
- **Game Chats**: Dedicated chat rooms for gaming communities.
- **Giveaways**: Automated giveaway scheduling and management.
- **Admin Tools**: Tools for managing users, chats, and content.

## Project Structure

The repository is organized into the following main directories:

- **client/**: Contains the frontend code for the Rover Chat application, built with React and TypeScript.
- **functions/**: Includes Firebase functions for backend logic and automation.
- **server/**: Backend server code, including APIs, database models, and services.

### Client

The `client` directory contains the following key files and folders:
- `src/`: Source code for the React application.
- `public/`: Static assets such as images, fonts, and configuration files.
- `vite.config.ts`: Configuration for Vite, the build tool.

### Functions

The `functions` directory includes:
- `src/`: Source code for Firebase functions.
- `env/`: Environment configuration files.

### Server

The `server` directory contains:
- `src/`: Source code for the backend server.
- `scripts/`: Utility scripts for seeding data and testing.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rover-chat.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rover-chat
   ```
3. Install dependencies for the client, functions, and server:
   ```bash
   cd client && npm install
   cd ../functions && npm install
   cd ../server && npm install
   ```

### Running the Application

#### Client

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

#### Server

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Start the backend server:
   ```bash
   npm run dev
   ```

#### Firebase Functions

1. Navigate to the `functions` directory:
   ```bash
   cd functions
   ```
2. Emulate Firebase functions locally:
   ```bash
   firebase emulators:start
   ```