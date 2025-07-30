import { iso } from "@iso-bfc";

export const GradingSamples = iso(`
  field Query.GradingSamples($deckId: ID!) @component {
    getSamplesForDeck(deckId: $deckId) {
      id
      timestamp
      duration
      provider
      request
      response
      graderEvaluations
      humanGrade
      bfMetadata
    }
  }
`)(function GradingSamples({ data }) {
  const samples = data.getSamplesForDeck;

  // Transform the stringified JSON fields back to objects
  const transformedSamples = samples.map((sample) => ({
    id: sample.id,
    timestamp: sample.timestamp,
    duration: sample.duration,
    provider: sample.provider,
    request: JSON.parse(sample.request),
    response: JSON.parse(sample.response),
    graderEvaluations: sample.graderEvaluations
      ? JSON.parse(sample.graderEvaluations)
      : null,
    humanGrade: sample.humanGrade ? JSON.parse(sample.humanGrade) : null,
    bfMetadata: JSON.parse(sample.bfMetadata),
  }));

  return transformedSamples;
});
