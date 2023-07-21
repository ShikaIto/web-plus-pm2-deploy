require("dotenv").config();

const {
  DEPLOY_USER,
  DEPLOY_HOST = "158.160.116.43",
  DEPLOY_PATH,
  DEPLOY_REF = "origin/master",
  DEPLOY_REPO,
} = process.env;

module.exports = {
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      "post-deploy": `cd frontend && npm ci && npm run build`,
    },
  },
};
