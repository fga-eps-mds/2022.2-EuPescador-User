import databaseConnect from './config/database';
import app from './app';

databaseConnect().then(() => {
  console.log('Banco conectado!')
});

const serverPort = process.env.PORT || 4000;

app.listen(serverPort, () => {
  console.log('server running on port %d', serverPort);
});
