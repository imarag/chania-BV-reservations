// import Input from "@react-components/Input.jsx";
// import { AppUrls } from "@utils/enumerators";
// import { useEffect, useState } from "react";
// export default function NavBarSearchBar() {
//     const [searchPattern, setSearchPattern] = useState("");
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const response = await fetch(`${AppUrls.searchAPI}?q=${searchPattern}`);
//                 const data = await response.json();
//                 setProducts(data.products);
//                 console.log("Search results:", data);
//             } catch (error) {
//                 setProducts([]);
//             }
//         }

//         fetchData();
//     }, [searchPattern]);

//     return (
//         <div>
//             <Input
//                 block={true}
//                 type="search"
//                 placeholder="Search..."
//                 value={searchPattern}
//                 onChange={(e) => setSearchPattern(e.target.value)}
//             />
//             {products.length > 0 && (
//                 <ul className=" absolute mt-2 bg-white border border-gray-200 rounded-sm shadow-lg text-gray-800 h-60 overflow-y-auto">
//                     {products.map((product, index) => (
//                         <li key={index} className="px-4 py-2 hover:bg-gray-100">
//                             {product.title || product.name}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }
