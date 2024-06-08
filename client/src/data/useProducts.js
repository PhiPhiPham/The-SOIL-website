import { useState, useEffect } from 'react';
import axios from 'axios';
const API_HOST = "http://localhost:4000/api/products/";

//Fetches product data and puts into state
const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async() =>
        {
            setLoading(true);
            try{
                const response = await axios.get(API_HOST)
                setProducts(response.data);
            }catch(error) {
                console.log("error trying to fetch products");
            }finally {
                setLoading(false);
            }
            
            
        }
        fetchProducts();
    }, []);

    return [products, loading];
};

export default useProducts;