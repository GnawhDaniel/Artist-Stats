export interface User {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    user_role: string;
    account_creation_date: string; // You might want to use `Date` type if you parse it into a Date object
  }
  