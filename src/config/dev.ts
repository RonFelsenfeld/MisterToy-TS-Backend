import dotenv from 'dotenv'
import { DBConfig } from '../models/db.model'

dotenv.config()

const configDev: DBConfig = {
  dbURL: process.env.MONGO_COMPASS_URL!,
  dbName: 'MisterToyDB',
}

export default configDev
