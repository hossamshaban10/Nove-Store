function renderSummary() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  const container = document.getElementById("summary-items");
  let total = 0;

  // لو الكارت فاضي
  if (cartItems.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    document.getElementById("summary-total").textContent = "$0.00";
    return;
  }

  container.innerHTML = cartItems
    .map((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      return `
      <div class="summary-item">
        <span>${item.title} x${item.quantity}</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      `;
    })
    .join("");

  document.getElementById("summary-total").textContent = `$${total.toFixed(2)}`;
}

// Place order
function placeOrder() {
  // check cart first
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Cart is Empty!",
      text: "Please choose products first before placing your order.",
      confirmButtonColor: "#0090f0",
    });

    return;
  }
  const name = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const zip = document.getElementById("zip").value.trim();

  // validation
  if (!name || !email || !phone || !address || !city || !zip) {
    Swal.fire({
      icon: "warning",
      title: "Oops!",
      text: "Please fill in all fields before placing your order.",
      confirmButtonColor: "#0090f0",
    });
    return;
  }

  Swal.fire({
    icon: "success",
    title: "Order Placed!",
    text: `Thank you, ${name}! Your order has been placed.`,
    confirmButtonColor: "#0090f0",
  });

  // Clear cart after order
  localStorage.removeItem("cart");
}

// Run on load
renderSummary();
