module.exports = {
  apps: [
    {
      name: "unti-detech-browser-be",
      script: "dist/main.js",
      instances: 3,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
    },
  ],
};
