// import { useState } from "react";
// import Input from "@react-components/Input.jsx";
// import Textarea from "@react-components/Textarea.jsx";
// import Label from "@react-components/Label.jsx";
// import Button from "@react-components/Button.jsx";
// import { AppUrls } from "@utils/enumerators.js";

// export default function EditPostForm({ post }) {
//     const [postData, setPostData] = useState(post)
//     const [error, setError] = useState(null);

//     async function handleUpdatePost(e) {
//         e.preventDefault();
//         setError(null); // Clear previous error

//         try {
//             const formData = new FormData(e.target)
//             formData.set("post-id", post.id)
//             const res = await fetch(AppUrls.EditPostAPI, {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!res.ok) {
//                 const data = await res.json();
//                 setError(data.message || "Something went wrong.");
//                 return;
//             }

//             window.location.href = AppUrls.Posts;

//         } catch (err) {
//             console.error("Error submitting post:", err.message);
//             setError("An unexpected error occurred.");
//         }
//     }

//     return (
//         <form className="space-y-4" onSubmit={handleUpdatePost}>
//             <h1 className="text-center text-2xl font-semibold uppercase border-gray-200 pb-2 text-gray-800">Edit Post</h1>
//             <div className="flex flex-col gap-1">
//                 <Label text="Title" htmlFor="post-title" />
//                 <Input
//                     name="post-title"
//                     type="text"
//                     id="post-title"
//                     value={postData?.title || ""}
//                     onChange={(e) => setPostData({ ...postData, title: e.target.value })}
//                 />
//             </div>

//             <div className="flex flex-col gap-1">
//                 <Label text="Description" htmlFor="post-body" />
//                 <Textarea
//                     name="post-body"
//                     id="post-body"
//                     value={postData?.body || ""}
//                     onChange={(e) => setPostData({ ...postData, body: e.target.value })}
//                 />
//             </div>

//             {error && (
//                 <p className="text-red-500 text-sm text-center">{error}</p>
//             )}

//             <div className="text-center">
//                 <Button text="Update post" type="submit" />
//             </div>
//         </form>
//     );
// }
