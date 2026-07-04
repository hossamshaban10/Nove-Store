function ShowPage(e, pageId) {
  e.preventDefault();
  // menu
  document.querySelector(".nav")?.classList.remove("active");
  document.querySelector(".login-signup")?.classList.remove("active");

  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");

  document.querySelectorAll(".nav-links li, .btn").forEach((li) => {
    li.classList.remove("active");
  });
  if (pageId === "home") {
    const homeLi = document.querySelector(".nav-links li:first-child");
    if (homeLi) homeLi.classList.add("active");

    document.getElementById("header-top").style.display = "none";

    document.getElementById("select_category").value = "all";
    renderCategory(allcategories);
  } else {
    document.querySelectorAll(".btn, .nav-links li").forEach((el) => {
      el.classList.remove("active");
    });

    const activeElement = e.currentTarget;
    if (activeElement) {
      activeElement.classList.add("active");
    }
  }
}

let allproducts = [];
let allcategories = [];

let loading = document.getElementById("status");

loading.textContent = "Not Found Products";

let api_products = new XMLHttpRequest();
api_products.open("GET", "https://dummyjson.com/products?limit=0");
api_products.onreadystatechange = function () {
  if (api_products.readyState === 4 && api_products.status === 200) {
    let data = JSON.parse(api_products.responseText);

    allproducts = data.products;

    if (allcategories.length === 0) {
      loading.innerHTML = `
  <div class="loader"></div>
`;
    }
    console.log(allproducts);
    getCategories();
  }
};

api_products.send();

function getCategories() {
  let api_categories = new XMLHttpRequest();
  api_categories.open("GET", "https://dummyjson.com/products/categories");

  api_categories.onreadystatechange = function () {
    if (api_categories.readyState === 4 && api_categories.status === 200) {
      let categories = JSON.parse(api_categories.responseText);
      allcategories = categories;
      renderCategory(categories);
    }
  };
  api_categories.send();
}

function renderCategory(categories) {
  let container = document.getElementById("container");
  container.innerHTML = "";

  categories.forEach((cat, index) => {
    let filtered_products = allproducts.filter(
      (prod) => prod.category.toLowerCase() === cat.slug.toLowerCase(),
    );

    let header_top_category = document.getElementById("select_category");

    header_top_category.innerHTML += `
        <option  value="${cat.slug}">${cat.name}</option>
      `;

    let swiperID = `swiper-${index}`;

    container.innerHTML += `
      <div class="header-top">
        <h2 id="category_title">${cat.name}</h2>
        <p id="category_desc">Discover the best ${cat.name} products with high quality, best prices, and fast delivery.</p>
      </div>

      <div class="card">
        <div class="swiper ${swiperID}">
          <div class="swiper-wrapper">
            ${filtered_products
              .map(
                (product) => `
              <div class="swiper-slide">
                <div class="product">
                  <div class="img-product">
                    <img src="${product.thumbnail}" alt="${product.title}" />
                  </div>
                  <div class="content">
                    <h2>${product.title}</h2>
                    <div class="icon">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star-half-stroke"></i>
                        </div>
                        
                    <span class="price">${product.price}$</span>
                  </div>
                  <div class="btn" product_id=${product.id} onclick="ShowPage(event, 'details-product')">
                        <span
                          class="btn-details"
                          >Details
                        </span>
                      </div>

                      <div class="icons-cart-fav" product_id="${product.id}">
                      <span  class="cart" onclick="requireLogin(() => addToCart({id: ${product.id}, title: '${product.title}', price: ${product.price}, thumbnail: '${product.thumbnail}'}))">
                         <i class="fa-solid fa-cart-arrow-down"></i>
                        </span>
                        <span class="fav" onclick="requireLogin(() => toggleFav({
                                    id: ${product.id},
                                    title: '${product.title}',
                                    price: ${product.price},
                                    thumbnail: '${product.thumbnail}'
              }))">
                          <i class="fa-regular fa-heart"></i>
                        </span>
                        
                      </div>
                </div>
              </div>
            `,
              )
              .join("")}
            
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </div>
    `;
  });

  categories.forEach((cat, index) => {
    new Swiper(`.swiper-${index}`, {
      slidesPerView: 5,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: `.swiper-${index} .swiper-button-next`,
        prevEl: `.swiper-${index} .swiper-button-prev`,
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1200: { slidesPerView: 5 },
      },
    });
  });

  syncFavIcons();
  syncCartIcons();
}

document
  .getElementById("select_category")
  .addEventListener("change", function () {
    let select_category = this.value;
    if (this.value == "all") {
      document.getElementById("header-top").style.display = "none";
      renderCategory(allcategories);
    } else {
      failter_product(select_category);
    }
  });

function failter_product(category) {
  document.getElementById("category_title").textContent = "";
  document.getElementById("category_desc").textContent = "";

  let failter = allproducts.filter((prod) => prod.category === category);

  let displaycategory = allcategories.find((cat) => cat.slug === category);

  console.log(displaycategory.name);
  let info = document.getElementById("header-top");
  document.getElementById("category_title").innerHTML += displaycategory.name;
  document.getElementById("category_desc").innerHTML += `

   <p id="category_desc">Discover the best ${displaycategory.name} products with high quality, best prices, and fast delivery.</p>
   
   `;
  info.style.display = "block";
  info.classList.add("header-after");

  render_products(failter);
}

function render_products(products) {
  let container = document.getElementById("container");
  container.innerHTML = "";

  if (!products) return `not found`;
  let swiperID = `swiper-filtered`;
  container.innerHTML += `
  <div class="card">
              <div class="swiper ${swiperID}">
                <div class="swiper-wrapper">
                ${products
                  .map(
                    (product) => `
                  
               
                
                  <div class="swiper-slide">
                     <div class="product" >
                      <div class="img-product">
                        <img src="${product.thumbnail}" alt="${product.title}" />
                      </div>
                      <div class="content">
                        <h2>${product.title}</h2>
                        <div class="icon">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star-half-stroke"></i>
                        </div>
                        <span class="price">$${product.price}</span>
                      </div>
                      <div class="btn" product_id="${product.id}" onclick="ShowPage(event, 'details-product')">
                        <span
                          
                          class="btn-details"
                          >Details
                        </span>
                      </div>

                      <div class="icons-cart-fav" product_id="${product.id}">
                      <span class="cart" onclick="requireLogin(() => addToCart({id: ${product.id}, title: '${product.title}', price: ${product.price}, thumbnail: '${product.thumbnail}'}))">
                         <i class="fa-solid fa-cart-arrow-down"></i>
                        </span>
                        <span class="fav" onclick="requireLogin(() => toggleFav({
                                id: ${product.id},
                                title: '${product.title}',
                                price: ${product.price},
                                thumbnail: '${product.thumbnail}'
                  }))">
                          <i class="fa-regular fa-heart"></i>
                        </span>
                        
                      </div>
                    </div> 
                  </div> 
                 
                `,
                  )
                  .join("")}
                </div> 
                

                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
              </div>
            </div>
`;

  syncFavIcons();
  syncCartIcons();
  new Swiper(`.${swiperID}`, {
    slidesPerView: 5,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: `.${swiperID} .swiper-button-next`,
      prevEl: `.${swiperID} .swiper-button-prev`,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
      1200: { slidesPerView: 5 },
    },
  });
}

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

function syncFavIcons() {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favs.forEach((item) => {
    document
      .querySelectorAll(`[product_id="${item.id}"] .fav`)
      .forEach((icon) => {
        icon.classList.add("fav-active");
      });
  });
  document.getElementById("counter-fav").innerHTML = favs.length;
}

// search

function searchProducts(e) {
  e.preventDefault();

  let value = document.getElementById("search").value.toLowerCase().trim();

  if (!value) {
    renderCategory(allcategories);
    return;
  }

  let results = allproducts.filter((product) =>
    product.title.toLowerCase().includes(value),
  );

  if (results.length === 0) {
    document.getElementById("container").innerHTML = `
      <h2 style="text-align:center;margin:20px">No products found </h2>
    `;
    return;
  }
  renderCategory(allcategories);
  render_products(results);
}

function liveSearch() {
  let value = document.getElementById("search").value.toLowerCase().trim();

  if (value === "") {
    // render_products(allproducts)
    renderCategory(allcategories);
    return;
  }

  let results = allproducts.filter(
    (product) =>
      product.title.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value),
  );

  render_products(results);
  syncFavIcons();
  syncCartIcons();
}
