import { CiSearch } from "react-icons/ci";
export default function SearchWindow({ products }) {
    return (
        <ul className="absolute left-0 right-0 mt-2 p-4 bg-base-200 text-base-content border border-base-100 rounded-md shadow-lg h-68 overflow-y-auto space-y-2">
            {products.map((product, index) => (
                <li key={index} className="flex justify-between items-center px-4 py-2 rounded-md hover:bg-base-100 hover:cursor-pointer">
                    {product.title || product.name}
                    <CiSearch className="inline mr-2" />
                </li>
            ))}
        </ul>
    );
}
