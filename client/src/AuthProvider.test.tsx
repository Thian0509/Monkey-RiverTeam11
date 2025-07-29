import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "./AuthProvider";
import { TestConsumer } from "./TestConsumer";
import { vi } from "vitest";

// Mock localStorage
beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

// Mock token + parseJwt return
const fakeToken = "header." + btoa(JSON.stringify({ email: "test@example.com" })) + ".sig";

describe("AuthProvider", () => {
  it("should show no user by default", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByText(/User: None/i)).toBeInTheDocument();
  });

  it("logs in user correctly", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: fakeToken }),
      })
    ));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText(/User: test@example.com/i)).toBeInTheDocument();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("token", fakeToken);
  });

  it("logs out user correctly", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(screen.getByText(/User: None/i)).toBeInTheDocument();
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
  });

  it("registers user correctly", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: fakeToken }),
      })
    ));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    
    const registerButton = screen.getByText("Login");
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/User:/i)).toBeInTheDocument();
    });
    expect(localStorage.setItem).toHaveBeenCalledWith("token", fakeToken);
  });
});
