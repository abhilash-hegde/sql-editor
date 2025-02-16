import { byDate, byNumber } from "./sort";

export default {
    getAllCustomers: (customers) => customers,
    getRecentOrders: (orders) => {
        return orders.sort(byDate).slice(0, 10);
    },
    getAllOrderDetails: (orders, customers, employees, shippers, products, categories, suppliers) => {
        return orders.map(order => {
            const customer = customers.find(c => c.customerID === order.customerID) || {};
            const employee = employees.find(e => e.employeeID === order.employeeID) || {};
            const shipper = shippers.find(s => s.shipperID === order.shipVia) || {};
            const shipAddress = order.shipAddress || {};

            const orderDetails = order.details.map(detail => {
                const product = products.find(p => p.productID === detail.productID) || {};
                const category = categories.find(cat => cat.categoryID === product.categoryID) || {};
                const supplier = suppliers.find(sup => sup.supplierID === product.supplierID) || {};

                return {
                    productID: detail.productID,
                    productName: product.name,
                    unitPrice: detail.unitPrice,
                    quantity: detail.quantity,
                    discount: detail.discount,
                    categoryName: category.name,
                    supplierName: supplier.companyName
                };
            });

            return {
                orderID: order.orderID,
                customerID: order.customerID,
                customerName: customer.companyName,
                employeeID: order.employeeID,
                employeeFirstName: employee.firstName,
                employeeLastName: employee.lastName,
                orderDate: order.orderDate,
                requiredDate: order.requiredDate,
                shippedDate: order.shippedDate,
                shipVia: order.shipVia,
                shipperName: shipper.companyName,
                freight: order.freight,
                shipName: order.shipName,
                shipStreet: shipAddress.street,
                shipCity: shipAddress.city,
                shipRegion: shipAddress.region,
                shipPostalCode: shipAddress.postalCode,
                shipCountry: shipAddress.country,
                orderDetails
            };
        });
    },
    getTotalSalesPerCustomer: (orders, customers) => {
        return orders.map(order => {
            const customer = customers.find(c => c.customerID === order.customerID) || {};
            const totalSpent = order.details.reduce((sum, d) => sum + d.unitPrice * d.quantity * (1 - d.discount), 0);

            return {
                customerID: order.customerID,
                customerName: customer.companyName || "Unknown",
                totalSpent
            };
        }).sort((a, b) => byNumber(a, b, "totalSpent", "desc"));
    },
    getBestSellingProducts: (orders, products) => {
        const productSales = {};

        orders.forEach(order => {
            order.details.forEach(detail => {
                productSales[detail.productID] = (productSales[detail.productID] || 0) + detail.quantity;
            });
        });

        return Object.entries(productSales)
            .map(([productID, totalQuantitySold]) => {
                const product = products.find(p => p.productID == productID) || {};
                return { productID, productName: product.name || "Unknown", totalQuantitySold };
            })
            .sort((a, b) => byNumber(a, b, "totalQuantitySold", "desc"));
    },
    getSalesPerCategory: (orders, products, categories) => {
        const categorySales = {};

        orders.forEach(order => {
            order.details.forEach(detail => {
                const product = products.find(p => p.productID === detail.productID) || {};
                const category = categories.find(c => c.categoryID === product.categoryID) || {};
                const categoryName = category.name || "Unknown";
                categorySales[categoryName] = (categorySales[categoryName] || 0) + detail.unitPrice * detail.quantity * (1 - detail.discount);
            });
        });

        return Object.entries(categorySales)
            .map(([categoryName, totalSales]) => ({ categoryName, totalSales }))
            .sort((a, b) => byNumber(a, b, "totalSales", "desc"));
    },
    getEmployeesWithMostOrders: (orders, employees) => {
        const employeeOrders = {};

        orders.forEach(order => {
            employeeOrders[order.employeeID] = (employeeOrders[order.employeeID] || 0) + 1;
        });

        return Object.entries(employeeOrders)
            .map(([employeeID, totalOrdersHandled]) => {
                const employee = employees.find(e => e.employeeID == employeeID) || {};
                return { employeeID, employeeName: `${employee.firstName} ${employee.lastName}`, totalOrdersHandled };
            })
            .sort((a, b) => byNumber(a, b, "totalOrdersHandled", "desc"));
    },
    getLateShippedOrders: (orders, customers) => {
        return orders
            .filter(order => new Date(order.shippedDate) > new Date(order.requiredDate))
            .map(order => {
                const customer = customers.find(c => c.customerID === order.customerID) || {};
                const millisInADay = 1000 * 60 * 60 * 24;
                return {
                    orderID: order.orderID,
                    customerName: customer.companyName,
                    requiredDate: order.requiredDate,
                    shippedDate: order.shippedDate,
                    daysLate: (new Date(order.shippedDate) - new Date(order.requiredDate)) / millisInADay
                };
            })
            .sort((a, b) => byNumber(a, b, "daysLate", "desc"));
    },
    getRevenuePerSupplier: (orders, products, suppliers) => {
        const supplierRevenue = {};

        orders.forEach(order => {
            order.details.forEach(detail => {
                const product = products.find(p => p.productID === detail.productID) || {};
                const supplier = suppliers.find(s => s.supplierID === product.supplierID) || {};
                const supplierName = supplier.companyName || "Unknown";
                supplierRevenue[supplierName] = (supplierRevenue[supplierName] || 0) + detail.unitPrice * detail.quantity * (1 - detail.discount);
            });
        });

        return Object.entries(supplierRevenue)
            .map(([supplierName, totalRevenue]) => ({ supplierName, totalRevenue }))
            .sort((a, b) => byNumber(a, b, "totalRevenue", "desc"));
    },
    getCustomerOrdersWithProducts: (orders, customers, products) => {
        return orders.map(order => {
            const customer = customers.find(c => c.customerID === order.customerID) || {};
            return {
                orderID: order.orderID,
                customerName: customer.companyName || "Unknown",
                products: order.details.map(detail => {
                    const product = products.find(p => p.productID === detail.productID) || {};
                    return {
                        productName: product.name,
                        quantity: detail.quantity,
                        unitPrice: detail.unitPrice,
                        discount: detail.discount,
                        totalPrice: detail.unitPrice * detail.quantity * (1 - detail.discount)
                    };
                })
            };
        });
    },
    getMonthlySalesTrend: (orders) => {
        const monthlySales = {};

        orders.forEach(order => {
            const month = order.orderDate.substring(0, 7)
            monthlySales[month] = (monthlySales[month] || 0) + order.details.reduce((sum, d) => sum + d.unitPrice * d.quantity * (1 - d.discount), 0);
        });

        return Object.entries(monthlySales)
            .map(([orderMonth, totalSales]) => ({ orderMonth, totalSales }))
            .sort((a, b) => byDate(a.orderMonth, b.orderMonth));
    },
    getOrdersByRegion: (orders) => {
        const regionOrders = {};

        orders.forEach(order => {
            const region = order.shipAddress?.region || "Unknown";
            regionOrders[region] = (regionOrders[region] || 0) + 1;
        });

        return Object.entries(regionOrders)
            .map(([region, totalOrders]) => ({ region, totalOrders }))
            .sort((a, b) => byNumber(a, b, "totalOrders", "desc"));
    },
    getHighDiscountOrders: (orders, customers, products) => {
        return orders.flatMap(order =>
            order.details
                .filter(detail => detail.discount > 0.2)
                .map(detail => {
                    const customer = customers.find(c => c.customerID === order.customerID) || {};
                    const product = products.find(p => p.productID === detail.productID) || {};
                    return {
                        orderID: order.orderID,
                        customerName: customer.companyName,
                        productName: product.name,
                        unitPrice: detail.unitPrice,
                        quantity: detail.quantity,
                        discount: detail.discount,
                        discountAmount: detail.unitPrice * detail.quantity * detail.discount
                    };
                })
        ).sort((a, b) => byNumber(a, b, "discountAmount", "desc"));
    }
}