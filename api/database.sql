CREATE DATABASE sablecoin;
USE sablecoin;

CREATE TABLE IF NOT EXISTS `Admin` (
  `_id` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `AdminAccessToken` (
  `_id` varchar(256) NOT NULL,
  `adminId` varchar(256) NOT NULL,
  `isActive` boolean NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Wallet` (
  `_id` varchar(256) NOT NULL,
  `privateKey` varchar(256) NOT NULL,
  `balanceETH` DOUBLE NULL,
  `balanceSAC` DOUBLE NULL,
  `fixedFees` DOUBLE NULL,
  `percentFees` DOUBLE NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Transaction` (
  `_id` varchar(256) NOT NULL,
  `from` varchar(256) NOT NULL,
  `to` varchar(256) NOT NULL,
  `amount` varchar(256) NULL,
  `amountInFloat` DOUBLE NULL,
  `fees` varchar(256) NULL,
  `feesInFloat` DOUBLE NULL,
  `nonce` INTEGER NULL,
  `status` varchar(256) NOT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
