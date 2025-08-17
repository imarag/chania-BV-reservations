// import Button from "@react-components/Button"

// export default function FormContainer({ title = null, error = "", success = "", handleSubmit = () => { }, buttonLabel = "Submit", loading = false, children }) {
//     return (
//         <div className="bg-white px-6 py-4 rounded-md w-auto md:w-96 mx-auto">
//             {error && (
//                 <p className="bg-red-500/40 text-black font-light p-3 rounded-md text-center mb-2 text-sm">{error}</p>
//             )}
//             {success && (
//                 <p className="bg-green-500/40 text-black font-light p-3 rounded-md text-center mb-2 text-sm">{success}</p>
//             )}
//             {title && <h1 className="text-center font-semibold mb-4 text-2xl">{title}</h1>}
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                 {children}
//                 <div className="text-center">
//                     <Button
//                         type="submit"
//                         disabled={loading}
//                     >
//                         {loading ? "loading..." : buttonLabel}
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     )
// }