CREATE database calculator;

use calculator;
CREATE TABLE history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expression VARCHAR(255) NOT NULL,
  result VARCHAR(255) NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
