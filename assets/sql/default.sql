TRUNCATE TABLE `one2one`;
TRUNCATE TABLE `user`;
TRUNCATE TABLE `user_info`;
TRUNCATE TABLE `user_journey`;
TRUNCATE TABLE `user_photo`;
TRUNCATE TABLE `user_vg`;
TRUNCATE TABLE `user_vg_info`;
TRUNCATE TABLE `user_vg_users`;
TRUNCATE TABLE `weekend`;
TRUNCATE TABLE `weekend_settings`;

INSERT INTO `user` (`userid`, `username`, `password`, `email`, `firstname`, `lastname`, `middlename`, `photoid`, `phonenumber`, `datecreated`, `profileid`, `statusid`, `churchid`, `generatedcode`, `weekendid`) VALUES
(1,	NULL,	'3eca10f30041813f045165784e24b5a950a6cc7e',	'henry@gmail.com',	'Henry',	'De Guzman',	'Garcia',	7,	'09568179975',	'2019-02-16 17:14:40',	4,	1,	13,	'henry',	NULL);

INSERT INTO `user_info` (`userid`, `personal_number`, `work_number`, `sss_number`, `pagibig_number`, `philhealth_number`, `personal_email`, `current_address`, `permanent_address`, `birthdate`, `about`, `languages`, `degree`) VALUES
(1,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'Anoyao East, Linmansangan, Binalonan, Pangasinan',	NULL,	NULL,	NULL,	NULL,	NULL);



