'use client';

import React, { useState, useCallback } from 'react';
import { Navbar, Button, Input, Dropdown, Drawer, Menu } from 'react-daisyui';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModel';
import SignupModal from './SignupModel';
import { useStyles } from '../contexts/StyleContext';

function NavBar() {
  // Use the StyleContext
  const { styles } = useStyles();

  // Use Next.js authentication hook
  const { data: session, status } = useSession();
  const router = useRouter();

  // State management for various UI elements
  const [visible, setVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized toggle functions to optimize performance
  const toggleVisible = useCallback(() => {
    setVisible(visible => !visible);
  }, []);

  const toggleProfileDropdown = useCallback(() => {
    setProfileDropdownVisible(profileDropdownVisible => !profileDropdownVisible);
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

  // Handle click on bookings link
  const handleBookingsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (status === 'authenticated') {
      router.push('/bookings');
    } else {
      setShowLoginPopup(true);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setVisible(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Large Screen Navbar */}
      <Navbar className={`${styles.backgroundColor} ${styles.textColor} hidden lg:flex`}>
        <Navbar.Start>
          <Dropdown>
            <Button tag="label" color="ghost" shape="circle" tabIndex={0}>
              {/* Hamburger menu icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </Button>
            <Dropdown.Menu className={`menu-sm w-52 mt-3 z-[1] ${styles.backgroundColor} ${styles.textColor}`}>
              <Dropdown.Item>
                <Link href="/">Home</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href="/contact_us">Contact Us</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href="/about">About</Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Start>
        <Navbar.Center>
          <Link href="/">
            <Button tag="a" color="ghost" className="normal-case text-xl">
              <img src="/photo/door.svg" alt="Door" className={`inline-block h-5 w-5 mr-2 ${styles.logoColor}`} />
              DoorDash
            </Button>
          </Link>
        </Navbar.Center>
        <Navbar.End className="navbar-end">
          {/* Search button */}
          <Button color="ghost" shape="circle" onClick={toggleVisible}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
          {/* Bookings button */}
          <Link href="/bookings" onClick={handleBookingsClick}>
            <Button color="ghost" shape="circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5M17 13l1.4 5M9 21h6M9 21a2 2 11-4 0M15 21a2 2 104 0" />
              </svg>
            </Button>
          </Link>
          {/* Profile dropdown */}
          <Dropdown>
            <Button color="ghost" shape="circle" onClick={toggleProfileDropdown}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </Button>
            {profileDropdownVisible && (
              <Dropdown.Menu className={`menu-sm w-52 mt-3 z-[1] ${styles.backgroundColor} ${styles.textColor} right-0`}>
                {status === 'authenticated' ? (
                  <>
                    <Dropdown.Item>
                      <Button onClick={() => signOut()} className={`${styles.buttonColor} ${styles.textColor}`}>Logout</Button>
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item>
                      <Button onClick={handleShowLoginModal} className={`${styles.buttonColor} ${styles.textColor}`}>Login</Button>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Button onClick={handleShowSignupModal} className={`${styles.buttonColor} ${styles.textColor}`}>Signup</Button>
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            )}
          </Dropdown>
        </Navbar.End>
      </Navbar>

      {/* Small Screen Navbar */}
      <Navbar className={`${styles.backgroundColor} ${styles.textColor} lg:hidden`}>
        <Navbar.Start>
          <Button color="ghost" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </Button>
        </Navbar.Start>
        <Navbar.Center className="flex-1 justify-center">
          <Link href="/" className="flex items-center">
            <img src="/photo/door.svg" alt="Door" className={`h-8 w-8 mr-2 ${styles.logoColor}`} />
            <span className="text-xl font-bold">DoorDash</span>
          </Link>
        </Navbar.Center>
        <Navbar.End className="flex-none">
          <Link href="/bookings" onClick={handleBookingsClick}>
            <Button color="ghost" shape="circle" className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5M17 13l1.4 5M9 21h6M9 21a2 2 11-4 0M15 21a2 2 104 0" />
              </svg>
            </Button>
          </Link>
          <Dropdown>
            <Button color="ghost" shape="circle" onClick={toggleProfileDropdown}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </Button>
            {profileDropdownVisible && (
              <Dropdown.Menu className={`menu-sm w-52 mt-3 z-[1] ${styles.backgroundColor} ${styles.textColor} right-0`}>
                {status === 'authenticated' ? (
                  <>
                    <Dropdown.Item>
                      <Button onClick={() => signOut()} className={`${styles.buttonColor} ${styles.textColor}`}>Logout</Button>
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item>
                      <Button onClick={handleShowLoginModal} className={`${styles.buttonColor} ${styles.textColor}`}>Login</Button>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Button onClick={handleShowSignupModal} className={`${styles.buttonColor} ${styles.textColor}`}>Signup</Button>
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            )}
          </Dropdown>
        </Navbar.End>
      </Navbar>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden ${styles.backgroundColor} ${styles.textColor} p-4`}>
          <Link href="/" className="block py-2">Home</Link>
          <Link href="/contact_us" className="block py-2">Contact Us</Link>
          <Link href="/about" className="block py-2">About</Link>
          <form onSubmit={handleSearch} className="mt-4">
            <Input 
              placeholder="Search Services" 
              className="w-full mb-2" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className={`w-full ${styles.buttonColor} ${styles.textColor} ${styles.hoverColor}`}>Search</Button>
          </form>
        </div>
      )}

      {/* Search Drawer */}
      <Drawer open={visible} onClickOverlay={toggleVisible} className="drawer-left" side={
        <Menu className={`p-4 w-80 h-full ${styles.backgroundColor} ${styles.textColor}`}>
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
              <Button type="submit" className={`w-full ${styles.buttonColor} ${styles.textColor} ${styles.hoverColor}`}>Search</Button>
            </Menu.Item>
          </form>
        </Menu>
      }>
      </Drawer>

      {/* Login and Signup Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${styles.backgroundColor} p-6 rounded-lg`}>
            <h2 className={`text-xl font-bold mb-4 ${styles.textColor}`}>Login Required</h2>
            <p className={`mb-4 ${styles.textColor}`}>Please log in to view your bookings.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLoginPopup(false)}
                className={`px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  handleShowLoginModal();
                }}
                className={`px-4 py-2 ${styles.buttonColor} ${styles.textColor} rounded ${styles.hoverColor}`}
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