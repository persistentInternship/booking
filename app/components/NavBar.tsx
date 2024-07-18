"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Navbar, Button, Input, Dropdown, Badge, Drawer, Menu, Modal } from 'react-daisyui';

function NavBar() {
  const [visible, setVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const loginRef = useRef<HTMLDialogElement>(null);
  const signupRef = useRef<HTMLDialogElement>(null);

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
                            <a href="/">Home</a>
                        </Dropdown.Item>
                        
                        <Dropdown.Item>
                            <a href="/contact_us">Contact Us</a>
                        </Dropdown.Item>

                        <Dropdown.Item>
                            <a href="/about">About</a>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar.Start>
            <Navbar.Center>
                <Button tag="a" color="ghost" className="normal-case text-xl">
                    <img src="/photo/door.svg" alt="Door" className="inline-block h-5 w-5 mr-2 bg-white" />
                    DoorDash                </Button>
            </Navbar.Center>
            <Navbar.End className="navbar-end">
                <Button color="ghost" shape="circle" onClick={toggleVisible}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </Button>
                <Button color="ghost" shape="circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5M17 13l1.4 5M9 21h6M9 21a2 2 11-4 0M15 21a2 2 104 0" />
                    </svg>
                </Button>
                <Dropdown>
                    <Button color="ghost" shape="circle" onClick={toggleProfileDropdown}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </Button>
                    {profileDropdownVisible && (
                        <Dropdown.Menu className="menu-sm w-52 mt-3 z-[1] text-black right-0">
                            <Dropdown.Item>
                                <Button onClick={handleShowLoginModal}>Login</Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button onClick={handleShowSignupModal}>Signup</Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <a href="/logout">Logout</a>
                            </Dropdown.Item>
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
                <Menu.Item className="mb-4">
                    <Dropdown className="custom-dropdown w-full">
                        <Dropdown.Toggle className="w-full">Select Place</Dropdown.Toggle>
                        <Dropdown.Menu className="w-full">
                            <Dropdown.Item className="w-full">Place 1</Dropdown.Item>
                            <Dropdown.Item className="w-full">Place 2</Dropdown.Item>
                            <Dropdown.Item className="w-full">Place 3</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                <Menu.Item>
                    <Button className="w-full bg-black text-white">Search</Button>
                </Menu.Item>
            </Menu>
        }>
        </Drawer>
        <Modal ref={loginRef} className="bg-gray-800 text-white max-w-lg mx-auto p-4 rounded-lg">
            <form method="dialog">
                <Button size="sm" color="ghost" shape="circle" className="absolute right-2 top-2">
                    x
                </Button>
            </form>
            <Modal.Header className="font-bold text-center">Login</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col space-y-4">
                    <Input type="email" placeholder="Enter email" className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <Input type="password" placeholder="Enter password" className="w-full bg-gray-700 text-white rounded-md p-2" />
                </div>
            </Modal.Body>
            <Modal.Actions className="justify-center">
                <Button className='bg-gray-950 text-white w-full rounded-md p-2'>Proceed</Button>
            </Modal.Actions>
        </Modal>
        <Modal ref={signupRef} className="bg-gray-800 text-white max-w-lg mx-auto p-4 rounded-lg">
            <form method="dialog">
                <Button size="sm" color="ghost" shape="circle" className="absolute right-2 top-2">
                    x
                </Button>
            </form>
            <Modal.Header className="font-bold text-center">Sign up</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col space-y-4">
                    <Input type="email" placeholder="Enter email" className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <Input type="password" placeholder="Enter password" className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <Input type="password" placeholder="Confirm password" className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <Input type="tel" placeholder="Enter phone number" className="w-full bg-gray-700 text-white rounded-md p-2" />
                </div>
            </Modal.Body>
            <Modal.Actions className="justify-center">
                <Button className='bg-gray-950 text-white w-full rounded-md p-2'>Proceed</Button>
            </Modal.Actions>
        </Modal>
    </>
);
}

export default NavBar;