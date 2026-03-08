import React,{useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({children,authentication=true}){
    const [loader,setLoader]=useState(true)
    const navigate=useNavigate()
    const authstatus=useSelector((state)=>state.auth.status)

    useEffect(()=>{
        if(authentication && authstatus!==authentication ){
            navigate("/login")
        }else if(!authentication && authstatus!==authentication){
            navigate("/")
        }
        setLoader(false)
    },[authentication,authstatus,navigate])

    return loader ? <h1>...Loading</h1> : <>{children}</>
}