-- Sample user for login testing
-- Change password in query to your liking

INSERT INTO Address (A_HouseNo, A_Street, A_City)
VALUES ('1/2/3', 'User Street', 'Colombo');

-- Adjust A_ID based on your existing data
INSERT INTO [User] (
    U_Username,
    U_Password,
    U_FullName,
    U_Role,
    U_Phone,
    U_Email,
    A_ID,
    U_IDCard,
    U_Status
)
VALUES (
    'devTeam',
    '$2b$10$qylTgsmJ18.u8XU0nY0QHOnb2PCgyO7qQtShp2PVJKFydZkvHChtC',
    'Dev Team',
    'Admin',
    '+94711231231',
    'devTeam@trimeter.com',
    1,  -- Adjust this if you have existing addresses
    '123456789V',
    'Working'
);

-- Test Credentials:
-- Username: devTeam
-- Password: dev123
