import { describe, expect, it, vi } from "vitest";
import { FilterableList } from "@/components/FilterableList";
import { render, screen, userEvent } from "@test-utils";

describe("FilterableList Component", () => {
  const items = [
    "Admin Panel",
    "Database Controller",
    "Network Switch",
    "System Monitor",
    "User Profile",
  ];

  it("renders with list of items and custom headers", () => {
    render(<FilterableList items={items} label="OPERATIONAL REGISTRY" />);
    expect(screen.getByText("OPERATIONAL REGISTRY")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("SEARCH NETWORK DIRECTORY...")
    ).toBeInTheDocument();
    expect(screen.getByText("TOTAL: 5 ITEMS")).toBeInTheDocument();

    items.forEach((item, index) => {
      const element = screen.getByTestId(`list-item-${index}`);
      expect(element).toBeInTheDocument();
      expect(element.textContent).toContain(item);
    });
  });

  it("filters items using fuzzy search", async () => {
    render(<FilterableList items={items} />);
    const searchInput = screen.getByTestId("search-input");

    // Type "db" to filter down to "Database Controller"
    await userEvent.type(searchInput, "db");

    expect(screen.getByText("FOUND: 1 MATCHES")).toBeInTheDocument();
    const firstItem = screen.getByTestId("list-item-0");
    expect(firstItem.textContent).toContain("Database Controller");
  });

  it("highlights matching fuzzy characters inside list items", async () => {
    render(<FilterableList items={items} />);
    const searchInput = screen.getByTestId("search-input");

    // Type "ap" (A-p) which fuzzy matches "Admin Panel"
    await userEvent.type(searchInput, "ap");

    const firstItem = screen.getByTestId("list-item-0");
    expect(firstItem.textContent).toContain("Admin Panel");

    // The highlighted characters should be wrapped in testid elements
    const charA = screen.getByTestId("highlighted-char-0"); // First letter 'A' of Admin Panel
    const charP = screen.getByTestId("highlighted-char-6"); // Seventh letter 'P' of Admin Panel ('P' in Panel)

    expect(charA).toBeInTheDocument();
    expect(charA.textContent).toBe("A");
    expect(charP).toBeInTheDocument();
    expect(charP.textContent).toBe("P");
  });

  it("calls onItemSelect when a list item is clicked", async () => {
    const onItemSelectMock = vi.fn();
    render(<FilterableList items={items} onItemSelect={onItemSelectMock} />);

    const firstItem = screen.getByTestId("list-item-0");
    await userEvent.click(firstItem);

    expect(onItemSelectMock).toHaveBeenCalledWith("Admin Panel");
  });

  it("shows empty message if no matches", async () => {
    render(<FilterableList items={items} emptyMessage="OUT OF RANGE" />);
    const searchInput = screen.getByTestId("search-input");

    await userEvent.type(searchInput, "xyz123");

    expect(screen.getByText("OUT OF RANGE")).toBeInTheDocument();
    expect(screen.getByText("FOUND: 0 MATCHES")).toBeInTheDocument();
  });
});
