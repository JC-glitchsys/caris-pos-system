const bcrypt = require("bcryptjs");
const pool = require("./src/config/db");

async function seed() {
    try {
        const password =await bcrypt.hash("cashier123", 10);

        await pool.query(
            'INSERT IGNORE INTO users (email, password) VALUES (?, ?)',
            ['cashier@example.com', password]
        );
       

        //PRODUCTSSSS
        const products = [

            //food
            ["Hamburger", "food", 10.99, 100], 
            ["Hotdog", "food", 19.99, 50],
            ["Fries", "food", 5.99, 200],
            ["Milkshake", "food", 15.49, 75],
            ["Pizza", "food", 20.99, 30],

            //drinks
            ["Soda", "drinks", 8.99, 150],
            [ "Lemonade", "drinks", 12.49, 80],
            ["Iced Tea", "drinks", 6.99, 120],
            ["Energy Drink", "drinks", 14.99, 60],
            ["Smoothie", "drinks", 9.49, 90],

            //snacks
            ["Chips", "snacks", 11.99, 110],
            ["Cookies", "snacks", 7.99, 130], 
            ["Candy", "snacks", 13.49, 70],
            ["Popcorn", "snacks", 4.99, 180],
            ["Brownie", "snacks", 16.99, 40],
            
        ];

        for (const product of products) {
            await pool.query(
                'INSERT INTO products (name, category, price, stock_quantity ) VALUES (?, ?, ?, ?)',
                product
            );
        }
   
       console.log("Seeding completed successfully.");

       await pool.end(); 
        } catch (error) {
            console.error("Error seeding data:", error);
            await pool.end();
        }    
        

}      

seed();