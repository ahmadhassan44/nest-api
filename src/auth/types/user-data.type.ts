export interface UserData {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string | null;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
} 