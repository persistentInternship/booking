'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Navbar, Button, Input, Dropdown, Drawer, Menu } from 'react-daisyui';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModel';
import SignupModal from './SignupModel';
import { useStyles } from '../contexts/StyleContext';
import { getStylesAsCSS } from './DefaultStyle';
import Loading from './Loading';
import { API_ROUTES, PAGE_ROUTES } from '../routes';

function NavBar() {
  const { styles, setStyles, isLoading } = useStyles();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false); // New state for dropdown

  const toggleVisible = useCallback(() => {
    setVisible(visible => !visible);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleShowLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleShowSignupModal = useCallback(() => {
    setIsSignupModalOpen(true);
  }, []);

  const handleBookingsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (status === 'authenticated') {
      router.push(PAGE_ROUTES.BOOKINGS);
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${PAGE_ROUTES.SERVICES}?search=${encodeURIComponent(searchQuery.trim())}`);
      setVisible(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSettingsClick = () => {
    router.push(PAGE_ROUTES.SETTINGS);
  };

  const toggleSettingsDropdown = () => {
    setSettingsDropdownOpen(prev => !prev);
  };

  const applyDefaultTheme = () => {
    // Reset styles to default values
    setStyles((prevStyles) => ({
      ...prevStyles, // Preserve existing styles
      backgroundColor: '#ffffff', // Default background color
      textColor: '#000000', // Default text color
      // Add other default styles as needed
    }));
  };

  useEffect(() => {
    if (!isLoading) {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = getStylesAsCSS(styles);
      document.head.appendChild(styleElement);

      // Set up service worker for push notifications
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });

        // Listen for messages from the service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'STYLE_UPDATE') {
            console.log('Received style update:', event.data.styles);
            setStyles(event.data.styles);
          }
        });
      }

      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [styles, setStyles, isLoading]);

  if (isLoading) {
    return <Loading />; 
  }

  return (
    <>
      <Navbar className="navbar hidden lg:flex" style={{
        backgroundColor: styles.backgroundColor,
        color: styles.textColor
      }}>
        <Navbar.Start>
          <Dropdown>
            <Button tag="label" color="ghost" shape="circle" tabIndex={0}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </Button>
            <Dropdown.Menu className="menu-sm w-52 mt-3 z-[1]" style={{
              backgroundColor: styles.backgroundColor,
              color: styles.textColor
            }}>
              <Dropdown.Item>
                <Link href={PAGE_ROUTES.HOME}>Home</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href={PAGE_ROUTES.CONTACT_US}>Contact Us</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href={PAGE_ROUTES.ABOUT}>About</Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Start>
        <Navbar.Center>
          <Link href={PAGE_ROUTES.HOME}>
            <Button tag="a" color="ghost" className="normal-case text-xl">
              <img src="/photo/door.svg" alt="Door" className="logo inline-block h-5 w-5 mr-2" />
              {styles.logoname}
            </Button>
          </Link>
        </Navbar.Center>
        <Navbar.End className="navbar-end">
          <Button color="ghost" shape="circle" onClick={toggleVisible}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
          <Link href={PAGE_ROUTES.BOOKINGS} onClick={handleBookingsClick}>
            <Button color="ghost" shape="circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5M17 13l1.4 5M9 21h6M9 21a2 2 11-4 0M15 21a2 2 104 0" />
              </svg>
            </Button>
          </Link>
          {status === 'authenticated' ? (
            <div className="relative">
              <Button color="ghost" shape="circle" onClick={toggleSettingsDropdown}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
              {settingsDropdownOpen && ( // Dropdown menu
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                  <Link href={PAGE_ROUTES.SETTINGS}>
                    <Button color="ghost" className="w-full text-left bg-gradient-to-r from-black to-gray-800 text-white mb-2">Style Configurator</Button>
                  </Link>
                  <Dropdown.Item>
                    <Button color="ghost" onClick={applyDefaultTheme} className="w-full bg-gradient-to-r from-black to-gray-800 text-white mb-2">Default Theme</Button> {/* New button for default theme */}
                  </Dropdown.Item>
                  <Button color="ghost" className="w-full text-left bg-gradient-to-r from-black to-gray-800 text-white mb-2" onClick={() => signOut()}>Logout</Button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleShowLoginModal} className="bg-transparent hover:bg-opacity-20 hover:bg-gray-700 text-white font-semibold py-2 px-4 mr-2 focus:outline-none border-0">
              Login
            </button>
          )}
        </Navbar.End>
      </Navbar>

      <Navbar className="navbar lg:hidden" style={{
        backgroundColor: styles.backgroundColor,
        color: styles.textColor
      }}>
        <Navbar.Start>
          <Button color="ghost" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </Button>
          <Link href={PAGE_ROUTES.HOME} className="flex items-center">
            <img src="/photo/door.svg" alt="Door" className="logo h-8 w-8 mr-2" />
            <span className="text-xl font-bold">{styles.logoname}</span>
          </Link>
        </Navbar.Start>
      
        <Navbar.End className="flex-none">
          <Link href={PAGE_ROUTES.BOOKINGS} onClick={handleBookingsClick}>
            <Button color="ghost" shape="circle" className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5M17 13l1.4 5M9 21h6M9 21a2 2 11-4 0M15 21a2 2 104 0" />
              </svg>
            </Button>
          </Link>
          {status === 'authenticated' ? (
            <div className="relative">
              <Button color="ghost" shape="circle" onClick={toggleSettingsDropdown}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
              {settingsDropdownOpen && ( // Dropdown menu
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                  <Link href={PAGE_ROUTES.SETTINGS}>
                    <Button color="ghost" className="w-full text-left bg-gradient-to-r from-black to-gray-800 text-white space-y-1">Style Configurator</Button>
                  </Link>
                  <Dropdown.Item>
                    <Button color="ghost" onClick={applyDefaultTheme} className="w-full bg-gradient-to-r from-black to-gray-800 text-white mb-2">Default Theme</Button> {/* New button for default theme */}
                  </Dropdown.Item>
                  <Button color="ghost" className="w-full text-left bg-gradient-to-r from-black to-gray-800 text-white mb-2" onClick={() => signOut()}>Logout</Button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleShowLoginModal} className="bg-transparent hover:bg-opacity-20 hover:bg-gray-700 text-white font-semibold py-2 px-4 mr-2 focus:outline-none border-0">
              Login
            </button>
          )}
        </Navbar.End>
      </Navbar>

      {mobileMenuOpen && (
        <div className="lg:hidden p-4">
          <Link href={PAGE_ROUTES.HOME} className="block py-2">Home</Link>
          <Link href={PAGE_ROUTES.CONTACT_US} className="block py-2">Contact Us</Link>
          <Link href={PAGE_ROUTES.ABOUT} className="block py-2">About</Link>
          <form onSubmit={handleSearch} className="mt-4">
            <Input 
              placeholder="Search Services" 
              className="w-full mb-2" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="w-full">Search</Button>
          </form>
        </div>
      )}

      <Drawer open={visible} onClickOverlay={toggleVisible} className="drawer-left" side={
        <Menu className="p-4 w-80 h-full">
          <form onSubmit={handleSearch}>
            <Menu.Item className="mb-4">
              <Input 
                placeholder="Search Services" 
                className="w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Menu.Item>
            <Menu.Item>
              <Button type="submit" className="w-full">Search</Button>
            </Menu.Item>
          </form>
        </Menu>
      }>
      </Drawer>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onShowSignup={handleShowSignupModal}
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />

      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg">
            <h2></h2>
            <p className="mb-4">Please log in to view your bookings.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  handleShowLoginModal();
                }}
                className="px-4 py-2 rounded"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;