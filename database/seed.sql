-- ShopAI Seed Data
-- Run after schema.sql: mysql -u root -p shopai < seed.sql

USE shopai;

-- Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Gadgets and electronic devices'),
('Audio', 'Headphones, speakers, earbuds'),
('Wearables', 'Smartwatches and fitness bands'),
('Laptops', 'Laptops and notebooks'),
('Smartphones', 'Mobile phones'),
('Gaming', 'Gaming accessories and consoles'),
('Cameras', 'Digital cameras and accessories'),
('Accessories', 'Tech accessories');

-- Products
INSERT INTO products (name, description, price, original_price, stock, category_id, image_url, rating) VALUES
('ProBass Wireless Headphones', 'Premium sound, 40hr battery, noise cancellation', 1899.00, 3499.00, 50, 2, '/images/headphones.png', 4.5),
('FitPulse X2 Smartwatch', 'Health tracking, GPS, 7-day battery', 4599.00, 7999.00, 30, 3, '/images/watch.png', 4.3),
('UltraBook Pro 15', 'Intel i7, 16GB RAM, 512GB SSD, FHD Display', 52999.00, 69000.00, 20, 4, '/images/laptop.png', 4.7),
('Nova 12 Ultra Smartphone', '108MP camera, 5G, 5000mAh', 24999.00, 32000.00, 40, 5, '/images/phone.png', 4.4),
('GameZone Pro Controller', 'Wireless, RGB, compatible with PC/PS', 2299.00, 3999.00, 60, 6, '/images/controller.png', 4.2),
('SnapPro 4K Camera', '4K video, 24MP, Wi-Fi enabled', 18499.00, 24000.00, 15, 7, '/images/camera.png', 4.6),
('SoundBox 360 Speaker', '360 surround sound, waterproof', 3199.00, 5500.00, 35, 2, '/images/speaker.png', 4.1),
('ViewMax 27" Monitor', '4K IPS, 144Hz, HDR support', 15999.00, 21000.00, 25, 1, '/images/monitor.png', 4.5),
('Tech Backpack Pro', 'Anti-theft, USB charging port, waterproof', 1499.00, 2500.00, 70, 8, '/images/bag.png', 4.0),
('Wireless Mouse X200', 'Ergonomic, 2.4GHz, 18 month battery', 699.00, 1200.00, 100, 8, '/images/mouse.png', 4.3);

-- Sample admin user (password: admin123 - bcrypt encoded)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@shopai.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lihO', 'ADMIN');

-- Product associations (people also bought)
INSERT INTO product_associations (product_id, associated_product_id, confidence_score) VALUES
(3, 9, 0.85), -- Laptop → Backpack
(3, 10, 0.80), -- Laptop → Mouse
(3, 8, 0.75), -- Laptop → Monitor
(1, 7, 0.70), -- Headphones → Speaker
(4, 1, 0.65); -- Phone → Headphones
