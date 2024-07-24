'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Navbar, Button, Input, Dropdown, Drawer, Menu, Modal } from 'react-daisyui';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

function NavBar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const loginRef = useRef<HTMLDialogElement>(null);
  const signupRef = useRef<HTMLDialogElement>(null);

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const toggleVisible = useCallback(() => {
    setVisible(visible => !visible);
  }, []);

  const toggleProfileDropdown = useCallback(() => {
    setProfileDropdownVisible(profileDropdownVisible => !profileDropdownVisible);
  }, []);

  const handleShowLoginModal = useCallback(() => {
    loginRef.current?.showModal();
  }, [loginRef]);

  const handleShowSignupModal = useCallback(() => {
    signupRef.current?.showModal();
  }, [signupRef]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, password: signupPassword, phone: signupPhone }),
      });
      if (response.ok) {
        alert('Signup successful! Please log in.');
        signupRef.current?.close();
      } else {
        const data = await response.json();
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      });
      if (result?.error) {
        alert(result.error);
      } else {
        alert('Login successful!');
        loginRef.current?.close();
        window.location.reload(); // Refresh to update session state
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  const handleBookingsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (status === 'authenticated') {
      router.push('/bookings');
    } else {
      setShowLoginPopup(true);
    }
  };

  return (
    <>
      <Navbar className='bg-gray-950 text-white'>
        <Navbar.Start>
          <Dropdown>
            <Button tag="label" color="ghost" shape="circle" tabIndex={0}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </Button>
            <Dropdown.Menu className="menu-sm w-52 mt-3 z-[1] text-black">
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
            <img src="/photo/door.svg" alt="Door" className="inline-block h-5 w-5 mr-2 bg-white" />
            DoorDash
          </Button>
          </Link>
        </Navbar.Center>
        <Navbar.End className="navbar-end">
          <Button color="ghost" shape="circle" onClick={toggleVisible}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
          <Link href="/bookings" onClick={handleBookingsClick}>
            <Button color="ghost" shape="circle">
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
              <Dropdown.Menu className="menu-sm w-52 mt-3 z-[1] text-black right-0">
                {status === 'authenticated' ? (
                  <>
                    <Dropdown.Item>
                      <Button onClick={() => signOut()}>Logout</Button>
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item>
                      <Button onClick={handleShowLoginModal}>Login</Button>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Button onClick={handleShowSignupModal}>Signup</Button>
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            )}
          </Dropdown>
        </Navbar.End>
      </Navbar>
      <Drawer open={visible} onClickOverlay={toggleVisible} className="drawer-left" side={
        <Menu className="p-4 w-80 h-full bg-base-200 text-base-content">
          <Menu.Item className="mb-4">
            <Input placeholder="Search Services" className="w-full" />
          </Menu.Item>

          <Menu.Item>
            <Button className="w-full bg-black text-white">Search</Button>
          </Menu.Item>
        </Menu>
      }>
      </Drawer>
      <Modal ref={loginRef} className="bg-gray-800 text-white max-w-lg mx-auto p-4 rounded-lg">
        <form onSubmit={handleLogin} method="dialog">
          <Button size="sm" color="ghost" shape="circle" className="absolute right-2 top-2">
            x
          </Button>
          <Modal.Header className="font-bold text-center">Login</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col space-y-4">
              <Input 
                type="email" 
                placeholder="Enter email" 
                className="w-full bg-gray-700 text-white rounded-md p-2"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <Input 
                type="password" 
                placeholder="Enter password" 
                className="w-full bg-gray-700 text-white rounded-md p-2"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Actions className="justify-center">
            <Button type="submit" className='bg-gray-950 text-white w-full rounded-md p-2'>Login</Button>
          </Modal.Actions>
        </form>
      </Modal>
      <Modal ref={signupRef} className="bg-gray-800 text-white max-w-lg mx-auto p-4 rounded-lg">
        <form onSubmit={handleSignup} method="dialog">
          <Button size="sm" color="ghost" shape="circle" className="absolute right-2 top-2">
            x
          </Button>
          <Modal.Header className="font-bold text-center">Sign up</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col space-y-4">
              <Input 
                type="email" 
                placeholder="Enter email" 
                className="w-full bg-gray-700 text-white rounded-md p-2" 
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
              <Input 
                type="password" 
                placeholder="Enter password" 
                className="w-full bg-gray-700 text-white rounded-md p-2" 
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
              <Input 
                type="password" 
                placeholder="Confirm password" 
                className="w-full bg-gray-700 text-white rounded-md p-2" 
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
              <Input 
                type="tel" 
                placeholder="Enter phone number" 
                className="w-full bg-gray-700 text-white rounded-md p-2" 
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Actions className="justify-center">
            <Button type="submit" className='bg-gray-950 text-white w-full rounded-md p-2'>Proceed</Button>
          </Modal.Actions>
        </form>
      </Modal>
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Login Required</h2>
            <p className="mb-4 text-gray-600">Please log in to view your bookings.</p>
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
                className="px-4 py-2 bg-black text-white rounded hover:bg-black"
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