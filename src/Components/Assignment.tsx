import {useEffect, useState} from "react";
import {ProductSearch} from "./ProductSearch";
import InfiniteScroll from "react-infinite-scroll-component";
import {ClipLoader} from "react-spinners";
import {useDebouncedValue} from "../CustomHooks/debounce";
import {Product} from "../models/Product";

export const Assignment = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

    const debouncedSearchQuery = useDebouncedValue(search, 500);

    // handle get next 20 products each time user scroll to the bottom
    const fetchFunc = (type: string = "") => {
        fetch('https://dummyjson.com/products/search?q=' + debouncedSearchQuery + '&limit=20&skip=' + (type !== "search" ? page * 20 : 0))
            // convert response to json
            .then(res => res.json())
            .then(data => {
                // deserialize products
                const fetchedProducts = data.products.map((product: any) => Product.fromApi(product));
                if (fetchedProducts.length === 0) {
                    setHasMore(false);
                    setProducts(type !== "search" ? products : fetchedProducts);
                } else {
                    setProducts(type !== "search" ? [...products, ...fetchedProducts] : fetchedProducts);
                    setPage(type !== "search" ? page + 1 : 1);
                    setHasMore(data.total > products.length);
                }
            })
            .catch(err => {
                console.error(err);
                setHasMore(false);
            });
    };


    useEffect(() => {
        fetchFunc("search")
    }, [debouncedSearchQuery]);


    // handle scroll to top button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div>
            <h1>Products List</h1>
            <ProductSearch search={search} setSearch={setSearch}/>

            {/* Display products list */}
            <InfiniteScroll
                dataLength={products.length}
                next={fetchFunc}
                hasMore={hasMore}
                loader={<ClipLoader
                    color={"#0dd53c"}
                    loading={hasMore}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />}
                scrollThreshold={0.95}
                style={{display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden"}}
                endMessage={
                    <p style={{textAlign: 'center'}}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
                {products.length > 0 && products.map((product: Product) => (
                    <div className={"product-container"} key={product.id}>
                        <div className={"tab-product"} key={"product-" + product.id}>
                            <div className={"product-desc"}>
                                <h2>{product.title}</h2>
                                <p className={"desc"}>{product.description}</p>
                                <p className={"price"}>{product.price} $</p>
                            </div>
                            <img src={product.thumbnail} alt=""/>
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
            {showScrollTop && (
                <button className={"scroll-top"} onClick={scrollToTop}>
                    Scroll to Top
                </button>
            )}
        </div>
    );
}

