const params = new URLSearchParams(window.location.search);
const selectedID = params.get("id");

console.log("selectedID", selectedID);

const detailURL = `https://kea-alt-del.dk/t7/api/products/${selectedID}`;

console.log("detailURL", detailURL);

function loadData(url) {
  fetch(url).then((response) => {
    response.json().then((data) => {
      showDetails(data);
    });
  });
}

function showDetails(detail) {
  console.log("detail", detail);

  // IMAGE
  document.querySelector(".detail-image").src = `https://kea-alt-del.dk/t7/images/webp/640/${detail.id}.webp`;

  document.querySelector(".detail-image").alt = detail.productdisplayname;

  // PRODUCT INFORMATION
  document.querySelector(".detail-model").textContent = detail.productdisplayname;

  document.querySelector(".detail-color").textContent = detail.basecolour;

  document.querySelector(".detail-id").textContent = detail.id;

  // BRAND
  document.querySelector(".detail-brand").textContent = detail.brandname;

  document.querySelector(".detail-brand-text").textContent = detail.brandname;

  // BUY BOX
  document.querySelector(".detail-name").textContent = detail.productdisplayname;

  document.querySelector(".detail-brand-category").textContent = detail.brandname;

  document.querySelector(".detail-category").textContent = detail.category;

  // PRICE
  if (detail.discount) {
    document.querySelector(".detail-sale-price").textContent = `${getDiscountPrice(detail.price, detail.discount)} kr.`;

    document.querySelector(".detail-original-price").textContent = `${detail.price} kr.`;

    document.querySelector(".detail-sale-tag").textContent = `SALE -${detail.discount}%`;
  } else {
    document.querySelector(".detail-sale-price").textContent = `${detail.price} kr.`;

    document.querySelector(".detail-original-price").textContent = "";
    document.querySelector(".detail-sale-tag").textContent = "";
  }

  // SOLD OUT
  if (detail.soldout) {
    document.querySelector(".detail-soldout-tag").textContent = "SOLD OUT";
  } else {
    document.querySelector(".detail-soldout-tag").textContent = "";
  }
}

function getDiscountPrice(originalPrice, discount) {
  return Math.round((originalPrice * (100 - discount)) / 100);
}

loadData(detailURL);
