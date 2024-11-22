-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: mirrortable.mysql.database.azure.com:3306
-- Generation Time: Oct 01, 2022 at 12:13 AM
-- Server version: 5.7.38-log
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mirrortable`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `company_id` int(11) NOT NULL,
  `wallet_addr` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_sym` varchar(255) NOT NULL,
  `no_of_shares` int(11) NOT NULL,
  `contract_addr` varchar(255) NOT NULL,
  `swap_contract_addr` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`company_id`, `wallet_addr`, `company_name`, `company_sym`, `no_of_shares`, `contract_addr`, `swap_contract_addr`) VALUES
(1, '0x595790da12d0b554d5ace1f34e392b6a56205496', 'EKI Energy Systems', 'EKI', 7875, '0x39CB6d6b841514eae59011220cd57951DFC2898e', '0xcA0F358108F2776a16e1bcc9ea008F41607b0f16');

-- --------------------------------------------------------

--
-- Table structure for table `investor`
--

CREATE TABLE `investor` (
  `investor_id` int(10) NOT NULL,
  `investor_name` varchar(255) NOT NULL,
  `wallet_addr` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `investor`
--

INSERT INTO `investor` (`investor_id`, `investor_name`, `wallet_addr`) VALUES
(1, 'Rakesh Jhunjhunwala', '0x635b6DE4b6b3D01Ef90DaeF31E112298700b8A57'),
(2, 'EKI Energy Systems', '0x595790DA12D0B554D5ACE1F34E392B6a56205496'),
(3, 'Vijay Kedia', '0xDBE5A810398b5F7FD6B34eC9358501EEEd4252B3'),
(4, 'Ketan Parekh', '0x9529316C97394D9f6956Cf0dc78625410255DEA1'),
(5, 'Radhakishan Damani', '0xdb3D6be5DC964503A068aBe8F6bBD85290B06a5d'),
(6, 'Ritesh Malik', '0xAFBf606852F6a6186f88ebDdD08dCCF2b2667cF5');

-- --------------------------------------------------------

--
-- Table structure for table `investor_listing`
--

CREATE TABLE `investor_listing` (
  `sellShare_id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `seller_wallet_addr` varchar(50) NOT NULL DEFAULT '',
  `buyer_wallet_addr` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `investor_listing`
--

INSERT INTO `investor_listing` (`sellShare_id`, `transaction_id`, `seller_wallet_addr`, `buyer_wallet_addr`) VALUES
(1, 3, '0x635b6DE4b6b3D01Ef90DaeF31E112298700b8A57', '0x9529316c97394d9f6956cf0dc78625410255dea1');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(10) NOT NULL,
  `name` longtext NOT NULL,
  `email` longtext NOT NULL,
  `role` varchar(50) NOT NULL,
  `wallet_addr` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `name`, `email`, `role`, `wallet_addr`) VALUES
(1, 'KARTHIK K.N', 'karthik.kadivela@gmail.com', 'Company', '0x595790DA12D0B554D5ACE1F34E392B6a56205496'),
(2, '1MS19CS058', '1ms19cs058@gmail.com', 'Investor', '0x635b6DE4b6b3D01Ef90DaeF31E112298700b8A57');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` int(10) NOT NULL,
  `company_id` int(11) NOT NULL,
  `no_of_shares` int(11) NOT NULL,
  `current_shares_price` double DEFAULT '0',
  `investor_id` int(11) NOT NULL,
  `trustee_id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `swap_txn_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `request_usdt` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transaction_id`, `company_id`, `no_of_shares`, `current_shares_price`, `investor_id`, `trustee_id`, `status`, `swap_txn_hash`, `created_at`, `updated_at`, `request_usdt`) VALUES
(1, 1, 655, 0, 1, 1, 'Swap Successful', '0x881f1fd0c0985baecbf202222eb18933900f7e92d0e41d720b422631e210c17c', '2022-09-22 15:44:46', '2022-09-22 16:05:25', 650),
(2, 1, 523, 0, 3, 1, 'Swap Successful', '0xff92c0149042785126339d3543c32a398b83d06c547fadf6393148cd12a54690', '2022-09-22 16:10:56', '2022-09-22 16:17:28', 250),
(3, 1, 56, 0, 1, 1, 'Swap Successful', '0xe51314e8c7f862a7c0b9f197c8b537d64326c272a43e5d209b28e5069a19fc40', '2022-09-22 16:28:06', '2022-09-22 16:54:57', 280),
(4, 1, 100, 0, 6, 1, 'Rejected', NULL, '2022-09-22 18:04:14', '2022-09-22 18:11:57', NULL),
(5, 1, 822, 0, 6, 1, 'Swap Successful', '0x9ad1746b29facc4f007404374ac048e7dacbe7f6259e7e9fd03d3db263eaa2a3', '2022-09-22 18:19:42', '2022-09-22 18:25:16', 10),
(10, 1, 125, 0, 1, 1, 'Swap Successful', '0xd0dd85c0ca8be01ff4603c44721269fbe73524a4574f37a482b7adf285a21727', '2022-09-23 11:48:36', '2022-09-23 12:04:18', 75);

-- --------------------------------------------------------

--
-- Table structure for table `transaction_log`
--

CREATE TABLE `transaction_log` (
  `log_id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `txn_hash` varchar(128) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transaction_log`
--

INSERT INTO `transaction_log` (`log_id`, `transaction_id`, `txn_hash`, `created_at`) VALUES
(1, 4, '0xe583e591096ef2a7c8c412b5da1278b734598773b24641e9398959c440d4916f', '2022-09-22 18:08:49'),
(2, 5, '0xd9020ed5127e1d3d4f89ed63de88fc17355cfe17b0f52fb51630022cae6b1310', '2022-09-22 18:19:49'),
(3, 5, '0xe84a5940d1016090a4de6049f014c537e9113bac297b853d915ab078bd8cb437', '2022-09-22 18:20:32'),
(4, 7, '0xb40d7955e5f8d0c308964294603cd0f95a333d692a470aca2c2fbdb8f9a672dd', '2022-09-22 18:38:42'),
(5, 8, '0x1509d81e3c7be9cd102832f1d0e65254bee70d3c42cbc705edb097ce15e8925a', '2022-09-22 18:39:13'),
(6, 9, '0x28d039280b9973b25509201b6c668cc7ec079fe7166d025a5c00558584ec865b', '2022-09-22 18:43:40'),
(7, 10, '0xfea2a330910338825aa22c3962bc6411be679d79fabdd5873823e43662f1d9f9', '2022-09-23 11:48:45'),
(8, 10, '0x9a1bcc46cbf02259eaeff54be6462e84a0365f04ff371b0b98a15ac33f30418b', '2022-09-23 11:52:03'),
(9, 10, '0xfbd2fb320a2b444dc87889bd713c023a052b914519e57007e40f5628f6e0ca80', '2022-09-23 11:57:05');

-- --------------------------------------------------------

--
-- Table structure for table `trustee`
--

CREATE TABLE `trustee` (
  `trustee_id` int(11) NOT NULL,
  `trustee_name` varchar(50) DEFAULT NULL,
  `trustee_wallet_addr` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `investor`
--
ALTER TABLE `investor`
  ADD PRIMARY KEY (`investor_id`);

--
-- Indexes for table `investor_listing`
--
ALTER TABLE `investor_listing`
  ADD PRIMARY KEY (`sellShare_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `transaction_log`
--
ALTER TABLE `transaction_log`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `trustee`
--
ALTER TABLE `trustee`
  ADD PRIMARY KEY (`trustee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `investor`
--
ALTER TABLE `investor`
  MODIFY `investor_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `investor_listing`
--
ALTER TABLE `investor_listing`
  MODIFY `sellShare_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transaction_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `transaction_log`
--
ALTER TABLE `transaction_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `trustee`
--
ALTER TABLE `trustee`
  MODIFY `trustee_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
