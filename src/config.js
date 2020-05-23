module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL
    || 'postgres://wxrkgmdzzbtpcv:7aa5ea796ff47aae7e6dad237b95ab84e8f08d00c0613b0e9ca4f530cdfe28c3@ec2-54-81-37-115.compute-1.amazonaws.com:5432/d47cvbs7k2jipf',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
