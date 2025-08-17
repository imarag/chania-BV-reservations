// import { useEffect, useState } from "react";
// import Input from "@react-components/Input";
// import { AppUrls } from "@utils/enumerators";

// export default function PostsContainer({ posts }) {
//     const [allPosts, setAllPosts] = useState(posts);
//     const [searchParam, setSearchParam] = useState("");
//     const [allUsers, setAllUsers] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null)

//     const searchPattern = searchParam.toString().toLowerCase().trim();

//     const filteredPosts = allPosts.filter(post => {
//         const postTitleEdited = post.title.toString().toLowerCase().trim();
//         const postBodyEdited = post.body.toString().toLowerCase().trim();
//         return postTitleEdited.includes(searchPattern) || postBodyEdited.includes(searchPattern)
//     })

//     useEffect(() => {
//         fetch(AppUrls.GetUsersAPI)
//             .then(res => res.json())
//             .then(users => setAllUsers(users))
//     }, [])

//     useEffect(() => {
//         fetch(AppUrls.GetSessionUserAPI)
//             .then(res => res.json())
//             .then(userObj => setCurrentUser(userObj.user))
//     }, [])

//     return (
//         <div>
//             <div className="w-full sm:w-3/4  md:w-1/2 xl:w-1/3 mx-auto mb-12">
//                 <Input block={true} value={searchParam} onChange={(e) => setSearchParam(e.target.value)} />
//             </div>
//             {
//                 filteredPosts.length == 0 ? (
//                     <p className="text-center text-gray-400 mt-12">No posts found for this search param...</p>
//                 ) : (
//                     <div>
//                         {
//                             filteredPosts.map((post) => {
//                                 const author = allUsers.find(user => user.id === post.userId);
//                                 return (
//                                     <div
//                                         key={post.id}
//                                         className="p-8 rounded-2xl my-8 mx-auto relative bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-xl border border-gray-100 transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl"
//                                     >
//                                         <div className="flex items-center justify-between mb-6">
//                                             <h3 className="font-extrabold text-2xl text-gray-900 tracking-tight">{post?.title}</h3>
//                                             {currentUser?.email === author?.email && (
//                                                 <a
//                                                     className="underline text-blue-500 text-base font-medium hover:text-blue-700 transition"
//                                                     href={AppUrls.EditPostPage.replace(":id", post?.id)}
//                                                 >
//                                                     Edit post
//                                                 </a>
//                                             )}
//                                         </div>
//                                         <p className="font-normal text-gray-800 text-lg mb-6 leading-relaxed">{post?.body}</p>
//                                         <div className="flex items-center gap-3 mt-6">
//                                             <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
//                                                 {author?.email?.[0]?.toUpperCase() || "?"}
//                                             </div>
//                                             <span className="text-sm italic text-gray-500">
//                                                 by <span className="underline text-blue-800">{author?.email}</span>
//                                             </span>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         }
//                     </div>
//                 )
//             }
//         </div>

//     )
// }