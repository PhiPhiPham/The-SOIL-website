import { useState, useEffect } from 'react';
import axios from 'axios';
import { findUser } from './repository_express';
const API_HOST = "http://localhost:4000/api/reviews/";
let method = "all";

const useReviews = (product_id) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        // Fetches given product_id reviews, if no product_id is given, fetches all reviews.
        const fetchReviews = async() =>
        {
            setLoading(true);
            if (product_id !== false) method = "select/" + product_id;
            
            try{
                const response = await axios.get(API_HOST + method);
                
                // If there are no reveiws then simply return the empty array
                if (response.data.length <= 0){ 
                    setReviews(response.data);
                    return;
                }
  
                await Promise.all(response.data.map(async(review) => { // thank you lords at stack overflow https://stackoverflow.com/questions/33438158/best-way-to-call-an-asynchronous-function-within-map
                    const user = await findUser(review.user_id);
                    review.username = user.username;
                }))
               // Append associated username to the review. (reason for this and above 2 lines is to catch when a user changes their username.)
                setReviews(response.data); 
            }catch(error) {
                console.log("error trying to fetch reviews");
            }finally {
                setLoading(false);
            }
            
            
        }
        fetchReviews();
    }, [product_id]);

    // Add given review into database
    const addReview = async(review) => {
        console.log(JSON.stringify(review));
        try{
            const response = await axios.post(API_HOST + 'create', review)
            console.log("Review added into database successfully");
            let new_review = response.data;
            new_review.username = review.username;
            setReviews((reviewsCurrent) => [...reviewsCurrent, new_review])
        }catch (e){
            console.log("Error trying to add review into database");
        }
    }

    const deleteReview = async(review_id) => {
        console.log(review_id);
        try{
            const response = await axios.post(API_HOST + 'delete', {review_id: review_id});
            setReviews((reviewsCurrent) => reviewsCurrent.filter((review) => review.review_id !== review_id))
            
        }catch(e){
            console.log("Unable to delete");
        }
    }
    
    const updateReview = async (edited_review) => {
        //Update review in database
        console.log(edited_review);
        try{
            const response = await axios.post(API_HOST + 'update', edited_review);
            setReviews((reviewsCurrent) => reviewsCurrent.map((review) => { // this is where i realised dictionary implenetation would optimise everything but it's too late!
                if (review.review_id == response.data.review_id) {
                    review.text = response.data.text;
                    review.stars = response.data.stars;
                }
                return review;
            }))
        }
        catch(e){
            console.log("Failed to update review");
        }
        
        return;
    }

    return [reviews, loading, addReview, deleteReview, updateReview];
};

export default useReviews