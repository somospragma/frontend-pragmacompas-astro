import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { useErrorStore } from "@/store/errorStore";
import { ErrorModal } from "./ModalError";

// Mock the error store
vi.mock("@/store/errorStore", () => ({
  useErrorStore: vi.fn(),
}));

describe("ErrorModal", () => {
  const mockSetError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when there is no error", () => {
    // Mock the store with no error
    vi.mocked(useErrorStore).mockImplementation((selector) => selector({ error: null, setError: mockSetError }));

    const { container } = render(<ErrorModal />);
    expect(container.firstChild).toBeNull();
  });

  it("should render when there is an error", () => {
    const testError = "Test error message";

    // Mock the store with an error
    vi.mocked(useErrorStore).mockImplementation((selector) => selector({ error: testError, setError: mockSetError }));

    render(<ErrorModal />);

    // Check if modal title is rendered
    expect(screen.getByText("Error")).toBeInTheDocument();

    // Check if error message is displayed
    expect(screen.getByText(testError)).toBeInTheDocument();

    // Check if close button is present
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("should call setError with null when close button is clicked", () => {
    // Mock the store with an error
    vi.mocked(useErrorStore).mockImplementation((selector) =>
      selector({ error: "Test error", setError: mockSetError })
    );

    render(<ErrorModal />);

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(mockSetError).toHaveBeenCalledTimes(1);
  });

  it("should have the correct ARIA attributes", () => {
    // Mock the store with an error
    vi.mocked(useErrorStore).mockImplementation((selector) =>
      selector({ error: "Test error", setError: mockSetError })
    );

    render(<ErrorModal />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
  });

  it("should have the correct styling classes", () => {
    // Mock the store with an error
    vi.mocked(useErrorStore).mockImplementation((selector) =>
      selector({ error: "Test error", setError: mockSetError })
    );

    render(<ErrorModal />);

    // Check for backdrop
    expect(document.querySelector(".bg-gray-500.bg-opacity-75")).toBeInTheDocument();

    // Check for modal container
    expect(document.querySelector(".bg-white.shadow-xl")).toBeInTheDocument();

    // Check for error icon container
    expect(document.querySelector(".bg-error-50")).toBeInTheDocument();
  });
});
