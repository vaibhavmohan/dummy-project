-- Adminer 4.8.1 MySQL 8.0.27-0ubuntu0.20.04.1 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE `dmi` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dmi`;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `warehouse_code` varchar(100) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `organization_name` varchar(1024) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `landline_number` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `user_address` varchar(3072) DEFAULT NULL,
  `state` varchar(11) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `is_active` enum('0','1','2') DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `default_password` enum('1','0') DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `code`, `email`, `postal_code`, `warehouse_code`, `name`, `organization_name`, `password`, `contact_number`, `landline_number`, `fax`, `user_address`, `state`, `city`, `country`, `is_active`, `created_at`, `updated_at`, `default_password`) VALUES
(1,	'user11',	'vaibhavmohan429@gmail.com',	NULL,	'ND1',	'Admin',	NULL,	'$2y$10$KpHrHUkcn5pSWC4A1FSMiOaTrL.Qrv3N5M7MCVtIVMHEIaS8VYtRG',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'1',	'2020-08-05 14:57:59',	'2021-10-30 04:58:46',	'1');

-- 2021-10-30 09:38:47
