-- Tri-Meter UMS - Database Schema (DDL Script)
-- Database: MS SQL Server

-- Drop tables in reverse order (for re-running script)
IF OBJECT_ID('Complaint', 'U') IS NOT NULL DROP TABLE Complaint;
IF OBJECT_ID('Payment', 'U') IS NOT NULL DROP TABLE Payment;
IF OBJECT_ID('BillLineItem', 'U') IS NOT NULL DROP TABLE BillLineItem;
IF OBJECT_ID('Bill', 'U') IS NOT NULL DROP TABLE Bill;
IF OBJECT_ID('MeterReading', 'U') IS NOT NULL DROP TABLE MeterReading;
IF OBJECT_ID('ServiceConnection', 'U') IS NOT NULL DROP TABLE ServiceConnection;
IF OBJECT_ID('GasTariff', 'U') IS NOT NULL DROP TABLE GasTariff;
IF OBJECT_ID('WaterTariff', 'U') IS NOT NULL DROP TABLE WaterTariff;
IF OBJECT_ID('ElectricityTariff', 'U') IS NOT NULL DROP TABLE ElectricityTariff;
IF OBJECT_ID('TariffPlan', 'U') IS NOT NULL DROP TABLE TariffPlan;
IF OBJECT_ID('Meter', 'U') IS NOT NULL DROP TABLE Meter;
IF OBJECT_ID('[User]', 'U') IS NOT NULL DROP TABLE [User];
IF OBJECT_ID('CustomerPhone', 'U') IS NOT NULL DROP TABLE CustomerPhone;
IF OBJECT_ID('Customer', 'U') IS NOT NULL DROP TABLE Customer;
IF OBJECT_ID('Utility', 'U') IS NOT NULL DROP TABLE Utility;
IF OBJECT_ID('Address', 'U') IS NOT NULL DROP TABLE Address;
GO

-- 1. Address Table
CREATE TABLE Address (
    A_ID      INT             IDENTITY(1,1) PRIMARY KEY,
    A_HouseNo         VARCHAR(50)     NOT NULL,
    A_Street          VARCHAR(100)    NOT NULL,
    A_City            VARCHAR(50)     NOT NULL,

    CONSTRAINT UQ_A_Details UNIQUE (A_HouseNo, A_Street, A_City)
);
GO

-- 2. Utility Table (Lookup Table)
CREATE TABLE Utility (
    U_ID            INT             IDENTITY(1,1) PRIMARY KEY,
    U_Name          VARCHAR(20)     NOT NULL CHECK (U_Name IN ('Electricity', 'Water', 'Gas')),
    U_Unit          VARCHAR(10)     NOT NULL,
    U_Description   VARCHAR(MAX)    NULL,

    CONSTRAINT UQ_U_Name UNIQUE (U_Name)
);
GO

-- 3. Customer Table
CREATE TABLE Customer (
    C_ID                INT             IDENTITY(1,1) PRIMARY KEY,
    C_Name              VARCHAR(100)    NOT NULL,
    C_Type              VARCHAR(20)     NOT NULL CHECK (C_Type IN ('Household', 'Business', 'Government')),
    A_ID                INT             NOT NULL,
    C_Email             VARCHAR(100)    NULL,
    C_IDProof           VARCHAR(50)     NOT NULL,
    C_RegistrationDate  DATE            NOT NULL DEFAULT GETDATE(),
    C_Status            VARCHAR(20)     NOT NULL DEFAULT 'Active' CHECK (C_Status IN ('Active', 'Inactive')),

    CONSTRAINT FK_C_Address FOREIGN KEY (A_ID) REFERENCES Address(A_ID),
);
GO

-- 4. Customer Phone Table
CREATE TABLE CustomerPhone (
    C_ID            INT             NOT NULL,
    C_PhoneNo       VARCHAR(20)     NOT NULL,

    CONSTRAINT PK_Cp PRIMARY KEY (C_ID, C_PhoneNo),
    CONSTRAINT FK_Cp_Customer FOREIGN KEY (C_ID) REFERENCES Customer(C_ID) ON DELETE CASCADE
);
GO

-- 5. User Table
CREATE TABLE [User] (
    U_ID                INT             IDENTITY(1,1) PRIMARY KEY,
    U_Username          VARCHAR(50)     NOT NULL,
    U_Password          VARCHAR(255)    NOT NULL,
    U_FullName          VARCHAR(100)    NOT NULL,
    U_Role              VARCHAR(20)     NOT NULL CHECK (U_Role IN ('Field Officer', 'Cashier', 'Admin', 'Manager')),
    U_Phone             VARCHAR(20)     NOT NULL,
    U_Email             VARCHAR(100)    NOT NULL,
    A_ID                INT             NOT NULL,
    U_IDCard            VARCHAR(255)    NULL,
    U_RegistrationDate  DATE            NOT NULL DEFAULT GETDATE(),
    U_Status            VARCHAR(20)     NOT NULL DEFAULT 'Working' CHECK (U_Status IN ('Working', 'On Leave', 'Resigned')),

    CONSTRAINT FK_U_Address FOREIGN KEY (A_ID) REFERENCES Address(A_ID),
    CONSTRAINT UQ_U_Username UNIQUE (U_Username),
    CONSTRAINT UQ_U_Email UNIQUE (U_Email)
);
GO

-- 6. Meter Table
CREATE TABLE Meter (
    M_ID                INT             IDENTITY(1,1) PRIMARY KEY,
    U_ID                INT             NOT NULL,
    M_Number            VARCHAR(50)     NOT NULL,
    M_InstallationDate  DATE            NOT NULL,
    M_Status            VARCHAR(20)     NOT NULL DEFAULT 'Active' CHECK (M_Status IN ('Active', 'Faulty', 'Replaced')),

    CONSTRAINT FK_M_Utility FOREIGN KEY (U_ID) REFERENCES Utility(U_ID),
    CONSTRAINT UQ_M_Number UNIQUE (M_Number)
);
GO

-- 7. Tariff Table
CREATE TABLE Tariff (
    T_ID                INT             IDENTITY(1,1) PRIMARY KEY,
    U_ID                INT             NOT NULL,
    T_CustomerType      VARCHAR(20)     NOT NULL CHECK (T_CustomerType IN ('Household', 'Business', 'Government')),
    T_ValidFrom         DATE            NOT NULL,
    T_ValidTo           DATE            NULL,
    T_Description       TEXT            NULL,

    CONSTRAINT FK_T_Utility FOREIGN KEY (U_ID) REFERENCES Utility(U_ID),
    CONSTRAINT UQ_T_Details UNIQUE (U_ID, T_CustomerType, T_ValidFrom)
);
GO

-- 8. Electricity Tariff Table
CREATE TABLE ElectricityTariff (
    E_T_ID          INT             PRIMARY KEY,
    E_Slab1Max      INT             NOT NULL,
    E_Slab1Rate     DECIMAL(10,2)   NOT NULL,
    E_Slab2Max      INT             NOT NULL,
    E_Slab2Rate     DECIMAL(10,2)   NOT NULL,
    E_Slab3Rate     DECIMAL(10,2)   NOT NULL,

    CONSTRAINT FK_E_Tariff FOREIGN KEY (E_T_ID) REFERENCES Tariff(T_ID) ON DELETE CASCADE
);
GO

-- 9. Water Tariff Table
CREATE TABLE WaterTariff (
    W_T_ID          INT             PRIMARY KEY,
    W_FlatRate      DECIMAL(10,2)   NOT NULL,
    W_FixedCharge   DECIMAL(10,2)   NOT NULL,

    CONSTRAINT FK_W_Tariff FOREIGN KEY (W_T_ID) REFERENCES Tariff(T_ID) ON DELETE CASCADE
);
GO

-- 10. Gas Tariff Table
CREATE TABLE GasTariff (
    G_T_ID          INT             PRIMARY KEY,
    G_Slab1Max      INT             NOT NULL,
    G_Slab1Rate     DECIMAL(10,2)   NOT NULL,
    G_Slab2Rate     DECIMAL(10,2)   NOT NULL,
    G_SubsidyAmount DECIMAL(10,2)   NOT NULL DEFAULT 50.00,

    CONSTRAINT FK_G_TariffP FOREIGN KEY (G_T_ID) REFERENCES Tariff(T_ID) ON DELETE CASCADE
);
GO

-- 11. Service Connection Table
CREATE TABLE ServiceConnection (
    S_ID                    INT             IDENTITY(1,1) PRIMARY KEY,
    C_ID                    INT             NOT NULL,
    M_ID                    INT             NOT NULL,
    T_ID                    INT             NOT NULL,
    S_ConnectionDate        DATE            NOT NULL DEFAULT GETDATE(),
    S_InstallationCharge    DECIMAL(10,2)   NOT NULL,
    S_Status                VARCHAR(20)     NOT NULL DEFAULT 'Active' CHECK (S_Status IN ('Active', 'Disconnected')),

    CONSTRAINT FK_S_Customer FOREIGN KEY (C_ID) REFERENCES Customer(C_ID),
    CONSTRAINT FK_S_Meter FOREIGN KEY (M_ID) REFERENCES Meter(M_ID),
    CONSTRAINT FK_S_Tariff FOREIGN KEY (T_ID) REFERENCES Tariff(T_ID),
    CONSTRAINT UQ_S_Meter UNIQUE (M_ID)
);
GO

-- 12. Meter Reading Table
CREATE TABLE MeterReading (
    R_ID                INT             IDENTITY(1,1) PRIMARY KEY,
    M_ID                INT             NOT NULL,
    U_ID                INT             NOT NULL,
    R_Date              DATE            NOT NULL,
    R_Value             DECIMAL(10,2)   NOT NULL,
    R_Consumption       DECIMAL(10,2)   NULL,                         -- Current - Previous reading
    R_IsTampered        BIT             NOT NULL DEFAULT 0,
    R_TamperingFine     DECIMAL(10,2)   NOT NULL DEFAULT 0.00,

    CONSTRAINT FK_R_Meter FOREIGN KEY (M_ID) REFERENCES Meter(M_ID),
    CONSTRAINT FK_R_User FOREIGN KEY (U_ID) REFERENCES [User](U_ID),
    CONSTRAINT UQ_R_Details UNIQUE (M_ID, R_Date)
);
GO

-- 13. Bill Table
CREATE TABLE Bill (
    B_ID                    INT             IDENTITY(1,1) PRIMARY KEY,
    C_ID                    INT             NOT NULL,
    M_ID                    INT             NOT NULL,
    T_ID                    INT             NOT NULL,
    B_PeriodStart           DATE            NOT NULL,
    B_PeriodEnd             DATE            NOT NULL,
    B_Consumption           DECIMAL(10,2)   NOT NULL,
    B_ConsumptionCharge     DECIMAL(10,2)   NOT NULL,
    B_FixedCharges          DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    B_LateFee               DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    B_PreviousBalance       DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    B_TotalAmount           DECIMAL(10,2)   NOT NULL,                                    -- Sum of all charges
    B_Date                  DATE            NOT NULL DEFAULT GETDATE(),
    B_DueDate               DATE            NOT NULL,
    B_Status                VARCHAR(20)     NOT NULL DEFAULT 'Unpaid' CHECK (B_Status IN ('Unpaid', 'PartiallyPaid', 'Paid')),

    CONSTRAINT FK_B_Customer FOREIGN KEY (C_ID) REFERENCES Customer(C_ID),
    CONSTRAINT FK_B_Meter FOREIGN KEY (M_ID) REFERENCES Meter(M_ID),
    CONSTRAINT FK_B_Tariff FOREIGN KEY (T_ID) REFERENCES Tariff(T_ID)
);
GO

-- 14. Bill Line Item Table
CREATE TABLE BillLineItem (
    B_ID            INT             NOT NULL,
    Bl_LineNumber   INT             NOT NULL,
    Bl_Description  VARCHAR(200)    NOT NULL,
    Bl_Quantity     DECIMAL(10,2)   NOT NULL,
    Bl_Rate         DECIMAL(10,2)   NOT NULL,
    Bl_Amount       DECIMAL(10,2)   NOT NULL,         -- Quantity × Rate

    CONSTRAINT PK_Bl PRIMARY KEY (B_ID, Bl_LineNumber),
    CONSTRAINT FK_Bl_Bill FOREIGN KEY (B_ID) REFERENCES Bill(B_ID) ON DELETE CASCADE
);
GO

-- 15. Payment Table
CREATE TABLE Payment (
    P_ID            INT             IDENTITY(1,1) PRIMARY KEY,
    B_ID            INT             NOT NULL,
    U_ID            INT             NOT NULL,
    P_Date          DATE            NOT NULL DEFAULT GETDATE(),
    P_Amount        DECIMAL(10,2)   NOT NULL CHECK (P_Amount > 0),
    P_Method        VARCHAR(20)     NOT NULL CHECK (P_Method IN ('Cash', 'Card', 'Online', 'Cheque')),
    P_ReferenceNo   VARCHAR(100)    NULL,

    CONSTRAINT FK_P_Bill FOREIGN KEY (B_ID) REFERENCES Bill(B_ID),
    CONSTRAINT FK_P_User FOREIGN KEY (U_ID) REFERENCES [User](U_ID)
);
GO

-- 16. Complaint Table
CREATE TABLE Complaint (
    Co_ID           INT             IDENTITY(1,1) PRIMARY KEY,
    C_ID            INT             NOT NULL,
    Co_ResolvedBy   INT             NULL,
    Co_Date         DATE            NOT NULL DEFAULT GETDATE(),
    Co_Description  TEXT            NOT NULL,
    Co_Status       VARCHAR(20)     NOT NULL DEFAULT 'Open' CHECK (Co_Status IN ('Open', 'Resolved', 'Closed')),
    Co_ResolvedDate DATE            NULL,

    CONSTRAINT FK_Co_Customer FOREIGN KEY (C_ID) REFERENCES Customer(C_ID),
    CONSTRAINT FK_Co_User FOREIGN KEY (Co_ResolvedBy) REFERENCES [User](U_ID) ON DELETE SET NULL
);
GO

-- Indexes

-- Customer indexes
CREATE INDEX IX_C_Status ON Customer(C_Status);
CREATE INDEX IX_C_Type ON Customer(C_Type);

-- Meter indexes
CREATE INDEX IX_M_Utility ON Meter(U_ID);
CREATE INDEX IX_M_Status ON Meter(M_Status);

-- ServiceConnection indexes
CREATE INDEX IX_S_Customer ON ServiceConnection(C_ID);
CREATE INDEX IX_S_Status ON ServiceConnection(S_Status);

-- MeterReading indexes
CREATE INDEX IX_R_Date ON MeterReading(R_Date);
CREATE INDEX IX_R_Meter ON MeterReading(M_ID);

-- Bill indexes
CREATE INDEX IX_B_Customer ON Bill(C_ID);
CREATE INDEX IX_B_Status ON Bill(B_Status);
CREATE INDEX IX_B_DueDate ON Bill(B_DueDate);
CREATE INDEX IX_B_Date ON Bill(B_Date);

-- Payment indexes
CREATE INDEX IX_P_Date ON Payment(P_Date);
CREATE INDEX IX_P_Bill ON Payment(B_ID);

-- Complaint indexes
CREATE INDEX IX_Co_Status ON Complaint(Co_Status);
CREATE INDEX IX_Co_Date ON Complaint(Co_Date);
GO


-- Final
PRINT 'DDL SCRIPT RUN SUCCESSFULL';
PRINT 'TABLES: 16';
PRINT 'Total indexes: 16';
GO
