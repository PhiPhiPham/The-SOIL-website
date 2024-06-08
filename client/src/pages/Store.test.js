import {render, screen, fireEvent, act} from "@testing-library/react";
import axios from "axios";
import Store from "./Store";
import { getProducts } from "../data/repository_express";
import { UserContext } from "../App";

// Global data for tests
//let container;
let products;
let container;
let cart;

// Initialised data to run before all tests
beforeAll(async() => {
    products = await getProducts();
});

// Run before every test
beforeEach(() => {
    const utils = render(
        <UserContext.Provider value={[{username: "guest", user_id: 0}, 1, null, null]}>
            <Store />
        </UserContext.Provider>
    )
    container = utils.container;
});

// Basic test to see if this works
test("Render Store", () => {
    expect(container).toBeInTheDocument();
});

// Test that displaying the cart shows the expected amount of items 
test("Display Cart", () => {
    // Cart shouldn't be open before open cart button is pressed
    const cart = container.querySelector(".modal-content");
    expect(cart).not.toBeInTheDocument();

    // Select open cart button
    const button = screen.getByRole('button', {name: /Open Cart/i});

    // Simulate input
   fireEvent.click(button);
    
    screen.debug();

    // Check that the cart is in the document
    expect(container.querySelector(".modal-content")).toBeInTheDocument();

    
})


// Test that specials filters works; 