CREATE DATABASE IF NOT EXISTS petni_chat;
USE petni_chat;

-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  gender ENUM('ভূত', 'পেত্নী') NOT NULL,
  avatar_id INT DEFAULT 1,
  magical_stones INT DEFAULT 0,
  verified BOOLEAN DEFAULT 0,
  google_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  banned BOOLEAN DEFAULT 0,
  ban_reason TEXT,
  banned_at TIMESTAMP NULL
);

-- Chat History Table
CREATE TABLE chat_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user1_id INT,
  user2_id INT,
  gender1 ENUM('ভूत', 'पेত्नी'),
  gender2 ENUM('ভूत', 'पेत्नी'),
  age_range1 VARCHAR(20),
  age_range2 VARCHAR(20),
  chat_mode VARCHAR(50),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  duration_seconds INT,
  user1_rating INT,
  user2_rating INT,
  user1_gender_guess ENUM('ভूत', 'पेत्नी', 'Not Sure'),
  user2_gender_guess ENUM('ভूत', 'पेत्नी', 'Not Sure'),
  user1_reported BOOLEAN DEFAULT 0,
  user2_reported BOOLEAN DEFAULT 0,
  FOREIGN KEY (user1_id) REFERENCES users(id),
  FOREIGN KEY (user2_id) REFERENCES users(id)
);

-- Messages Table
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT,
  message_type ENUM('text', 'sticker', 'emoji') DEFAULT 'text',
  replied_to_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (replied_to_id) REFERENCES messages(id)
);

-- Message Reactions Table
CREATE TABLE message_reactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message_id INT NOT NULL,
  user_id INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_reaction (message_id, user_id, emoji),
  FOREIGN KEY (message_id) REFERENCES messages(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reports Table
CREATE TABLE reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reporter_id INT NOT NULL,
  reported_user_id INT NOT NULL,
  session_id INT,
  reason ENUM('Offensive Language', 'Spam', 'Faking Gender', 'Threats', 'Sexual Talking') NOT NULL,
  description TEXT,
  block_user BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Pending', 'Reviewed', 'Dismissed') DEFAULT 'Pending',
  FOREIGN KEY (reporter_id) REFERENCES users(id),
  FOREIGN KEY (reported_user_id) REFERENCES users(id),
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
);

-- Transactions Table
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  package_name VARCHAR(50) NOT NULL,
  stones INT NOT NULL,
  amount_bdt DECIMAL(10, 2) NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  status ENUM('Pending', 'Confirmed', 'Rejected') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Stone Transactions (for tracking earnings/spending)
CREATE TABLE stone_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount INT NOT NULL,
  type ENUM('Earn', 'Spend', 'Buy', 'Refund') NOT NULL,
  reason VARCHAR(100),
  reference_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Avatars Table
CREATE TABLE avatars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  icon TEXT NOT NULL,
  cost INT,
  is_free BOOLEAN DEFAULT 0
);

-- User Avatars (owned by user)
CREATE TABLE user_avatars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  avatar_id INT NOT NULL,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_avatar (user_id, avatar_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (avatar_id) REFERENCES avatars(id)
);

-- Ban List
CREATE TABLE bans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  ip_address VARCHAR(45),
  reason TEXT NOT NULL,
  banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Block List
CREATE TABLE blocks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  blocker_id INT NOT NULL,
  blocked_id INT NOT NULL,
  reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_block (blocker_id, blocked_id),
  FOREIGN KEY (blocker_id) REFERENCES users(id),
  FOREIGN KEY (blocked_id) REFERENCES users(id)
);

-- Insert default avatars
INSERT INTO avatars (name, icon, is_free) VALUES
('Default Ghost', '👻', 1),
('Shadow Spirit', '🌑', 1),
('Blue Flame', '🔵', 0),
('Red Demon', '👹', 0),
('Cursed Lantern', '🔦', 0),
('Dark Queen Petni', '👑', 0),
('Ancient Bhoot', '💀', 0),
('Golden Specter', '✨', 0),
('Crystal Wraith', '💎', 0),
('Void Walker', '⚫', 0);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_chat_sessions_users ON chat_sessions(user1_id, user2_id);
CREATE INDEX idx_messages_session ON messages(session_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_id ON transactions(transaction_id);
