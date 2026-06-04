/** Where each role lands after login / when they hit a page they can't access. */
export const homeForRole = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'DELIVERY':
      return '/delivery';
    default:
      return '/';
  }
};

/** Which login portal a role belongs to. */
export const loginForRole = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/login';
    case 'DELIVERY':
      return '/delivery/login';
    default:
      return '/customer/login';
  }
};
