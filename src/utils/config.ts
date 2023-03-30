import { config } from 'dotenv'

config()

const PORT: number = parseInt(process.env.PORT || '3000')
const MONGODB_URI: string = process.env.MONGODB_URI || ''

export default {
  MONGODB_URI,
  PORT
}
