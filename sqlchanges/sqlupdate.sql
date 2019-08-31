ALTER TABLE `user`
CHANGE `photo` `photoid` int NOT NULL DEFAULT '0' AFTER `middlename`;

ALTER TABLE `user`
CHANGE `datecreated` `datecreated` datetime NULL COMMENT 'set the date when the user is transformed to member profile' AFTER `phonenumber`;


/* May 24, 2019 at 10:10PM */
CREATE TABLE `one2one_chapter` (
  `chapterid` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `value` int NOT NULL
);
INSERT INTO `one2one_chapter` (`value`)
VALUES ('1');
INSERT INTO `one2one_chapter` (`value`)
VALUES ('2');
INSERT INTO `one2one_chapter` (`value`)
VALUES ('3');
INSERT INTO `one2one_chapter` (`value`)
VALUES ('4');
INSERT INTO `one2one_chapter` (`value`)
VALUES ('5');
INSERT INTO `one2one_chapter` (`value`)
VALUES ('6');
INSERT INTO `one2one_chapter` (`value`)
VALUES ('7');

ALTER TABLE `user_one2one`
RENAME TO `one2one`;

CREATE TABLE `weekend` (
  `weekendid` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `weekend_date` date NOT NULL
);

ALTER TABLE `user_civilstatus`
RENAME TO `user_lifestatus`;

UPDATE `user_lifestatus` SET
`statusid` = '1',
`name` = 'ENCampus'
WHERE `statusid` = '1';

UPDATE `user_lifestatus` SET
`statusid` = '2',
`name` = 'Couples'
WHERE `statusid` = '2';

UPDATE `user_lifestatus` SET
`statusid` = '3',
`name` = 'Singles'
WHERE `statusid` = '3';

UPDATE `user_lifestatus` SET
`statusid` = '4',
`name` = 'Jukebox'
WHERE `statusid` = '4';

ALTER TABLE `user`
CHANGE `statusid` `statusid` int(11) NULL COMMENT 'From user_lifestatus' AFTER `profileid`;