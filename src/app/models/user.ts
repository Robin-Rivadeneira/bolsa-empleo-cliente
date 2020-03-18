export class User {
  id: number;
  name: string;
  user_name: string;
  email: string;
  password: string;
  api_token: string;
  role: string;
  state: string;

  constructor() {
    this.role = '0';
    this.email = '';

  }

}
