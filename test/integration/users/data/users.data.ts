import * as crypto from 'crypto';

import { UserCandidateInput } from 'src/modules/users/types';

export const userCandidateInputTemplate: UserCandidateInput = {
  name: 'John',
  nickname: 'john1994',
  email: 'john1994@gmail.com',
  password: crypto.createHash('sha256').update('some-password').digest('hex'),
  level: 1,
  xp: '0',
};
