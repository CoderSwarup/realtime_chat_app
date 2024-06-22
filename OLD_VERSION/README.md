# Chat App

## Overview

This repository contains the source code for a real-time chat application built using React, Node.js, Express, and Socket.IO. The application supports both one-on-one chat and group chat functionalities, providing users with a seamless real-time communication experience.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

### Real-time Communication:

- Instant messaging using Socket.IO for real-time updates.
- One-on-one and group chat capabilities.

### User Authentication:

- Secure user authentication to ensure the privacy of conversations.

### Responsive Design:

- Mobile-friendly design for a seamless user experience on various devices.

### Emoji Support:

- Incorporates emoji support for expressive communication.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/): Download and Install Node.js.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/CoderSwarup/realtime_chat_app.git
   cd chat-app
   ```

2. **Install Dependencies:**

   ```bash
   # Install server dependencies
   cd backend
   npm install

   # Install client dependencies
   cd frontend
   npm install
   ```

## Usage

### Usage for Development

set in **.env** file NODE_ENV=developement

1. **Start the server:**

   ```bash
   # Inside the server directory
   npm run dev
   ```

2. **Start the client:**

   ```bash
   # Inside the client directory
   num run dev
   ```

### Usage for Profuction

set in **.env** file NODE_ENV=production

```bash
    npm run build
    num start
```

**Open your browser and go to `http://localhost:8080` to use the chat app.**

## Sample Images

![Main Interface](https://res.cloudinary.com/dc4li3m0r/image/upload/v1704975405/samples/WebImg/bonw3jtsiixxlaebb2kl.png)

## Folder Structure

- `client`: Frontend codebase built with React.
- `server`: Backend codebase built with Node.js and Express.

## Technologies Used

- **Frontend:** React ChakraUi
- **Backend:** Node.js, Express
- **Real-time Communication:** Socket.IO

## Contributing

We welcome contributions from the community! To contribute to the project:

1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Make changes and open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
