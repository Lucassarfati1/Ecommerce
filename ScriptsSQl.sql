-- ========== LIMPIAR TODOS LOS DATOS ==========

-- 1. Primero eliminar todos los productos (para evitar el error de foreign key)
DELETE FROM products;

-- 2. Luego eliminar todas las categorías
DELETE FROM category;

-- 3. Reiniciar los auto_increment (opcional)
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE category AUTO_INCREMENT = 1;

-- ========== INSERTAR CATEGORÍAS DE ROPA ==========

INSERT INTO category (name, description) VALUES
('Remeras', 'Remeras de algodón, manga corta y larga'),
('Camisetas', 'Camisetas deportivas y casuales'),
('Shorts', 'Shorts de verano, deportivos y casuales'),
('Pantalones', 'Pantalones largos, jeans, chinos'),
('Camperas', 'Camperas de abrigo, impermeables, deportivas'),
('Buzos', 'Buzos con y sin capucha, deportivos'),
('Conjuntos', 'Conjuntos deportivos y casuales'),
('Zapatillas', 'Calzado deportivo y casual');

-- ========== INSERTAR PRODUCTOS DE EJEMPLO ==========

-- Remeras (id_category = 1)
INSERT INTO products (nombre, brand, unityPrice, id_category, condition) VALUES
('Remera Básica Blanca', 'Nike', 2500, 1, 'nuevo'),
('Remera Estampada Negra', 'Adidas', 3200, 1, 'nuevo'),
('Remera Manga Larga Azul', 'Puma', 2800, 1, 'nuevo'),
('Remera Oversize Gris', 'Vans', 3500, 1, 'nuevo'),
('Remera Vintage Roja', 'Converse', 4200, 1, 'nuevo');

-- Camisetas (id_category = 2)
INSERT INTO products (nombre, brand, unityPrice, id_category, condition) VALUES
('Camiseta Deportiva Dri-Fit', 'Nike', 4500, 2, 'nuevo'),
('Camiseta Running Azul', 'Adidas', 3800, 2, 'nuevo'),
('Camiseta Fitness Negra', 'Under Armour', 5200, 2, 'nuevo'),
('Camiseta Térmica Blanca', 'Puma', 4800, 2, 'nuevo');

-- Shorts (id_category = 3)
INSERT INTO products (nombre, brand, unityPrice, id_category, condition) VALUES
('Short Deportivo Negro', 'Nike', 3200, 3, 'nuevo'),
('Short Jean Azul', 'Levis', 4500, 3, 'nuevo'),
('Short Cargo Verde', 'Billabong', 3800, 3, 'nuevo'),
('Short Running Gris', 'Adidas', 2900, 3, 'nuevo');

-- Pantalones (id_category = 4)
INSERT INTO products (nombre, brand, unityPrice, id_category, condition) VALUES
('Jean Skinny Azul', 'Levis', 8500, 4, 'nuevo'),
('Pantalón Chino Beige', 'Dockers', 6200, 4, 'nuevo'),
('Pantalón Deportivo Negro', 'Nike', 5500, 4, 'nuevo'),
('Jean Recto Negro', 'Wrangler', 7200, 4, 'nuevo'),
('Pantalón Cargo Verde', 'Carhartt', 9200, 4, 'nuevo');

-- Camperas (id_category = 5)
INSERT INTO products (nombre, brand, unityPrice, id_category, condition) VALUES
('Campera Rompeviento Azul', 'Nike', 12500, 5, 'nuevo'),
('Campera de Cuero Negra', 'Zara', 25000, 5, 'nuevo'),
('Campera Inflable Roja', 'The North Face', 18500, 5, 'nuevo'),
('Campera Deportiva Gris', 'Adidas', 14200, 5, 'nuevo');

-- Buzos (id_category = 6)
INSERT INTO products (nombre, brand, unityPrice, id_category, condition) VALUES
('Buzo con Capucha Negro', 'Nike', 8500, 6, 'nuevo'),
('Buzo Canguro Gris', 'Adidas', 7200, 6, 'nuevo'),
('Buzo Sin Capucha Azul', 'Puma', 6800, 6, 'nuevo'),
('Buzo Oversize Blanco', 'Vans', 9200, 6, 'nuevo');

-- Conjuntos (id_category = 7)
INSERT INTO products (nombre, brand, unityPrice, id_category, condition) VALUES
('Conjunto Deportivo Negro', 'Nike', 15500, 7, 'nuevo'),
('Conjunto Jogging Gris', 'Adidas', 12800, 7, 'nuevo'),
('Conjunto Training Azul', 'Puma', 14200, 7, 'nuevo'),
('Conjunto Casual Beige', 'Lacoste', 18500, 7, 'nuevo');

-- Zapatillas (id_category = 8)
INSERT INTO products (nombre, brand, unityPrice, id_category, condition) VALUES
('Zapatillas Air Max Blancas', 'Nike', 25500, 8, 'nuevo'),
('Zapatillas Stan Smith', 'Adidas', 18200, 8, 'nuevo'),
('Zapatillas Chuck Taylor', 'Converse', 15800, 8, 'nuevo'),
('Zapatillas Running Negras', 'Asics', 22500, 8, 'nuevo'),
('Zapatillas Casual Grises', 'Vans', 16500, 8, 'nuevo'),
('Zapatillas Basketball', 'Jordan', 35000, 8, 'nuevo');