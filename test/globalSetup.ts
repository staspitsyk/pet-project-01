import { upAll } from 'docker-compose';
import { join } from 'path';

export default async () => {
  await upAll({
    cwd: join(__dirname),
    log: true,
  });
};
