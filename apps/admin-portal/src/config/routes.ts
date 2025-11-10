const routes = {
  dashboard: '/',
  museums: {
    list: '/museums/admin',
    detail: (id: string) => `/museums/admin/${id}`,
    approval: '/museums/approval',
  },
  users: '/users',
  settings: '/settings',
  policies: '/policies',
  roles: {
    list: '/roles',
    detail: (id: string) => `/roles/${id}`,
  },
  payments: {
    orders: '/payments/orders',
    plans: '/payments/plans',
    subscriptions: 'payments/subscriptions',
    payouts: 'payments/payouts',
  },
};

export default routes;