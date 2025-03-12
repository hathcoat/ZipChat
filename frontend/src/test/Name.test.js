import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import Name from '../Name';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('axios'); //Mock axios

//Mock use navigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        //useNavigate: jest.fn(),
        useNavigate: () => mockedUsedNavigate,
    };
});

//useNavigate.mockReturnValue(mockedUsedNavigate)

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("username", "testuser");
});

test("fetches and displays user data correctly", async () => {
    axios.get.mockResolvedValueOnce({
        data: {
            first_name: "Arthur",
            last_name: "Morgan",
            avatarColor: "#3498db",
        },
    });

    render(
        <MemoryRouter>
            <Name />
        </MemoryRouter>
    );

    expect(screen.getByText(/Set Your Name & Avatar Color/i)).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByDisplayValue("Arthur")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Morgan")).toBeInTheDocument();
    });

    expect(localStorage.getItem("first_name")).toBe("Arthur");
    expect(localStorage.getItem("last_name")).toBe("Morgan");
    expect(localStorage.getItem("avatarColor")).toBe("#3498db");
});

test("updates first name, last name, and avatar color", () => {
    render(
        <MemoryRouter>
            <Name />
        </MemoryRouter>
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);

    fireEvent.change(firstNameInput, {target: {value: "John"}});
    fireEvent.change(lastNameInput, {target: {value: "Marston"}});

    expect(firstNameInput.value).toBe("John");
    expect(lastNameInput.value).toBe("Marston");

    //Avatar click
    const colorOptions = screen.getAllByTestId("avatar-color-option");
    fireEvent.click(colorOptions[1]);

    expect(colorOptions[1]).toHaveStyle("border: 3px solid black");
});

test("submission and update local storage", async () => {
    axios.post.mockResolvedValueOnce({ data: { redirect: true} })

    render(
        <MemoryRouter>
            <Name />
        </MemoryRouter>
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const submitButton = screen.getByRole("button", {name: /Save/i});

    fireEvent.change(firstNameInput, {target: {value: "Alice"}});
    fireEvent.change(lastNameInput, {target: {value: "Smith"}});

    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:5000/api/auth/setname",
            {
                first_name: "Alice",
                last_name: "Smith",
                avatarColor: "#3498db",
            },
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: expect.stringContaining("Bearer"),
                }),
            })
        );

        expect(localStorage.getItem("first_name")).toBe("Alice");
        expect(localStorage.getItem("last_name")).toBe("Smith");
    });

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/home");
});

test("Should not allow for entries larger then 30 characters for first and last name", async () => {
    render(<Name />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);

    fireEvent.change(firstNameInput, {target: {value: "a".repeat(35) }});
    fireEvent.change(lastNameInput, {target: {value: "b".repeat(35) }});

    expect(screen.getByDisplayValue('a'.repeat(30))).toBeInTheDocument();
    expect(screen.getByDisplayValue('b'.repeat(30))).toBeInTheDocument();
})





