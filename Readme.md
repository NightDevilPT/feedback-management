# Feedback Management System Monorepo

A comprehensive feedback management platform built as a monorepo using PNPM workspaces.

## Repository Structure

This project is organized as a monorepo using PNPM workspaces with the following structure:

```
feedback-management/
├── apps/
│   ├── web/               # Frontend React application
│   └── api/               # Backend API service
├── package.json           # Root package.json for managing the monorepo
├── pnpm-workspace.yaml    # PNPM workspace configuration
└── README.md              # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [PNPM](https://pnpm.io/) (v10.7.1 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/feedback-management.git
cd feedback-management
```

2. Install dependencies for all packages:

```bash
pnpm install
```

This command will install dependencies for the root project and all packages in the `apps` directory.

## Development

### Running the entire project

To start all applications in development mode simultaneously:

```bash
pnpm dev
```

This command will start both the frontend and backend servers in development mode with hot-reloading enabled.

### Running individual applications

If you want to run only a specific application:

```bash
# To run only the web frontend
pnpm --filter web dev

# To run only the API backend
pnpm --filter api dev
```