const backendDomain = "/api/"
const adminBackendDomain = "/api/admin"
const waiterBackendDomain = "/api/waiter"
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
        }
    },

    manager: {},
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
        }
    }
}

export default summaryAPI