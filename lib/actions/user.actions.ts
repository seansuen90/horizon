'use server';

import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "../appwrite";
import { ID } from "node-appwrite";
import { parseStringify } from "../utils";

export const signIn = async (userData: signInProps) => {
  try {
    // mutation / database /fetch
    const {email, password} = userData;
    const {account} = await createAdminClient();
    const session = await account.createEmailPasswordSession({
      email, password
    })
    return parseStringify(session);    
  } catch (error) {
    console.error('Error', error);
    
  }
}

export const signUp = async (userData: SignUpParams) => {
  try {
      const {email, firstName, lastName, password} = userData;
      const { account } = await createAdminClient();
      const newUserAccount = await account.create({
        userId: ID.unique(),
        email,
        password,
        name: `${firstName} ${lastName}`,
      });
      const session = await account.createEmailPasswordSession({
        email,
        password
      });

      (await cookies()).set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
      return parseStringify(newUserAccount);
  } catch (error) {
    console.error('Error', error);
    
  }
}

export async function getLoggedInUser() {
  try {
    const {account} = await createSessionClient();
    return await account.get();    
  } catch (error) {
    return null;    
  }
  
}

