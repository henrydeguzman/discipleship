TRUNCATE TABLE one2one;
TRUNCATE TABLE user;
TRUNCATE TABLE user_info;
TRUNCATE TABLE user_journey;
TRUNCATE TABLE user_photo;
TRUNCATE TABLE user_vg;
TRUNCATE TABLE user_vg_info;
TRUNCATE TABLE user_vg_intern;
TRUNCATE TABLE user_vg_users;
TRUNCATE TABLE weekend;
TRUNCATE TABLE weekend_settings;

INSERT INTO `user` (`userid`,`username`, `password`, `email`, `firstname`, `lastname`, `middlename`, `photoid`, `phonenumber`, `datecreated`, `profileid`, `statusid`, `churchid`, `generatedcode`, `weekendid`)
VALUES (1,NULL, '3eca10f30041813f045165784e24b5a950a6cc7e', 'henrydeguzman.java73@gmail.com', 'Henry', 'De Guzman', 'Garcia', '0', NULL, now(), '4', '3', '13', 'henry', NULL);

INSERT INTO `user_info` (`userid`, `personal_number`, `work_number`, `sss_number`, `pagibig_number`, `philhealth_number`, `personal_email`, `current_address`, `permanent_address`, `birthdate`, `about`, `languages`, `degree`)
VALUES (1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


INSERT INTO `user` (`userid`,`username`, `password`, `email`, `firstname`, `lastname`, `middlename`, `photoid`, `phonenumber`, `datecreated`, `profileid`, `statusid`, `churchid`, `generatedcode`, `weekendid`)
VALUES (2,NULL, '17b9e1c64588c7fa6419b4d29dc1f4426279ba01', 'michael.ganzagan@victory.org.ph', 'Michael', 'Ganzagan', '', '0', NULL, now(), '4', '2', '13', 'michael', NULL);

INSERT INTO `user_info` (`userid`, `personal_number`, `work_number`, `sss_number`, `pagibig_number`, `philhealth_number`, `personal_email`, `current_address`, `permanent_address`, `birthdate`, `about`, `languages`, `degree`)
VALUES (2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


INSERT INTO `user` (`userid`,`username`, `password`, `email`, `firstname`, `lastname`, `middlename`, `photoid`, `phonenumber`, `datecreated`, `profileid`, `statusid`, `churchid`, `generatedcode`, `weekendid`)
VALUES (3,NULL, '2ebe38ab858e4f22ecdd4d4b08ed4a46892314d8', 'justineang.official@hotmail.com', 'Justine', 'Ang', '', '0', NULL, now(), '4', '3', '13', 'justine', NULL);

INSERT INTO `user_info` (`userid`, `personal_number`, `work_number`, `sss_number`, `pagibig_number`, `philhealth_number`, `personal_email`, `current_address`, `permanent_address`, `birthdate`, `about`, `languages`, `degree`)
VALUES (3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);