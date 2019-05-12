import { User } from "./user";
import { ReimbursementStatus } from "./reimbursmentStatus";
import { ReimbursmentType } from "./reimbursmentType";



export class Reimbursement{
    id: number // primary key
    author: User // foreign key -> User, not null
    amount: number  // not null
    dateSubmitted: Number // not null
    dateResolved: number // not null
    description: string // not null
    resolver: User // foreign key -> User
    status: ReimbursementStatus // foreign ey -> ReimbursementStatus, not null
    type: ReimbursmentType  // foreign key -> ReimbursementType
  }