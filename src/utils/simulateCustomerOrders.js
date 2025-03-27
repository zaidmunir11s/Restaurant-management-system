// src/utils/simulateCustomerOrders.js
/**
 * This is a utility function that can be used to simulate customer orders
 * for testing purposes. It should be called from the browser console.
 */
export const simulateCustomerOrder = (branchId = 1) => {
    // Get menu items
    const menuItems = JSON.parse(localStorage.getItem(`branch_menu_${branchId}`) || '[]');
    
    if (menuItems.length === 0) {
      console.error('No menu items found for this branch');
      return;
    }
    
    // Generate a random order with 1-5 items
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const orderItems = [];
    
    for (let i = 0; i < itemCount; i++) {
      // Pick a random menu item
      const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
      
      // Check if item already exists in order
      const existingItem = orderItems.find(item => item.menuItemId === randomItem.id);
      
      if (existingItem) {
        // Update quantity
        existingItem.quantity += 1;
        existingItem.amount = (parseFloat(randomItem.price) * existingItem.quantity).toFixed(2);
      } else {
        // Add new item
        orderItems.push({
          id: Date.now() + i,
          menuItemId: randomItem.id,
          name: randomItem.name,
          price: randomItem.price,
          quantity: 1,
          amount: randomItem.price
        });
      }
    }
    
    // Calculate total
    const total = orderItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
    // Create order
    const order = {
      id: Date.now(),
      branchId,
      timestamp: new Date().toISOString(),
      customerName: `Customer ${Math.floor(Math.random() * 100)}`,
      items: orderItems,
      status: 'pending',
      total
    };
    
    // Save to localStorage
    const incomingOrders = JSON.parse(localStorage.getItem(`branch_incoming_orders_${branchId}`) || '[]');
    localStorage.setItem(`branch_incoming_orders_${branchId}`, JSON.stringify([...incomingOrders, order]));
    
    console.log('New order created:', order);
    return order;
  };
  
  // Expose to window for testing
  if (typeof window !== 'undefined') {
    window.simulateCustomerOrder = simulateCustomerOrder;
  }