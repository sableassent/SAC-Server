CREATE DATABASE sablecoin;
USE sablecoin;

CREATE TABLE IF NOT EXISTS `Admin` (
  `_id` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `User` (
  `_id` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `phoneNumber` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `walletAddress` varchar(256) NULL,
  `referralCode` varchar(256) NOT NULL,
  `phoneNumberVerified` boolean NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `AdminAccessToken` (
  `_id` varchar(256) NOT NULL,
  `adminId` varchar(256) NOT NULL,
  `isActive` boolean NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `UserAccessToken` (
  `_id` varchar(256) NOT NULL,
  `userId` varchar(256) NOT NULL,
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

CREATE TABLE IF NOT EXISTS `PasswordReset` (
    `_id`       varchar(256) NOT NULL,
    `userId`    varchar(256) NOT NULL,
    `otp`       varchar(10)  NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`_id`)
    FOREIGN KEY (`user_id`) REFERENCES `User`(`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Referral` (
    `_id`       varchar(256) NOT NULL,
    `from`    varchar(256) NOT NULL,
    `to`       varchar(256)  NOT NULL,
    `referralCode` varchar(10)  NOT NULL,
    `status`       varchar(10)  NOT NULL,
    `transactionHash`       varchar(256) NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
    `completedAt` TIMESTAMP NULL,
    PRIMARY KEY (`_id`)
    FOREIGN KEY (`from`) REFERENCES `User`(`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `OTPMobile` (
    `_id`       varchar(256) NOT NULL,
    `userid`    varchar(256) NOT NULL UNIQUE,
    `phoneNumber`    varchar(256) NOT NULL UNIQUE,
    `otp`       varchar(256)  NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;