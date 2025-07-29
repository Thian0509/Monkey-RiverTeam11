import React from 'react'

const navBarItems = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    link: '/'
  },
  {
    label: 'Travel Risk Assessment',
    icon: 'pi pi-exclamation-triangle',
    link: '/travelrisk',
  },
  {
    label: 'Notifications',
    icon: 'pi pi-bell',
    link: '/notifications',
  },
  {
    label: 'Account',
    icon: 'pi pi-user',
    link: '/account'
  }
]

class NavBar extends React.Component {
  render() {
    return (
      <nav className="bg-white p-4 sticky top-0 w-full shadow-md z-40">
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">M&R Travel Risk Assessment Tool</div>
          <div className="flex gap-2 items-center text-sm">
            {navBarItems.map((item) => (
              <a
                key={item.label}
                href={item.link}
                className="flex items-center gap-1.5 hover:bg-red-100 p-1 px-2 rounded transition-colors duration-200"
              >
                <i className={item.icon}></i>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    )
  }
}

export default NavBar