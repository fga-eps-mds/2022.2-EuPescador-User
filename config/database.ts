import { Pool } from 'pg'
const databaseConnect = async () => {
  try {
    const pool = new Pool({
        user: '',
        host: '',
        database: '',
        password: '',
        port: 2
    });

    return pool;
  } catch (error) {
    console.log('Não foi possível inicicializar corretamente a base de dados!');
    console.log(error);
  }
};

export default databaseConnect;
