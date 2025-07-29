import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsEmptyState } from "@bfmono/apps/bfDs/components/BfDsEmptyState.tsx";
import { BfDsInput } from "@bfmono/apps/bfDs/components/BfDsInput.tsx";
import { DeckItem } from "./DeckItem.tsx";
import { DeckCreateModal, type DeckFormData } from "./DeckCreateModal.tsx";
import { useEvalContext } from "@bfmono/apps/boltfoundry-com/contexts/EvalContext.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { GradingSample } from "@bfmono/apps/boltfoundry-com/types/grading.ts";

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

// Mock sample data for demonstration
const mockSample: GradingSample = {
  id: "sample-1",
  timestamp: "2023-10-01T12:00:00Z",
  duration: 150,
  provider: "openai",
  request: {
    url: "https://api.openai.com/v1/chat/completions",
    method: "POST",
    headers: {},
    body: {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: "Can you give me the markdown for this invoice?",
        },
        {
          role: "assistant",
          content:
            "# Invoice\n\n**Date:** 2023-10-01\n\n**Bill To:**\nJohn Doe\n123 Main St.\nCity, State, ZIP\n\n**Items:**\n- Item 1: $100.00\n- Item 2: $50.00\n\n**Total:** $150.00\n",
        },
        {
          role: "user",
          content: "What output format do you want for the invoice?",
        },
        {
          role: "assistant",
          content:
            "JSON following this format: {'lineItems': [{'description': 'Item 1', 'amount': 100.00}, {'description': 'Item 2', 'amount': 50.00}], 'total': 150.00, 'date': '2023-10-01', 'billTo': {'name': 'John Doe', 'address': '123 Main St., City, State, ZIP'}}",
        },
      ],
    },
  },
  response: {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-RateLimit-Limit": "60",
      "X-RateLimit-Remaining": "59",
    },
    body: {
      id: "chatcmpl-1234567890",
      object: "chat.completion",
      created: 1700000000,
      model: "gpt-4",
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      },
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: {
              lineItems: [
                {
                  description: "Item 1",
                  amount: 100.00,
                },
                {
                  description: "Item 2",
                  amount: 50.00,
                },
              ],
              total: 150.00,
              date: "2023-10-01",
              billTo: {
                name: "John Doe",
                address: "123 Main St., City, State, ZIP",
              },
            },
          },
        },
      ],
    },
  },
  graderEvaluations: [
    {
      graderId: "grader-1",
      graderName: "JSON Validator",
      score: 3,
      reason:
        "The JSON output correctly matches the requested format with all required fields present and properly structured.",
    },
    {
      graderId: "grader-2",
      graderName: "Data Accuracy",
      score: 3,
      reason:
        "All values from the original invoice are accurately represented in the JSON output.",
    },
  ],
  bfMetadata: {
    deckName: "Invoice Generation",
    deckContent:
      "Generate an invoice in JSON format based on the provided markdown.",
    contextVariables: {
      userId: "12345",
      sessionId: "abcde-12345",
    },
  },
};

interface DeckListProps {
  onDeckSelect?: (deckId: string) => void;
}

export function DeckList({ onDeckSelect }: DeckListProps) {
  const { startDeckCreation, startGrading } = useEvalContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [decks] = useState(mockDecks);

  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDeck = (deckData: DeckFormData) => {
    logger.info("Creating deck:", deckData);
    // TODO: Implement deck creation with GraphQL mutation
    setShowCreateModal(false);
  };

  const handleDeckClick = (deckId: string) => {
    const deck = decks.find((d) => d.id === deckId);
    if (deck) {
      // TODO: Fetch samples from API
      // For now, use mock data with multiple samples
      const mockSamples = [mockSample, { ...mockSample, id: "sample-2" }, {
        ...mockSample,
        id: "sample-3",
      }];

      startGrading(deckId, deck.name, mockSamples);
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
            {filteredDecks.map((deck) => (
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
