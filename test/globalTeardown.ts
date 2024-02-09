import { down } from 'docker-compose';
import { join } from 'path';

export default async () => {
  await down({
    commandOptions: ['--remove-orphans'],
    cwd: join(__dirname),
  });
};
