import React, { useCallback } from "react"
import { useForm } from "react-hook-form"
import { Button, Input, Select, RTE } from "../index"
import appwriteService from "../../appwrite/config"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

function PostForm({post}) {
    const { register, control, handleSubmit, watch, setValue, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            status: post?.status || 'active',
            content: post?.content || "",

        },
    })
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData)

    const submit = async (data) => {
         console.log("FORM SUBMITTED", data);
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadfile(data.image[0]) : null

            if (file) {
               await appwriteService.deletefile(post.featuredImage)
            }
            const dbpost = await appwriteService.updatepost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,

            })
            if (dbpost) {
                navigate(`/post/${dbpost.$id}`)
            }
        } else {
            const file =await appwriteService.uploadfile(data.image[0]);
            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId
                const dbpost = await appwriteService.createpost({
                    ...data,
                    userId: userData.$id
                })
                if (dbpost) {
                    navigate(`/post/${dbpost.$id}`)
                }
            }
        }
    }

    const slugTransform=useCallback((value)=>{
        if(value && typeof value === 'string')
            return value
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g,'-');

        return "";
    },[])

    React.useEffect(()=>{
        const subscription=watch((value,{name})=>{
            if(name==='title'){
                setValue('slug',slugTransform(value.title),{shouldValidate:true});
            }
        });

        return ()=>{
            subscription.unsubscribe()
        }
    },[watch,slugTransform,setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getfilepreview(post.featuredImage).toString()}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgcolor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm