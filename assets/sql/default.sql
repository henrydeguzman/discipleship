TRUNCATE TABLE `user`;
TRUNCATE TABLE `user_journey`;
TRUNCATE TABLE `user_info`;
TRUNCATE TABLE `one2one`;

/* user */
INSERT INTO `user`
(
`userid`, `username`, `password`, `email`, `firstname`,
`lastname`, `middlename`, `photo`, `phonenumber`, `datecreated`,
`profileid`, `statusid`, `generatedcode`)
VALUES (
'1', NULL, '3eca10f30041813f045165784e24b5a950a6cc7e', 'a@gmail.com', 'Henry',
'De Guzman', 'Garcia', NULL, '09568179975', now(),
'3', '1', 'henry');

/* user info */
INSERT INTO `user_info` (
`userid`, `personal_number`, `work_number`, `sss_number`, `pagibig_number`,
`philhealth_number`, `personal_email`, `current_address`, `permanent_address`, `birthdate`,
`about`, `languages`)
VALUES (
'1', NULL, NULL, NULL, NULL,
NULL, NULL, 'Anoyao East, Linmansangan, Binalonan, Pangasinan', NULL, NULL,
NULL, NULL);

/* user_church */
INSERT INTO `user_church` (`userid`, `churchid`, `profileid`, `datecreated`)
VALUES ('1', '13', NULL, now());


CREATE TABLE `weekend_settings` (
  `weekendsetid` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `chapter` tinyint NOT NULL DEFAULT '4'
);

ALTER TABLE `user`
ADD `churchid` int NOT NULL AFTER `statusid`;

DROP TABLE `user_church`;

INSERT INTO `user_profile` (`profileid`, `name`)
VALUES ('4', 'Super admin');