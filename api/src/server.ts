import { startServer } from './index';

// Inicia o servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  startServer().catch(error => {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  });
}
