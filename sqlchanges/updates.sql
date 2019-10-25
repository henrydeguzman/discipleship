ALTER TABLE `church`
ADD `churchadminid` int NOT NULL DEFAULT '0' AFTER `name`;

INSERT INTO `page` (`code`, `name`, `description`, `icon`, `parentid`, `collapsible`, `pageorder`)
VALUES ('profile', 'navlink.admincenter', 'navlink.admincenter=>desc', 'fas fa-user', '0', '0', '0');

INSERT INTO `page_control_collection` (`pagecontrolid`, `pageid`)
VALUES ('1', '20');

INSERT INTO `page_control_collection` (`pagecontrolid`, `pageid`)
VALUES ('3', '20');

UPDATE `page` SET
`name` = 'navlink.profile',
`description` = 'navlink.profile=>desc',
WHERE `pageid` = '20';

ALTER TABLE `page`
ADD `linkview` int(11) NOT NULL DEFAULT '1' COMMENT 'can view in sidebar ?';

UPDATE `page` SET
`linkview` = '0'
WHERE `pageid` = '20';