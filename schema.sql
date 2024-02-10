CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phoneNumber VARCHAR(255),
    email VARCHAR(255),
    linkedId INT,
    linkPrecedence ENUM('secondary', 'primary'),
    createdAt DATETIME,
    updatedAt DATETIME,
    deletedAt DATETIME,
    FOREIGN KEY (linkedId) REFERENCES contacts(id)
);

INSERT INTO contacts (id, phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt, deletedAt) 
VALUES (1, '123456', 'lorraine@hillvalley.edu', null, 'primary', '2023-04-01 00:00:00.374', '2023-04-01 00:00:00.374', null);