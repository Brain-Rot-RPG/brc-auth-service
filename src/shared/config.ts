import 'dotenv/config';


export const config = {
    port: Number(process.env.PORT) || 4007,
    nodeEnv: process.env.NODE_ENV || 'development',
    isProd: process.env.NODE_ENV === 'production',
};