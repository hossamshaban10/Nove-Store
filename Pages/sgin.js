document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("reg-name").value;
    let email = document.getElementById("reg-email").value;
    let password = document.getElementById("reg-password").value;
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let exists = users.find((user) => user.email === email);

    if (exists) {
      Swal.fire("Error", "Email already exists", "error");
      ShowPage(event, "login");
      return;
    }

    let newUser = { name, password, email };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    document.querySelector(".login-btn").remove();
    document.querySelector(".sign-btn").remove();

    Swal.fire("Success", "Account created successfully", "success");

    ShowPage(event, "home");
  });
