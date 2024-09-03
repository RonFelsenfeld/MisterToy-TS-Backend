import dotenv from 'dotenv'
import { DBConfig } from '../models/db.model'

dotenv.config()

const configProd: DBConfig = {
  dbURL: process.env.MONGO_CLOUD_URL!,
  dbName: 'MisterToyDB',
}

export default configProd
