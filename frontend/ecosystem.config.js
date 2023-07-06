require("dotenv").config();

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF = "origin/master",
} = process.env;

module.exports = {
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: "https://github.com/ShikaIto/web-plus-pm2-deploy",
      path: DEPLOY_PATH,
      "pre-deploy-local": "npm run build",
      "post-deploy": `scp -Cr ./build/* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
    },
  },
};
