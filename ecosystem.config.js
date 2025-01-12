module.exports = {
  apps: [
    {
      name: 'disease-tracker-backend',
      script: 'uvicorn',
      args: 'backend.server:app --host 0.0.0.0 --port 8000',
      interpreter: 'python3',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    }
  ],
};