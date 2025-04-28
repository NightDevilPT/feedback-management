# Feedback Management System

A comprehensive web application for managing and analyzing user feedback with advanced visualization and management capabilities.

## Overview

The Feedback Management System provides a robust platform for collecting, analyzing, and managing user feedback. It features both public and private interfaces, with enhanced data visualization tools and detailed management capabilities for authenticated users.

## Features

### Public Dashboard (Unauthenticated Access)
- View aggregated feedback statistics without login
- Visualize feedback trends and categories
- Access overall system metrics and public insights
- Anonymous feedback submission

### Authenticated User Features

#### User Management
- Complete user directory with search and filtering
- Detailed user profiles with activity history
- View feedback associated with specific users
- User role management and permissions

#### Feedback Management
- Comprehensive feedback listing with advanced sorting
- Multi-criteria filtering (by status, category, rating, etc.)
- Pagination for efficient navigation through large datasets
- Edit, update, and manage feedback status
- Submit new feedback entries

#### Advanced Data Presentation

##### Dual View System
- Toggle between grid and table layouts
- Responsive design optimized for all device sizes
- Save view preferences per user

##### Enhanced Table Functionality
- Customizable column visibility
- Export data to CSV, Excel, and PDF formats
- Sortable columns (ascending/descending)
- Advanced filtering options
- Bulk actions on selected items

## Technical Implementation

### Core Components

#### Dashboard Component
- Displays key metrics and visualizations
- Renders different views based on authentication status
- Interactive charts and statistics

#### User Management Module
- Protected routes requiring authentication
- Detailed user profiles with associated feedback
- Paginated and filterable user listings

#### Feedback Module
- Complete feedback listing with multi-column sorting
- Pagination controls with customizable items per page
- Advanced filtering with real-time updates

#### Data Presentation Components
- **DataView**: Switches between grid and table layouts
- **AdvancedTable**: Feature-rich table component with:
  - Column customization
  - Data export functionality
  - Multi-level sorting and filtering
  - Responsive design


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
