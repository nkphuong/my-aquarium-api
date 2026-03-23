import { NestFactory } from '@nestjs/core';
import { AppQueueModule } from './app-queue.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppQueueModule);

  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
  for (const signal of signals) {
    process.on(signal, () => {
      app
        .close()
        .then(() => process.exit(0))
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
    });
  }
}
void bootstrap();
