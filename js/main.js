  const API_URL    = "https://fakestoreapi.com/products";
  const API_SINGLE = "https://fakestoreapi.com/products";
  const API_CATS   = "https://fakestoreapi.com/products/categories";

  let allProducts = [];

  async function loadProducts() {
    showLoading(true);
    try {
      allProducts = await (await fetch(API_URL)).json();
      const cats  = API_CATS ? await (await fetch(API_CATS)).json() : [];
      showLoading(false);
      renderFilters(cats);
      renderProducts(allProducts);
    } catch(e) { showLoading(false); showError(e.message); }
  }

  function renderFilters(cats) {
    const bar = document.getElementById("filter-bar");
    if (!cats.length) return;
    bar.innerHTML = `<button class="filter-btn active" onclick="filterBy('all',this)">الكل</button>`;
    cats.forEach(c => bar.innerHTML += `<button class="filter-btn" onclick="filterBy('${c}',this)">${c}</button>`);
  }

  function filterBy(cat, btn) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(cat === "all" ? allProducts : allProducts.filter(p => p.category === cat));
  }

  function renderProducts(products) {
    const grid = document.getElementById("products-grid");
    document.getElementById("product-count").textContent = `${products.length} منتج`;
    grid.innerHTML = "";
    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.onclick = () => showDetail(p.id);
      card.innerHTML = `
        <div class="card-img-wrap"><img src="${p.image}" loading="lazy"/></div>
        <div class="card-hover-overlay"><span>عرض التفاصيل</span></div>
        <div class="card-body">
          <div class="card-cat">${p.category||""}</div>
          <div class="card-name">${p.title}</div>
          <div class="card-price">$${p.price}</div>
          <div class="card-stars">${stars(p.rating?.rate||0)}</div>
        </div>`;
      grid.appendChild(card);
    });
  }

  async function showDetail(id) {
    document.getElementById("products-page").style.display = "none";
    showLoading(true);
    try {
      const p = await (await fetch(`${API_SINGLE}/${id}`)).json();
      showLoading(false);
      document.getElementById("d-img").src    = p.image;
      document.getElementById("d-cat").textContent    = p.category||"";
      document.getElementById("d-name").textContent   = p.title;
      document.getElementById("d-price").textContent  = `$${p.price}`;
      document.getElementById("d-desc").textContent   = p.description||"";
      document.getElementById("d-stars").textContent  = stars(p.rating?.rate||0);
      document.getElementById("d-rating").textContent = p.rating ? `${p.rating.rate}/5 ⭐ (${p.rating.count})` : "";
      document.getElementById("detail-page").style.display = "block";
      window.scrollTo(0,0);
    } catch(e) { showLoading(false); showError(e.message); }
  }

  function showProducts() {
    document.getElementById("detail-page").style.display  = "none";
    document.getElementById("products-page").style.display = "block";
    document.getElementById("error-msg").style.display    = "none";
    window.scrollTo(0,0);
  }

  function addToCart()     { alert("✅ تمت الإضافة للسلة: " + document.getElementById("d-name").textContent); }
  function addToWishlist() { alert("♡ تمت الإضافة للمفضلة: " + document.getElementById("d-name").textContent); }

  function stars(r) { return "★".repeat(Math.round(r)) + "☆".repeat(5-Math.round(r)); }
  function showLoading(v) { document.getElementById("loading").style.display = v?"block":"none"; }
  function showError(m)   { const e=document.getElementById("error-msg"); e.innerHTML=`⚠️ ${m}`; e.style.display="block"; }

  loadProducts();