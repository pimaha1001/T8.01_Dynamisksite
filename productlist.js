"use strict";

const productURL = "https://kea-alt-del.dk/t7/api/products?limit=100";

const listContainer = document.querySelector(".product_list_container");
const categoryTitle = document.querySelector("#category-title");
const filterButtons = document.querySelectorAll(".btn_container button");

// Hent category fra URL'en
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

// Gem alle produkterne fra API'et her, så de kan filtreres
let allData = [];

// Vis alle køn som standard
let selectedGender = "All";

// Hvis der er en kategori i URL'en, hentes kun den kategori
let url;

if (category) {
  url = `${productURL}&category=${encodeURIComponent(category)}`;
  categoryTitle.textContent = category;
} else {
  // Hvis der ikke er en kategori i URL'en, hentes alle produkter
  url = productURL;
  categoryTitle.textContent = "All Products";
}

// Gør filterknapperne klikbare
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Hent filterværdien fra knappens data-filter
    selectedGender = button.dataset.filter;

    // Markér den valgte filterknap som aktiv
    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("active", filterButton === button);
    });

    // Vis produkterne, der passer til det valgte filter
    filterSelection();
  });
});

// Hent produkterne fra API'et
getData(url);

function getData(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API-fejl: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      // Gem API-dataene, så filterfunktionen kan bruge dem
      allData = data;

      // Vis produkterne med det valgte filter
      filterSelection();
    })
    .catch((error) => {
      console.error("Kunne ikke hente produkter:", error);
      listContainer.textContent = "Produkterne kunne ikke indlæses.";
    });
}

function filterSelection() {
  // Vis alle produkter eller filtrér på det valgte køn
  const filteredProducts = selectedGender === "All" ? allData : allData.filter((product) => product.gender === selectedGender);

  showProducts(filteredProducts);
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
