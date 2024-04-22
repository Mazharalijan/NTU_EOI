class Authorization {
    constructor(){
        // fetch actual roles and permissions here
        this.roles = {
            admin: ['read', 'write', 'delete'],
            user: ['read'],
          };

    }
    // chech permissions here if match then apply
    hasPermission(role, action) {
        if (this.roles[role] && this.roles[role].includes(action)) {
          return true;
        }
        return false;
      }
    // call this function in route 
    authorize(role, action) {
        return (req, res, next) => {
          if (this.hasPermission(role, action)) {
            next();
          } else {
            res.status(403).json({ message: 'Forbidden' });
          }
        };
      }
    }
    
    module.exports = new Authorization();
