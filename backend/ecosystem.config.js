require("dotenv").config();

const {
  MONGOURL,
  PORT,
  JWTSECRET,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_USER,
} = process.env;

module.exports = {
  apps: [
    {
      name: "api-service",
      script: "./dist/app.js",
      env_production: {
        NODE_ENV: "production",
        MONGOURL,
        PORT,
        JWTSECRET,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
        JWTSECRET: "some-secret-key",
        MONGOURL: "mongodb://127.0.0.1:27017/mestodb",
      },
      env_testing: {
        NODE_ENV: "testing",
        MONGOURL,
        PORT,
        JWTSECRET,
      },
    },
  ],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: "https://github.com/ShikaIto/web-plus-pm2-deploy",
      path: DEPLOY_PATH,
      "pre-deploy": `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      "post-deploy": "npm i && npm run build",
    },
  },
};