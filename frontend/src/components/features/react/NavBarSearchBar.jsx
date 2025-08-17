import Input from "../../ui/react/Input";
import { AppUrls } from "../../../utils/enumerators";
import SearchWindow from "./SearchWindow";
import { useEffect, useState } from "react";
export default function NavBarSearchBar() {
    const [searchPattern, setSearchPattern] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            console.log("Fetching data for:", searchPattern);
            try {
                const response = await fetch(`${AppUrls.searchAPI}?q=${searchPattern}`);
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                setProducts([]);
            }
        }

        fetchData();
    }, [searchPattern]);

    return (
        <div>
            <Input
                type="search"
                placeholder="Search a product..."
                value={searchPattern}
                className="w-full"
                onChange={(e) => setSearchPattern(e.target.value)}
            />
            {products.length > 0 && (
                <SearchWindow products={products} />
            )}
        </div>
    );
}
