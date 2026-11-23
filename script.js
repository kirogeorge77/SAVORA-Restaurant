
// =========================
// 1. Shopping Cart Variables
// =========================

// Load saved cart from localStorage
let cart = JSON.parse(localStorage.getItem("savoraCart")) || [];

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

// Toast Notification
const toast = document.getElementById("toast");

let toastTimer;


// =========================
// 2. Toast Notification Function
// =========================

function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}


// =========================
// 3. Add Products to Cart
// =========================

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const foodCard = button.closest(".food-card");

        const foodName = foodCard.querySelector("h3").textContent;

        const foodPriceText = foodCard.querySelector("span").textContent;

        const foodPrice = parseFloat(foodPriceText.replace("$", ""));

        const existingItem = cart.find(item => item.name === foodName);

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                name: foodName,
                price: foodPrice,
                quantity: 1
            });

        }

        updateCart();

        // Show small notification
        showToast(foodName + " added to cart!");

    });

});


// =========================
// 4. Update Shopping Cart
// =========================

function updateCart() {

    // Save cart in localStorage
    localStorage.setItem("savoraCart", JSON.stringify(cart));

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';

    }

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        totalQuantity += item.quantity;

        const itemElement = document.createElement("div");

        itemElement.classList.add("cart-item");

        itemElement.innerHTML = `
            <div>
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>

            <div class="quantity-controls">

                <button onclick="changeQuantity(${index}, -1)">-</button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${index}, 1)">+</button>

            </div>

            <button class="remove-item" onclick="removeItem(${index})">
                Remove
            </button>
        `;

        cartItems.appendChild(itemElement);

    });

    cartCount.textContent = totalQuantity;

    cartTotal.textContent = total.toFixed(2);

}


// =========================
// 5. Change Product Quantity
// =========================

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    updateCart();

}


// =========================
// 6. Remove Product
// =========================

function removeItem(index) {

    const removedItem = cart[index].name;

    cart.splice(index, 1);

    updateCart();

    showToast(removedItem + " removed from cart!");

}


// =========================
// 7. Checkout Button
// =========================

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty! Please add some food first.");

    } else {

        let orderSummary = "Your Order:\n\n";

        cart.forEach((item) => {

            orderSummary += item.name + " x " + item.quantity +
                " = $" + (item.price * item.quantity).toFixed(2) + "\n";

        });

        const finalTotal = cart.reduce((sum, item) =>
            sum + item.price * item.quantity, 0
        );

        orderSummary += "\nTotal: $" + finalTotal.toFixed(2);

        alert(orderSummary + "\n\nThank you for choosing SAVORA!");

        cart = [];

        updateCart();

    }

});


// =========================
// 8. Back To Top Button
// =========================

const backToTopButton = document.getElementById("back-to-top");

if (backToTopButton) {

    backToTopButton.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


// =========================
// 9. Current Year
// =========================

const yearElement = document.getElementById("year");

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();

}
// =========================
// 11. Menu Search
// =========================

const menuSearch = document.getElementById("menu-search");

const foodCards = document.querySelectorAll(".food-card");

if (menuSearch) {

    menuSearch.addEventListener("input", () => {

        const searchValue = menuSearch.value.toLowerCase().trim();

        foodCards.forEach((card) => {

            const foodName = card.querySelector("h3").textContent.toLowerCase();

            const foodDescription = card.querySelector("p").textContent.toLowerCase();

            if (
                foodName.includes(searchValue) ||
                foodDescription.includes(searchValue)
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

}
// =========================
// 12. Menu Filter
// =========================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        // Get selected category
        const selectedCategory = button.dataset.filter;

        // Remove active class from all buttons
        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        // Add active class to clicked button
        button.classList.add("active");

        // Show or hide food cards
        foodCards.forEach((card) => {

            const foodCategory = card.dataset.category;

            if (
                selectedCategory === "all" ||
                foodCategory === selectedCategory
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

});

// =========================
// 10. Load Saved Cart
// =========================

// Display saved products when the page opens
updateCart();
