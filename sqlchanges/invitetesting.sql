SET @userid = 18;
DELETE FROM `user` WHERE userid = @userid;
DELETE FROM `development_one2one` WHERE userid = @userid;
DELETE FROM `church_admin` WHERE userid = @userid;
DELETE FROM `user_info` WHERE userid = @userid;
DELETE FROM `user_invites` WHERE userid = @userid;