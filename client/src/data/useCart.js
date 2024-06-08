import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const API_HOST = "http://localhost:4000/api/cart";

const useCart = (user_id) => {
    const [joinedCart, setJoinedCart] = useState([]); // State to store array of products associated with cart for logged user with all necessary properties. This is the final cart that is exported for anywhere it needs to be used.
    const [cartProducts, setCartProducts] = useState([]); // State to store array of products without joined properties
    const [activeCart, setActiveCart] = useState([]); // Properties of cart that has parameter 'active' set to 'true'
    const [carts, setCarts] = useState([]); // Store carts from db.cart
    const [loading, setLoading] = useState(false); 
    const isMounted = useRef(false);
    
    // Use effect to load state data from api requests
    useEffect(() => {
        if (!isMounted.current) { //https://www.reddit.com/r/reactjs/comments/15s1p0q/useeffect_firing_twice_causing_an_issue_with/ - trying to prevent 2 database adds 
        // Returns cart_id's for given user
        const fetchCart = async() =>
        {
            setLoading(true); 
            try{
                // Get db.carts for associated user and set into carts
                const firstResponse = await axios.get(API_HOST + '/select/' + user_id) 
                setCarts(firstResponse.data);
                console.log(firstResponse.data);

                // Behavior if there are no carts associated with user ID
                if (firstResponse.data.length == 0) {
                    console.log("No cart found for user, attempting to create new cart");
                    try{
                        const response = await axios.post(API_HOST + '/create', {user_id: user_id}); // Create new cart
                        setCarts([response.data.cart_id]) // Set carts to have newly created table
                        setActiveCart(response.data); // Set new table as the active cart in state
                    }catch(e){
                        console.log("Failed to create new cart, aborting...");
                    }
                    
                    return; // Return early
                }
                
                //Behvaior if there are carts associated with user ID
                const active_cart = firstResponse.data.filter((cart) => cart.active === true) // Get only the active cart for fetching cart_products
                const secondResponse = await axios.get(API_HOST + '_products/select/' + active_cart[0].cart_id) // Get cart_products table associated with active_cart cartid
                setActiveCart(active_cart[0]);
                setCartProducts(secondResponse.data)

            }catch(error) {
                console.log("error trying to fetch cart IDs");;
            }finally{
                setLoading(false);
            }
        }

        fetchCart();
        isMounted.current = true;
        }
    }, [user_id]);

    // Join db.cart_products and db.products to create a new table with all properties needed for page functionality
    useEffect(()=> {
        // fetches table that has all product properties and a new quantity property from joining the corresponding cart
        const joinCartProducts = async() => { // Only try and do this when there is actually data in db.cart_products for the logged in user.
            if (cartProducts.length > 0) { 
            const response = await axios.get(API_HOST + "_products/join/" + activeCart.cart_id);
            setJoinedCart(response.data);
            }
        }

        joinCartProducts()
    },[cartProducts])


    // Add product to cart
    const cartProductsAdd = async(product_id, value = 1) => {
        
        //Check if product exists in cart and increment it
        for (let i = 0; i < cartProducts.length; i++) {
            if (cartProducts[i].product_id == product_id) {
                await cartProductsIncrement(product_id, value);
                return;
            }
        }

        //If product doesn't exist in cart create it
        try{
            const response = await axios.post(API_HOST + '_products/add', {cart_id: activeCart.cart_id, product_id: product_id}); // Add product to cart in db
            const new_cart_products = response.data;
            setCartProducts((current_cart_products) => [...current_cart_products, new_cart_products]) // Add product to cart in state
        }catch (e){
            console.log("Error trying to add product into database");
        }
    }

    //Increment product in cart by given value
    const cartProductsIncrement = async (product_id, value = 1) => {
        try{
            if (value == 1) {
                const response = await axios.post(API_HOST + '_products/add', {cart_id: activeCart.cart_id, product_id: product_id, increment: value})
            }else{
                const response = await axios.post(API_HOST + '_products/subtract', {cart_id: activeCart.cart_id, product_id: product_id, increment: value})
            }
            
            // Update cart state
            for (let i = 0; i < cartProducts.length; i++) { //for loop jumpscare
                if (cartProducts[i].product_id == product_id) {
                    let new_cart_products = [...cartProducts];
                    new_cart_products[i].quantity += value;
                    setCartProducts(new_cart_products)
                    break;
                }
            }
        }catch(e){
            console.log("Error incrementing value");
        }
    }

    // delete given product in cart
    const cartProductsDelete = async(product_id) => {
        try{
            const response = await axios.post(API_HOST + '_products/delete', {product_id: product_id, cart_id: activeCart.cart_id}); //Delete product in cart in db
            setCartProducts((cartCurrent) => cartCurrent.filter((cart) => cart.product_id !== product_id)) //Delete product in cart in state
        }catch(e){
            console.log("failed to delete");
        }
        
    }

    return [joinedCart, loading, cartProductsAdd, cartProductsIncrement, cartProductsDelete];
};

export default useCart;