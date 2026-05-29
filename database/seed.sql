-- =============================================================
-- SEED DATA — Proyecto 3
-- =============================================================


-- ------------------------------------------------------------
-- Categoria (25 registros)
-- ------------------------------------------------------------
INSERT INTO categoria (nombre, descripcion) VALUES
('Zapatillas Deportivas',    'Calzado diseñado para actividades deportivas y running'),
('Zapatos Casuales',         'Calzado para uso diario y ocasiones informales'),
('Botas',                    'Calzado de caña alta para distintos usos'),
('Sandalias',                'Calzado abierto para clima cálido'),
('Zapatos Formales',         'Calzado de vestir para ocasiones formales'),
('Mocasines',                'Calzado sin cordones de estilo clásico'),
('Oxfords',                  'Zapatos de cordones de estilo formal clásico'),
('Loafers',                  'Calzado slip-on versátil'),
('Slip-On',                  'Calzado sin cordones de fácil puesta'),
('Chanclas',                 'Calzado abierto de uso playero'),
('Zapatillas de Skate',      'Calzado diseñado para skateboarding'),
('Zapatillas de Baloncesto', 'Calzado de alto rendimiento para basketball'),
('Zapatillas de Fútbol',     'Calzado con tacos para fútbol'),
('Botas de Trabajo',         'Calzado de seguridad para entornos laborales'),
('Botas Vaqueras',           'Botas de estilo western'),
('Botas Chelsea',            'Botas de caña media con elástico lateral'),
('Alpargatas',               'Calzado ligero con suela de esparto'),
('Zuecos',                   'Calzado con suela rígida'),
('Plataformas',              'Calzado con suela elevada'),
('Cuñas',                    'Calzado con tacón corrido'),
('Stilettos',                'Zapatos de tacón fino y alto'),
('Kitten Heels',             'Zapatos de tacón bajo y fino'),
('Mules',                    'Calzado sin talón'),
('Babuchas',                 'Calzado plano de punta redondeada'),
('Zapatillas de Trail',      'Calzado para correr en terrenos irregulares');


-- ------------------------------------------------------------
-- Proveedor (25 registros)
-- ------------------------------------------------------------
INSERT INTO proveedor (nombre, telefono, email) VALUES
('Nike Distribution GT',        '22001001', 'orders@nike-gt.com'),
('Adidas Centroamérica',        '22001002', 'ventas@adidas-ca.com'),
('New Balance Imports',         '22001003', 'info@nb-imports.com'),
('Puma Supply Chain GT',        '22001004', 'supply@puma-gt.com'),
('Vans Distribution CA',        '22001005', 'orders@vans-ca.com'),
('Converse Americas',           '22001006', 'ventas@converse-am.com'),
('Skechers GT Wholesale',       '22001007', 'wholesale@skechers-gt.com'),
('Reebok Distribuidora CA',     '22001008', 'dist@reebok-ca.com'),
('ASICS Import GT',             '22001009', 'imports@asics-gt.com'),
('Under Armour Supply GT',      '22001010', 'supply@ua-gt.com'),
('Timberland Importadora',      '22001011', 'info@timberland-gt.com'),
('Dr. Martens CA',              '22001012', 'orders@drmartens-ca.com'),
('Clarks Distribution GT',      '22001013', 'ventas@clarks-gt.com'),
('Birkenstock Imports CA',      '22001014', 'info@birkenstock-ca.com'),
('Crocs Centroamérica',         '22001015', 'supply@crocs-ca.com'),
('Steve Madden GT',             '22001016', 'orders@stevemadden-gt.com'),
('Tommy Hilfiger Footwear GT',  '22001017', 'ventas@tommy-gt.com'),
('Calvin Klein Shoes CA',       '22001018', 'info@ck-shoes-ca.com'),
('Guess Footwear GT',           '22001019', 'orders@guess-gt.com'),
('Lacoste Distribution GT',     '22001020', 'ventas@lacoste-gt.com'),
('Fila Imports CA',             '22001021', 'supply@fila-ca.com'),
('Brooks Running GT',           '22001022', 'info@brooks-gt.com'),
('Hoka Importadora CA',         '22001023', 'orders@hoka-ca.com'),
('On Running GT',               '22001024', 'ventas@on-gt.com'),
('Salomon Distribution CA',     '22001025', 'supply@salomon-ca.com');


-- ------------------------------------------------------------
-- Producto (25 registros)
-- ------------------------------------------------------------
INSERT INTO producto (id_categoria, id_proveedor, nombre, sku, marca, descripcion, genero, precio_actual, imagen) VALUES
(1,  1,  'Air Max 90',            'NIK-AM90',  'Nike',         'Zapatilla icónica con unidad de aire visible en talón',         'Unisex', 1350.00, 'nike_airmax90.jpg'),
(1,  2,  'Ultraboost 22',         'ADI-UB22',  'Adidas',       'Zapatilla de running con tecnología Boost de alta energía',     'Unisex', 1550.00, 'adidas_ultraboost22.jpg'),
(1,  3,  'Fresh Foam 1080v12',    'NB-FF1080', 'New Balance',  'Zapatilla de running con amortiguación máxima Fresh Foam',      'M',      1450.00, 'nb_freshfoam1080.jpg'),
(11, 5,  'Old Skool Classic',     'VAN-OS',    'Vans',         'Zapatilla de skate clásica con franja lateral',                 'Unisex', 750.00,  'vans_oldskool.jpg'),
(11, 6,  'Chuck Taylor All Star', 'CON-CTAS',  'Converse',     'Zapatilla de lona icónica de caña alta',                       'Unisex', 650.00,  'converse_chuck.jpg'),
(1,  7,  'D Lites',               'SKE-DL',    'Skechers',     'Zapatilla casual con suela chunky y plantilla Memory Foam',     'F',      680.00,  'skechers_dlites.jpg'),
(1,  8,  'Classic Leather',       'REE-CL',    'Reebok',       'Zapatilla de cuero clásica estilo retro',                      'Unisex', 720.00,  'reebok_classicleather.jpg'),
(1,  9,  'Gel-Kayano 30',         'ASI-GK30',  'ASICS',        'Zapatilla de running con soporte de pronación y gel',           'M',      1650.00, 'asics_gelkayano30.jpg'),
(1,  4,  'RS-X³ Puzzle',          'PUM-RSX3',  'Puma',         'Zapatilla lifestyle con diseño retro chunky',                   'Unisex', 890.00,  'puma_rsx3.jpg'),
(1,  10, 'HOVR Phantom 3',        'UA-HOVR3',  'Under Armour', 'Zapatilla de running con tecnología HOVR sin gravedad',         'M',      1200.00, 'ua_hovrphantom3.jpg'),
(14, 11, 'PRO 6 Inch Waterproof', 'TIM-PRO6',  'Timberland',   'Bota de trabajo impermeable resistente con puntera de acero',   'M',      1800.00, 'timberland_pro6.jpg'),
(3,  12, '1460 Smooth',           'DRM-1460S', 'Dr. Martens',  'Bota clásica de 8 ojales en cuero liso negro',                 'Unisex', 1950.00, 'drmartens_1460.jpg'),
(2,  13, 'Desert Boot',           'CLA-DB',    'Clarks',       'Botín casual de ante con suela de crepé',                      'M',      1100.00, 'clarks_desertboot.jpg'),
(4,  14, 'Arizona Soft Footbed',  'BIR-ARZ',   'Birkenstock',  'Sandalia con plantilla anatómica y dos tiras ajustables',       'Unisex', 950.00,  'birkenstock_arizona.jpg'),
(18, 15, 'Classic Clog',          'CRO-CC',    'Crocs',        'Zueco ligero y cómodo con ventilación lateral',                 'Unisex', 480.00,  'crocs_classic.jpg'),
(21, 16, 'Madden Girl Beella',    'STM-BEE',   'Steve Madden', 'Stiletto de punta fina con tacón de aguja',                    'F',      880.00,  'stevemadden_beella.jpg'),
(5,  17, 'Court Leather Oxford',  'TOM-CLO',   'Tommy Hilfiger','Oxford de cuero liso con detalle de logo en lateral',         'M',      1050.00, 'tommy_courtoxford.jpg'),
(6,  18, 'Moccasin Leather',      'CK-MOC',    'Calvin Klein', 'Mocasín de cuero suave con suela flexible',                    'M',      920.00,  'ck_moccasin.jpg'),
(2,  19, 'Noelle Platform',       'GUE-NOE',   'Guess',        'Zapatilla plataforma con logo en lateral',                     'F',      790.00,  'guess_noelle.jpg'),
(2,  20, 'Lerond Pro',            'LAC-LP',    'Lacoste',      'Zapatilla de cuero con cocodrilo bordado en lateral',           'M',      1150.00, 'lacoste_lerond.jpg'),
(1,  21, 'Disruptor II',          'FIL-DIS2',  'Fila',         'Zapatilla chunky retro con suela gruesa dentada',              'Unisex', 780.00,  'fila_disruptor2.jpg'),
(25, 22, 'Ghost 15',              'BRO-GH15',  'Brooks',       'Zapatilla de trail con amortiguación DNA Loft v3',              'Unisex', 1400.00, 'brooks_ghost15.jpg'),
(25, 23, 'Clifton 9',             'HOK-CL9',   'Hoka',         'Zapatilla maximalista con amortiguación META-Rocker',           'Unisex', 1700.00, 'hoka_clifton9.jpg'),
(1,  24, 'Cloudstratus',          'ON-CLS',    'On Running',   'Zapatilla de running con tecnología CloudTec de doble capa',    'Unisex', 1850.00, 'on_cloudstratus.jpg'),
(25, 25, 'Speedcross 6',          'SAL-SC6',   'Salomon',      'Zapatilla de trail con suela Contagrip y ajuste rápido',        'Unisex', 1600.00, 'salomon_speedcross6.jpg');


-- ------------------------------------------------------------
-- ProductoVariante (25 registros)
-- ------------------------------------------------------------
INSERT INTO producto_variante (id_producto, talla, color, peso, alto, ancho, largo, stock_total) VALUES
(1,  '42', 'Blanco/Negro',  0.35, 12.0, 10.0, 29.0, 20),
(1,  '44', 'Blanco/Negro',  0.38, 12.5, 10.5, 30.0, 15),
(2,  '41', 'Negro/Blanco',  0.32, 13.0, 10.0, 28.0, 18),
(2,  '43', 'Gris/Naranja',  0.34, 13.0, 10.5, 29.0, 12),
(3,  '42', 'Blanco',        0.36, 13.5, 10.0, 29.0, 10),
(4,  '40', 'Negro',         0.28, 11.0,  9.5, 27.0, 25),
(4,  '42', 'Blanco/Negro',  0.30, 11.0,  9.5, 28.0, 22),
(5,  '38', 'Rojo',          0.25, 18.0,  9.0, 27.0, 30),
(5,  '40', 'Negro',         0.27, 18.5,  9.5, 28.0, 28),
(6,  '37', 'Blanco/Rosa',   0.30, 12.0,  9.0, 26.0, 15),
(7,  '41', 'Blanco',        0.33, 12.0, 10.0, 28.0, 20),
(8,  '43', 'Azul/Amarillo', 0.38, 13.5, 10.5, 30.0,  8),
(9,  '42', 'Blanco/Gris',   0.40, 13.0, 10.5, 29.0, 14),
(10, '44', 'Negro/Rojo',    0.37, 13.0, 11.0, 30.0, 10),
(11, '42', 'Trigo',         0.95, 16.0, 11.0, 30.0,  6),
(12, '40', 'Negro',         1.05, 17.0, 10.5, 29.0,  9),
(13, '42', 'Arena',         0.55, 13.0, 10.0, 29.0, 12),
(14, '39', 'Marrón',        0.45, 10.0, 10.0, 27.0, 18),
(15, '42', 'Negro',         0.28,  9.0, 10.5, 28.0, 35),
(16, '37', 'Nude',          0.32, 10.0,  8.5, 25.0, 11),
(17, '43', 'Marrón',        0.52, 12.0, 10.5, 30.0,  8),
(18, '41', 'Cognac',        0.48, 11.5, 10.0, 28.0, 13),
(19, '38', 'Blanco/Dorado', 0.35, 12.0,  9.0, 26.0, 16),
(20, '42', 'Blanco',        0.40, 12.0, 10.0, 28.0, 20),
(25, '43', 'Negro/Rojo',    0.45, 13.5, 10.5, 30.0,  7);


-- ------------------------------------------------------------
-- Empleado (25 registros)
-- ------------------------------------------------------------
INSERT INTO empleado (nombre, telefono, email, fecha_contra) VALUES
('Carlos García',     '55551001', 'carlos.garcia@zapateria.com',  '2022-01-10'),
('María López',       '55551002', 'maria.lopez@zapateria.com',    '2022-03-15'),
('José Martínez',     '55551003', 'jose.martinez@zapateria.com',  '2021-06-01'),
('Ana Ramírez',       '55551004', 'ana.ramirez@zapateria.com',    '2023-02-20'),
('Luis Hernández',    '55551005', 'luis.hernandez@zapateria.com', '2022-08-05'),
('Sofía Torres',      '55551006', 'sofia.torres@zapateria.com',   '2023-05-10'),
('Diego Flores',      '55551007', 'diego.flores@zapateria.com',   '2021-11-15'),
('Valentina Gil',     '55551008', 'valentina.gil@zapateria.com',  '2024-01-08'),
('Fernando Mora',     '55551009', 'fernando.mora@zapateria.com',  '2020-04-01'),
('Isabella Vargas',   '55551010', 'isabella.v@zapateria.com',     '2022-09-12'),
('Andrés Peña',       '55551011', 'andres.pena@zapateria.com',    '2023-07-18'),
('Camila Ruiz',       '55551012', 'camila.ruiz@zapateria.com',    '2023-10-01'),
('Ricardo Solís',     '55551013', 'ricardo.solis@zapateria.com',  '2021-03-22'),
('Gabriela Castro',   '55551014', 'gabriela.c@zapateria.com',     '2020-12-05'),
('Miguel Díaz',       '55551015', 'miguel.diaz@zapateria.com',    '2024-02-14'),
('Paola Estrada',     '55551016', 'paola.estrada@zapateria.com',  '2022-06-30'),
('Sebastián Fuentes', '55551017', 'sebastian.f@zapateria.com',    '2023-11-11'),
('Laura Godínez',     '55551018', 'laura.godinez@zapateria.com',  '2021-08-19'),
('Héctor Ibáñez',     '55551019', 'hector.i@zapateria.com',       '2024-03-01'),
('Natalia Juárez',    '55551020', 'natalia.j@zapateria.com',      '2022-05-25'),
('Emilio Klee',       '55551021', 'emilio.klee@zapateria.com',    '2023-04-07'),
('Daniela Luna',      '55551022', 'daniela.luna@zapateria.com',   '2022-07-13'),
('Rodrigo Méndez',    '55551023', 'rodrigo.m@zapateria.com',      '2024-01-22'),
('Valeria Nieto',     '55551024', 'valeria.n@zapateria.com',      '2020-09-09'),
('Tomás Ordóñez',     '55551025', 'tomas.o@zapateria.com',        '2019-06-15');


-- ------------------------------------------------------------
-- Cliente (25 registros)
-- ------------------------------------------------------------
INSERT INTO cliente (nombre, telefono, email) VALUES
('Pedro Alvarado',    '44441001', 'pedro.alvarado@gmail.com'),
('Lucía Mendoza',     '44441002', 'lucia.mendoza@gmail.com'),
('Roberto Castillo',  '44441003', 'roberto.castillo@gmail.com'),
('Elena Morales',     '44441004', 'elena.morales@gmail.com'),
('Francisco Reyes',   '44441005', 'francisco.reyes@gmail.com'),
('Adriana Soto',      '44441006', 'adriana.soto@gmail.com'),
('Marco Jiménez',     '44441007', 'marco.jimenez@gmail.com'),
('Gloria Fuentes',    '44441008', 'gloria.fuentes@gmail.com'),
('Arturo Vásquez',    '44441009', 'arturo.vasquez@gmail.com'),
('Carmen Salazar',    '44441010', 'carmen.salazar@gmail.com'),
('Jorge Aguilar',     '44441011', 'jorge.aguilar@gmail.com'),
('Patricia Ortiz',    '44441012', 'patricia.ortiz@gmail.com'),
('Manuel Cruz',       '44441013', 'manuel.cruz@gmail.com'),
('Sandra Ramos',      '44441014', 'sandra.ramos@gmail.com'),
('Eduardo Pineda',    '44441015', 'eduardo.pineda@gmail.com'),
('Mónica Leiva',      '44441016', 'monica.leiva@gmail.com'),
('Gustavo Chávez',    '44441017', 'gustavo.chavez@gmail.com'),
('Rosa Méndez',       '44441018', 'rosa.mendez@gmail.com'),
('Alejandro Barrios', '44441019', 'alex.barrios@gmail.com'),
('Silvia Orellana',   '44441020', 'silvia.orellana@gmail.com'),
('Hugo Monzón',       '44441021', 'hugo.monzon@gmail.com'),
('Irma Gudiel',       '44441022', 'irma.gudiel@gmail.com'),
('Raúl Cifuentes',    '44441023', 'raul.cifuentes@gmail.com'),
('Blanca Tórtola',    '44441024', 'blanca.tortola@gmail.com'),
('Nelson Cabrera',    '44441025', 'nelson.cabrera@gmail.com');


-- ------------------------------------------------------------
-- Venta (25 registros)
-- ------------------------------------------------------------
INSERT INTO venta (id_cliente, id_empleado, fecha, metodo_pago) VALUES
(1,  1, '2025-01-05 09:15:00', 'Efectivo'),
(2,  2, '2025-01-08 10:30:00', 'Tarjeta'),
(3,  3, '2025-01-12 11:00:00', 'Efectivo'),
(4,  1, '2025-01-15 14:20:00', 'Tarjeta'),
(5,  4, '2025-01-20 16:45:00', 'Efectivo'),
(6,  2, '2025-02-02 09:00:00', 'Tarjeta'),
(7,  5, '2025-02-10 10:10:00', 'Efectivo'),
(8,  1, '2025-02-14 13:30:00', 'Tarjeta'),
(9,  3, '2025-02-18 15:00:00', 'Efectivo'),
(10, 6, '2025-02-25 11:45:00', 'Tarjeta'),
(11, 2, '2025-03-01 09:30:00', 'Efectivo'),
(12, 4, '2025-03-05 10:00:00', 'Tarjeta'),
(13, 1, '2025-03-10 12:15:00', 'Efectivo'),
(14, 7, '2025-03-15 14:00:00', 'Tarjeta'),
(15, 5, '2025-03-20 16:30:00', 'Efectivo'),
(16, 2, '2025-04-01 09:00:00', 'Tarjeta'),
(17, 6, '2025-04-05 10:30:00', 'Efectivo'),
(18, 3, '2025-04-10 11:00:00', 'Tarjeta'),
(19, 1, '2025-04-15 13:45:00', 'Efectivo'),
(20, 4, '2025-04-20 15:15:00', 'Tarjeta'),
(21, 2, '2025-05-02 09:00:00', 'Efectivo'),
(22, 5, '2025-05-08 10:45:00', 'Tarjeta'),
(23, 1, '2025-05-12 12:00:00', 'Efectivo'),
(24, 3, '2025-05-18 14:30:00', 'Tarjeta'),
(25, 6, '2025-05-25 16:00:00', 'Efectivo');


-- ------------------------------------------------------------
-- DetalleVenta (25 registros)
-- ------------------------------------------------------------
INSERT INTO detalle_venta (id_venta, id_variante, cantidad, precio_unitario) VALUES
(1,  1,  1, 1350.00),
(2,  3,  1, 1550.00),
(3,  15, 1, 1800.00),
(4,  10, 1,  680.00),
(5,  8,  1,  650.00),
(6,  6,  1,  750.00),
(7,  14, 1, 1200.00),
(8,  11, 1,  720.00),
(9,  16, 1, 1950.00),
(10, 7,  1,  750.00),
(11, 4,  1, 1550.00),
(12, 17, 1, 1100.00),
(13, 9,  1,  650.00),
(14, 12, 1, 1650.00),
(15, 2,  1, 1350.00),
(16, 18, 1,  950.00),
(17, 13, 1,  890.00),
(18, 19, 1,  480.00),
(19, 20, 1,  880.00),
(20, 5,  1, 1450.00),
(21, 21, 1, 1050.00),
(22, 22, 1,  920.00),
(23, 23, 1,  790.00),
(24, 24, 1, 1150.00),
(25, 25, 1, 1600.00);


-- ------------------------------------------------------------
-- Usuarios de prueba — 1 por cada rol
-- ------------------------------------------------------------
INSERT INTO usuario (username, password_hash, rol) VALUES
('proy3',           '$2a$10$wyvK2hTdCsB5/Z/LX4d0YOhRfqO7wHkEeVvmeddgex19t1xboJCVm', 'admin'),
('admin_user',      '$2a$10$H3Zusv1y2ACdOMtorWqXWekbeZjjtprgL8ACSX5lCykAHWEQ483ya', 'admin'),
('vendedor_user',   '$2a$10$39.14y7ioPN4a5zKZLTNnOkgw0/cokJGfjgujojtdlzTgn2.X/blu', 'vendedor'),
('inventario_user', '$2a$10$1DI0CX7eKwyyHXL5bNFhPeOyBFhMt/99nYy6FaaaP66smw6JjyBti', 'inventario'),
('reportes_user',   '$2a$10$ugWUZW3bViJWzrj4YKaDiuqE2iUWcUqPegLcn0jAU320XtjgOclhG', 'reportes'),
('cliente_user',    '$2a$10$sqbEuLaasibCNThRPR4BrO.UTQFWKbawJn.QF2RvHNQg4Q4qX03Qi', 'cliente_web');
