import { it, expect, describe, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../src/App";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import type { Todo } from "../src/constants/Types";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("App", () => {
  it("should show up", () => {
    render(<App />);
    const header = screen.getByRole("heading", { name: /todos/i });
    expect(header).toBeInTheDocument();
  });

  it("should show error when fetch doesn't work", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("should show loading state", async () => {
    mockedAxios.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    render(<App />);

    expect(screen.queryByText(/loading/i)).toBeInTheDocument();
  });

  it("should show place holder message when response is empty", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] } as any);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/no todos/i)).toBeInTheDocument();
    });
  });
});
