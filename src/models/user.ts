import { Role } from "./role";


export interface User{
    id: number; // primary key
    userName: string;// not null, unique
    password?: string ;// not null
    firstName: string; // not null
    lastName: string; // not null
    email: string ;// not null
    role: Role ;// not null
  }