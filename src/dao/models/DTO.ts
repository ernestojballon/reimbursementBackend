export interface dtoRole{
    role_id: number; // primary key
    role_name: string ;// not null, unique
  }
  export interface dtoUser{
    user_id: number; // primary key
    username: string;// not null, unique
    firstname: string; // not null
    password?: string;
    lastname: string; // not null
    email: string ;// not null
    role_id: number ;// not null
  }
  export interface dtoReimbursmentType{
    type_id: number;// primary key
    type_name: string ;// not null, unique
  }
  export interface dtoReimbursementStatus {
    status_id: number; // primary key
    status_name: string ;// not null, unique
  }
  export interface dtoReimbursement{
    reimbursement_id?: number; // primary key
    author: number; // foreign key -> User, not null
    amount: number;  // not null
    submitted_date?: Date; // not null
    resolve_date?: Date ;// not null
    description: string ;// not null
    resolver?: number; // foreign key -> User
    status_id?: number; // foreign ey -> ReimbursementStatus, not null
    reim_type_id: number ; // foreign key -> ReimbursementType
  }
  export interface dtoPhoto {
    photo_id: number; // primary key
    url: string ;
    reimbursement_id: number;
  }