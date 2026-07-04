function getDetails(id) {
  let api_products_details = new XMLHttpRequest();
  api_products_details.open("GET", `https://dummyjson.com/products/${id}`);
  api_products_details.onreadystatechange = function () {
    if (
      api_products_details.readyState === 4 &&
      api_products_details.status === 200
    ) {
      let product = JSON.parse(api_products_details.responseText);

      console.log(product.title);
      // renderCategory_details(product.category)

      let product_id_details = document.getElementById("details-product");
      product_id_details.innerHTML = `
      
        <div class="item-details">
        <div class="container">
        <div class="images">
          <div class="big-image" >
            <img id="big-img" src="${product.images[0]}" alt="" />
          </div>
          <div class="small-image">
            ${product.images
              .map((imag, index) => {
                console.log(product.images.length);

                return `<img 
                            src="${imag}" 
                            alt="${product.title}" 
                            onclick="document.getElementById('big-img').src='${imag}'"
                          />`;
              })
              .join("")}
            
          </div>
        </div>
        <div class="content-details" >
          <h2>${product.title}</h2>
          <div class="icon">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star-half-stroke"></i>
          </div>
          <p class="price">$${product.price}</p>
          <h5 >Availability: <span>${product.availabilityStatus}</span></h5>
          <h5 >Brand: <span>${product.brand}</span></h5>
          <p class="description">${product.description}</p>
          <span class="stock">Hurry Up! Only ${product.stock} products left in stock</span>

     <div class="icon-fav-details" product_id="${product.id}">
          <button class="add-cart cart" onclick="requireLogin(() => addToCart({
    id: ${product.id},
    title: '${product.title}',
    price: ${product.price},
    thumbnail: '${product.thumbnail}'
            }))">Add To Card</button>
          <div class="icon-fav fav" onclick="requireLogin(() => toggleFav({
        id: ${product.id},
        title: '${product.title}',
        price: ${product.price},
        thumbnail: '${product.thumbnail}'
            }))" >
            <i class="fa-regular fa-heart "></i>
          </div>
</div>

        </div>
      </div>
        </div>
        <div id="container-details"></div>
        `;
      syncCartIcons();
      syncFavIcons();
      renderCategory_details(product.category);
    }
  };

  api_products_details.send();
}

document.addEventListener("click", function (e) {
  let btn = e.target.closest(".btn");
  if (btn) {
    let id = btn.getAttribute("product_id");
    if (!id) return;
    getDetails(id);
  }
});

function renderCategory_details(category) {
  let api_categories = new XMLHttpRequest();
  api_categories.open(
    "GET",
    `https://dummyjson.com/products/category/${category}`,
  );

  api_categories.onreadystatechange = function () {
    if (api_categories.readyState === 4 && api_categories.status === 200) {
      let data = JSON.parse(api_categories.responseText);
      let products = data.products;

      let swiperID = `swiper-${category}`;

      let container = document.getElementById("container-details");
      container.innerHTML = `
                <div class="header-top">
                    <h2 id="category_title">${category}</h2>
                    <p id="category_desc">Discover the best ${category} products with high quality, best prices, and fast delivery</p>
                </div>

                <div class="card">
                    <div class="swiper ${swiperID}">
                        <div class="swiper-wrapper">
                            ${products
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
                                        <div class="btn" product_id="${product.id}" onclick="ShowPage(event, 'details-product')">
                                            <span class="btn-details">Details</span>
                                        </div>
                                        <div class="icons-cart-fav" product_id="${product.id}">
                                            <span class="cart" onclick="requireLogin(() =>addToCart({id: ${product.id}, title: '${product.title}', price: ${product.price}, thumbnail: '${product.thumbnail}'}))">
                                                <i class="fa-solid fa-cart-arrow-down"></i>
                                            </span>
                                            <span class="fav"  onclick="requireLogin(() => toggleFav({id: ${product.id}, title: '${product.title}', price: ${product.price}, thumbnail: '${product.thumbnail}'}))">
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
  };

  api_categories.send();
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
