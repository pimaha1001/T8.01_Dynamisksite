"use strict";

const productURL = "https://kea-alt-del.dk/t7/api/products?limit=100";

const listContainer = document.querySelector(".product_list_container");
const categoryTitle = document.querySelector("#category-title");
const genderButtons = document.querySelectorAll(".btn_container button[data-filter]");
const seasonButtons = document.querySelectorAll(".btn_container button[data-season]");
const sortButton = document.querySelector(".sort_button");

// Hent filtre fra sidens URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

let allData = [];
let selectedGender = params.get("gender") || "All";
let selectedSeason = params.get("season") || "All";
let sortByPriceAscending = false;

// Byg API-URL'en med de valgte filtre
function createProductURL() {
  const url = new URL(productURL);

  if (category) {
    url.searchParams.set("category", category);
  }

  if (selectedSeason !== "All") {
    url.searchParams.set("season", selectedSeason);
  }

  if (selectedGender !== "All") {
    url.searchParams.set("gender", selectedGender);
  }

  return url.toString();
}

// Gem de valgte filtre i sidens URL uden at genindlæse siden
function updatePageURL() {
  const url = new URL(window.location.href);

  if (selectedGender === "All") {
    url.searchParams.delete("gender");
  } else {
    url.searchParams.set("gender", selectedGender);
  }

  if (selectedSeason === "All") {
    url.searchParams.delete("season");
  } else {
    url.searchParams.set("season", selectedSeason);
  }

  window.history.replaceState({}, "", url);
}

categoryTitle.textContent = category || "All Products";

// Gør kønsfilterknapperne klikbare
genderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedGender = button.dataset.filter;

    genderButtons.forEach((genderButton) => {
      genderButton.classList.toggle("active", genderButton === button);
    });

    updatePageURL();
    getData(createProductURL());
  });
});

// Gør sæsonknapperne klikbare
seasonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedSeason = button.dataset.season;

    seasonButtons.forEach((seasonButton) => {
      seasonButton.classList.toggle("active", seasonButton === button);
    });

    updatePageURL();
    getData(createProductURL());
  });
});

// Hent produkterne første gang
getData(createProductURL());

function getData(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API-fejl: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      allData = data;
      filterSelection();
    })
    .catch((error) => {
      console.error("Kunne ikke hente produkter:", error);
      listContainer.textContent = "Produkterne kunne ikke indlæses.";
    });
}

// Filtrér produkterne, og sortér dem hvis sorteringsknappen er brugt
function filterSelection() {
  let filteredProducts = selectedGender === "All" ? [...allData] : allData.filter((product) => product.gender === selectedGender);

  if (sortByPriceAscending) {
    filteredProducts.sort((a, b) => {
      const actualPriceA = a.discount ? getDiscountPrice(a.price, a.discount) : a.price;

      const actualPriceB = b.discount ? getDiscountPrice(b.price, b.discount) : b.price;

      return actualPriceA - actualPriceB;
    });
  }

  showProducts(filteredProducts);
}

// Sortér efter pris fra høj til lav
if (sortButton) {
  sortButton.addEventListener("click", () => {
    sortByPriceAscending = true;
    filterSelection();
  });
}

function showProducts(products) {
  console.log("Products:", products);

  // Ryd produktlisten, før de nye produkter vises
  listContainer.innerHTML = "";

  // Opret et produktkort for hvert produkt
  products.forEach((product) => {
    listContainer.innerHTML += `
      <article class="product
        ${product.soldout ? "soldout" : ""}
        ${product.discount ? "discount" : ""}">

        <img
          src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp"
          alt="${product.productdisplayname}"
        >

        <h3>${product.productdisplayname}</h3>

        <p>${product.brandname} - ${product.category}</p>

        <div class="product-price">
          ${
            product.discount
              ? `<p>${getDiscountPrice(product.price, product.discount)} kr.</p>
                 <p class="old-price">${product.price} kr.</p>`
              : `<p>${product.price} kr.</p>`
          }
        </div>

        <a href="product.html?id=${product.id}" class="btn">
          View Product
        </a>

        ${product.discount ? `<p class="discount_tag">SALE -${product.discount}%</p>` : ""}
        ${product.soldout ? `<p class="soldout_tag">Sold Out</p>` : ""}
      </article>
    `;
  });
}

// Beregn prisen efter rabat
function getDiscountPrice(originalPrice, discount) {
  return Math.round((originalPrice * (100 - discount)) / 100);
}
