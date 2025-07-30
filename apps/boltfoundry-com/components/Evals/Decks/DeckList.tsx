import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsEmptyState } from "@bfmono/apps/bfDs/components/BfDsEmptyState.tsx";
import { BfDsInput } from "@bfmono/apps/bfDs/components/BfDsInput.tsx";
import { DeckItem } from "./DeckItem.tsx";
import { DeckCreateModal, type DeckFormData } from "./DeckCreateModal.tsx";
import { useEvalContext } from "@bfmono/apps/boltfoundry-com/contexts/EvalContext.tsx";
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
  evalData?: any;
}

export function DeckList({ onDeckSelect, evalData }: DeckListProps) {
  const { startDeckCreation, startGrading } = useEvalContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Transform BfDeck data to match existing interface
  const decks =
    evalData?.currentViewer?.organization?.bfDecks?.edges?.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name,
      description: edge.node.description || "No description available",
      graderCount: 0, // TODO: Add grader count to BfDeck
      lastModified: new Date().toISOString().split("T")[0], // TODO: Add lastModified to BfDeck
      status: "active" as const,
      agreementRate: 90, // TODO: Calculate from grader results
      totalTests: edge.node.bfSamples?.edges?.length || 0,
    })) || mockDecks;

  const filteredDecks = decks.filter((deck: any) =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDeck = (deckData: DeckFormData) => {
    logger.info("Creating deck:", deckData);
    // TODO: Implement deck creation with GraphQL mutation
    setShowCreateModal(false);
  };

  const handleDeckClick = (deckId: string) => {
    const deck = decks.find((d: any) => d.id === deckId);
    if (deck) {
      // Samples will be fetched by GradingInbox using GraphQL
      startGrading(deckId, deck.name);
    }
    onDeckSelect?.(deckId);
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
            onClick: startDeckCreation,
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
          onClick={startDeckCreation}
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
            {filteredDecks.map((deck: any) => (
              <DeckItem
                key={deck.id}
                deck={deck}
                onClick={() => handleDeckClick(deck.id)}
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
