import {Role} from './models/role';
import { User } from './models/user';
import { ReimbursmentType } from './models/reimbursmentType';
import { ReimbursementStatus } from './models/reimbursmentStatus';
import { Reimbursement } from './models/reimbursment';




export const rols:Role[] = [
    {
        id:1,
        role: 'employee'
    },
    {
        id:2,
        role: 'manager'
    },
    {
        id:3,
        role: 'admin'
    }
];

export let users:User[] = [
    {
        id: 1, // primary key
        username: 'joeb',// not null, unique
        password: 'pass', // not null
        firstName: 'joe', // not null
        lastName: 'beldner', // not null
        email: 'joebeldner@gmail.com' ,// not null
        role: rols[0] // not null
      },
      {
        id: 2, // primary key
        username: 'ernestob',// not null, unique
        password: 'pass', // not null
        firstName: 'ernesto', // not null
        lastName: 'ballon', // not null
        email: 'ernestoballono@gmail.com' ,// not null
        role: rols[1] // not null
      },
      {
        id: 3, // primary key
        username: 'admin',// not null, unique
        password: 'pass', // not null
        firstName: 'ernesto', // not null
        lastName: 'ballon', // not null
        email: 'ernestoballono@gmail.com' ,// not null
        role: rols[1] // not null
      }
] 
export let reimTypes:ReimbursmentType[] = [
    {
        id: 1, // primary key
        type: 'Lodging' // not null, unique
    },
    {
        id: 2, // primary key
        type: 'Travel' // not null, unique
    },
    {
        id: 3, // primary key
        type: 'Food' // not null, unique
    },
    {
        id: 4, // primary key
        type: 'Other' // not null, unique
    }
];
export let reimStatus:ReimbursementStatus[] = [
    {
        id: 1, // primary key
        status:  'Pending' // not null, unique
    },
    {
        id: 2, // primary key
        status:  'Approved' // not null, unique
    },
    {
        id: 3, // primary key
        status:  'Denied' // not null, unique
    }
];
export let reimburstments:Reimbursement[] = [
    {
        id: 1, // primary key
        author: users[0],  // foreign key -> User, not null
        amount: 100,  // not null
        dateSubmitted: 0, // not null
        dateResolved: 0, // not null
        description: 'relocation reimburstmen', // not null
        resolver: users[1], // foreign key -> User
        status: reimStatus[1], // foreign ey -> ReimbursementStatus, not null
        type: reimTypes[1] // foreign key -> ReimbursementType
      },
      {
        id: 2, // primary key
        author: users[0],  // foreign key -> User, not null
        amount: 600,  // not null
        dateSubmitted: 0, // not null
        dateResolved: 0, // not null
        description: 'bussiness lunch', // not null
        resolver: users[1], // foreign key -> User
        status: reimStatus[0], // foreign ey -> ReimbursementStatus, not null
        type: reimTypes[2] // foreign key -> ReimbursementType
      }
]


