import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./Dialog";

describe("Dialog", () => {
  const user = userEvent.setup();

  describe("Basic Functionality", () => {
    it("should not render content when closed", () => {
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Hidden Content</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    });

    it("should render content when opened via trigger", async () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText("Open Dialog"));

      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      expect(screen.getByText("Dialog Description")).toBeInTheDocument();
    });

    it("should render content when defaultOpen is true", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Auto Open Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Auto Open Dialog")).toBeInTheDocument();
    });
  });

  describe("Close Functionality", () => {
    it("should close when DialogClose is clicked", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Closable Dialog</DialogTitle>
            <DialogFooter>
              <DialogClose>Close Button</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Closable Dialog")).toBeInTheDocument();

      await user.click(screen.getByText("Close Button"));

      await waitFor(() => {
        expect(screen.queryByText("Closable Dialog")).not.toBeInTheDocument();
      });
    });

    it("should close when X button is clicked", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog with X</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Dialog with X")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /close/i }));

      await waitFor(() => {
        expect(screen.queryByText("Dialog with X")).not.toBeInTheDocument();
      });
    });

    it("should close when Escape key is pressed", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Escapable Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Escapable Dialog")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Escapable Dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("Controlled State", () => {
    it("should respect open prop", () => {
      const { rerender } = render(
        <Dialog open={false}>
          <DialogContent>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.queryByText("Controlled Dialog")).not.toBeInTheDocument();

      rerender(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Controlled Dialog")).toBeInTheDocument();
    });

    it("should call onOpenChange when state changes", async () => {
      const onOpenChange = vi.fn();

      render(
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Callback Dialog</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText("Open"));
      expect(onOpenChange).toHaveBeenCalledWith(true);

      await user.click(screen.getAllByText("Close")[0]);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Content Rendering", () => {
    it("should render all dialog parts correctly", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Full Dialog</DialogTitle>
              <DialogDescription>Complete description</DialogDescription>
            </DialogHeader>
            <div>Body content</div>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Full Dialog")).toBeInTheDocument();
      expect(screen.getByText("Complete description")).toBeInTheDocument();
      expect(screen.getByText("Body content")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });

    it("should handle empty content", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent />
        </Dialog>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
