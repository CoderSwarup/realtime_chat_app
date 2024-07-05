module.exports = {
  apps: [
    {
      name: "talk_live_backend",
      script: "./index.js",
      instances: 1, //'max'
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development", // Default environment
      },
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
