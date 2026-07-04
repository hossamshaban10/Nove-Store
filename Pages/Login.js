window.addEventListener("load", function () {
  localStorage.removeItem("currentUser");
  if (isLoggedIn()) {
    console.log("User logged in");
  } else {
    console.log("No user");
  }
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    Swal.fire("Error", "Wrong email or password", "error");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  document.querySelector(".login-btn").remove();
  document.querySelector(".sign-btn").remove();

  Swal.fire("Success", "Logged in successfully", "success");

  ShowPage(event, "home");
});

function isLoggedIn() {
  return localStorage.getItem("currentUser") !== null;
}

function requireLogin(action) {
  if (!isLoggedIn()) {
    Swal.fire({
      title: "Login Required",
      text: "You need to login first",
      icon: "warning",
      confirmButtonText: "Go to Login",
    }).then(() => {
      document
        .querySelectorAll(".page")
        .forEach((p) => p.classList.remove("active"));
      document.getElementById("login").classList.add("active");

      document
        .querySelectorAll(".nav-links li, .btn")
        .forEach((el) => el.classList.remove("active"));
      // *= يحتوي علي
      document.querySelector('.btn[onclick*="login"]').classList.add("active");
    });
    return;
  }

  action();
}
