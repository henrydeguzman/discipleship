ALTER TABLE `church`
ADD `churchadminid` int NOT NULL DEFAULT '0' AFTER `name`;

DROP TABLE IF EXISTS `church_admin`;
CREATE TABLE `church_admin` (
  `churchadminid` int(11) NOT NULL AUTO_INCREMENT,
  `churchid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `datecreated` datetime NOT NULL,
  PRIMARY KEY (`churchadminid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `user_invites`;
CREATE TABLE `user_invites` (
  `inviteid` int(11) NOT NULL AUTO_INCREMENT,
  `isverified` tinyint(1) NOT NULL DEFAULT '0',
  `email` text,
  `phonenumber` int(11) DEFAULT NULL,
  `datecreated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `typeid` int(11) NOT NULL COMMENT 'via email or phonenumber',
  `inviteasid` int(11) NOT NULL COMMENT 'from table user_invites_as',
  `userid` int(11) NOT NULL DEFAULT '0' COMMENT 'if verified, userid must link from table ''user''',
  `churchid` int(11) NOT NULL,
  PRIMARY KEY (`inviteid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='User invites via email or mobile#';


DROP TABLE IF EXISTS `user_invites_as`;
CREATE TABLE `user_invites_as` (
  `inviteasid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`inviteasid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user_invites_as` (`inviteasid`, `name`) VALUES
(1,	'Administrator'),
(2,	'Member');

DROP TABLE IF EXISTS `user_invites_type`;
CREATE TABLE `user_invites_type` (
  `typeid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`typeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user_invites_type` (`typeid`, `name`) VALUES
(1,	'Email'),
(2,	'Mobile');


INSERT INTO `page` (`code`, `name`, `description`, `icon`, `parentid`, `collapsible`, `pageorder`)
VALUES ('profile', 'navlink.admincenter', 'navlink.admincenter=>desc', 'fas fa-user', '0', '0', '0');

INSERT INTO `page_control_collection` (`pagecontrolid`, `pageid`)
VALUES ('1', '20');

INSERT INTO `page_control_collection` (`pagecontrolid`, `pageid`)
VALUES ('3', '20');

UPDATE `page` SET
`name` = 'navlink.profile',
`description` = 'navlink.profile=>desc'
WHERE `pageid` = '20';

ALTER TABLE `page`
ADD `linkview` int(11) NOT NULL DEFAULT '1' COMMENT 'can view in sidebar ?';

UPDATE `page` SET
`linkview` = '0'
WHERE `pageid` = '20';