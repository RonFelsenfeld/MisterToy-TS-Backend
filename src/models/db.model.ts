export interface DBConfig {
  dbURL: string
  dbName: string
}

export function createDBConfig(dbURL: string): DBConfig {
  return { dbURL, dbName: process.env.DB_NAME! }
}
