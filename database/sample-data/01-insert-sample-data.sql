-- Sample Records (DML Script)

PRINT 'QUERY SAMPLE RECORD INJECTION';
-- ----------------------------------------
GO


-- 1 -> Address Table
-- ----------------------------------------
PRINT 'INJECTING ADDRESS RECORDS...';
GO

SET IDENTITY_INSERT Address ON;

INSERT INTO Address (A_ID, A_HouseNo, A_Street, A_City) VALUES
(1, '25/A', 'Galle Road', 'Colombo'),
(2, '142', 'Kandy Road', 'Kandy'),
(3, '78/B', 'Kandy Road', 'Kandy'),
(4, '234', 'Main Street', 'Negombo'),
(5, '56/1', 'Temple Road', 'Galle'),
(6, '89', 'Station Road', 'Jaffna'),
(7, '12/C', 'Beach Road', 'Matara'),
(8, '456', 'Highlands Avenue', 'Nuwara Eliya'),
(9, '23', 'Lake Side Road', 'Kurunegala'),
(10, '67/2', 'Market Street', 'Anuradhapura'),
(11, '45', 'High Level Road', 'Maharagama'),
(12, '789', 'Hospital Road', 'Batticaloa'),
(13, '101', 'University Lane', 'Peradeniya'),
(14, '5/A', 'Galle Road', 'Colombo'),
(15, '48/1', 'Old Road', 'Trincomalee');

SET IDENTITY_INSERT Address OFF;
GO

-- 2 -> Utility Table
-- ----------------------------------------
PRINT 'INJECTING UTILITY RECORDS...';
GO

SET IDENTITY_INSERT Utility ON;

INSERT INTO Utility (Ut_ID, Ut_Name, Ut_Unit, Ut_Description) VALUES
(1, 'Electricity', 'kWh', 'Electric power supply measured in kilowatt-hours'),
(2, 'Water', 'm³', 'Water supply measured in cubic meters'),
(3, 'Gas', 'm³', 'Natural gas supply measured in cubic meters');

SET IDENTITY_INSERT Utility OFF;
GO

-- 3 -> Customer Table
-- ----------------------------------------
PRINT 'INJECTING CUSTOMER RECORDS...';
GO

SET IDENTITY_INSERT Customer ON;

INSERT INTO Customer (C_ID, C_Name, C_Type, A_ID, C_Email, C_IDProof, C_RegistrationDate, C_Status) VALUES
(1, 'Nimalsiri Perera', 'Household', 1, 'nimalsiri.perera@gmail.com', '199512345678', '2025-01-15', 'Active'),
(2, 'Kamala Silva', 'Household', 2, 'kamala.silva@yahoo.com', '198723456789', '2025-02-20', 'Active'),
(3, 'Raj Industries Ltd', 'Business', 11, 'contact@rajindustries.lk', 'PV12345', '2024-11-10', 'Inactive'),
(4, 'Sunil Fernando', 'Household', 3, 'sunil.fernando@outlook.com', '199634567890', '2025-03-12', 'Active'),
(5, 'Galle Municipal Council', 'Government', 5, 'it@gallemc.gov.lk', 'GOV-GMC-001', '2024-08-05', 'Active'),
(6, 'Priya Wickramasinghe', 'Household', 4, 'priya.w@hotmail.com', '199045678901', '2025-04-18', 'Active'),
(7, 'Lanka Tech Solutions', 'Business', 14, 'admin@lankatech.lk', 'PV67890', '2025-01-25', 'Active'),
(8, 'Chandana Jayawardena', 'Household', 6, 'chandana.j@gmail.com', '198856789012', '2025-05-22', 'Active'),
(9, 'Nelum Restaurant', 'Business', 7, 'info@nelumrestaurant.lk', 'PV23456', '2024-12-01', 'Active'),
(10, 'Dilshan Rathnayake', 'Household', 8, 'dilshan.r@gmail.com', '199267890123', '2025-06-10', 'Active'),
(11, 'Anuradhapura General Hospital', 'Government', 10, 'admin@anuradhospital.gov.lk', 'GOV-AGH-002', '2024-09-15', 'Active'),
(12, 'Tharindu Gunawardena', 'Household', 9, 'tharindu.g@live.com', '199478901234', '2025-06-28', 'Active'),
(13, 'Green Valley Hotel', 'Business', 8, 'reservations@greenvalley.lk', 'PV34567', '2025-02-14', 'Active'),
(14, 'Mandani Samaraweera', 'Household', 12, 'mandani.s@yahoo.com', '198989012345', '2025-07-19', 'Inactive'),
(15, 'University of Peradeniya', 'Government', 13, 'finance@pdn.ac.lk', 'GOV-UOP-003', '2024-10-20', 'Active');

SET IDENTITY_INSERT Customer OFF;
GO

-- 4 -> Customer Phone Table
-- ----------------------------------------
PRINT 'INJECTING CUSTOMER PHONE RECORDS...';
GO

INSERT INTO CustomerPhone (C_ID, C_PhoneNo) VALUES
(1, '+94771234567'),
(1, '+94112345678'),
(2, '+94772345678'),
(3, '+94773456789'),
(3, '+94113456789'),
(4, '+94774567890'),
(5, '+94115678901'),
(5, '+94915678901'),
(6, '+94775678901'),
(7, '+94776789012'),
(7, '+94116789012'),
(8, '+94777890123'),
(9, '+94778901234'),
(9, '+94918901234'),
(10, '+94779012345'),
(11, '+94250123456'),
(11, '+94250123457'),
(12, '+94770123456'),
(13, '+94771123456'),
(13, '+94521123456'), 
(14, '+94772123456'),
(15, '+94813123456'),
(15, '+94813123457');

GO

-- 5 -> User Table
-- ----------------------------------------
PRINT 'INJECTING USER RECORDS...';
GO

SET IDENTITY_INSERT [User] ON;

INSERT INTO [User] (U_ID, U_Username, U_Password, U_FullName, U_Role, U_Phone, U_Email, A_ID, U_IDCard, U_RegistrationDate, U_Status) VALUES
(1, 'adminAshen', '$2b$10$YQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Ashen', 'Admin', '+94711111111', 'ashen@trimeter.lk', 1, 'ID1.jpg', '2024-06-01', 'Working'),
(2, 'cashierYameesha', '$2b$10$XQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Yameesha', 'Cashier', '+94712222222', 'yameesha@trimeter.lk', 2, 'ID2.jpg', '2024-07-15', 'Working'),
(3, 'cashierfernando', '$2b$10$XQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Ruwan Fernando', 'Cashier', '+94713333333', 'ruwan.f@trimeter.lk', 3, 'ID3.jpg', '2024-08-10', 'Working'),
(4, 'officerThamindu', '$2b$10$WQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Thamindu', 'Field Officer', '+94714444444', 'thamindu@trimeter.lk', 4, 'ID4.jpg', '2024-09-05', 'Working'),
(5, 'officerdissanayake', '$2b$10$WQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Saman Dissanayake', 'Field Officer', '+94715555555', 'saman.d@trimeter.lk', 5, 'ID5.jpg', '2024-10-12', 'Working'),
(6, 'officerwickrama', '$2b$10$WQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Lasitha Wickramaratne', 'Field Officer', '+94716666666', 'lasitha.w@trimeter.lk', 6, 'ID6.jpg', '2025-01-08', 'Working'),
(7, 'managerThiranya', '$2b$10$VQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Thiranya', 'Manager', '+94717777777', 'thiranya@trimeter.lk', 7, 'ID7.jpg', '2024-06-15', 'Working'),
(8, 'cashiermendis', '$2b$10$XQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Nadee Mendis', 'Cashier', '+94718888888', 'nadee.m@trimeter.lk', 9, 'ID8.jpg', '2025-02-20', 'Working'),
(9, 'officerbandara', '$2b$10$WQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Chaminda Bandara', 'Field Officer', '+94719999999', 'chaminda.b@trimeter.lk', 10, 'ID9.jpg', '2025-03-15', 'On Leave'),
(10, 'adminwijesinghe', '$2b$10$YQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Dilini Wijesinghe', 'Admin', '+94710000000', 'dilini.w@trimeter.lk', 14, 'ID10.jpg', '2024-07-01', 'Working'),
(11, 'managerrathnayake', '$2b$10$VQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Gayan Rathnayake', 'Manager', '+94710101010', 'gayan.r@trimeter.lk', 15, 'ID11.jpg', '2024-11-20', 'Working'),
(12, 'officerkarunaratne', '$2b$10$WQ7l5K8zqJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YOzJ5X3wZ3Y3Y3YO', 'Thisara Karunaratne', 'Field Officer', '+94710202020', 'thisara.k@trimeter.lk', 12, 'ID12.jpg', '2025-04-10', 'Resigned');

SET IDENTITY_INSERT [User] OFF;
GO

-- 6 -> Meter Table
-- ----------------------------------------
PRINT 'INJECTING METER RECORDS...';
GO

SET IDENTITY_INSERT Meter ON;

INSERT INTO Meter (M_ID, Ut_ID, M_Number, M_InstallationDate, M_Status) VALUES
-- Electricity
(1, 1, 'E-1', '2025-01-15', 'Active'),
(2, 1, 'E-2', '2025-02-20', 'Active'),
(3, 1, 'E-3', '2024-11-10', 'Faulty'),
(4, 1, 'E-4', '2025-03-12', 'Active'),
(5, 1, 'E-5', '2025-04-18', 'Active'),
(6, 1, 'E-6', '2025-01-25', 'Replaced'),
(7, 1, 'E-7', '2025-05-22', 'Active'),
(8, 1, 'E-8', '2025-06-10', 'Faulty'),
(9, 1, 'E-9', '2025-07-05', 'Active'),
(10, 1, 'E-10', '2024-10-20', 'Active'),

-- Water
(11, 2, 'W-1', '2025-01-20', 'Active'),
(12, 2, 'W-2', '2025-02-25', 'Active'),
(13, 2, 'W-3', '2024-08-05', 'Active'),
(14, 2, 'W-4', '2025-03-15', 'Active'),
(15, 2, 'W-5', '2024-12-01', 'Faulty'),
(16, 2, 'W-6', '2025-06-12', 'Active'),
(17, 2, 'W-7', '2024-09-15', 'Active'),
(18, 2, 'W-8', '2025-07-08', 'Active'),
(19, 2, 'W-9', '2024-10-22', 'Replaced'),
(20, 2, 'W-10', '2025-07-19', 'Faulty'),

-- Gas
(21, 3, 'G-1', '2024-11-12', 'Active'),
(22, 3, 'G-2', '2025-01-28', 'Replaced'),
(23, 3, 'G-3', '2025-02-14', 'Active'),
(24, 3, 'G-4', '2025-06-15', 'Faulty'),
(25, 3, 'G-5', '2025-03-18', 'Active'),
(26, 3, 'G-6', '2024-12-05', 'Faulty'),
(27, 3, 'G-7', '2025-05-25', 'Active'),

-- Additional meters for disconnected connections
(28, 1, 'E-11', '2024-08-15', 'Active'),
(29, 2, 'W-11', '2024-09-20', 'Active'),
(30, 3, 'G-8', '2024-10-10', 'Active');

SET IDENTITY_INSERT Meter OFF;
GO

-- 7 -> Tariff Table
-- ----------------------------------------
PRINT 'INJECTING TARIFF RECORDS...';
GO

SET IDENTITY_INSERT Tariff ON;

INSERT INTO Tariff (T_ID, Ut_ID, T_CustomerType, T_ValidFrom, T_ValidTo, T_Description) VALUES
-- Electricity Tariffs
(1, 1, 'Household', '2025-01-01', NULL, 'Domestic Electricity Tariff 2025 - Progressive slab-based pricing'),
(2, 1, 'Business', '2025-01-01', NULL, 'Commercial Electricity Tariff 2025 - Higher rates for business consumption'),
(3, 1, 'Government', '2025-01-01', NULL, 'Government Electricity Tariff 2025 - Special rates for government institutions'),

-- Water Tariffs
(4, 2, 'Household', '2025-01-01', NULL, 'Domestic Water Tariff 2025 - Flat rate with fixed monthly charge'),
(5, 2, 'Business', '2025-01-01', NULL, 'Commercial Water Tariff 2025 - Higher flat rate for businesses'),
(6, 2, 'Government', '2025-01-01', NULL, 'Government Water Tariff 2025 - Standard rate for government entities'),

-- Gas Tariffs
(7, 3, 'Household', '2025-01-01', NULL, 'Domestic Gas Tariff 2025 - Slab pricing with subsidy'),
(8, 3, 'Business', '2025-01-01', NULL, 'Commercial Gas Tariff 2025 - Standard slab pricing without subsidy'),
(9, 3, 'Government', '2025-01-01', NULL, 'Government Gas Tariff 2025 - Standard slab pricing without subsidy');

SET IDENTITY_INSERT Tariff OFF;
GO

-- 8 -> Electricity Tariff Table
-- ----------------------------------------
PRINT 'INJECTING ELECTRICITYTARIFF RECORDS...';
GO

INSERT INTO ElectricityTariff (E_T_ID, E_Slab1Max, E_Slab1Rate, E_Slab2Max, E_Slab2Rate, E_Slab3Rate) VALUES
(1, 50, 0.05, 150, 0.10, 0.30), -- Household
(2, 50, 0.15, 150, 0.25, 0.50), -- Business 
(3, 50, 0.10, 150, 0.20, 0.35); -- Government
GO

-- 9 -> Water Tariff Table
-- ----------------------------------------
PRINT 'INJECTING WATERTARIFF RECORDS...';
GO

INSERT INTO WaterTariff (W_T_ID, W_FlatRate, W_FixedCharge) VALUES
(4, 1.50, 10.00),   -- Household
(5, 3.50, 25.00),   -- Business
(6, 2.00, 15.00);   -- Government
GO

-- 10 -> Gas Tariff Table
-- ----------------------------------------
PRINT 'INJECTING GASTARIFF RECORDS...';
GO

INSERT INTO GasTariff (G_T_ID, G_Slab1Max, G_Slab1Rate, G_Slab2Rate, G_SubsidyAmount) VALUES
(7, 50, 0.55, 1.25, 50.00),   -- Household
(8, 50, 1.15, 1.50, 0.00),    -- Business
(9, 50, 0.75, 1.35, 0.00);    -- Government
GO

-- 11 -> Service Connection Table
-- ----------------------------------------
PRINT 'INJECTING SERVICECONNECTION RECORDS...';
GO

SET IDENTITY_INSERT ServiceConnection ON;

INSERT INTO ServiceConnection (S_ID, C_ID, M_ID, T_ID, S_ConnectionDate, S_InstallationCharge, S_Status) VALUES
-- Electricity
(1, 1, 1, 1, '2025-01-15', 100.00, 'Active'),
(2, 2, 2, 1, '2025-02-20', 100.00, 'Active'),
(3, 3, 3, 2, '2024-11-10', 100.00, 'Active'),
(4, 4, 4, 1, '2025-03-12', 100.00, 'Active'),
(5, 6, 5, 1, '2025-04-18', 100.00, 'Active'),
(6, 7, 6, 2, '2025-01-25', 100.00, 'Active'),
(7, 8, 7, 1, '2025-05-22', 100.00, 'Active'),
(8, 10, 8, 1, '2025-06-10', 100.00, 'Disconnected'),
(9, 12, 9, 1, '2025-07-05', 100.00, 'Active'),
(10, 15, 10, 3, '2024-10-20', 100.00, 'Active'),

-- Water
(11, 1, 11, 4, '2025-01-20', 75.00, 'Active'),
(12, 2, 12, 4, '2025-02-25', 75.00, 'Active'),
(13, 5, 13, 6, '2024-08-05', 75.00, 'Active'),
(14, 4, 14, 4, '2025-03-15', 75.00, 'Active'),
(15, 9, 15, 5, '2024-12-01', 75.00, 'Active'),
(16, 10, 16, 4, '2025-06-12', 75.00, 'Active'),
(17, 11, 17, 6, '2024-09-15', 75.00, 'Active'),
(18, 12, 18, 4, '2025-07-08', 75.00, 'Active'),
(19, 15, 19, 6, '2024-10-22', 75.00, 'Disconnected'),
(20, 14, 20, 4, '2025-07-19', 75.00, 'Active'),

-- Gas
(21, 3, 21, 8, '2024-11-12', 155.00, 'Active'),
(22, 7, 22, 8, '2025-01-28', 155.00, 'Active'),
(23, 13, 23, 8, '2025-02-14', 155.00, 'Active'),
(24, 10, 24, 7, '2025-06-15', 155.00, 'Active'),
(25, 4, 25, 7, '2025-03-18', 155.00, 'Active'),
(26, 9, 26, 8, '2024-12-05', 155.00, 'Active'),
(27, 6, 27, 7, '2025-05-25', 155.00, 'Active'),

-- Disconnected Service Connections
(28, 14, 28, 1, '2024-08-15', 100.00, 'Disconnected'),
(29, 3, 29, 5, '2024-09-20', 75.00, 'Disconnected'),   
(30, 6, 30, 7, '2024-10-10', 155.00, 'Disconnected');  

SET IDENTITY_INSERT ServiceConnection OFF;
GO

-- 12 -> Meter Reading Table
-- ----------------------------------------
PRINT 'Inserting MeterReading records...';
GO

SET IDENTITY_INSERT MeterReading ON;

-- Electricity Readings (Customer 1)
INSERT INTO MeterReading (R_ID, M_ID, U_ID, R_Date, R_Value, R_Consumption, R_IsTampered, R_TamperingFine) VALUES
(1, 1, 4, '2025-10-25', 1000.00, NULL, 0, 0.00),         
(2, 1, 4, '2025-11-25', 1125.00, 125.00, 0, 0.00),
(3, 1, 4, '2025-12-25', 1250.00, 125.00, 0, 0.00),

-- Electricity Readings (Customer 2)
(4, 2, 5, '2025-10-26', 850.00, NULL, 0, 0.00),
(5, 2, 5, '2025-11-26', 905.00, 55.00, 0, 0.00),
(6, 2, 5, '2025-12-26', 960.00, 55.00, 0, 0.00),

-- Electricity Readings (Business - Raj Industries)
(7, 3, 4, '2025-10-27', 5200.00, NULL, 0, 0.00),
(8, 3, 4, '2025-11-27', 5890.00, 690.00, 0, 0.00),
(9, 3, 4, '2025-12-27', 6650.00, 760.00, 0, 0.00),

-- Electricity Readings (Customer 4)
(10, 4, 5, '2025-10-28', 720.00, NULL, 0, 0.00),
(11, 4, 5, '2025-11-28', 812.00, 92.00, 0, 0.00),
(12, 4, 5, '2025-12-28', 898.00, 86.00, 0, 0.00),

-- Electricity Readings (Customer 6) - Tampered
(13, 5, 6, '2025-10-25', 650.00, NULL, 0, 0.00),
(14, 5, 6, '2025-11-25', 740.00, 90.00, 0, 0.00),
(15, 5, 6, '2025-12-25', 735.00, -5.00, 1, 500.00),

-- Electricity Readings (Business - Lanka Tech)
(16, 6, 4, '2025-10-26', 3200.00, NULL, 0, 0.00),
(17, 6, 4, '2025-11-26', 3520.00, 320.00, 0, 0.00),
(18, 6, 4, '2025-12-26', 3856.00, 336.00, 0, 0.00),

-- Electricity Readings (Customer 8)
(19, 7, 5, '2025-10-27', 890.00, NULL, 0, 0.00),
(20, 7, 5, '2025-11-27', 978.00, 88.00, 0, 0.00),
(21, 7, 5, '2025-12-27', 1062.00, 84.00, 0, 0.00),

-- Electricity Readings (Customer 10)
(22, 8, 6, '2025-10-28', 1200.00, NULL, 0, 0.00),
(23, 8, 6, '2025-11-28', 1245.00, 45.00, 0, 0.00),

-- Electricity Readings (Customer 12)
(24, 9, 4, '2025-10-25', 420.00, NULL, 0, 0.00),
(25, 9, 4, '2025-11-25', 485.00, 65.00, 0, 0.00),
(26, 9, 4, '2025-12-25', 548.00, 63.00, 0, 0.00),

-- Electricity Readings (Government - University)
(27, 10, 5, '2025-10-26', 8900.00, NULL, 0, 0.00),
(28, 10, 5, '2025-11-26', 9620.00, 720.00, 0, 0.00),
(29, 10, 5, '2025-12-26', 10280.00, 660.00, 0, 0.00),

-- Water Readings (Customer 1)
(30, 11, 4, '2025-10-26', 245.00, NULL, 0, 0.00),
(31, 11, 4, '2025-11-26', 258.00, 13.00, 0, 0.00),
(32, 11, 4, '2025-12-26', 272.00, 14.00, 0, 0.00),

-- Water Readings (Customer 2)
(33, 12, 5, '2025-10-27', 189.00, NULL, 0, 0.00),
(34, 12, 5, '2025-11-27', 198.00, 9.00, 0, 0.00),
(35, 12, 5, '2025-12-27', 207.00, 9.00, 0, 0.00),

-- Water Readings (Government - Galle MC)
(36, 13, 6, '2025-10-28', 1200.00, NULL, 0, 0.00),
(37, 13, 6, '2025-11-28', 1288.00, 88.00, 0, 0.00),
(38, 13, 6, '2025-12-28', 1374.00, 86.00, 0, 0.00),

-- Water Readings (Customer 4)
(39, 14, 4, '2025-10-26', 345.00, NULL, 0, 0.00),
(40, 14, 4, '2025-11-26', 357.00, 12.00, 0, 0.00),
(41, 14, 4, '2025-12-26', 369.00, 12.00, 0, 0.00),

-- Water Readings (Business - Nelum Restaurant)
(42, 15, 5, '2025-10-27', 678.00, NULL, 0, 0.00),
(43, 15, 5, '2025-11-27', 723.00, 45.00, 0, 0.00),
(44, 15, 5, '2025-12-27', 771.00, 48.00, 0, 0.00),

-- Water Readings (Customer 10)
(45, 16, 6, '2025-10-28', 123.00, NULL, 0, 0.00),
(46, 16, 6, '2025-11-28', 134.00, 11.00, 0, 0.00),
(47, 16, 6, '2025-12-28', 145.00, 11.00, 0, 0.00),

-- Gas Readings (Business - Raj Industries )
(48, 21, 4, '2025-10-25', 890.00, NULL, 0, 0.00),
(49, 21, 4, '2025-11-25', 978.00, 88.00, 0, 0.00),
(50, 21, 4, '2025-12-25', 1062.00, 84.00, 0, 0.00),

-- Gas Readings (Business - Lanka Tech)
(51, 22, 5, '2025-10-26', 456.00, NULL, 0, 0.00),
(52, 22, 5, '2025-11-26', 521.00, 65.00, 0, 0.00),
(53, 22, 5, '2025-12-26', 589.00, 68.00, 0, 0.00),

-- Gas Readings (Business - Green Valley Hotel)
(54, 23, 6, '2025-10-27', 1200.00, NULL, 0, 0.00),
(55, 23, 6, '2025-11-27', 1312.00, 112.00, 0, 0.00),
(56, 23, 6, '2025-12-27', 1428.00, 116.00, 0, 0.00),

-- Gas Readings (Household - Customer 10)
(57, 24, 4, '2025-10-28', 120.00, NULL, 0, 0.00),
(58, 24, 4, '2025-11-28', 158.00, 38.00, 0, 0.00),
(59, 24, 4, '2025-12-28', 194.00, 36.00, 0, 0.00),

-- Gas Readings (Household - Customer 4)
(60, 25, 5, '2025-10-25', 230.00, NULL, 0, 0.00),
(61, 25, 5, '2025-11-25', 272.00, 42.00, 0, 0.00),
(62, 25, 5, '2025-12-25', 316.00, 44.00, 0, 0.00),

-- Gas Readings (Business - Nelum Restaurant)
(63, 26, 6, '2025-10-26', 890.00, NULL, 0, 0.00),
(64, 26, 6, '2025-11-26', 978.00, 88.00, 0, 0.00),
(65, 26, 6, '2025-12-26', 1062.00, 84.00, 0, 0.00);

SET IDENTITY_INSERT MeterReading OFF;
GO

-- 13 -> Bill Table
-- ----------------------------------------
PRINT 'INSERTING BILL RECORDS...';
GO

SET IDENTITY_INSERT Bill ON;

-- Electricity Bills (Household - Customer 1)
INSERT INTO Bill (B_ID, C_ID, M_ID, T_ID, B_PeriodStart, B_PeriodEnd, B_Consumption, B_ConsumptionCharge, B_FixedCharges, B_LateFee, B_PreviousBalance, B_TotalAmount, B_Date, B_DueDate, B_Status) VALUES
(1, 1, 1, 1, '2025-11-01', '2025-11-30', 125.00, 10.00, 100.00, 0.00, 0.00, 110.00, '2025-12-01', '2025-12-16', 'Paid'),    
(2, 1, 1, 1, '2025-12-01', '2025-12-31', 125.00, 10.00, 0.00, 0.00, 0.00, 10.00, '2024-01-01', '2024-01-16', 'Unpaid'),

-- Electricity Bills (Household - Customer 2)
(3, 2, 2, 1, '2025-11-01', '2025-11-30', 55.00, 3.00, 100.00, 0.00, 0.00, 103.00, '2025-12-01', '2025-12-16', 'Paid'),       
(4, 2, 2, 1, '2025-12-01', '2025-12-31', 55.00, 3.00, 0.00, 0.00, 0.00, 3.00, '2024-01-01', '2024-01-16', 'Paid'),

-- Electricity Bills (Business - Raj Industries)
(5, 3, 3, 2, '2025-11-01', '2025-11-30', 690.00, 302.50, 100.00, 0.00, 0.00, 402.50, '2025-12-01', '2025-12-16', 'Unpaid'),  
(6, 3, 3, 2, '2025-12-01', '2025-12-31', 760.00, 337.50, 0.00, 10.00, 402.50, 750.00, '2024-01-01', '2024-01-16', 'Unpaid'), 

-- Electricity Bills (Household - Customer 4)
(7, 4, 4, 1, '2025-11-01', '2025-11-30', 92.00, 6.70, 100.00, 0.00, 0.00, 106.70, '2025-12-01', '2025-12-16', 'Paid'),      
(8, 4, 4, 1, '2025-12-01', '2025-12-31', 86.00, 6.10, 0.00, 0.00, 0.00, 6.10, '2024-01-01', '2024-01-16', 'PartiallyPaid'),

-- Electricity Bills (Household - Customer 6) - TAMPERED
(9, 6, 5, 1, '2025-11-01', '2025-11-30', 90.00, 6.50, 100.00, 0.00, 0.00, 106.50, '2025-12-01', '2025-12-16', 'Paid'),     
(10, 6, 5, 1, '2025-12-01', '2025-12-31', 0.00, 0.00, 0.00, 500.00, 0.00, 500.00, '2024-01-01', '2024-01-16', 'Unpaid'),    

-- Electricity Bills (Business - Lanka Tech)
(11, 7, 6, 2, '2025-11-01', '2025-11-30', 320.00, 117.50, 100.00, 0.00, 0.00, 217.50, '2025-12-01', '2025-12-16', 'Paid'),  
(12, 7, 6, 2, '2025-12-01', '2025-12-31', 336.00, 125.50, 0.00, 0.00, 0.00, 125.50, '2024-01-01', '2024-01-16', 'Paid'),    

-- Electricity Bills (Household - Customer 8)
(13, 8, 7, 1, '2025-11-01', '2025-11-30', 88.00, 6.30, 100.00, 0.00, 0.00, 106.30, '2025-12-01', '2025-12-16', 'PartiallyPaid'),
(14, 8, 7, 1, '2025-12-01', '2025-12-31', 84.00, 5.90, 0.00, 5.00, 56.30, 67.20, '2024-01-01', '2024-01-16', 'Unpaid'),     

-- Electricity Bills (Household - Customer 12)
(15, 12, 9, 1, '2025-11-01', '2025-11-30', 65.00, 4.00, 100.00, 0.00, 0.00, 104.00, '2025-12-01', '2025-12-16', 'Paid'),   
(16, 12, 9, 1, '2025-12-01', '2025-12-31', 63.00, 3.80, 0.00, 0.00, 0.00, 3.80, '2024-01-01', '2024-01-16', 'Paid'),        

-- Electricity Bills (Government - University)
(17, 15, 10, 3, '2025-11-01', '2025-11-30', 720.00, 224.50, 100.00, 0.00, 0.00, 324.50, '2025-12-01', '2025-12-16', 'Paid'),
(18, 15, 10, 3, '2025-12-01', '2025-12-31', 660.00, 203.50, 0.00, 0.00, 0.00, 203.50, '2024-01-01', '2024-01-16', 'Paid'),  

-- Water Bills (Household - Customer 1)
(19, 1, 11, 4, '2025-11-01', '2025-11-30', 13.00, 19.50, 85.00, 0.00, 0.00, 104.50, '2025-12-01', '2025-12-16', 'Paid'),    
(20, 1, 11, 4, '2025-12-01', '2025-12-31', 14.00, 21.00, 10.00, 0.00, 0.00, 31.00, '2024-01-01', '2024-01-16', 'Paid'),    

-- Water Bills (Household - Customer 2)
(21, 2, 12, 4, '2025-11-01', '2025-11-30', 9.00, 13.50, 85.00, 0.00, 0.00, 98.50, '2025-12-01', '2025-12-16', 'Paid'),    
(22, 2, 12, 4, '2025-12-01', '2025-12-31', 9.00, 13.50, 10.00, 0.00, 0.00, 23.50, '2024-01-01', '2024-01-16', 'Paid'),

-- Water Bills (Government - Galle MC)
(23, 5, 13, 6, '2025-11-01', '2025-11-30', 88.00, 176.00, 90.00, 0.00, 0.00, 266.00, '2025-12-01', '2025-12-16', 'Unpaid'),  
(24, 5, 13, 6, '2025-12-01', '2025-12-31', 86.00, 172.00, 15.00, 5.00, 266.00, 458.00, '2024-01-01', '2024-01-16', 'Unpaid'),

-- Water Bills (Household - Customer 4)
(25, 4, 14, 4, '2025-11-01', '2025-11-30', 12.00, 18.00, 85.00, 0.00, 0.00, 103.00, '2025-12-01', '2025-12-16', 'Paid'),    
(26, 4, 14, 4, '2025-12-01', '2025-12-31', 12.00, 18.00, 10.00, 0.00, 0.00, 28.00, '2024-01-01', '2024-01-16', 'PartiallyPaid'),

-- Water Bills (Business - Nelum Restaurant)
(27, 9, 15, 5, '2025-11-01', '2025-11-30', 45.00, 157.50, 100.00, 0.00, 0.00, 257.50, '2025-12-01', '2025-12-16', 'Paid'),  
(28, 9, 15, 5, '2025-12-01', '2025-12-31', 48.00, 168.00, 25.00, 0.00, 0.00, 193.00, '2024-01-01', '2024-01-16', 'Paid'),   

-- Gas Bills (Business - Raj Industries)
(29, 3, 21, 8, '2025-11-01', '2025-11-30', 88.00, 114.50, 155.00, 0.00, 0.00, 269.50, '2025-12-01', '2025-12-16', 'Unpaid'), 
(30, 3, 21, 8, '2025-12-01', '2025-12-31', 84.00, 108.50, 0.00, 5.00, 269.50, 383.00, '2024-01-01', '2024-01-16', 'Unpaid'), 

-- Gas Bills (Household - Customer 10 with subsidy)
(31, 10, 24, 7, '2025-11-01', '2025-11-30', 38.00, 20.90, 155.00, 0.00, 0.00, 125.90, '2025-12-01', '2025-12-16', 'Paid'),    
(32, 10, 24, 7, '2025-12-01', '2025-12-31', 36.00, 19.80, 0.00, 0.00, 0.00, 0.00, '2024-01-01', '2024-01-16', 'Paid');      

SET IDENTITY_INSERT Bill OFF;
GO


-- 14 -> Bill Line Item Table
-- ----------------------------------------
PRINT 'INJECTING BILLLINEITEM RECORDS...';
GO

-- Bill 1 (Customer 1 - Electricity Household - Nov 2025 - 125 kWh)
INSERT INTO BillLineItem (B_ID, Bl_LineNumber, Bl_Description, Bl_Quantity, Bl_Rate, Bl_Amount) VALUES
(1, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(1, 2, 'Electricity 51-150 kWh (Slab 2)', 75.00, 0.10, 7.50),
(1, 3, 'Installation Charge', 1.00, 100.00, 100.00),

-- Bill 2 (Customer 1 - Electricity Household - Dec 2025 - 125 kWh)
(2, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(2, 2, 'Electricity 51-150 kWh (Slab 2)', 75.00, 0.10, 7.50),

-- Bill 3 (Customer 2 - Electricity Household - Nov 2025 - 55 kWh)
(3, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(3, 2, 'Electricity 51-150 kWh (Slab 2)', 5.00, 0.10, 0.50),
(3, 3, 'Installation Charge', 1.00, 100.00, 100.00),

-- Bill 4 (Customer 2 - Electricity Household - Dec 2025 - 55 kWh)
(4, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(4, 2, 'Electricity 51-150 kWh (Slab 2)', 5.00, 0.10, 0.50),

-- Bill 5 (Raj Industries - Electricity Business - Nov 2025 - 690 kWh)
(5, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.15, 7.50),
(5, 2, 'Electricity 51-150 kWh (Slab 2)', 100.00, 0.25, 25.00),
(5, 3, 'Electricity 151+ kWh (Slab 3)', 540.00, 0.50, 270.00),
(5, 4, 'Installation Charge', 1.00, 100.00, 100.00),

-- Bill 6 (Raj Industries - Electricity Business - Dec 2025 - 760 kWh)
(6, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.15, 7.50),
(6, 2, 'Electricity 51-150 kWh (Slab 2)', 100.00, 0.25, 25.00),
(6, 3, 'Electricity 151+ kWh (Slab 3)', 610.00, 0.50, 305.00),
(6, 4, 'Previous Balance', 1.00, 402.50, 402.50),
(6, 5, 'Late Fee', 1.00, 10.00, 10.00),

-- Bill 7 (Customer 4 - Electricity Household - Nov 2025 - 92 kWh)
(7, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(7, 2, 'Electricity 51-150 kWh (Slab 2)', 42.00, 0.10, 4.20),
(7, 3, 'Installation Charge', 1.00, 100.00, 100.00),

-- Bill 8 (Customer 4 - Electricity Household - Dec 2025 - 86 kWh)
(8, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(8, 2, 'Electricity 51-150 kWh (Slab 2)', 36.00, 0.10, 3.60),

-- Bill 9 (Customer 6 - Electricity Household - Nov 2025 - 90 kWh)
(9, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(9, 2, 'Electricity 51-150 kWh (Slab 2)', 40.00, 0.10, 4.00),
(9, 3, 'Installation Charge', 1.00, 100.00, 100.00),

-- Bill 10 (Customer 6 - Electricity Household - Dec 2025 - TAMPERING FINE)
(10, 1, 'Meter Tampering Fine', 1.00, 500.00, 500.00),

-- Bill 11 (Lanka Tech - Electricity Business - Nov 2025 - 320 kWh)
(11, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.15, 7.50),
(11, 2, 'Electricity 51-150 kWh (Slab 2)', 100.00, 0.25, 25.00),
(11, 3, 'Electricity 151+ kWh (Slab 3)', 170.00, 0.50, 85.00),
(11, 4, 'Installation Charge', 1.00, 100.00, 100.00),

-- Bill 12 (Lanka Tech - Electricity Business - Dec 2025 - 336 kWh)
(12, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.15, 7.50),
(12, 2, 'Electricity 51-150 kWh (Slab 2)', 100.00, 0.25, 25.00),
(12, 3, 'Electricity 151+ kWh (Slab 3)', 186.00, 0.50, 93.00),

-- Bill 13 (Customer 8 - Electricity Household - Nov 2025 - 88 kWh)
(13, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(13, 2, 'Electricity 51-150 kWh (Slab 2)', 38.00, 0.10, 3.80),
(13, 3, 'Installation Charge', 1.00, 100.00, 100.00),

-- Bill 14 (Customer 8 - Electricity Household - Dec 2025 - 84 kWh)
(14, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(14, 2, 'Electricity 51-150 kWh (Slab 2)', 34.00, 0.10, 3.40),
(14, 3, 'Previous Balance', 1.00, 56.30, 56.30),
(14, 4, 'Late Fee', 1.00, 5.00, 5.00),

-- Bill 15 (Customer 12 - Electricity Household - Nov 2025 - 65 kWh)
(15, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(15, 2, 'Electricity 51-150 kWh (Slab 2)', 15.00, 0.10, 1.50),
(15, 3, 'Installation Charge', 1.00, 100.00, 100.00),

-- Bill 16 (Customer 12 - Electricity Household - Dec 2025 - 63 kWh)
(16, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.05, 2.50),
(16, 2, 'Electricity 51-150 kWh (Slab 2)', 13.00, 0.10, 1.30),

-- Bill 17 (University - Electricity Government - Nov 2025 - 720 kWh)
(17, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.10, 5.00),
(17, 2, 'Electricity 51-150 kWh (Slab 2)', 100.00, 0.20, 20.00),
(17, 3, 'Electricity 151+ kWh (Slab 3)', 570.00, 0.35, 199.50),
(17, 4, 'Installation Charge', 1.00, 100.00, 100.00),

-- Bill 18 (University - Electricity Government - Dec 2025 - 660 kWh)
(18, 1, 'Electricity 0-50 kWh (Slab 1)', 50.00, 0.10, 5.00),
(18, 2, 'Electricity 51-150 kWh (Slab 2)', 100.00, 0.20, 20.00),
(18, 3, 'Electricity 151+ kWh (Slab 3)', 510.00, 0.35, 178.50),

-- Bill 19 (Customer 1 - Water - Nov 2025)
(19, 1, 'Water Consumption', 13.00, 1.50, 19.50),
(19, 2, 'Fixed Charge', 1.00, 10.00, 10.00),
(19, 3, 'Installation Charge', 1.00, 75.00, 75.00),

-- Bill 20 (Customer 1 - Water - Dec 2025)
(20, 1, 'Water Consumption', 14.00, 1.50, 21.00),
(20, 2, 'Fixed Charge', 1.00, 10.00, 10.00),

-- Bill 21 (Customer 2 - Water - Nov 2025)
(21, 1, 'Water Consumption', 9.00, 1.50, 13.50),
(21, 2, 'Fixed Charge', 1.00, 10.00, 10.00),
(21, 3, 'Installation Charge', 1.00, 75.00, 75.00),

-- Bill 22 (Customer 2 - Water - Dec 2025)
(22, 1, 'Water Consumption', 9.00, 1.50, 13.50),
(22, 2, 'Fixed Charge', 1.00, 10.00, 10.00),

-- Bill 23 (Galle MC - Water - Nov 2025)
(23, 1, 'Water Consumption', 88.00, 2.00, 176.00),
(23, 2, 'Fixed Charge', 1.00, 15.00, 15.00),
(23, 3, 'Installation Charge', 1.00, 75.00, 75.00),

-- Bill 24 (Galle MC - Water - Dec 2025)
(24, 1, 'Water Consumption', 86.00, 2.00, 172.00),
(24, 2, 'Fixed Charge', 1.00, 15.00, 15.00),
(24, 3, 'Previous Balance', 1.00, 266.00, 266.00),
(24, 4, 'Late Fee', 1.00, 5.00, 5.00),

-- Bill 25 (Customer 4 - Water - Nov 2025)
(25, 1, 'Water Consumption', 12.00, 1.50, 18.00),
(25, 2, 'Fixed Charge', 1.00, 10.00, 10.00),
(25, 3, 'Installation Charge', 1.00, 75.00, 75.00),

-- Bill 26 (Customer 4 - Water - Dec 2025)
(26, 1, 'Water Consumption', 12.00, 1.50, 18.00),
(26, 2, 'Fixed Charge', 1.00, 10.00, 10.00),

-- Bill 27 (Nelum Restaurant - Water Business - Nov 2025 - 45 m³)
(27, 1, 'Water Consumption', 45.00, 3.50, 157.50),
(27, 2, 'Fixed Charge', 1.00, 25.00, 25.00),
(27, 3, 'Installation Charge', 1.00, 75.00, 75.00),

-- Bill 28 (Nelum Restaurant - Water Business - Dec 2025 - 48 m³)
(28, 1, 'Water Consumption', 48.00, 3.50, 168.00),
(28, 2, 'Fixed Charge', 1.00, 25.00, 25.00),

-- Bill 29 (Raj Industries - Gas Business - Nov 2025 - 88 m³)
(29, 1, 'Gas 0-50 m³ (Slab 1)', 50.00, 1.15, 57.50),
(29, 2, 'Gas 51+ m³ (Slab 2)', 38.00, 1.50, 57.00),
(29, 3, 'Installation Charge', 1.00, 155.00, 155.00),

-- Bill 30 (Raj Industries - Gas Business - Dec 2025 - 84 m³)
(30, 1, 'Gas 0-50 m³ (Slab 1)', 50.00, 1.15, 57.50),
(30, 2, 'Gas 51+ m³ (Slab 2)', 34.00, 1.50, 51.00),
(30, 3, 'Previous Balance', 1.00, 234.50, 234.50),
(30, 4, 'Late Fee', 1.00, 5.00, 5.00),

-- Bill 31 (Customer 10 - Gas Household with Subsidy - Nov 2025 - 38 m³)
(31, 1, 'Gas 0-50 m³ (Slab 1)', 38.00, 0.55, 20.90),
(31, 2, 'Installation Charge', 1.00, 155.00, 155.00),
(31, 3, 'Government Subsidy', 1.00, -50.00, -50.00),

-- Bill 32 (Customer 10 - Gas Household with Subsidy - Dec 2025 - 36 m³)
(32, 1, 'Gas 0-50 m³ (Slab 1)', 36.00, 0.55, 19.80),
(32, 2, 'Government Subsidy', 1.00, -50.00, -50.00);

GO

-- 15 -> Payment Table
-- ----------------------------------------
PRINT 'INSERTING PAYMENT RECORDS...';
GO

SET IDENTITY_INSERT Payment ON;

INSERT INTO Payment (P_ID, B_ID, U_ID, P_Date, P_Amount, P_Method, P_ReferenceNo) VALUES
-- Payments for November Bills (all paid in December)
(1, 1, 2, '2025-12-05', 110.00, 'Cash', NULL),
(2, 3, 2, '2025-12-06', 103.00, 'Card', 'CARD-2025-12-00123'),
(3, 7, 3, '2025-12-07', 106.70, 'Online', 'ONLINE-20251207-456'),
(4, 9, 2, '2025-12-08', 106.50, 'Cash', NULL),
(5, 11, 3, '2025-12-09', 217.50, 'Cash', NULL),
(6, 13, 2, '2025-12-10', 50.00, 'Cash', NULL),              -- Partial payment
(7, 15, 3, '2025-12-11', 104.00, 'Card', 'CARD-2025-12-00789'),
(8, 17, 2, '2025-12-12', 324.50, 'Online', 'ONLINE-20251212-890'),
(9, 19, 3, '2025-12-13', 104.50, 'Cash', NULL),
(10, 21, 2, '2025-12-14', 98.50, 'Card', 'CARD-2025-12-01011'),
(11, 25, 3, '2025-12-15', 103.00, 'Online', 'ONLINE-20251215-234'),
(12, 27, 2, '2025-12-16', 257.50, 'Cash', NULL),
(13, 31, 3, '2025-12-17', 125.90, 'Card', 'CARD-2025-12-01213'),

-- Payments for December Bills (paid in late December/early January)
(14, 4, 2, '2025-12-28', 3.00, 'Cash', NULL),
(15, 12, 3, '2025-12-29', 125.50, 'Online', 'ONLINE-20251229-567'),
(16, 16, 2, '2025-12-30', 3.80, 'Card', 'CARD-2025-12-01415'),
(17, 18, 3, '2024-01-02', 203.50, 'Online', 'ONLINE-20240102-789'),
(18, 20, 2, '2024-01-03', 31.00, 'Cash', NULL),
(19, 22, 3, '2024-01-04', 23.50, 'Card', 'CARD-2024-01-00123'),
(20, 28, 2, '2024-01-05', 193.00, 'Online', 'ONLINE-20240105-345'),

-- Partial Payments
(21, 8, 2, '2024-01-07', 5.00, 'Cash', NULL),               -- Partial payment
(22, 26, 3, '2024-01-08', 15.00, 'Card', 'CARD-2024-01-00456'),  -- Partial payment

-- More recent payments
(23, 2, 2, '2024-01-10', 10.00, 'Cash', NULL);

SET IDENTITY_INSERT Payment OFF;
GO

-- 16 -> Complaint Table
-- ----------------------------------------
PRINT 'INJECTING COMPLAINT RECORDS...';
GO

SET IDENTITY_INSERT Complaint ON;

INSERT INTO Complaint (Co_ID, C_ID, Co_ResolvedBy, Co_Date, Co_Description, Co_Status, Co_ResolvedDate) VALUES
(1, 1, 1, '2025-11-10', 'Meter reading discrepancy - Reading seems too high for my usual consumption', 'Resolved', '2025-11-15'),
(2, 3, 10, '2025-11-12', 'Bill amount incorrect - Installation charge applied twice', 'Resolved', '2025-11-20'),
(3, 6, NULL, '2025-11-15', 'Meter display not working properly, unable to verify readings', 'Open', NULL),
(4, 8, 1, '2025-11-20', 'Power outage for 3 days but billed for full month consumption', 'Resolved', '2025-11-28'),
(5, 10, NULL, '2025-11-25', 'Gas leak detected near meter, requesting urgent inspection', 'Open', NULL),
(6, 4, 10, '2025-12-01', 'Water pressure very low, suspecting meter issue', 'Resolved', '2025-12-10'),
(7, 12, NULL, '2025-12-05', 'Received bill for wrong address - please verify meter number', 'Open', NULL),
(8, 2, 1, '2025-12-08', 'Late fee applied but payment was made on time', 'Resolved', '2025-12-12'),
(9, 7, NULL, '2025-12-12', 'Requesting meter relocation due to construction work', 'Open', NULL),
(10, 9, 10, '2025-12-15', 'Multiple billing errors in past 3 months, need audit', 'Resolved', '2025-12-22'),
(11, 5, NULL, '2025-12-18', 'Government subsidy not applied to gas bill', 'Closed', NULL),
(12, 13, NULL, '2025-12-20', 'Hotel renovation - temporary service disconnection needed', 'Open', NULL),
(13, 15, 1, '2025-12-22', 'University campus expansion - additional 5 meters required', 'Resolved', '2025-12-28'),
(14, 14, NULL, '2025-12-25', 'Account deactivation request - moving out of country', 'Closed', NULL);

SET IDENTITY_INSERT Complaint OFF;
GO

PRINT 'SAMPLE DATA INJECTION COMPLETED';
PRINT 'Total Records:';
PRINT '  - Address: 15';
PRINT '  - Utility: 3';
PRINT '  - Customer: 15';
PRINT '  - CustomerPhone: 25';
PRINT '  - User: 12';
PRINT '  - Meter: 30';
PRINT '  - Tariff: 9';
PRINT '  - ElectricityTariff: 3';
PRINT '  - WaterTariff: 3';
PRINT '  - GasTariff: 3';
PRINT '  - ServiceConnection: 30';
PRINT '  - MeterReading: 65';
PRINT '  - Bill: 32';
PRINT '  - BillLineItem: 96';
PRINT '  - Payment: 23';
PRINT '  - Complaint: 14';
PRINT '';
PRINT 'GRAND TOTAL: 362+ records across 16 tables';
PRINT '';
GO
