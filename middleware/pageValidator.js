export default function({ route, redirect, app }) {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const accessRights = localStorage.getItem('accessRights');
  
  if (!user) {
    // User not logged in, redirect to login
    return redirect('/');
  }

  try {
    // Parse access rights (user might just be a string name now)
    const userAccessRights = accessRights ? JSON.parse(accessRights) : [];
    
    // Get the required access right for this page
    const requiredRight = route.meta.access?.right;
    
    if (!requiredRight) {
      // No access requirement, allow access
      return;
    }

    // Check if user has the required access right
    // Access rights structure: modules -> actions with actionname
    let hasAccess = false;
    
    // Check through modules and their actions
    userAccessRights.forEach(module => {
      if (module.actions && Array.isArray(module.actions)) {
        hasAccess = hasAccess || module.actions.some(action => 
          action.actionname === requiredRight ||
          action.action_description === requiredRight ||
          action.right_name === requiredRight ||
          action.right === requiredRight ||
          action === requiredRight
        );
      }
    });

    if (!hasAccess) {
      // User doesn't have required access, redirect to assets page
      console.warn(`Access denied: User doesn't have required right: ${requiredRight}`);
      console.log('User access rights:', userAccessRights);
      return redirect('/assets');
    }

  } catch (error) {
    console.error('Error validating access rights:', error);
    // On error, redirect to login
    return redirect('/');
  }
}
