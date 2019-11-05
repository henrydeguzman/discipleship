TRUNCATE TABLE `development_churchcommunity`;
TRUNCATE TABLE `development_churchcommunity_dates`;
TRUNCATE TABLE `development_empleaders`;
TRUNCATE TABLE `development_empleaders_dates`;
TRUNCATE TABLE `development_makingdisciples`;
TRUNCATE TABLE `development_makingdisciples_dates`;
TRUNCATE TABLE `development_one2one`;
TRUNCATE TABLE `development_purplebook`;
TRUNCATE TABLE `development_purplebook_dates`;
TRUNCATE TABLE `development_weekend`;
TRUNCATE TABLE `development_weekend_dates`;
TRUNCATE TABLE `development_weekend_settings`;
TRUNCATE TABLE `user`;

INSERT INTO `user` (`userid`, `username`, `password`, `email`, `firstname`, `lastname`, `middlename`, `photoid`, `phonenumber`, `datecreated`, `profileid`, `statusid`, `churchid`) VALUES
(1,	NULL,	'3eca10f30041813f045165784e24b5a950a6cc7e',	'henrydeguzman.java73@gmail.com',	'Henry',	'De Guzman',	'Garcia',	0,	NULL,	'2019-10-07 15:25:39',	5,	3,	13),
(2,	NULL,	'17b9e1c64588c7fa6419b4d29dc1f4426279ba01',	'michael.ganzagan@victory.org.ph',	'Michael',	'Ganzagan',	'',	0,	NULL,	'2019-10-07 15:25:39',	4,	2,	13),
(3,	NULL,	'2ebe38ab858e4f22ecdd4d4b08ed4a46892314d8',	'justineang.official@hotmail.com',	'Justine',	'Ang',	'',	0,	NULL,	'2019-10-07 15:25:39',	5,	3,	13);

TRUNCATE TABLE `user_info`;
INSERT INTO `user_info` (`userid`, `personal_number`, `work_number`, `sss_number`, `pagibig_number`, `philhealth_number`, `personal_email`, `current_address`, `permanent_address`, `birthdate`, `about`, `languages`, `degree`) VALUES
(1,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(3,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL);

TRUNCATE TABLE `user_invites`;
TRUNCATE TABLE `user_vg`;
TRUNCATE TABLE `user_vg_info`;
TRUNCATE TABLE `user_vg_intern`;
TRUNCATE TABLE `user_vg_users`;

