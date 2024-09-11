import dotenv from 'dotenv'
import { createDBConfig } from '../models/db.model'

dotenv.config()

const configDev = createDBConfig(process.env.MONGO_COMPASS_URL!)
export default configDev
