export default [
    {
        name: "Get all order details",
        queryKey: "getAllOrderDetails",
        query: `SELECT 
    o.orderID,
    o.customerID,
    c.companyName AS customerName,
    o.employeeID,
    e.firstName AS employeeFirstName,
    e.lastName AS employeeLastName,
    o.orderDate,
    o.requiredDate,
    o.shippedDate,
    o.shipVia,
    s.companyName AS shipperName,
    o.freight,
    o.shipName,
    o.shipAddress->>'$.street' AS shipStreet,
    o.shipAddress->>'$.city' AS shipCity,
    o.shipAddress->>'$.region' AS shipRegion,
    o.shipAddress->>'$.postalCode' AS shipPostalCode,
    o.shipAddress->>'$.country' AS shipCountry,
    p.productID,
    p.name AS productName,
    d.unitPrice,
    d.quantity,
    d.discount,
    cat.name AS categoryName,
    sup.companyName AS supplierName
FROM orders o
LEFT JOIN customers c ON o.customerID = c.customerID
LEFT JOIN employees e ON o.employeeID = e.employeeID
LEFT JOIN shippers s ON o.shipVia = s.shipperID
LEFT JOIN JSON_TABLE(o.details, '$[*]' COLUMNS (
    productID INT PATH '$.productID',
    unitPrice DECIMAL PATH '$.unitPrice',
    quantity INT PATH '$.quantity',
    discount DECIMAL PATH '$.discount'
)) AS d ON TRUE
LEFT JOIN products p ON d.productID = p.productID
LEFT JOIN categories cat ON p.categoryID = cat.categoryID
LEFT JOIN suppliers sup ON p.supplierID = sup.supplierID;
`,
        tables: ["orders", "customers", "employees", "shippers", "products", "categories", "suppliers"],
        purpose: "View all order details with customer, employee, product, and shipping information",
    },
    {
        name: "Get recent orders",
        queryKey: "getRecentOrders",
        query: "SELECT * FROM orders ORDER BY order_date DESC LIMIT 50",
        purpose: "View the most recent 50 orders",
        tables: ["orders"],
    },
    {
        name: "Total Sales Per Customer",
        queryKey: "getTotalSalesPerCustomer",
        purpose: "Identify high-value customers",
        query: `SELECT 
    o.customerID, 
    c.companyName, 
    SUM(d.unitPrice * d.quantity * (1 - d.discount)) AS totalSpent
FROM orders o
JOIN customers c ON o.customerID = c.customerID
JOIN JSON_TABLE(o.details, '$[*]' COLUMNS (
    productID INT PATH '$.productID',
    unitPrice DECIMAL PATH '$.unitPrice',
    quantity INT PATH '$.quantity',
    discount DECIMAL PATH '$.discount'
)) AS d ON TRUE
GROUP BY o.customerID, c.companyName
ORDER BY totalSpent DESC;`,
        tables: ["orders", "customers"],
    },
    {
        name: "Get Best-Selling Products",
        queryKey: "getBestSellingProducts",
        purpose: "Identify popular products",
        query: `SELECT 
    p.productID, 
    p.name AS productName, 
    SUM(d.quantity) AS totalQuantitySold
FROM orders o
JOIN JSON_TABLE(o.details, '$[*]' COLUMNS (
    productID INT PATH '$.productID',
    quantity INT PATH '$.quantity'
)) AS d ON TRUE
JOIN products p ON d.productID = p.productID
GROUP BY p.productID, p.name
ORDER BY totalQuantitySold DESC
LIMIT 10;`,
        tables: ["orders", "products"],
    },
    {
        name: "Get Sales Per Category",
        queryKey: "getSalesPerCategory",
        purpose: "See which product categories sell the most",
        query: `SELECT 
    cat.categoryID, 
    cat.name AS categoryName, 
    SUM(d.unitPrice * d.quantity * (1 - d.discount)) AS totalSales
FROM orders o
JOIN JSON_TABLE(o.details, '$[*]' COLUMNS (
    productID INT PATH '$.productID',
    unitPrice DECIMAL PATH '$.unitPrice',
    quantity INT PATH '$.quantity',
    discount DECIMAL PATH '$.discount'
)) AS d ON TRUE
JOIN products p ON d.productID = p.productID
JOIN categories cat ON p.categoryID = cat.categoryID
GROUP BY cat.categoryID, cat.name
ORDER BY totalSales DESC;`,
        tables: ["orders", "products", "categories"],
    },
    {
        name: "Get Employees with the Most Orders Handled",
        queryKey: "getEmployeesWithMostOrders",
        purpose: "Identify top-performing employees",
        query: `SELECT 
    e.employeeID, 
    e.firstName, 
    e.lastName, 
    COUNT(o.orderID) AS totalOrdersHandled
FROM orders o
JOIN employees e ON o.employeeID = e.employeeID
GROUP BY e.employeeID, e.firstName, e.lastName
ORDER BY totalOrdersHandled DESC;`,
        tables: ["orders", "employees"],
    },
    {
        name: "Get Orders Shipped Late",
        queryKey: "getLateShippedOrders",
        purpose: "Identify orders that were shipped late",
        query: `SELECT 
    o.orderID, 
    c.companyName AS customerName, 
    o.requiredDate, 
    o.shippedDate, 
    DATEDIFF(o.shippedDate, o.requiredDate) AS daysLate
FROM orders o
JOIN customers c ON o.customerID = c.customerID
WHERE o.shippedDate > o.requiredDate
ORDER BY daysLate DESC;`,
        tables: ["orders", "customers"],
    },
    {
        name: "Get Revenue Per Supplier",
        queryKey: "getRevenuePerSupplier",
        purpose: "Find out which suppliers contribute the most revenue",
        query: `SELECT 
    sup.supplierID, 
    sup.companyName, 
    SUM(d.unitPrice * d.quantity * (1 - d.discount)) AS totalRevenue
FROM orders o
JOIN JSON_TABLE(o.details, '$[*]' COLUMNS (
    productID INT PATH '$.productID',
    unitPrice DECIMAL PATH '$.unitPrice',
    quantity INT PATH '$.quantity',
    discount DECIMAL PATH '$.discount'
)) AS d ON TRUE
JOIN products p ON d.productID = p.productID
JOIN suppliers sup ON p.supplierID = sup.supplierID
GROUP BY sup.supplierID, sup.companyName
ORDER BY totalRevenue DESC;`,
        tables: ["orders", "products", "suppliers"],
    },
    {
        name: "Get Customer Orders with Product Details",
        queryKey: "getCustomerOrdersWithProducts",
        purpose: "Show each customer's orders along with the products they purchased",
        query: `SELECT 
    o.orderID, 
    o.customerID, 
    c.companyName, 
    p.name AS productName, 
    d.quantity, 
    d.unitPrice, 
    d.discount, 
    (d.unitPrice * d.quantity * (1 - d.discount)) AS totalPrice
FROM orders o
JOIN customers c ON o.customerID = c.customerID
JOIN JSON_TABLE(o.details, '$[*]' COLUMNS (
    productID INT PATH '$.productID',
    unitPrice DECIMAL PATH '$.unitPrice',
    quantity INT PATH '$.quantity',
    discount DECIMAL PATH '$.discount'
)) AS d ON TRUE
JOIN products p ON d.productID = p.productID
ORDER BY o.orderID;`,
        tables: ["orders", "customers", "products"],
    },
    {
        name: "Get Monthly Sales Trend",
        queryKey: "getMonthlySalesTrend",
        purpose: "Track sales performance over time",
        query: `SELECT 
    DATE_FORMAT(o.orderDate, '%Y-%m') AS orderMonth, 
    SUM(d.unitPrice * d.quantity * (1 - d.discount)) AS totalSales
FROM orders o
JOIN JSON_TABLE(o.details, '$[*]' COLUMNS (
    unitPrice DECIMAL PATH '$.unitPrice',
    quantity INT PATH '$.quantity',
    discount DECIMAL PATH '$.discount'
)) AS d ON TRUE
GROUP BY orderMonth
ORDER BY orderMonth;`,
        tables: ["orders"],
    },
    {
        name: "Get Orders by Region",
        queryKey: "getOrdersByRegion",
        purpose: "Find out where most orders are being shipped",
        query: `SELECT 
    o.shipAddress->>'$.region' AS region, 
    COUNT(o.orderID) AS totalOrders
FROM orders o
GROUP BY region
ORDER BY totalOrders DESC;`,
        tables: ["orders"],
    },
    {
        name: "Get Orders with High Discounts",
        queryKey: "getHighDiscountOrders",
        purpose: "Identify orders with high discount rates",
        query: `SELECT 
    o.orderID, 
    c.companyName, 
    p.name AS productName, 
    d.unitPrice, 
    d.quantity, 
    d.discount, 
    (d.unitPrice * d.quantity * d.discount) AS discountAmount
FROM orders o
JOIN customers c ON o.customerID = c.customerID
JOIN JSON_TABLE(o.details, '$[*]' COLUMNS (
    productID INT PATH '$.productID',
    unitPrice DECIMAL PATH '$.unitPrice',
    quantity INT PATH '$.quantity',
    discount DECIMAL PATH '$.discount'
)) AS d ON TRUE
JOIN products p ON d.productID = p.productID
WHERE d.discount > 0.2
ORDER BY discountAmount DESC;`,
        tables: ["orders", "customers", "products"],
    },
    {
        name: "Get all customers",
        queryKey: "getAllCustomers",
        query: "SELECT * FROM customers",
        purpose: "View all customer records",
        tables: ["customers"]
    },
];