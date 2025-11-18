import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MentorshipTable from "./MentorShipTable";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";
import { UserRole } from "@/shared/utils/enums/role";
import type MentorshipRequest from "@/components/page/MentoShipRequest/MentorshipRequest";

vi.mock("./MentorshipActionModal/MentorshipActionModal", () => ({
  default: () => <div data-testid="mock-modal">Modal</div>,
}));

vi.mock("@/components/molecules/MentorshipItemCard", () => ({
  default: ({ onClick, user }: { onClick: () => void; user: { firstName: string; lastName: string } }) => (
    <button onClick={onClick} data-testid="mentorship-card">
      {user.firstName} {user.lastName}
    </button>
  ),
}));

const mockRequest: MentorshipRequest = {
  id: "req-1",
  requestStatus: MentorshipStatus.CONVERSING, // Use CONVERSING as it's in TUTOR filters
  requestDate: "2025-01-01",
  tutee: {
    id: "tutee-1",
    firstName: "John",
    lastName: "Doe",
    email: "john@test.com",
    rol: UserRole.TUTEE,
    chapter: { id: "ch-1", name: "Test Chapter" },
    activeTutoringLimit: 3,
    seniority: "Junior",
  },
  skills: [{ id: "1", name: "React" }],
  needsDescription: "Need help with React",
};

describe("MentorshipTable", () => {
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with requests", () => {
    render(<MentorshipTable mentorshipRequests={[mockRequest]} refetch={mockRefetch} />);

    expect(screen.getByText("Solicitudes de Tutoría")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should filter by search term", async () => {
    const user = userEvent.setup();
    const requests = [
      mockRequest,
      {
        ...mockRequest,
        id: "req-2",
        tutee: { ...mockRequest.tutee, firstName: "Jane", lastName: "Smith" },
      },
    ];

    render(<MentorshipTable mentorshipRequests={requests} refetch={mockRefetch} />);

    const searchInput = screen.getByPlaceholderText(/buscar solicitudes/i);
    await user.type(searchInput, "Jane");

    // Check the card is filtered
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("should show empty state when no results", async () => {
    const user = userEvent.setup();
    render(<MentorshipTable mentorshipRequests={[mockRequest]} refetch={mockRefetch} />);

    const searchInput = screen.getByPlaceholderText(/buscar solicitudes/i);
    await user.type(searchInput, "NonExistent");

    expect(screen.getByText(/no se encontraron solicitudes que coincidan/i)).toBeInTheDocument();
  });

  it("should open modal when clicking a request", async () => {
    const user = userEvent.setup();
    render(<MentorshipTable mentorshipRequests={[mockRequest]} refetch={mockRefetch} />);

    const card = screen.getByText("John Doe");
    await user.click(card);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
  });

  it("should have accessible search input", () => {
    render(<MentorshipTable mentorshipRequests={[mockRequest]} refetch={mockRefetch} />);

    const searchInput = screen.getByLabelText(/buscar solicitudes por nombre o capítulo/i);
    expect(searchInput).toBeInTheDocument();
  });
});
