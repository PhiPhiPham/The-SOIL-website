import React, { useState, useContext } from 'react';
import { UserContext } from '../App';
import useReviews from '../data/useReview';
import useProducts from '../data/useProducts';
import '../styles/reviews.css';

const ReviewForm = () => {
  const [fields, setFields] = useState({text: "", stars: 1, product_id: false });
  const [user, cartState, loginUser, logoutUser] = useContext(UserContext);
  const [reviews, loading, addReview, deleteReview, updateReview] = useReviews(fields.product_id);
  const [reviewHolder, setReviewHolder] = useState([]); // State to store the review that is currently being edited (if any)
  const [editing, setEditing] = useState(false); // State to store whether we are currently editing a review or not
  const [disabled, setDisabled] = useState(false); // For any buttons we want to toggle 
  const [products] = useProducts();
  
  console.log(editing);
  //console.log(reviews);

  // Generic change handler.
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // Update field and state.
    setFields({...fields, [name]:value});
  }

  const handleSubmit = (event) => {
    //Validate fields here
    ///
    ///
    event.preventDefault();
    const review = {username: user.username, user_id: user.id, text: fields.text, stars: fields.stars, product_id: fields.product_id}
    addReview(review);
  };

  const handleEdit = (review) => {
    // Set 'editing' state to true (This will trigger conditional rendering to show edit form)
    setEditing(true);
    setDisabled(true) // Disable submit button
    // Copy 'review' into 'reviewHolder'. We want data of the review we are editing for future logic
    setReviewHolder(review);
  }

  const handleEditInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // Update field and state.
    setReviewHolder({...reviewHolder, [name]:value});
  }

  const handleSave = (event) => {
    event.preventDefault();
    // Call editReview from useReviews. This will update the review in the database
    updateReview(reviewHolder);
    // If all went well, set 'editing' back to false
    setEditing(false);
    setDisabled(false);
    console.log("Editing set to false");
    // Profit?
  }

  return (
    //Conditional rendering if somehow a non-logged in user gets to this page
    user == null ? <h1>Must be Logged in to view reviews</h1> :
    <section>
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>
          Item:
          <select
            onChange={handleInputChange}
            name="product_id"
          >
            <option value={false}>Select an item...</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>{product.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-group">
        <label>
          ✰ Stars:
          <select
            onChange={handleInputChange}
            name="stars"
          >
            {[1, 2, 3, 4, 5].map(star => (
              <option key={star} value={star}>{star}</option>
            ))}
          </select>
        </label>
      </div>
            <div className="form-group">
        <label>
          Leave your review:
          <textarea
            value={fields.text}
            name="text"
            onChange={handleInputChange}
            
            maxLength={100}
            required
          />
        </label>
      </div>
      <button id='submit' type="submit" disabled={disabled}>Submit Review</button>
    </form>
    
    {loading && <h1>Loading</h1>}
    <div className="reviews">
      <h>Posted Reviews: </h>
    {reviews.length > 0 ? (
      reviews.map((review) => {
        // If the review belongs to the logged in user, add delete and edit button when rendering
        if (review.user_id == user.id && editing == false) {
          console.log("User = review user id");
          return (
            <div key={review.review_id} className="review">
              <p><strong>Rating: {review.stars}/5 ⭐</strong></p>
              <p><strong>{review.username}</strong>: <br></br>{review.text}</p>
              
              <button onClick={()=> deleteReview(review.review_id)}>Delete Review</button>
              <button onClick={()=> handleEdit(review)}>Edit Review</button>
            </div>
          )
        }
        // If the review is currently being edited, add save button and a form
        if (editing == true && reviewHolder.review_id == review.review_id) {
          return (
            <div key={review.review_id} className="review">
              <form onSubmit={handleSave} className="form">
                <div className="form-group">
                  <label>
                    ✰ Stars:
                    <select
                      onChange={handleEditInput}
                      name="stars"
                      value={reviewHolder.stars}
                    >
                      {[1, 2, 3, 4, 5].map(star => (
                        <option key={star} value={star}>{star}</option>
                      ))}
                    </select>
                  </label>
                </div>
                      <div className="form-group">
                  <label>
                    Leave your review:
                    <textarea
                      value={reviewHolder.text}
                      name="text"
                      onChange={handleEditInput}
                      maxLength={100}
                      required
                    />
                  </label>
                </div>
                <button type="submit">Save Edit</button>
              </form>
            </div>
          )
        }
        // Default behavior, simply return the contents of the review
        return (
          <div  key={review.review_id} className="review">
             <p><strong>{review.username}</strong>: {review.text}</p>
             <p>Rating: {review.stars} stars</p>
          </div>
        )
      })
        ) : ( //Ternary operator jumpscare (please god turn this into an if statement)
          <p>No reviews yet for this product.</p>
        )}
    </div>
    
    </section>
  );
};

export default ReviewForm;