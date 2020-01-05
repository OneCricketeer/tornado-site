--CREATE DATABASE IF NOT EXISTS `secure_login`;

--CREATE USER 'sec_user'@'localhost' IDENTIFIED BY 'rQK6xLKJeEYPb63N';
--GRANT SELECT, INSERT, UPDATE ON `secure_login`.* TO 'sec_user'@'localhost';

CREATE TABLE IF NOT EXISTS `members` (
    `id` INTEGER PRIMARY KEY,
    `username` VARCHAR(30) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` CHAR(128) NOT NULL,
    `salt` CHAR(128) NOT NULL 
);

CREATE TABLE IF NOT EXISTS `login_attempts` (
    `user_id` INT(11) NOT NULL,
    `time` VARCHAR(30) NOT NULL
);

-- Username: test_user
-- Email: test@example.com
-- Password: 6ZaxN2Vzm9NUJT2y
INSERT INTO `members` VALUES(1, 'test_user', 'test@example.com',
'00807432eae173f652f2064bdca1b61b290b52d40e429a7d295d76a71084aa96c0233b82f1feac45529e0726559645acaed6f3ae58a286b9f075916ebf66cacc',
'f9aab579fc1b41ed0c44fe4ecdbfcdb4cb99b9023abb241a6db833288f4eea3c02f76e0d35204a8695077dcf81932aa59006423976224be0390395bae152d4ef');
