"use strict";

const categoryUrl = "https://kea-alt-del.dk/t7/api/categories";
const catList = document.querySelector("#category");

// Billeder til de forskellige kategorier
const categoryImages = {
  Apparel: "images/apparel.jpg",
  Accessories: "images/asseccories.jpg",
  Footwear: "images/footware.jpg",
  "Free Items": "images/freeitems.jpg",
  "Personal Care": "images/personalcare.jpg",
  "Sporting Goods": "images/sportinggoods.jpg",
};

getData();

function getData() {
  fetch(categoryUrl)
    .then((response) => response.json())
    .then((data) => showData(data));
}

function showData(data) {
  let myInnerHTML = "";

  data.forEach((cat) => {
    const image = categoryImages[cat.category];

    myInnerHTML += `
      <a 
        href="productlist.html?category=${encodeURIComponent(cat.category)}" 
        class="category-card"
      >
        <img src="${image}" alt="${cat.category}">
        <span class="category-button">${cat.category}</span>
      </a>
    `;
  });

  catList.innerHTML = myInnerHTML;
}
