import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("menampilkan teks status, bukan hanya warna", () => {
    render(<StatusBadge tone="danger">Offline · 3 transaksi menunggu dikirim</StatusBadge>);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("Offline · 3 transaksi menunggu dikirim");
    expect(badge.querySelector("svg")).not.toBeNull();
  });
});
