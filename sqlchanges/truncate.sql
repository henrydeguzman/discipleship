TRUNCATE TABLE development_one2one;
TRUNCATE TABLE development_weekend;
TRUNCATE TABLE user;
TRUNCATE TABLE user_info;

TRUNCATE TABLE user_vg;
TRUNCATE TABLE user_vg_info;
TRUNCATE TABLE user_vg_intern;
TRUNCATE TABLE user_vg_users;

INSERT INTO `user` (`userid`,`username`, `password`, `email`, `firstname`, `lastname`, `middlename`, `photoid`, `phonenumber`, `datecreated`, `profileid`, `statusid`, `churchid`, `generatedcode`)
VALUES (1,NULL, '3eca10f30041813f045165784e24b5a950a6cc7e', 'henrydeguzman.java73@gmail.com', 'Henry', 'De Guzman', 'Garcia', '1', NULL, now(), '4', '3', '13', 'henry');

INSERT INTO `user_info` (`userid`, `personal_number`, `work_number`, `sss_number`, `pagibig_number`, `philhealth_number`, `personal_email`, `current_address`, `permanent_address`, `birthdate`, `about`, `languages`, `degree`)
VALUES (1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


INSERT INTO `user` (`userid`,`username`, `password`, `email`, `firstname`, `lastname`, `middlename`, `photoid`, `phonenumber`, `datecreated`, `profileid`, `statusid`, `churchid`, `generatedcode`)
VALUES (2,NULL, '17b9e1c64588c7fa6419b4d29dc1f4426279ba01', 'michael.ganzagan@victory.org.ph', 'Michael', 'Ganzagan', '', '0', NULL, now(), '4', '2', '13', 'michael');

INSERT INTO `user_info` (`userid`, `personal_number`, `work_number`, `sss_number`, `pagibig_number`, `philhealth_number`, `personal_email`, `current_address`, `permanent_address`, `birthdate`, `about`, `languages`, `degree`)
VALUES (2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


INSERT INTO `user` (`userid`,`username`, `password`, `email`, `firstname`, `lastname`, `middlename`, `photoid`, `phonenumber`, `datecreated`, `profileid`, `statusid`, `churchid`, `generatedcode`)
VALUES (3,NULL, '2ebe38ab858e4f22ecdd4d4b08ed4a46892314d8', 'justineang.official@hotmail.com', 'Justine', 'Ang', '', '0', NULL, now(), '4', '3', '13', 'justine');

INSERT INTO `user_info` (`userid`, `personal_number`, `work_number`, `sss_number`, `pagibig_number`, `philhealth_number`, `personal_email`, `current_address`, `permanent_address`, `birthdate`, `about`, `languages`, `degree`)
VALUES (3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
