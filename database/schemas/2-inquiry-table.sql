-- Inquiry Table (for Contact Admin form)
-- Emergency Table

IF OBJECT_ID('Inquiry', 'U') IS NOT NULL DROP TABLE Inquiry;
GO

CREATE TABLE Inquiry (
    I_ID              INT             IDENTITY(1,1) PRIMARY KEY,
    I_Email           VARCHAR(100)    NOT NULL,
    I_Subject         VARCHAR(200)    NOT NULL,
    I_Message         TEXT            NOT NULL,
    I_Date            DATETIME        NOT NULL DEFAULT GETDATE(),
);
GO

-- Indexes for Inquiry table
CREATE INDEX IX_I_Date ON Inquiry(I_Date);
GO

PRINT 'Inquiry table created successfully';
GO
