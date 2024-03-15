

const apiUrl = 'https://api.escuelajs.co/api/v1/products';


async function fetchProducts() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    console.log('Products:', products.slice(0,1));
    displayProducts(products.slice(0,10))
    // return products;
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
}



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
      productName.textContent = product.title;
      productName.classList.add('p-name')

      const productPrice = document.createElement('p');
      productPrice.textContent = `$${product.price}`;
      productPrice.classList.add('p-price')


      prodInfo.appendChild(productName)
      prodInfo.appendChild(productPrice)
      prodDetails.appendChild(prodInfo)
      prodDetails.appendChild(cartImg)

      const productImg = document.createElement('img');
      productImg.setAttribute('src',`${product.images.length >1 ? `${product.images[0]}` : `${product.images}` }`)
      console.log(product.images[0])
      let pName = product.title.split(' ')
      let lWord = pName[pName.length-1]
      productImg.setAttribute('alt',lWord)
      productImg.classList.add('p-img')

      const productDescription = document.createElement('p');
      productDescription.textContent = product.description;

      productCard.appendChild(productImg);
      productCard.appendChild(prodDetails)
      productsContainer.appendChild(productCard);
    });
  }




  fetchProducts()



  function addToCart(product) {
    const cartContainer = document.querySelector('.cart');
    cartContainer.classList.add('cart-container')
    const existingCartItem = cartContainer.querySelector(`[data-id="${product.id}"]`);

    if (existingCartItem) {
        // Increase quantity if item already exists in cart
        const quantityElement = existingCartItem.querySelector('.cart-quantity');
        let quantity = parseInt(quantityElement.textContent) + 1;
        quantityElement.textContent = quantity;
    } else {
        // Create new cart item
        const cartItem = document.createElement('div');
        cartItem.classList.add('product-card');
        cartItem.dataset.id = product.id;

        const prodInfo = document.createElement('div')
        prodInfo.classList.add('p-info-container')

        const itemName = document.createElement('h3');
        itemName.textContent = product.title;
        itemName.classList.add('p-name')

        const itemPrice = document.createElement('p');
        itemPrice.textContent = `$${product.price}`;
        itemPrice.classList.add('p-price')
        prodInfo.appendChild(itemName)
        prodInfo.appendChild(itemPrice)

        const itemImg = document.createElement('img');
        itemImg.setAttribute('src',`${product.images[0]}`)
        itemImg.classList.add('p-img')

        const itemQuantity = document.createElement('p');
        itemQuantity.classList.add('cart-quantity');
        itemQuantity.textContent = '1';

        let prodDetails = document.createElement('div') 
        prodDetails.classList.add('p-details')
        

        prodDetails.appendChild(prodInfo)
        prodDetails.appendChild(itemQuantity)

        cartItem.appendChild(itemImg)
        // cartItem.appendChild(prodInfo);
        cartItem.appendChild(prodDetails);
        // cartItem.appendChild(itemQuantity);
        
        cartContainer.appendChild(cartItem);

        calculateTotalBill();
    }
}




// function calculateTotalBill() {
//     const cartItems = document.querySelectorAll('.cart .product-card');
//     let totalAmount = 0;
//     cartItems.forEach(item => {
//         const itemPrice = parseFloat(item.querySelector('.p-price').textContent.replace('$', ''));
//         const itemQuantity = parseInt(item.querySelector('.cart-quantity').textContent);
//         totalAmount += itemPrice * itemQuantity;
//     });
//     const totalAmountContainer = document.getElementById('total-amount');
//     totalAmountContainer.innerHTML = ''; // Clear previous content
//     totalAmountContainer.classList.add('bill-container');

//     // Create elements for total text and bill amount
//     const totalText = document.createElement('span');
//     totalText.textContent = 'Total: ';
//     totalText.classList.add('total-text');

//     const billAmount = document.createElement('span');
//     billAmount.textContent = `$${totalAmount.toFixed(2)}`;
//     billAmount.classList.add('bill-amount');

//     // Append elements to the total amount container
//     totalAmountContainer.appendChild(totalText);
//     totalAmountContainer.appendChild(billAmount);
// }

function calculateTotalBill() {
    const cartItems = document.querySelectorAll('.cart .product-card');
    let totalAmount = 0;
    let itemCount = 0;

    cartItems.forEach(item => {
        const itemPrice = parseFloat(item.querySelector('.p-price').textContent.replace('$', ''));
        const itemQuantity = parseInt(item.querySelector('.cart-quantity').textContent);
        totalAmount += itemPrice * itemQuantity;
        itemCount += itemQuantity;
    });

    const totalAmountContainer = document.getElementById('total-amount');
    totalAmountContainer.innerHTML = ''; // Clear previous content
    totalAmountContainer.classList.remove('empty-cart-message');

    // Calculate average price
    const averagePrice = totalAmount / itemCount;

    // Create elements for average price, total text, and bill amount
    const averagePriceText = document.createElement('span');
    averagePriceText.textContent = `Average Price: $${averagePrice.toFixed(2)}`;
    averagePriceText.classList.add('average-price');

    const totalText = document.createElement('span');
    totalText.textContent = 'Total: ';
    totalText.classList.add('total-text');

    const billAmount = document.createElement('span');
    billAmount.textContent = `$${totalAmount.toFixed(2)}`;
    billAmount.classList.add('bill-amount');

    // Append elements to the total amount container
    totalAmountContainer.appendChild(averagePriceText);
    totalAmountContainer.appendChild(document.createElement('br'));
    totalAmountContainer.appendChild(totalText);
    totalAmountContainer.appendChild(billAmount);
}
