 let allProducts = [];
let filteredProducts = [];

const container = document.getElementById("products");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("error");
const searchInput = document.getElementById("search");

//  Fetch Data
async function fetchProducts() {
  try {
    loader.style.display = "block";

    let res = await fetch("https://fakestoreapi.com/products");
    let data = await res.json();

    allProducts = data;
    filteredProducts = [...data];

    displayProducts(filteredProducts);

    loader.style.display = "none";
  } catch (error) {
    loader.style.display = "none";
    errorMsg.innerText = "Error loading data";
  }
}

//  Home Reset
function goHome() {
  searchInput.value = "";
  document.getElementById("category").value = "all";

  filteredProducts = [...allProducts];
  displayProducts(filteredProducts);
}

//  Dark Mode
function toggleDark() {
  document.body.classList.toggle("dark");
}

//  Display Products
function displayProducts(products) {
  container.innerHTML = "";

  //  Show message if no products
  if (products.length === 0) {
    container.innerHTML = "<h2 style='text-align:center;'>No products found </h2>";
    return;
  }

  products.forEach(product => {
    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.image}" />
      <h4>${product.title.substring(0, 20)}...</h4>
      <p>${product.description.substring(0, 60)}...</p>
      <button class="price">$${product.price}</button>
      <br/>
      <button onclick="viewDetails(${product.id})">View More</button>
    `;

    container.appendChild(card);
  });
}

function applyFilters() {
  let searchValue = searchInput.value.toLowerCase();
  let category = document.getElementById("category").value;

  let temp = allProducts.filter(product => {
    let matchesSearch =
      product.title.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue);

    let matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  filteredProducts = temp;
  displayProducts(filteredProducts);
}

//  Search
searchInput.addEventListener("input", applyFilters);

//  Category Filter
function filterCategory() {
  applyFilters();
}

//  Sort Low → High
function sortLowToHigh() {
  filteredProducts.sort((a, b) => a.price - b.price);
  displayProducts(filteredProducts);
}

//  Sort High → Low
function sortHighToLow() {
  filteredProducts.sort((a, b) => b.price - a.price);
  displayProducts(filteredProducts);
}

//  View More
function viewDetails(id) {
  let product = allProducts.find(p => p.id === id);

  document.getElementById("modalData").innerHTML = `
    <h3>${product.title}</h3>
    <img src="${product.image}" style="height:150px"/>
    <p>${product.description}</p>
    <h4>Price: $${product.price}</h4>
    <p>Category: ${product.category}</p>
  `;

  document.getElementById("modal").style.display = "block";
}

//  Close Modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

 
fetchProducts();