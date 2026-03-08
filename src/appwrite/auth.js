import conf from "../conf/conf";
import { Client, ID, Account } from "appwrite";

export class Authservice{
    client=new Client();
    account;
    constructor(){
        this.client
            .setEndpoint(conf.AppWriteURL)
            .setProject(conf.AppWriteProjectID)
            this.account=new Account(this.client)
    }

    async createAccount({email,password,name}){
        try{
            const userAccount=await this.account.create(ID.unique(),email,password,name);
            if(userAccount){
                //call another method
                return this.login({email,password})
            }else{
                return userAccount;
            }

        }catch(error){
            throw error;
        }
    }

    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log("appwrite getuser error::", error)
        }
        return null;
    }

    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("appwrite logout error:: ",error)
        }
    }
}
const authService=new Authservice();
export default authService