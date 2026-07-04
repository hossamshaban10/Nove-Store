// add cart

window.addEventListener("load", function () {
  renderCart();
  syncFavIcons();
  syncCartIcons();
});

function syncCartIcons() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.forEach((item) => {
    document
      .querySelectorAll(`[product_id="${item.id}"] .cart`)
      .forEach((icon) => {
        icon.classList.add("active");
      });
  });
}
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let exists = cart.find((item) => item.id === product.id);
  if (exists) {
    exists.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
  syncCartIcons();

  Swal.fire({
    icon: "success",
    title: "Added!",
    text: "Product added to cart",
    showConfirmButton: false,
    timer: 1500,
  });
  renderSummary();
}
// remove
function removeFromCart(id) {
  Swal.fire({
    title: "Are You Sure From Delete The Product !?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart = cart.filter((item) => item.id !== id);

      localStorage.setItem("cart", JSON.stringify(cart));

      renderCart();
      renderSummary();
      document
        .querySelectorAll(`[product_id="${id}"] .cart`)
        .forEach((icon) => {
          icon.classList.remove("active");
        });

      Swal.fire({
        title: "Deleted!",
        text: "Product removed from cart",
        icon: "success",
      });
    }
  });
}

function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItems = document.getElementById("cart-items");
  let totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  if (cart.length === 0) {
    cartItems.innerHTML = `<p>Your cart is empty!</p>`;
    document.getElementById("cart-total-price").innerText = "0";
    document.getElementById("counter-card").innerHTML = 0;
    return;
  }
  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.thumbnail}" alt="${item.title}"/>
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>$${item.price}</p>
            
            <div class="quantity-controls">
                <button onclick="decreaseQty(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQty(${item.id})">+</button>
            </div>
            </div>
            
            <button class="btn" onclick="requireLogin(()=>removeFromCart(${item.id}))">Remove</button>
        </div>
    `,
    )
    .join("");

  document.getElementById("cart-total-price").innerText =
    `$${totalPrice.toFixed(2)}`;

  document.getElementById("counter-card").innerHTML = cart.length;
}
// +-
function increaseQty(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let item = cart.find((item) => item.id === id);
  if (item) item.quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderSummary();
}

function decreaseQty(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let item = cart.find((item) => item.id === id);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
  } else {
    removeFromCart(id);
    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderSummary();
}
