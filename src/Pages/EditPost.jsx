import React, { useEffect, useState } from "react";
import {Container,PostCard, PostForm} from "../components"
import appwriteService from "../appwrite/config"
import { useNavigate, useParams } from "react-router-dom";

function EditPost(){
    const [post,setpost]=useState(null)
    const navigate=useNavigate()
    const {slug}=useParams()

    useEffect(()=>{
        if(slug){
            appwriteService.getpost(slug).then((post)=>{
                if(post){
                setpost(post)
            }
        })
        }else{
            navigate("/")
        }
    },[slug,navigate])
    return(
        post?(
            <div className="py-8">
                <Container >
                    <PostForm post={post} />
                </Container>
            </div>
        ):null
    )
}

export default EditPost