/* eslint-disable @eslint-react/no-array-index-key -- Stable index keys are necessary for character rendering where no unique ID exists */
import { useState } from "react";
import { Box, Stack, Text } from "@mantine/core";
import classes from "@/components/FilterableList.module.css";

export interface FilterableListProps {
  /** Array of string items to display and search over */
  items: string[];
  /** Search bar input placeholder text */
  placeholder?: string;
  /** Callback triggered when a list item is clicked */
  onItemSelect?: (item: string) => void;
  /** Header label for the component */
  label?: string;
  /** Message to show when no items match the query */
  emptyMessage?: string;
}

interface FuzzyResult {
  item: string;
  score: number;
  matchingIndices: number[];
}

export function FilterableList({
  items = [],
  placeholder = "SEARCH NETWORK DIRECTORY...",
  onItemSelect,
  label = "FILTERABLE DIRECTORY",
  emptyMessage = "NO RECORDS FOUND",
}: FilterableListProps) {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Fuzzy search implementation
  const performFuzzySearch = (
    searchQuery: string,
    sourceItems: string[]
  ): FuzzyResult[] => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (!normalizedQuery) {
      return sourceItems.map((item) => ({
        item,
        score: 1,
        matchingIndices: [],
      }));
    }

    const results: FuzzyResult[] = [];

    for (const item of sourceItems) {
      const normalizedItem = item.toLowerCase();
      let queryIdx = 0;
      let itemIdx = 0;
      const matchingIndices: number[] = [];

      // Check if characters in query appear in sequence
      while (
        queryIdx < normalizedQuery.length &&
        itemIdx < normalizedItem.length
      ) {
        if (normalizedItem[itemIdx] === normalizedQuery[queryIdx]) {
          matchingIndices.push(itemIdx);
          queryIdx++;
        }
        itemIdx++;
      }

      // If all characters matched sequentially
      if (queryIdx === normalizedQuery.length) {
        let score = 100;

        const firstMatchIdx = matchingIndices[0];
        const lastMatchIdx = matchingIndices[matchingIndices.length - 1];

        if (firstMatchIdx !== undefined && lastMatchIdx !== undefined) {
          // Penalty for span distance (shorter span = consecutive = better)
          const span = lastMatchIdx - firstMatchIdx + 1;
          const excessChars = span - normalizedQuery.length;
          score -= excessChars * 2;

          // Penalty for starting index (earlier match is better)
          score -= firstMatchIdx * 1.5;
        }

        // Bonus for actual consecutive match pairs
        let consecutivePairsCount = 0;
        for (let k = 1; k < matchingIndices.length; k++) {
          const currentVal = matchingIndices[k];
          const prevVal = matchingIndices[k - 1];
          if (
            currentVal !== undefined &&
            prevVal !== undefined &&
            currentVal === prevVal + 1
          ) {
            consecutivePairsCount++;
          }
        }
        score += consecutivePairsCount * 8;

        results.push({
          item,
          score,
          matchingIndices,
        });
      }
    }

    // Sort by score descending (highest score first)
    return results.sort((a, b) => b.score - a.score);
  };

  const filtered = performFuzzySearch(query, items);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    if (onItemSelect) {
      onItemSelect(item);
    }
    // Briefly animate selection effect, then clear selected state highlight
    setTimeout(() => {
      setSelectedItem(null);
    }, 400);
  };

  const renderHighlightedText = (text: string, indices: number[]) => {
    if (indices.length === 0) {
      return <span>{text}</span>;
    }

    const chars = text.split("");
    return (
      <>
        {chars.map((char, i) => {
          const isHighlighted = indices.includes(i);
          return isHighlighted ? (
            <span
              key={i}
              className={classes["highlight"]}
              data-testid={`highlighted-char-${i}`}
            >
              {char}
            </span>
          ) : (
            <span key={i}>{char}</span>
          );
        })}
      </>
    );
  };

  return (
    <Box className={classes["container"]} data-testid="filterable-list">
      <Stack gap="xs">
        <Text
          fw="black"
          size="md"
          style={{ letterSpacing: "1px", textTransform: "uppercase" }}
        >
          {label}
        </Text>

        <Box className={classes["searchWrapper"]}>
          <input
            className={classes["searchInput"]}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            data-testid="search-input"
          />
        </Box>
      </Stack>

      <Box className={classes["scrollArea"]}>
        {filtered.length === 0 ? (
          <Text ta="center" size="sm" c="dimmed" py="md" fw="bold">
            {emptyMessage}
          </Text>
        ) : (
          <ul className={classes["list"]}>
            {filtered.map(({ item, matchingIndices }, idx) => {
              const isCurrentlySelected = selectedItem === item;
              const listItemClasses = `${classes["listItem"]} ${isCurrentlySelected ? classes["selectedItem"] : ""}`;
              return (
                <li
                  key={item}
                  className={listItemClasses}
                  onClick={() => handleItemClick(item)}
                  data-testid={`list-item-${idx}`}
                >
                  <Text
                    fw="bold"
                    style={{ textTransform: "uppercase" }}
                    size="sm"
                  >
                    {renderHighlightedText(item, matchingIndices)}
                  </Text>
                  {matchingIndices.length > 0 && (
                    <span className={classes["badge"]}>MATCH</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Box>

      <Group justify="space-between">
        <Text size="xs" c="dimmed" fw="bold">
          TOTAL: {items.length} ITEMS
        </Text>
        {query && (
          <Text size="xs" c="dimmed" fw="bold" data-testid="matches-count">
            FOUND: {filtered.length} MATCHES
          </Text>
        )}
      </Group>
    </Box>
  );
}

// Minimal inline helper Group to replace full Group import if we want to bypass extra imports
function Group({
  children,
  justify,
}: {
  children: React.ReactNode;
  justify: "space-between" | "flex-end";
}) {
  return (
    <div
      style={{ display: "flex", justifyContent: justify, alignItems: "center" }}
    >
      {children}
    </div>
  );
}
