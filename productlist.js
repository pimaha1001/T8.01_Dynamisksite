"use strict";

const productURL = "https://kea-alt-del.dk/t7/api/products?limit=100";

const listContainer = document.querySelector(".product_list_container");
const categoryTitle = document.querySelector("#category-title");

// Hent category fra URL'en
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

let url;

// Hvis der er en kategori i URL'en
if (category) {
  url = `${productURL}?category=${encodeURIComponent(category)}`;
  categoryTitle.textContent = category;
} else {
  // Hvis der IKKE er en kategori, hent alle produkter
  url = productURL;
  categoryTitle.textContent = "All Products";
}

getData(url);

function getData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => showProducts(data));
}

function showProducts(products) {
  console.log("Products:", products);

  listContainer.innerHTML = "";

  products.forEach((product) => {
    listContainer.innerHTML += `
      <article class="product ${product.soldout ? "soldout" : ""}">

        <img 
          src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp"
          alt="${product.productdisplayname}"
        >

        <h3>${product.productdisplayname}</h3>

        <p>${product.brandname} - ${product.category}</p>

        <div class="product-price">
          <p>${product.price} kr.</p>
        </div>

        <a href="product.html?id=${product.id}" class="btn">
          View Product
        </a>

        ${product.soldout ? `<p class="soldout_tag">Sold Out</p>` : ""}

      </article>
    `;
  });
}
