/**
 * Mock System Prompt Analyzer
 *
 * Temporary implementation that generates realistic grader suggestions
 * from system prompts for RLHF pipeline testing.
 */

export interface GraderSuggestion {
  name: string;
  graderText: string;
}

export interface AnalysisResult {
  graders: Array<GraderSuggestion>;
  analysisNotes: string;
}

/**
 * Mock analyzer that generates grader suggestions from system prompts
 */
export async function analyzeSystemPrompt(
  systemPrompt: string,
): Promise<AnalysisResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Generate mock graders based on common prompt patterns
  const graders: Array<GraderSuggestion> = [];

  // Always include basic helpfulness grader
  graders.push({
    name: "Helpfulness",
    graderText: `Evaluate how helpful the response is to the user's request.

Scoring Guidelines:
+3: Extremely helpful - Fully addresses request with actionable insights
+2: Very helpful - Addresses most aspects with useful information  
+1: Somewhat helpful - Provides some relevant information
0: Neutral - Neither particularly helpful nor unhelpful
-1: Slightly unhelpful - Misses key aspects or provides limited value
-2: Very unhelpful - Largely irrelevant or confusing
-3: Extremely unhelpful - Completely irrelevant or misleading`,
  });

  // Detect specific patterns and add relevant graders
  if (
    systemPrompt.toLowerCase().includes("code") ||
    systemPrompt.toLowerCase().includes("programming")
  ) {
    graders.push({
      name: "Code Quality",
      graderText: `Evaluate the quality of any code provided in the response.

Scoring Guidelines:
+3: Excellent code - Clean, efficient, well-structured, follows best practices
+2: Good code - Functional with minor improvements possible
+1: Acceptable code - Works but has some issues
0: No code provided or neutral quality
-1: Poor code - Has issues that impact functionality
-2: Bad code - Significant problems or errors
-3: Terrible code - Broken, insecure, or completely wrong`,
    });
  }

  if (
    systemPrompt.toLowerCase().includes("accurate") ||
    systemPrompt.toLowerCase().includes("fact")
  ) {
    graders.push({
      name: "Accuracy",
      graderText: `Evaluate the factual accuracy of the response.

Scoring Guidelines:
+3: Completely accurate - All facts and claims are correct
+2: Mostly accurate - Minor inaccuracies that don't affect main points
+1: Generally accurate - Some inaccuracies but overall correct
0: Mixed accuracy or unable to verify
-1: Some inaccuracies - Contains errors that could mislead
-2: Many inaccuracies - Significant factual errors
-3: Completely inaccurate - Fundamentally wrong information`,
    });
  }

  if (
    systemPrompt.toLowerCase().includes("creative") ||
    systemPrompt.toLowerCase().includes("novel")
  ) {
    graders.push({
      name: "Creativity",
      graderText: `Evaluate the creativity and originality of the response.

Scoring Guidelines:
+3: Highly creative - Novel, original, unexpected insights
+2: Creative - Some original thinking and fresh perspectives
+1: Somewhat creative - Minor creative elements
0: Standard response - Neither creative nor uncreative
-1: Limited creativity - Mostly conventional thinking
-2: Uncreative - Generic, formulaic response
-3: No creativity - Completely predictable or copied content`,
    });
  }

  // Always include clarity grader
  graders.push({
    name: "Clarity",
    graderText: `Evaluate how clear and understandable the response is.

Scoring Guidelines:
+3: Extremely clear - Easy to understand, well-organized, perfect communication
+2: Very clear - Clear communication with good structure
+1: Mostly clear - Generally understandable with minor confusion
0: Neutral clarity - Neither particularly clear nor unclear
-1: Somewhat unclear - Some confusing elements
-2: Unclear - Difficult to understand or poorly organized
-3: Very unclear - Confusing, poorly written, hard to follow`,
  });

  return {
    graders,
    analysisNotes:
      `Mock analysis generated ${graders.length} graders based on system prompt patterns. ` +
      `This is a temporary implementation for testing the RLHF pipeline.`,
  };
}
