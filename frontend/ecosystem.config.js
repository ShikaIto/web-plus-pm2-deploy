require("dotenv").config();

const {
  DEPLOY_USER,
  DEPLOY_HOST = "158.160.116.43",
  DEPLOY_PATH,
  DEPLOY_REF = "origin/master",
} = process.env;

module.exports = {
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: "git@github.com:ShikaIto/web-plus-pm2-deploy.git",
      path: DEPLOY_PATH,
      "post-deploy": `cd frontend && npm ci && npm run build`,
    },
  },
};
