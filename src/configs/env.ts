import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({});

const environmentSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().positive().required(),
    BASE_URL: Joi.string().required().description('Base URL of the API'),
    API_SECRET: Joi.string().required().description('API secret key'),
    MONGO_URI: Joi.string().required().description('Mongo DB url'),
    WEB3_STORAGE_API_TOKEN: Joi.string().required().description('Web3 storage api token'),
  })
  .unknown();

const { value: env, error } = environmentSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: env.NODE_ENV,
  base: {
    url: env.BASE_URL,
  },
  port: env.PORT,
  mongoose: {
    url: env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // autoIndex: false,
      // poolSize: 10,
      // serverSelectionTimeoutMS: 5000,
      // socketTimeoutMS: 45000,
      // family: 4, // IPv4
    },
  },
  api: {
    secret: env.API_SECRET,
  },
  web3Storage: {
    apiToken: env.WEB3_STORAGE_API_TOKEN,
  },
};

