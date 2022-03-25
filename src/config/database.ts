import { Pool } from 'pg'
const databaseConnect = async () => {
  try {
    const pool = new Pool({
        user: 'postgres',
        host: 'db',
        database: 'user',
        password: 'password',
        port: 5432
    });

    await pool.connect()
    return pool;
  } catch (error) {
    console.log('Não foi possível inicicializar corretamente a base de dados!');
    console.log(error);
  }
};

export default databaseConnect;
