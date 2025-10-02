import React from 'react';

const navItems = [
  { id: 1, name: 'Home', link: '/' },
  { id: 2, name: 'Collections', link: '/collections' },
  { id: 3, name: 'Exhibitions', link: '/exhibitions' },
];

const NavList = () => {
  return (
    <nav>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <a href={item.link}>{item.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavList;