import conf from "../conf/conf";
import { Client,ID, Databases,Query,Storage } from "appwrite";

export class Services{
    client=new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.AppWriteURL)
            .setProject(conf.AppWriteProjectID);
            this.databases=new Databases(this.client);
            this.bucket=new Storage(this.client);
    }
    
    
    async createpost({title,slug,content,featuredImage,status,userId}){
        console.log(userId);
            try {
                return await this.databases.createDocument(
                    conf.AppWriteDataBaseID,
                    conf.AppWriteArtical_ID,
                    slug,
                    {
                        title,
                        content,
                        featuredImage,
                        status,
                        userId,
                    }
                )
            } catch (error) {
                console.log("appwrite createpost error :: ",error);
                
            }
    }

    async updatepost(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(
                conf.AppWriteDataBaseID,
                conf.AppWriteArtical_ID,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("appwrite updatepost error:: ", error );
            
        }
    }

    async deletepost(slug){
        try {
            await this.databases.deleteDocument(
                conf.AppWriteDataBaseID,
                conf.AppWriteArtical_ID,
                slug
            )
            return true;
        } catch (error) {
            console.log("appwrite deletepost error :: ",error);
            return false;
        }
    }

    async getpost(slug){
        try {
            return await this.databases.getDocument(
                conf.AppWriteDataBaseID,
                conf.AppWriteArtical_ID,
                slug
            )
        } catch (error) {
            console.log("appwrite getpost error :: ", error)
            return false;
        }
    }

    async getposts(queries= [Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(
                conf.AppWriteDataBaseID,
                conf.AppWriteArtical_ID,
                queries
            )
        } catch (error) {
            console.log("Appwrite getposts error :: ",error);
            
        }
    }

    //file
    async uploadfile(file){
        try {
            return await this.bucket.createFile(
                conf.AppWriteBucketId,
                ID.unique(),
                file

            )
             
        } catch (error) {
            console.log("appwrite uploadfile error :: ",error);
            return false;
        }
    }

    async deletefile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.AppWriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("appwrite deletefile error :: ",error);
            return false;
        }
    }
    getfilepreview(fileId){
        return this.bucket.getFileView(
            conf.AppWriteBucketId,
            fileId
        )
    }
}

const service=new Services();

export default service