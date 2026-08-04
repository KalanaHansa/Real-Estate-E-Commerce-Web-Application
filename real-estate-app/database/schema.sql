-- Real Estate Database Schema
CREATE DATABASE IF NOT EXISTS real_estate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE real_estate_db;

-- Users Table (supports both email/password and Google auth)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL for Google-only users
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    auth_provider ENUM('local', 'google') DEFAULT 'local',
    firebase_uid VARCHAR(255) UNIQUE,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_firebase_uid (firebase_uid)
) ENGINE=InnoDB;

-- Provinces Table
CREATE TABLE provinces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- Districts Table
CREATE TABLE districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    province_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE,
    INDEX idx_province (province_id)
) ENGINE=InnoDB;

-- Cities Table
CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    district_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
    INDEX idx_district (district_id)
) ENGINE=InnoDB;

-- Properties Table
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type ENUM('sale', 'rent') NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    bedrooms INT,
    bathrooms INT,
    area_sqft DECIMAL(10, 2),
    address TEXT NOT NULL,
    province_id INT NOT NULL,
    district_id INT NOT NULL,
    city_id INT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    images JSON, -- Array of image URLs
    features JSON, -- Array of features
    status ENUM('available', 'sold', 'rented', 'pending') DEFAULT 'available',
    owner_id INT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (district_id) REFERENCES districts(id),
    FOREIGN KEY (city_id) REFERENCES cities(id),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type_status (property_type, status),
    INDEX idx_location (province_id, district_id, city_id),
    INDEX idx_price (price),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Transactions Table (buying/renting history)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    transaction_type ENUM('buy', 'rent') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    start_date DATE,
    end_date DATE, -- For rentals
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id),
    INDEX idx_buyer (buyer_id),
    INDEX idx_seller (seller_id),
    INDEX idx_type (transaction_type)
) ENGINE=InnoDB;

-- Favorites/Wishlist
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, property_id)
) ENGINE=InnoDB;

-- Insert Sample Location Data
INSERT INTO provinces (name, code) VALUES 
('Western Province', 'WP'),
('Central Province', 'CP'),
('Southern Province', 'SP');

INSERT INTO districts (province_id, name, code) VALUES 
(1, 'Colombo', 'CO'),
(1, 'Gampaha', 'GA'),
(1, 'Kalutara', 'KT'),
(2, 'Kandy', 'KY'),
(2, 'Matale', 'MT'),
(3, 'Galle', 'GL');

INSERT INTO cities (district_id, name, code) VALUES 
(1, 'Colombo 01', 'C001'),
(1, 'Colombo 02', 'C002'),
(1, 'Colombo 03', 'C003'),
(1, 'Colombo 04', 'C004'),
(1, 'Colombo 05', 'C005'),
(2, 'Gampaha Town', 'GA01'),
(2, 'Negombo', 'GA02'),
(3, 'Kalutara Town', 'KT01'),
(4, 'Kandy City', 'KY01'),
(5, 'Matale Town', 'MT01'),
(6, 'Galle Fort', 'GL01');

INSERT INTO users (
    email, 
    password_hash, 
    full_name, 
    auth_provider, 
    role, 
    is_active,
    created_at
) VALUES (
    'kalanahansa74@gmail.com',
    '$2b$12$HYrSnDFDY3Qt27UqYUzOEOpLbFcoMqdx7mzWZDrTqmsPWBJcZXwSy', 
    'System Administrator',
    'local',
    'admin',
    TRUE,
    NOW()
);