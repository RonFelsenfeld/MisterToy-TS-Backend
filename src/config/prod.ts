import dotenv from 'dotenv'
import { createDBConfig } from '../models/db.model'

dotenv.config()

const configProd = createDBConfig(process.env.MONGO_CLOUD_URL!)
export default configProd
