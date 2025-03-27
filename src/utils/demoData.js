// src/utils/demoData.js
export const initializeDemoData = () => {
    // Initialize restaurants if none exist
    let restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    
    if (restaurants.length === 0) {
      const demoRestaurants = [
        {
          id: 1,
          name: 'Ocean Breeze',
          address: '123 Beach Drive',
          city: 'Miami',
          state: 'FL',
          zipCode: '33139',
          phone: '(305) 555-1234',
          email: 'info@oceanbreeze.com',
          website: 'www.oceanbreeze.com',
          description: 'Oceanfront restaurant serving fresh seafood and coastal cuisine in a relaxed atmosphere.',
          cuisine: 'Seafood',
          status: 'active'
        },
        {
          id: 2,
          name: 'Urban Spice',
          address: '456 Main Street',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          phone: '(312) 555-6789',
          email: 'info@urbanspice.com',
          website: 'www.urbanspice.com',
          description: 'Modern fusion restaurant combining international flavors with local ingredients.',
          cuisine: 'Fusion',
          status: 'active'
        }
      ];
      
      localStorage.setItem('restaurants', JSON.stringify(demoRestaurants));
      restaurants = demoRestaurants;
    }
    
    // Initialize branches if none exist
    let branches = JSON.parse(localStorage.getItem('branches') || '[]');
    
    if (branches.length === 0) {
      const demoBranches = [];
      
      restaurants.forEach(restaurant => {
        // Add downtown branch
        demoBranches.push({
          id: restaurant.id * 100 + 1,
          restaurantId: restaurant.id,
          name: `${restaurant.name} Downtown`,
          address: "123 Main Street",
          city: restaurant.city,
          state: restaurant.state,
          zipCode: restaurant.zipCode,
          phone: "(555) 123-4567",
          email: `downtown@example.com`,
          managerId: 1,
          managerName: "John Smith",
          openingTime: "08:00",
          closingTime: "22:00",
          status: "active",
          description: `Downtown branch of ${restaurant.name}`,
          tableCount: 15
        });
        
        // Add mall branch
        demoBranches.push({
          id: restaurant.id * 100 + 2,
          restaurantId: restaurant.id,
          name: `${restaurant.name} Mall`,
          address: "456 Shopping Center Blvd",
          city: restaurant.city,
          state: restaurant.state,
          zipCode: restaurant.zipCode,
          phone: "(555) 987-6543",
          email: `mall@example.com`,
          managerId: 2,
          managerName: "Sarah Johnson",
          openingTime: "10:00",
          closingTime: "21:00",
          status: "active",
          description: `Shopping mall branch of ${restaurant.name}`,
          tableCount: 12
        });
      });
      
      localStorage.setItem('branches', JSON.stringify(demoBranches));
      branches = demoBranches;
    }
    
    // Initialize tables if none exist
    let tables = JSON.parse(localStorage.getItem('tables') || '[]');
    
    if (tables.length === 0) {
      const demoTables = [];
      
      branches.forEach(branch => {
        const tableCount = branch.tableCount || 10;
        
        for (let i = 1; i <= tableCount; i++) {
          demoTables.push({
            id: branch.id * 100 + i,
            branchId: branch.id,
            number: i,
            capacity: i % 3 === 0 ? 6 : (i % 2 === 0 ? 4 : 2),
            status: 'available',
            location: i <= tableCount / 2 ? 'Indoor' : 'Outdoor'
          });
        }
      });
      
      localStorage.setItem('tables', JSON.stringify(demoTables));
    }
    
    // Initialize menu items if none exist
    let menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    
    if (menuItems.length === 0) {
      const demoMenuItems = [];
      
      branches.forEach(branch => {
        const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
        
        categories.forEach((category, categoryIndex) => {
          for (let i = 1; i <= 3; i++) {
            demoMenuItems.push({
              id: branch.id * 1000 + categoryIndex * 10 + i,
              branchId: branch.id,
              name: `${category} Item ${i}`,
              description: `Delicious ${category.toLowerCase()} option ${i}`,
              price: (categoryIndex * 5 + i * 3) + 0.99,
              category: category,
              isVegetarian: i % 2 === 0,
              isVegan: i % 3 === 0,
              isGlutenFree: i % 2 === 1,
              status: 'active'
            });
          }
        });
      });
      
      localStorage.setItem('menuItems', JSON.stringify(demoMenuItems));
    }
  };