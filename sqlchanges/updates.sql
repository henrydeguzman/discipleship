ALTER TABLE `user_invites`
ADD `sendemailsuccess` tinyint NOT NULL DEFAULT '0' COMMENT 'if the email is successfully sent' AFTER `email`;

