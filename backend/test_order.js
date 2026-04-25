

async function test() {
  try {
    // 1. Register or login to get token
    const loginRes = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
    
    if (!loginData.token) {
        console.log('Failed to login, trying existing user');
        const loginRes2 = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        });
        const loginData2 = await loginRes2.json();
        if (!loginData2.token) return console.log('Auth failed completely');
        loginData.token = loginData2.token;
    }

    const token = loginData.token;

    // 2. Fetch products to get a valid product_id
    const prodRes = await fetch('http://localhost:3000/products');
    const products = await prodRes.json();
    if (!products || products.length === 0) return console.log('No products found');
    
    const productId = products[0].id;

    // 3. Place order
    const orderRes = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [
          { product_id: productId, quantity: 2 }
        ]
      })
    });
    
    const orderData = await orderRes.json();
    console.log('Order Response Status:', orderRes.status);
    console.log('Order Response:', orderData);
    
  } catch (err) {
    console.error('Test error:', err);
  }
}

test();
