import type { User } from '@/models/user'

export interface Withdrawals {
  id:         number;
  amount:     number;
  user_id:    number;
  status:     boolean;
  user: User;
}
