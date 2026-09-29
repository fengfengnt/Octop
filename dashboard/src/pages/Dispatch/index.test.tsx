import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import DispatchPage from ".";

describe("DispatchPage", () => {
  it("isolates task drafts and confirmations", async () => {
    const user = userEvent.setup();
    render(<DispatchPage />);
    await user.click(
      screen.getByRole("button", { name: "dispatch.loadExamples" }),
    );
    const input = screen.getByRole("textbox", { name: "dispatch.message" });
    await user.type(input, "Need ten laptops");
    await user.click(
      screen.getByRole("button", { name: /dispatch.examples.software/ }),
    );
    expect(input).toHaveValue("");
    await user.click(
      screen.getByRole("button", { name: /dispatch.examples.purchase/ }),
    );
    expect(input).toHaveValue("Need ten laptops");
    await user.click(screen.getByRole("button", { name: "dispatch.send" }));
    await user.click(screen.getByRole("button", { name: "dispatch.confirm" }));
    expect(
      screen.getByRole("button", { name: "dispatch.confirmed" }),
    ).toBeDisabled();
  });

  it("shows recoverable example states", async () => {
    const user = userEvent.setup();
    render(<DispatchPage />);
    await user.click(
      screen.getByRole("button", { name: "dispatch.loadExamples" }),
    );
    await user.click(
      screen.getByRole("button", { name: "dispatch.showFailure" }),
    );
    expect(screen.getByRole("alert")).toHaveTextContent("dispatch.failed");
    await user.click(screen.getByRole("button", { name: "dispatch.retry" }));
    expect(screen.queryByText("dispatch.failed")).not.toBeInTheDocument();
  });
});
