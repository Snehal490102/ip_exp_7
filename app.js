const express = require('express');
const app = express();
const { products } = require('./data');

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Home route with the search functionality
app.get('/', (req, res) => {
  res.send(`
    <div style="text-align: center; background-color: #f1f1f1; padding: 20px;">
      <h1 style="color: #2c3e50;">Home Page</h1>
      <form action="/search-results" method="get" style="margin-bottom: 20px; padding: 20px; border-radius: 10px; background-color: #fff; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);">
        <label for="search" style="font-size: 18px; color: #555;">Search Products:</label><br />
        <input type="text" id="search" name="search" placeholder="Search for products..." style="width: 80%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" /><br /><br />

        <label style="font-size: 18px; color: #555;">Price Range:</label><br />
        <div style="margin: 10px 0;">
          <button type="submit" name="minPrice" value="0" data-max="10" style="background-color: #e74c3c; color: white; padding: 10px 20px; border: none; margin: 5px; border-radius: 5px; cursor: pointer;">Under $10</button>
          <button type="submit" name="minPrice" value="10" data-max="20" style="background-color: #3498db; color: white; padding: 10px 20px; border: none; margin: 5px; border-radius: 5px; cursor: pointer;">$10 - $20</button>
          <button type="submit" name="minPrice" value="20" data-max="50" style="background-color: #f39c12; color: white; padding: 10px 20px; border: none; margin: 5px; border-radius: 5px; cursor: pointer;">$20 - $50</button>
          <button type="submit" name="minPrice" value="50" data-max="100" style="background-color: #16a085; color: white; padding: 10px 20px; border: none; margin: 5px; border-radius: 5px; cursor: pointer;">$50 - $100</button>
          <button type="submit" name="minPrice" value="100" data-max="9999" style="background-color: #9b59b6; color: white; padding: 10px 20px; border: none; margin: 5px; border-radius: 5px; cursor: pointer;">Over $100</button>
        </div>
        <input type="hidden" name="maxPrice" value="" id="maxPrice" />
        <br />
        <button type="submit" style="background-color: #34495e; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Search</button>
      </form>
      <br><br>
      <a href="/api/products" style="font-size: 18px; color: #3498db; text-decoration: none; font-weight: bold;">View All Products</a>
    </div>

    <script>
      document.querySelectorAll('button[data-max]').forEach(button => {
        button.addEventListener('click', function(event) {
          document.getElementById('maxPrice').value = this.getAttribute('data-max');
        });
      });
    </script>
  `);
});

// Search results route
app.get('/search-results', (req, res) => {
  const { search, minPrice, maxPrice } = req.query;
  let sortedProducts = [...products];

  // Filter by search term (product name)
  if (search) {
    sortedProducts = sortedProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by price range (if provided)
  if (minPrice) {
    sortedProducts = sortedProducts.filter((product) => 
      product.price >= Number(minPrice)
    );
  }

  if (maxPrice) {
    sortedProducts = sortedProducts.filter((product) => 
      product.price <= Number(maxPrice)
    );
  }

  // Display search results or show "No results found"
  if (sortedProducts.length === 0) {
    res.send(`
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: #e74c3c;">No products found for your search.</h2>
        <a href="/" style="color: #3498db; text-decoration: none; font-size: 18px;">Back to Home</a>
      </div>
    `);
  } else {
    let productList = sortedProducts.map((product) => {
      return `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px;">
            <h3 style="color: #2c3e50;">${product.name}</h3>
            <img src="${product.image}" alt="${product.name}" style="width: 150px; border-radius: 5px;" />
          </td>
          <td style="padding: 10px;">
            <p style="font-size: 18px; color: #555;">Price: $${product.price}</p>
            <p style="color: #777;">${product.desc}</p>
            <a href="/api/products/${product.id}" style="color: #3498db; text-decoration: none; font-weight: bold;">View Details</a>
          </td>
        </tr>
      `;
    }).join('');

    res.send(`
      <h1 style="text-align: center; color: #2c3e50;">Search Results</h1>
      <table style="margin: 0 auto; width: 80%; border-collapse: collapse; background-color: #fff; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);">
        <thead style="background-color: #3498db; color: white;">
          <tr>
            <th style="padding: 10px;">Product</th>
            <th style="padding: 10px;">Details</th>
          </tr>
        </thead>
        <tbody>${productList}</tbody>
      </table>
      <div style="text-align: center; margin-top: 20px;">
        <a href="/" style="color: #e74c3c; text-decoration: none; font-size: 18px;">Back to Home</a>
      </div>
    `);
  }
});

// View All Products
app.get('/api/products', (req, res) => {
  let productList = products.map((product) => {
    return `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px;">
          <h3 style="color: #2c3e50;">${product.name}</h3>
          <img src="${product.image}" alt="${product.name}" style="width: 150px; border-radius: 5px;" />
        </td>
        <td style="padding: 10px;">
          <p style="font-size: 18px; color: #555;">Price: $${product.price}</p>
          <p style="color: #777;">${product.desc}</p>
          <a href="/api/products/${product.id}" style="color: #3498db; text-decoration: none; font-weight: bold;">View Details</a>
        </td>
      </tr>
    `;
  }).join('');

  res.send(`
    <h1 style="text-align: center; color: #2c3e50;">All Products</h1>
    <table style="margin: 0 auto; width: 80%; border-collapse: collapse; background-color: #fff; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);">
      <thead style="background-color: #3498db; color: white;">
        <tr>
          <th style="padding: 10px;">Product</th>
          <th style="padding: 10px;">Details</th>
        </tr>
      </thead>
      <tbody>${productList}</tbody>
    </table>
    <div style="text-align: center; margin-top: 20px;">
      <a href="/" style="color: #e74c3c; text-decoration: none; font-size: 18px;">Back to Home</a>
    </div>
  `);
});

// Particular Product Page
app.get('/api/products/:productID', (req, res) => {
  const { productID } = req.params;
  const singleProduct = products.find((product) => product.id === Number(productID));

  if (!singleProduct) {
    return res.status(404).send('Product Does Not Exist');
  }

  res.send(`
    <div style="text-align: center; background-color: #f1f1f1; padding: 20px;">
      <h1 style="color: #2c3e50;">${singleProduct.name}</h1>
      <img src="${singleProduct.image}" alt="${singleProduct.name}" style="width: 300px; border-radius: 5px;" />
      <p style="font-size: 24px; color: #555;">Price: $${singleProduct.price}</p>
      <p style="color: #777;">${singleProduct.desc}</p>
      <div style="margin-top: 20px;">
        <a href="/api/products" style="color: #3498db; text-decoration: none; font-size: 18px;">Back to Products</a>
      </div>
    </div>
  `);
});

// Get product reviews (currently a placeholder)
app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
  console.log(req.params);
  res.send('hello world');
});

// Search products using query parameters
app.get('/api/v1/query', (req, res) => {
  const { search, limit } = req.query;
  let sortedProducts = [...products];

  // Search by product name
  if (search) {
    sortedProducts = sortedProducts.filter((product) =>
      product.name.toLowerCase().startsWith(search.toLowerCase())
    );
  }

  // Limit the number of results
  if (limit) {
    sortedProducts = sortedProducts.slice(0, Number(limit));
  }

  if (sortedProducts.length < 1) {
    return res.status(200).json({ success: true, data: [] });
  }

  res.status(200).json(sortedProducts);
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the server
app.listen(5000, () => {
  console.log('Server is listening on port 5000....');
});
