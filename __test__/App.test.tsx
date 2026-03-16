import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import "@testing-library/jest-dom/vitest";

describe("App", () => {
  it("should show up", () => {
    render(<App />);
    const header = screen.getByRole("heading", { name: /todos/i });
    expect(header).toBeInTheDocument();
  });
});
