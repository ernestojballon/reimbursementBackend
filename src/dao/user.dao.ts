import * as  PoolClient  from "pg";
import { connectionPool } from "./indexDao";
import { User } from "../models/user";
import { dtoUser } from "./models/DTO";
import { findRolByIdService } from "../services/role.service";
import { Role } from "../models/role";
import ReimbusementError from "../util/ReimbursementError";
import * as bcrypt from "bcryptjs";
//:::::::::::::::::::::::::::::::::::::::::::::::::
// Parse (dtoUser model) to --------> (User model)
//:::::::::::::::::::::::::::::::::::::::::::::::::
async function sqlUsertojsUSer(res: dtoUser): Promise<User> {
  try {
    let _role = await findRolByIdService(res.role_id);

    let user: User = {
      id: res.user_id, // primary key
      userName: res.username, // not null, unique
      firstName: res.firstname, // not null
      lastName: res.lastname, // not null
      email: res.email, // not null
      role: _role // not null
    };

    return user;
  } catch (err) {

    throw new ReimbusementError(500, err.message || "I could not build the User for the response");
  }
}

//:::::::::::::::::::::::::::::::::::::::::::::::::
// Get all users
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function findAllUsers(): Promise<User[]> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    let query = "SELECT * FROM users";
    let result = await client.query(query);

    let users: User[] = await result.rows.map(sqlUsertojsUSer);
    return await Promise.all(users);
  } catch (err) {
    throw new ReimbusementError(500, err.message || "I could not select users from the database");
  } finally {
    client && client.release();
  }
}

//:::::::::::::::::::::::::::::::::::::::::::::::::
// Get User by id    ------------>     with roles
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function findUserById(userId: number): Promise<User> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    let query = `SELECT * FROM users WHERE user_id = $1`;
    let result = await client.query(query, [userId]);
    if(typeof(result.rows[0])=="undefined") {
      throw new ReimbusementError(400, "User not found");
    }
    let user: User = await sqlUsertojsUSer(result.rows[0]);
    return user;
    
  } catch (err) {
    throw new ReimbusementError(err.statusCode || 500, err.message ||"User not found, we had problems with the connection");
  } finally {
    client && client.release();
  }
}

//:::::::::::::::::::::::::::::::::::::::::::::::::
// Find User by User name and Password ----->Login
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function findUserByUsernameAndPassword(
  username: string,
  password: string
): Promise<User> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    let query = `SELECT * FROM users WHERE username = $1;`;
    let result = await client.query(query, [username]);
    if (!result.rows[0]) {
      throw new ReimbusementError(401,`Invalid Credentials, please check username `);
    }
    let user:dtoUser = result.rows[0];
    if ( !bcrypt.compareSync(password,user.password)) {
      throw new ReimbusementError(401,`Invalid Credentials, please check password.`);
    }
    return await sqlUsertojsUSer(result.rows[0]);
  } catch (err) {
    //console.log(err.message)
    throw new ReimbusementError(err.statusCode || 500, err.message);
  } finally {
    client && client.release();
  }
}
//:::::::::::::::::::::::::::::::::::::::::::::::::
// Update User
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function updateUser(userdto: dtoUser): Promise<User> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    let query = `
        UPDATE users 
        SET 
        username = $1,
        firstname = $2,
        lastname = $3,
        email = $4,
        role_id = $5
        WHERE user_id = $6;`;
    let role: Role = await findRolByIdService(userdto.role_id);
    userdto.role_id = role.id;
    await client.query(query, [
      userdto.username,
      userdto.firstname,
      userdto.lastname,
      userdto.email,
      userdto.role_id,
      userdto.user_id
    ]);
    return await findUserById(userdto.user_id);
  } catch (err) {
    throw new ReimbusementError(500, err.message || "Database error Updating user ");
  } finally {
    client && client.release();
  }
}

//:::::::::::::::::::::::::::::::::::::::::::::::::
// Update User
//:::::::::::::::::::::::::::::::::::::::::::::::::
export async function createUser(userdto: dtoUser): Promise<User> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    let query = `
    INSERT 
    INTO users 
    VALUES (default,$1,$2,$3,$4,$5,$6) RETURNING user_id;`;
    let role: Role = await findRolByIdService(userdto.role_id);
    userdto.role_id = role.id;
    let result = await client.query(query, [
      userdto.username,
      userdto.password,
      userdto.firstname,
      userdto.lastname,
      userdto.email,
      userdto.role_id
    ]);
    //console.log(result.rows[0].user_id)
    return await findUserById(result.rows[0].user_id); 
  } catch (err) {
    let message = "Error creating user, " + err.message || " ";
    throw new ReimbusementError(500, message);
  } finally {
    client && client.release();
  }
}