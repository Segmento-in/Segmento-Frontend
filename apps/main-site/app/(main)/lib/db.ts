import mysql from "mysql2/promise"

interface DbConfig {
    host: string
    database: string
    user: string
    password: string
}

// Get database configuration from environment variables
function getDbConfig(): DbConfig {
    const config = {
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "segmento_contact",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
    }

    return config
}

// Create a new database connection
export async function createConnection() {
    try {
        const config = getDbConfig()

        const connection = await mysql.createConnection({
            host: config.host,
            database: config.database,
            user: config.user,
            password: config.password,
            charset: "utf8mb4",
        })

        return connection
    } catch (error) {
        console.error("Database connection error:", error)
        throw new Error("Failed to connect to database")
    }
}

// For connection pooling (optional, more efficient for production)
let pool: mysql.Pool | null = null

export function getPool() {
    if (!pool) {
        const config = getDbConfig()

        pool = mysql.createPool({
            host: config.host,
            database: config.database,
            user: config.user,
            password: config.password,
            charset: "utf8mb4",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        })
    }

    return pool
}
