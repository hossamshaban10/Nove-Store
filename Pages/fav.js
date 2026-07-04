function syncFavIcons() {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  document.querySelectorAll(".fav").forEach((icon) => {
    icon.classList.remove("fav-active");
  });

  favs.forEach((item) => {
    document
      .querySelectorAll(`[product_id="${item.id}"] .fav`)
      .forEach((icon) => {
        icon.classList.add("fav-active");
      });
  });
  document.getElementById("counter-fav").innerHTML = favs.length;
}

function toggleFav(product) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  let exists = favs.find((item) => item.id === product.id);

  if (exists) {
    favs = favs.filter((item) => item.id !== product.id);
  } else {
    favs.push(product);
  }

  localStorage.setItem("favorites", JSON.stringify(favs));

  syncFavIcons();
}
// + -

function showFavPreview() {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  Swal.fire({
    title: "My Favorites",
    html: favs.length
      ? favs
          .map(
            (item) => `
      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        padding:8px;
        border-bottom:1px solid #eee;
      ">
        
        
        <div style="display:flex;align-items:center;gap:10px;max-width:70%;">

          <img src="${item.thumbnail}" 
               style="
                 width:50px;
                 height:50px;
                 object-fit:cover;
                 border-radius:8px;
                 flex-shrink:0;
               "/>

          <div style="overflow:hidden;">

            <div style="
              font-size:14px;
              font-weight:bold;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
              max-width:180px;
            ">
              ${item.title}
            </div>

            <div style="font-size:13px;color:#0090f0">
              ${item.price}$
            </div>

          </div>

        </div>

        <!-- buttons -->
        <div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0;" >
              
          <button  onclick="requireLogin(()=>addToCart({
            id:${item.id},
            title:'${item.title}',
            price:${item.price},
            thumbnail:'${item.thumbnail}'
          }))"
            style="
              background:#0090f0;
              color:white;
              border:none;
              padding:4px 8px;
              border-radius:5px;
              cursor:pointer;
              font-size:12px;
            " >
            Add
          </button>

          <button onclick="requireLogin(()=>removeFav(${item.id}))"
            style="
              background:#ff4d4f;
              color:white;
              border:none;
              padding:4px 8px;
              border-radius:5px;
              cursor:pointer;
              font-size:12px;
            ">
            Remove
          </button>

        </div>

      </div>
    `,
          )
          .join("")
      : "<p>No favorites yet</p>",
    showConfirmButton: false,
    width: 500,
  });
}

function removeFav(id) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  favs = favs.filter((item) => item.id !== id);

  localStorage.setItem("favorites", JSON.stringify(favs));

  document.getElementById("counter-fav").innerHTML = favs.length;

  syncFavIcons();
  showFavPreview();
}
