module.exports = function(req, res, next) {
 roleid = parseInt(req.user.role_id);

 req.app.get('db').roles.findOne({role_name : "admin"},
   function(err, result) {
     roleType = parseInt(result.role_id);
   });

 if (roleid == roleType){
   res.redirect('admin');
 } else {
   res.redirect('profile');
 }
 
}
