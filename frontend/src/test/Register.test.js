import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import Register from '../Register';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('axios'); //Mock axios

beforeEach(() => {
    jest.clearAllMocks();
});

test('successful registration shows success message', async() => {
    //Mock axios
    axios.post.mockResolvedValueOnce({
        data: { message: 'Registration Successful!'},
    });

    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

    //Username and password entry.
    fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'newuser'} ,
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password'} ,
    });

    //Submit the form.
    fireEvent.click(screen.getByRole('button', {name: /register/i}));

    await waitFor(() => {
        expect(screen.getByText(/registration successful! you can now login./i)).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/auth/register", {
        username: 'newuser',
        password: 'password'
    });
});

test('failed registration shows error message', async() => {
    //Mock axios
    axios.post.mockRejectedValueOnce({
        data: { message: 'Registration failed. Try a different username.'},
    });

    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

    //Username and password entry.
    fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'existinguser'} ,
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password'} ,
    });

    //Submit the form.
    fireEvent.click(screen.getByRole('button', {name: /register/i}));

    await  waitFor(() =>  {
        expect(screen.getByText(/registration failed. Try a different username./i)).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/auth/register", {
        username: 'existinguser',
        password: 'password'
    });
});

test('input fields update corectly', () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    //Username and password entry.
    fireEvent.change(usernameInput,  {
        target: { value: 'testuser'} 
    });

    fireEvent.change(passwordInput, {
        target: { value: 'testpassword'} 
    });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
});
    
