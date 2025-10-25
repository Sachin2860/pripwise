'use server';

import { db,auth } from "@/Firebase/admin";
import { fail } from "assert";
import { error } from "console";
import { cookies } from "next/headers";
import { success } from "zod";
import { unstable_noStore as noStore } from 'next/cache';

export async function signUp(params:SignUpParams) {

    const {uid, name, email}=params;
    try{

        const userRecord= await db.collection('users').doc(uid).get();
        
        if (userRecord.exists){
            return{
                success: false,
                message:'User already exsits.Please Sign-in instead.'
            }
        }
        
        await db.collection('users').doc(uid).set({
            name, email
        })
        
        await auth.updateUser(uid, {
            displayName: name
        });

        return{
            success: true,
            message:'Account created successfully.Please sign in.'
        }

    }catch (e:any){
        console.error('Error is Creating a User.',e);
        if(e.code === 'auth/email-aready-exists'){
            return {
                success: false,
                message:'This email is already in use.'

            }
        }

        return{
            success: false,
            message:'Failed to create an account.'
        }
    }
}

export async function signIn(params:SignInParams) {
    const {email,idToken}=params;
    try{
        const authUserRecord = await auth.getUserByEmail(email);
        if (!authUserRecord){
            return{
                success:false,
                message:'User does not exist. Create an account instead.'
            }
        }
        
        const dbUserRecord = await db.collection('users').doc(authUserRecord.uid).get();
        
        if (!dbUserRecord.exists) {
            await db.collection('users').doc(authUserRecord.uid).set({
                name: authUserRecord.displayName || 'User',
                email: authUserRecord.email
            }, { merge: true });
        }

        const cookieResult = await setSessionCookie(idToken);
        if (!cookieResult.success) {
            return {
                success: false,
                message: cookieResult.message
            }
        }
        
        return { success: true };

    }catch(e){
        console.log(e)

        return{
            success:false,
            message:'Failed to log into an account.'
        }
    }
}

export async function setSessionCookie(idToken:string) {
    try {
        const cookieStore= await cookies();
        
        const sessionCookie= await auth.createSessionCookie(idToken, {
            expiresIn: 60*60*24*7*1000, 
        })

        cookieStore.set('session', sessionCookie, {
            maxAge: 60*60*24*7,
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            path:'/',
            sameSite:"lax"
        })
        
        return { success: true };
    } catch (e) {
        console.log(e);
        return { success: false, message: 'Failed to set session cookie.' };
    }
}


export async function checkAuth() {
    noStore();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) return false;

    try {
        
        await auth.verifySessionCookie(sessionCookie.value, true);
        return true; 
    } catch (e) {
      
        return false;
    }
}

export async function getCurrentUser(): Promise <User|null> {
    noStore(); 
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')

    if(!sessionCookie) return null;

    try{
        const decodedClaims= await auth.verifySessionCookie(sessionCookie.value,true);
        const userRecord= await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord.exists) return null; 
        
        const userData = userRecord.data()!;
        return {
            id: userRecord.id,
            name: userData.name,
            email: userData.email
        };

    }catch(e){
        console.log(e)
        return null;
    }
}

export async function signOutAction() {
    try {
        const cookieStore = await cookies();
        
        cookieStore.set('session', '', {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax'
        });

        return { success: true };
    } catch (e) {
        console.log(e);
        return { success: false, message: 'Failed to sign out.' };
    }
}