const routes = {
  dashboard: '/',
  museums: {
    list: '/museums/admin',
    detail: (id: string) => `/museums/admin/${id}`,
  },
  users: '/users',
  settings: '/settings',
  policies: '/policies',
  rolebase: {
    roles: '/rolebase/roles',
  },
  payments: {
    orders: '/payments/orders',
    plans: '/payments/plans',
    subscriptions: 'payments/subscriptions',
    payouts: 'payments/payouts',
  },
};

export default routes;