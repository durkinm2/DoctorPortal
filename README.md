# portal
## https://www.doctorportal.solutions/users/login

todo:
- setup openfda
- get user pages working
-- erase placeholder data
- add email to users table
- put password req's and re-type match code in /users

thoughts:
- create separate table for unique patient id's .. in /users: check table and if exists, recycle id. OR expire after xx time.

done
-set home redirect to login
-created admin user

todo
- create functions for create/delete patients
  -- find time stamp
- store openfda json in db
- fix single patient function


todo
- consider subapps for admin and api
- 1. use hbs and only send id
- 2. append using ajax

todo:
- get row value

testing:
-when update regimen med_name, need to reload page
-whole top navbar clickable
-login page accessible when already logged in
-/patients can't click table filter icon

-query admin table
-add forgot password
-fix dates in admin pages
