# SQL Query Editor

## Overview

SQL Query Editor is a web-based application that allows users to execute SQL queries against a mock database. It provides a user-friendly interface for writing and executing SQL queries, viewing results, and managing saved queries. The application features a multi-tab query editor, table list with column information, query history, and the ability to export results in various formats.

### Live Application
Access the SQL Query Editor at: [SQL Query Editor](https://sql-editor-eta.vercel.app/)

## Technology Stack

- **Framework**: Next.js (React)
- **Major Packages**:
  - `shadcn`: For UI components
  - `@radix-ui`: For enhanced UI elements
  - `@tanstack/react-table`: For table rendering and management
  - `tailwindcss`: For styling
  - `lucide-react`: For icons

## Predefined SQL Queries


## Performance Metrics

### Page Load Time
The SQL Query Editor application achieves an optimal load time based on Lighthouse performance metrics:
- **First Contentful Paint (FCP)**: 0.3s
- **Largest Contentful Paint (LCP)**: 0.4s
- **Speed Index**: 0.3s
- **Total Blocking Time (TBT)**: 0ms
- **Cumulative Layout Shift (CLS)**: 0

These metrics indicate a fast and smooth user experience with minimal layout shifts and blocking times.

### Measurement Method
The page load times were measured using [Lighthouse](https://developers.google.com/web/tools/lighthouse) on a deployed version of the application (`https://sql-editor-eta.vercel.app/`). 

## Optimizations Implemented

To achieve high performance and fast load times, we implemented the following optimizations:

1. **Code Splitting**: Utilizing Next.js's built-in automatic code splitting ensures that only necessary JavaScript files are loaded for each page.
2. **Table Pagination**: Implemented pagination in tables to optimize rendering performance and reduce memory usage.
3. **Using Web Workers for Exporting Data**: Offloaded data export tasks to web workers to prevent UI blocking and enhance responsiveness.
4. **Lazy Loading Components**: Implemented dynamic imports for non-critical components to reduce initial load time.
5. **Caching Strategies**: Leveraged Next.js's built-in static and server-side caching for improved response times.
6. **TailwindCSS Purging**: Removed unused CSS to decrease the final bundle size.
7. **Optimized Table Rendering**: Utilized `@tanstack/react-table` for performant and efficient table handling, minimizing unnecessary re-renders.

With these improvements, SQL Query Editor provides a seamless and efficient experience for users executing and managing SQL queries.

## Available SQL Queries

Here is a list of available SQL queries in the application:

1. **Get all order details** - Fetches comprehensive order details with customer, employee, product, and shipping information.
2. **Get recent orders** - Retrieves the 50 most recent orders.
3. **Total Sales Per Customer** - Identifies high-value customers based on total spending.
4. **Get Best-Selling Products** - Lists the top 10 best-selling products.
5. **Get Sales Per Category** - Displays sales performance by product category.
6. **Get Employees with the Most Orders Handled** - Identifies top-performing employees.
7. **Get Orders Shipped Late** - Shows orders that were shipped past their required date.
8. **Get Revenue Per Supplier** - Finds suppliers contributing the most revenue.
9. **Get Customer Orders with Product Details** - Displays each customer's orders along with purchased products.
10. **Get Monthly Sales Trend** - Tracks sales performance over time.
11. **Get Orders by Region** - Determines order distribution by region.
12. **Get Orders with High Discounts** - Lists orders that received significant discounts.
13. **Get all customers** - Fetches all customer records.

These queries provide essential insights into order management, customer behavior, and sales trends, helping users analyze and optimize their database operations efficiently.