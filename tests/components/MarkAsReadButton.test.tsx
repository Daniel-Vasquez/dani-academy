// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import MarkAsReadButton from "@/components/course/MarkAsReadButton";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("marca la sección, llama a la API con PUT y avisa al índice", async () => {
  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(null, { status: 204 }));
  const events: unknown[] = [];
  document.addEventListener("da:section-read", (e) => events.push((e as CustomEvent).detail));
  render(<MarkAsReadButton sectionId="B1.1" />);

  await userEvent.click(screen.getByRole("button", { name: /marcar como leído/i }));

  expect(fetchMock).toHaveBeenCalledWith("/api/progress/B1.1", { method: "PUT" });
  expect(screen.getByRole("button", { name: /leído/i })).toHaveAttribute("aria-pressed", "true");
  expect(events).toEqual([{ sectionId: "B1.1", read: true }]);
});

it("desmarca con DELETE si ya estaba leída", async () => {
  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(null, { status: 204 }));
  render(<MarkAsReadButton sectionId="B1.1" initialRead />);

  await userEvent.click(screen.getByRole("button", { name: "Leído" }));

  expect(fetchMock).toHaveBeenCalledWith("/api/progress/B1.1", { method: "DELETE" });
  expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
});

it("revierte el estado si la API falla", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500 }));
  render(<MarkAsReadButton sectionId="B1.1" />);

  await userEvent.click(screen.getByRole("button", { name: /marcar como leído/i }));

  expect(await screen.findByText(/no se pudo guardar/i)).toBeInTheDocument();
  expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
});

it("revierte también si el límite de peticiones responde 429", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 429 }));
  render(<MarkAsReadButton sectionId="B1.1" />);

  await userEvent.click(screen.getByRole("button", { name: /marcar como leído/i }));

  expect(await screen.findByText(/no se pudo guardar/i)).toBeInTheDocument();
  expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
});
