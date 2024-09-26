const backendDomain = "/api/"
const adminBackendDomain = "/api/admin"
const waiterBackendDomain = "/api/waiter"
const managerBackendDomain = "/api/manager"
const summaryAPI = {
    common: {
        login: {
            url: `${backendDomain}/login`,
            method: 'POST',
        },
        logout: {
            url: `${backendDomain}/logout`,
            method: 'GET'
        },
        bookTable: {
            url: `${backendDomain}/reserve`
        }
    },
    admin: {
        items: {
            commonUlr: `${adminBackendDomain}/items`,
            getallItems: {
                url: `${adminBackendDomain}/items`,
                method: 'GET'
            }
        },
        category: {
            commonUlr: `${adminBackendDomain}/category`,
            getallCategory: {
                url: `${adminBackendDomain}/category`,
                method: 'GET'
            },
            createCategory: {
                url: `${adminBackendDomain}/category`,
                method: 'POST',
            },
        },
        table: {
            commonUlr: `${adminBackendDomain}/table`,
            getallTable: {
                url: `${adminBackendDomain}/table`,
                method: 'GET'
            },
            createTable: {
                url: `${adminBackendDomain}/table`,
                method: 'POST'
            }
        }, staff: {
            commonUlr: `${adminBackendDomain}/staff`,
            getallStaff: {
                url: `${adminBackendDomain}/staff`,
                method: 'GET'
            },
        },
        reports: {
            getReports: `${adminBackendDomain}/get-reports`
        },
    },

    manager: {
        tables: {
            commaUrl: `${managerBackendDomain}/table`,
            getAllTable: {
                url: `${managerBackendDomain}/table`,
                method: 'GET'
            }
        },
        items: {
            commonUrl: `${managerBackendDomain}/items`,
            getAllItems: {
                url: `${managerBackendDomain}/items`,
                method: 'GET'
            },
        },
        getAllOrder: {
            commonUrl: `${managerBackendDomain}/get-all-order`,
            deleteOrder: `${managerBackendDomain}/get-all-order`,
            createBill: `${managerBackendDomain}/createBill`
        },
        placeOrder: {
            commonUrl: `${managerBackendDomain}/place-order`,
            placeOrder: {
                url: `${managerBackendDomain}/place-order`,
                method: 'POST'
            },
        },
        reports: {
            getReports: `${managerBackendDomain}/get-reports`
        },
    },
    waiter: {
        tables: {
            commaUrl: `${waiterBackendDomain}/table`,
            getAllTable: {
                url: `${waiterBackendDomain}/table`,
                method: 'GET'
            }
        },
        items: {
            commonUrl: `${waiterBackendDomain}/items`,
            getAllItems: {
                url: `${waiterBackendDomain}/items`,
                method: 'GET'
            },
        },
        getAllOrder: {
            commonUrl: `${waiterBackendDomain}/get-all-order`,
            deleteOrder: `${waiterBackendDomain}/get-all-order`
        },
        placeOrder: {
            commonUrl: `${waiterBackendDomain}/place-order`,
            placeOrder: {
                url: `${waiterBackendDomain}/place-order`,
                method: 'POST'
            },
        },

    }
}

export default summaryAPI