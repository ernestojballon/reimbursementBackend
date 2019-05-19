import { User } from "./user";
import { ReimbursementStatus } from "./reimbursementStatus";
import { ReimbursementType } from "./reimbursementType";



export interface Reimbursement{
    id: number // primary key
    author: User // foreign key -> User, not null
    amount: number  // not null
    dateSubmitted: Date // not null
    dateResolved: Date // not null
    description: string // not null
    resolver: User // foreign key -> User
    status: ReimbursementStatus // foreign ey -> ReimbursementStatus, not null
    type: ReimbursementType  // foreign key -> ReimbursementType
  }