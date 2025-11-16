export type User = {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
};

export const users: User[] = [];
