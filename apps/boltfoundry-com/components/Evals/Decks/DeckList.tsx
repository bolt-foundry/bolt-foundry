import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsEmptyState } from "@bfmono/apps/bfDs/components/BfDsEmptyState.tsx";
import { BfDsInput } from "@bfmono/apps/bfDs/components/BfDsInput.tsx";
import { DeckItem } from "./DeckItem.tsx";
import { DeckCreateModal } from "./DeckCreateModal.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Mock data for demonstration
const mockDecks = [
  {
    id: "1",
    name: "Customer Support Quality",
    description:
      "Evaluates helpfulness, accuracy, and tone of customer support responses",
    graderCount: 5,
    lastModified: "2025-07-24",
    status: "active" as const,
    agreementRate: 92,
    totalTests: 1250,
  },
  {
    id: "2",
    name: "Code Generation Accuracy",
    description:
      "Tests correctness, efficiency, and best practices in generated code",
    graderCount: 8,
    lastModified: "2025-07-23",
    status: "active" as const,
    agreementRate: 87,
    totalTests: 3420,
  },
  {
    id: "3",
    name: "Content Moderation",
    description: "Ensures appropriate content filtering and safety guidelines",
    graderCount: 3,
    lastModified: "2025-07-22",
    status: "inactive" as const,
    agreementRate: 95,
    totalTests: 892,
  },
];

interface DeckListProps {
  onDeckSelect?: (deckId: string) => void;
}

export function DeckList({ onDeckSelect }: DeckListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [decks] = useState(mockDecks);

  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDeck = (
    deckData: { name: string; description: string; graders: Array<unknown> },
  ) => {
    logger.info("Creating deck:", deckData);
    // TODO: Implement deck creation with GraphQL mutation
    setShowCreateModal(false);
  };

  if (decks.length === 0 && searchQuery === "") {
    return (
      <>
        <BfDsEmptyState
          icon="deck"
          title="No decks yet"
          description="Create your first evaluation deck to start grading AI responses"
          action={{
            label: "Create Deck",
            onClick: () => setShowCreateModal(true),
          }}
          secondaryAction={{
            label: "Learn More",
            onClick: () => logger.info("Learn more"),
          }}
        />
        {showCreateModal && (
          <DeckCreateModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateDeck}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="decks-header">
        <div className="decks-search">
          <BfDsInput
            placeholder="Search decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <BfDsButton
          variant="primary"
          icon="plus"
          onClick={() => setShowCreateModal(true)}
        >
          Create Deck
        </BfDsButton>
      </div>

      {filteredDecks.length === 0
        ? (
          <BfDsEmptyState
            icon="settings"
            title="No decks found"
            description={`No decks match "${searchQuery}"`}
            size="small"
          />
        )
        : (
          <div className="decks-list">
            {filteredDecks.map((deck) => (
              <DeckItem
                key={deck.id}
                deck={deck}
                onClick={() => onDeckSelect?.(deck.id)}
              />
            ))}
          </div>
        )}

      {showCreateModal && (
        <DeckCreateModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateDeck}
        />
      )}
    </>
  );
}
