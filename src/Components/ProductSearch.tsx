import React, {Dispatch, SetStateAction} from "react";


// Define the AppProps interface
type AppProps = {
    search: string | "";
    setSearch: Dispatch<SetStateAction<string>>;
};

export const ProductSearch = ({search, setSearch}: AppProps) => {

    return (
        <div className={"search-container"}>
            <input type="text" placeholder="Type here to search..." value={search}
                   onChange={(e) => setSearch(e.target.value)}/>
        </div>
    )
}
