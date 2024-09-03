import configProd from './prod'
import configDev from './dev'
import { DBConfig } from '../models/db.model'

let config: DBConfig

if (process.env.NODE_ENV === 'production') {
  config = configProd
} else {
  config = configDev
}

export default config
