

const apiUrl = "https://api.pexels.com/v1/search?query=chair"
const apiKey = 'kyPF1NsYrDyjA9ndRgNhJpj1TA6nc7Qxqquhk4uM7BMzgH0OXzNzVvzg';


  fetch(apiUrl,{
    headers:{
      'Authorization' : apiKey
    }
  })
  .then(response=>response.json())
  .then(data=>{
    console.log(data.photos)
    displayProducts(data.photos.slice(0,5))
  })
//   try {
//     const response = await fetch(apiUrl,
//     });
//     if (!response.ok) {
//       throw new Error('Failed to fetch products');
//     }
//     const products = await response.json();
//     console.log('Products:', products.slice(0,1));
//     displayProducts(products.slice(0,10))
//     // return products;
//   } catch (error) {
//     console.error('Error fetching products:', error.message);
//   }




function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.classList.add('prod-container')
    productsContainer.innerHTML = '';

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.id = `${product.id}`
      productCard.classList.add('product-card');

      // Create elements for product details

      const prodDetails = document.createElement('div') 
      prodDetails.classList.add('p-details')

      const cartImg = document.createElement('img')
      cartImg.setAttribute('src','https://res.cloudinary.com/dqnqix89g/image/upload/v1710494032/add-to-cart_r3ccgy.jpg')
      cartImg.classList.add('cart-img')

      cartImg.addEventListener('click', () => addToCart(product));


      const prodInfo = document.createElement('div')
      prodInfo.classList.add('p-info-container')

      const productName = document.createElement('h3');
      productName.textContent = product.alt;
      productName.classList.add('p-name')

      const productPrice = document.createElement('p');
      productPrice.textContent = `Rs${product.height}`;
      productPrice.classList.add('p-price')


      prodInfo.appendChild(productName)
      prodInfo.appendChild(productPrice)
      prodDetails.appendChild(prodInfo)
      prodDetails.appendChild(cartImg)

      const productImg = document.createElement('img');
      productImg.setAttribute('src',product.src.medium)
      // console.log(product.images[0])
      // let pName = product.title.split(' ')
      // let lWord = pName[pName.length-1]
      productImg.setAttribute('alt',product.photographer)
      productImg.classList.add('p-img')

      const productDescription = document.createElement('p');
      productDescription.textContent = product.description;

      productCard.appendChild(productImg);
      productCard.appendChild(prodDetails)
      productsContainer.appendChild(productCard);
    });
  }




  // fetchProducts()



  function addToCart(product) {
    const cartContainer = document.querySelector('.cart');
    cartContainer.classList.add('cart-container');
    const existingCartItem = cartContainer.querySelector(`[data-id="${product.id}"]`);

  

    if (existingCartItem) {
        // Increase quantity if item already exists in cart
        const quantityElement = existingCartItem.querySelector('.cart-quantity');
        let quantity = parseInt(quantityElement.textContent.replace('Qty: ', '')); // Extract numeric value and parse as integer
        quantity = isNaN(quantity) ? 1 : quantity; // If NaN, default to 1
        quantity++;
        quantityElement.textContent = `Qty: ${quantity}`;
        calculateTotalBill();
    } else {
        // Create new cart item
        const cartItem = document.createElement('div');
        cartItem.classList.add('product-card');
        cartItem.dataset.id = product.id;

        const prodInfo = document.createElement('div');
        prodInfo.classList.add('p-info-container');

        const itemName = document.createElement('h3');
        let text = product.alt.split(' ').slice(0,5).join(' ')
        console.log(text)
        itemName.textContent = text;
        itemName.classList.add('p-name');

        const itemPrice = document.createElement('p');
        itemPrice.textContent = `Rs${product.height}`;
        itemPrice.classList.add('p-price');
        prodInfo.appendChild(itemName);
        prodInfo.appendChild(itemPrice);

        const itemImg = document.createElement('img');
        itemImg.setAttribute('src', `${product.src.medium}`);
        itemImg.classList.add('p-img');

        const prodDetails = document.createElement('div');
        prodDetails.classList.add('p-details');

        prodDetails.appendChild(prodInfo);
        cartItem.appendChild(itemImg);

        // Initialize quantity to 1
        const itemQuantity = document.createElement('p');
        itemQuantity.classList.add('cart-quantity');
        itemQuantity.textContent = 'Qty: 1';
        // prodInfo.appendChild(itemQuantity)

        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => removeFromCart(cartItem));
        const prodDesc = document.createElement('div')
        prodDesc.classList.add('prod-desc')
        // const qtyText = document.createTextNode('Qty: ');

        prodDesc.appendChild(prodDetails)
        // prodDesc.appendChild(qtyText)
        prodDesc.appendChild(itemQuantity)
        prodDesc.appendChild(removeButton)

        cartItem.appendChild(prodDesc);
        // cartItem.appendChild(itemQuantity);
        // cartItem.appendChild(removeButton)
        cartContainer.appendChild(cartItem);

        calculateTotalBill();
        
    }
    
}

function removeFromCart(cartItem) {
  cartItem.remove();
  calculateTotalBill();


}

function calculateTotalBill() {
  const cartItems = document.querySelectorAll('.cart .product-card');
  let totalAmount = 0;
  let itemCount = 0;

  cartItems.forEach(item => {
      const itemPrice = parseFloat(item.querySelector('.p-price').textContent.replace('Rs', ''));
      let itemQuantity = parseInt(item.querySelector('.cart-quantity').textContent.replace('Qty: ', ''), 10);
      itemQuantity = isNaN(itemQuantity) ? 1 : itemQuantity; // If NaN, default to 1
      totalAmount += itemPrice * itemQuantity;
      itemCount += itemQuantity;
  });

  const totalAmountContainer = document.getElementById('total-amount');
  totalAmountContainer.innerHTML = ''; // Clear previous content
  totalAmountContainer.classList.remove('empty-cart-message');

  // Calculate average price
  const averagePrice = itemCount === 0 ? 0 : totalAmount / itemCount;

  // Create elements for average price, total text, and bill amount
  const averagePriceText = document.createElement('span');
  averagePriceText.textContent = `Average Price: Rs${averagePrice.toFixed(2)}`;
  averagePriceText.classList.add('average-price');

  const totalText = document.createElement('span');
  totalText.textContent = `Total Price: Rs${totalAmount.toFixed(2)}`;
  totalText.classList.add('total-text');

  // Append elements to the total amount container
  totalAmountContainer.appendChild(totalText);
  totalAmountContainer.appendChild(document.createElement('hr'));
  totalAmountContainer.appendChild(averagePriceText);
  totalAmountContainer.appendChild(document.createElement('hr'));
}

const clearCartButton = document.getElementById('clear-cart-btn');
clearCartButton.addEventListener('click', () => {
    const cartContainer = document.querySelector('.cart');
    cartContainer.innerHTML = ''; // Clear cart items
    calculateTotalBill(); // Update cart summary
});

const sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', () => {
    const cartItems = document.querySelectorAll('.cart .product-card');
    const sortedItems = Array.from(cartItems).sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.p-price').textContent.replace('Rs', ''));
        const priceB = parseFloat(b.querySelector('.p-price').textContent.replace('Rs', ''));
        return sortSelect.value === 'low-to-high' ? priceA - priceB : priceB - priceA;
    });
    const cartContainer = document.querySelector('.cart');
    cartContainer.innerHTML = ''; // Clear existing items
    sortedItems.forEach(item => {
        cartContainer.appendChild(item); // Append sorted items
    });
    calculateTotalBill(); // Update cart summary
});

// const sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', () => {
    const cartItems = document.querySelectorAll('.cart .product-card');
    const sortedItems = Array.from(cartItems).sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.p-price').textContent.replace('Rs', ''));
        const priceB = parseFloat(b.querySelector('.p-price').textContent.replace('Rs', ''));
        return sortSelect.value === 'low-to-high' ? priceA - priceB : priceB - priceA;
    });
    const cartContainer = document.querySelector('.cart');
    cartContainer.innerHTML = ''; // Clear existing items
    sortedItems.forEach(item => {
        cartContainer.appendChild(item); // Append sorted items
    });
    calculateTotalBill(); // Update cart summary
});

const filterButton = document.getElementById('filter-btn');
filterButton.addEventListener('click', () => {
    const filterInput = document.getElementById('filter-input');
    const filterPrice = parseFloat(filterInput.value);
    if (!isNaN(filterPrice)) {
        const cartItems = document.querySelectorAll('.cart .product-card');
        cartItems.forEach(item => {
            const itemPrice = parseFloat(item.querySelector('.p-price').textContent.replace('Rs', ''));
            if (itemPrice <= filterPrice) {
                item.style.display = 'block'; // Show items that match the entered price or are below it
            } else {
                item.style.display = 'none'; // Hide items that are above the entered price
            }
        });
    } else {
        alert('Please enter a valid price for filtering.');
    }
});
const clearFilterButton = document.getElementById('clear-filter-btn');
clearFilterButton.addEventListener('click', () => {
    const cartItems = document.querySelectorAll('.cart .product-card');
    cartItems.forEach(item => {
        item.style.display = 'block'; // Make all items in the cart visible again
    });
    document.getElementById('filter-input').value = ''; // Clear the filter input
});



