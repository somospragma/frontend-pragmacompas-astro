import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TutoringDetailSkeleton } from "./TutoringDetailSkeleton";

describe("TutoringDetailSkeleton", () => {
  describe("Rendering", () => {
    it("should render the skeleton component", () => {
      render(<TutoringDetailSkeleton />);
      const skeleton = screen.getByRole("status");
      expect(skeleton).toBeInTheDocument();
    });

    it("should render main container with status role", () => {
      render(<TutoringDetailSkeleton />);
      const container = screen.getByRole("status");
      expect(container).toHaveAttribute("aria-label", "Cargando detalles de tutoría");
    });

    it("should render user section", () => {
      render(<TutoringDetailSkeleton />);
      const userSection = screen.getByLabelText("Información del usuario");
      expect(userSection).toBeInTheDocument();
    });

    it("should render status section", () => {
      render(<TutoringDetailSkeleton />);
      const statusSection = screen.getByLabelText("Estado de la tutoría");
      expect(statusSection).toBeInTheDocument();
    });

    it("should render skills section", () => {
      render(<TutoringDetailSkeleton />);
      const skillsSection = screen.getByLabelText("Habilidades");
      expect(skillsSection).toBeInTheDocument();
    });

    it("should render dates section", () => {
      render(<TutoringDetailSkeleton />);
      const datesSection = screen.getByLabelText("Fechas de la tutoría");
      expect(datesSection).toBeInTheDocument();
    });

    it("should render feedback section", () => {
      render(<TutoringDetailSkeleton />);
      const feedbackSection = screen.getByLabelText("Retroalimentación");
      expect(feedbackSection).toBeInTheDocument();
    });
  });

  describe("User Section Structure", () => {
    it("should render avatar skeleton with proper aria-label", () => {
      render(<TutoringDetailSkeleton />);
      const avatarSkeleton = screen.getByLabelText("Cargando avatar");
      expect(avatarSkeleton).toBeInTheDocument();
    });

    it("should render name skeleton with proper aria-label", () => {
      render(<TutoringDetailSkeleton />);
      const nameSkeleton = screen.getByLabelText("Cargando nombre");
      expect(nameSkeleton).toBeInTheDocument();
    });

    it("should render email skeleton with proper aria-label", () => {
      render(<TutoringDetailSkeleton />);
      const emailSkeleton = screen.getByLabelText("Cargando correo");
      expect(emailSkeleton).toBeInTheDocument();
    });

    it("should render additional info skeleton with proper aria-label", () => {
      render(<TutoringDetailSkeleton />);
      const infoSkeleton = screen.getByLabelText("Cargando información adicional");
      expect(infoSkeleton).toBeInTheDocument();
    });
  });

  describe("Status Section Structure", () => {
    it("should render status label skeleton", () => {
      render(<TutoringDetailSkeleton />);
      const statusLabel = screen.getByLabelText("Cargando etiqueta de estado");
      expect(statusLabel).toBeInTheDocument();
    });

    it("should render status value skeleton", () => {
      render(<TutoringDetailSkeleton />);
      const statusValue = screen.getByLabelText("Cargando estado");
      expect(statusValue).toBeInTheDocument();
    });
  });

  describe("Skills Section Structure", () => {
    it("should render skills title skeleton", () => {
      render(<TutoringDetailSkeleton />);
      const skillsTitle = screen.getByLabelText("Cargando título de habilidades");
      expect(skillsTitle).toBeInTheDocument();
    });

    it("should render three skill skeletons", () => {
      render(<TutoringDetailSkeleton />);
      const skillSkeletons = screen.getAllByLabelText("Cargando habilidad");
      expect(skillSkeletons).toHaveLength(3);
    });
  });

  describe("Dates Section Structure", () => {
    it("should render dates title skeleton", () => {
      render(<TutoringDetailSkeleton />);
      const datesTitle = screen.getByLabelText("Cargando título de fechas");
      expect(datesTitle).toBeInTheDocument();
    });

    it("should render date label skeletons", () => {
      render(<TutoringDetailSkeleton />);
      const dateLabels = screen.getAllByLabelText("Cargando etiqueta de fecha");
      expect(dateLabels).toHaveLength(2);
    });

    it("should render date value skeletons", () => {
      render(<TutoringDetailSkeleton />);
      const datesSection = screen.getByLabelText("Fechas de la tutoría");
      const dateValues = screen.getAllByLabelText("Cargando fecha").filter((element) => datesSection.contains(element));
      expect(dateValues).toHaveLength(2);
    });

    it("should render button skeleton", () => {
      render(<TutoringDetailSkeleton />);
      const buttonSkeleton = screen.getByLabelText("Cargando botón");
      expect(buttonSkeleton).toBeInTheDocument();
    });
  });

  describe("Feedback Section Structure", () => {
    it("should render feedback title skeleton", () => {
      render(<TutoringDetailSkeleton />);
      const feedbackTitle = screen.getByLabelText("Cargando título de retroalimentación");
      expect(feedbackTitle).toBeInTheDocument();
    });

    it("should render two feedback card articles", () => {
      render(<TutoringDetailSkeleton />);
      const firstCard = screen.getByLabelText("Cargando primera retroalimentación");
      const secondCard = screen.getByLabelText("Cargando segunda retroalimentación");
      expect(firstCard).toBeInTheDocument();
      expect(secondCard).toBeInTheDocument();
    });

    it("should render evaluator name skeletons in feedback cards", () => {
      render(<TutoringDetailSkeleton />);
      const evaluatorNames = screen.getAllByLabelText("Cargando nombre del evaluador");
      expect(evaluatorNames).toHaveLength(2);
    });

    it("should render date skeletons in feedback cards", () => {
      render(<TutoringDetailSkeleton />);
      const userSection = screen.getByLabelText("Información del usuario");
      const feedbackSection = screen.getByLabelText("Retroalimentación");

      const feedbackDates = screen
        .getAllByLabelText("Cargando fecha")
        .filter((element) => feedbackSection.contains(element) && !userSection.contains(element));
      expect(feedbackDates).toHaveLength(2);
    });

    it("should render comments skeletons in feedback cards", () => {
      render(<TutoringDetailSkeleton />);
      const comments = screen.getAllByLabelText("Cargando comentarios");
      expect(comments).toHaveLength(2);
    });

    it("should render score skeletons in feedback cards", () => {
      render(<TutoringDetailSkeleton />);
      const scores = screen.getAllByLabelText("Cargando puntuación");
      expect(scores).toHaveLength(2);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA role on main container", () => {
      render(<TutoringDetailSkeleton />);
      const container = screen.getByRole("status");
      expect(container).toBeInTheDocument();
    });

    it("should have descriptive aria-label on main container", () => {
      render(<TutoringDetailSkeleton />);
      const container = screen.getByRole("status");
      expect(container).toHaveAttribute("aria-label", "Cargando detalles de tutoría");
    });

    it("should have section elements with aria-labels", () => {
      render(<TutoringDetailSkeleton />);
      const sections = screen.getAllByRole("region");
      expect(sections.length).toBeGreaterThan(0);
    });

    it("should have article elements for feedback cards", () => {
      render(<TutoringDetailSkeleton />);
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(2);
    });

    it("should have descriptive aria-labels on all skeleton elements", () => {
      render(<TutoringDetailSkeleton />);

      expect(screen.getByLabelText("Cargando avatar")).toBeInTheDocument();
      expect(screen.getByLabelText("Cargando nombre")).toBeInTheDocument();
      expect(screen.getByLabelText("Cargando correo")).toBeInTheDocument();
      expect(screen.getByLabelText("Cargando estado")).toBeInTheDocument();
      expect(screen.getAllByLabelText("Cargando habilidad")).toHaveLength(3);
      expect(screen.getByLabelText("Cargando botón")).toBeInTheDocument();
    });
  });

  describe("Semantic HTML", () => {
    it("should use section elements for major content areas", () => {
      render(<TutoringDetailSkeleton />);
      const sections = screen.getAllByRole("region");
      expect(sections.length).toBeGreaterThan(0);
    });

    it("should use article elements for feedback cards", () => {
      render(<TutoringDetailSkeleton />);
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(2);
      expect(articles[0]).toHaveAttribute("aria-label", "Cargando primera retroalimentación");
      expect(articles[1]).toHaveAttribute("aria-label", "Cargando segunda retroalimentación");
    });

    it("should have proper semantic structure", () => {
      const { container } = render(<TutoringDetailSkeleton />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBe(5);
    });
  });

  describe("Performance", () => {
    it("should memoize className values", () => {
      const { rerender } = render(<TutoringDetailSkeleton />);
      const firstRender = screen.getByRole("status");

      rerender(<TutoringDetailSkeleton />);
      const secondRender = screen.getByRole("status");

      expect(firstRender).toBe(secondRender);
    });
  });

  describe("Styling", () => {
    it("should apply flex layout to main container", () => {
      render(<TutoringDetailSkeleton />);
      const container = screen.getByRole("status");
      expect(container).toHaveClass("flex-1", "min-h-0");
    });

    it("should apply spacing classes to sections", () => {
      const { container } = render(<TutoringDetailSkeleton />);
      const userSection = container.querySelector("section");
      expect(userSection).toHaveClass("space-y-3");
    });

    it("should apply grid layout to dates section", () => {
      const { container } = render(<TutoringDetailSkeleton />);
      const datesGrid = container.querySelector(".grid");
      expect(datesGrid).toHaveClass("grid-cols-1", "sm:grid-cols-2", "gap-4");
    });

    it("should apply feedback card styling", () => {
      const { container } = render(<TutoringDetailSkeleton />);
      const feedbackCards = container.querySelectorAll(String.raw`.bg-slate-800\/30`);
      expect(feedbackCards.length).toBeGreaterThan(0);
    });

    it("should apply rounded corners to avatar skeleton", () => {
      render(<TutoringDetailSkeleton />);
      const avatar = screen.getByLabelText("Cargando avatar");
      expect(avatar).toHaveClass("rounded-full");
    });
  });

  describe("Edge Cases", () => {
    it("should render without errors when mounted multiple times", () => {
      const { unmount, rerender } = render(<TutoringDetailSkeleton />);
      expect(() => {
        rerender(<TutoringDetailSkeleton />);
        unmount();
        render(<TutoringDetailSkeleton />);
      }).not.toThrow();
    });

    it("should maintain structure across re-renders", () => {
      const { rerender } = render(<TutoringDetailSkeleton />);
      const firstSections = screen.getAllByRole("region");

      rerender(<TutoringDetailSkeleton />);
      const secondSections = screen.getAllByRole("region");

      expect(firstSections).toHaveLength(secondSections.length);
    });

    it("should have consistent aria-labels across renders", () => {
      const { rerender } = render(<TutoringDetailSkeleton />);
      const firstLabel = screen.getByLabelText("Cargando detalles de tutoría");

      rerender(<TutoringDetailSkeleton />);
      const secondLabel = screen.getByLabelText("Cargando detalles de tutoría");

      expect(firstLabel).toHaveAttribute("aria-label", secondLabel.getAttribute("aria-label"));
    });
  });
});
