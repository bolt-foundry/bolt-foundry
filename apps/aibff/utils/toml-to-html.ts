// Interface for evaluation results
export interface EvaluationResult {
  id: string;
  grader_score: number;
  truth_score?: number;
  notes: string;
  userMessage?: string;
  assistantResponse?: string;
  graderMetadata?: Record<string, unknown>;
  rawOutput?: string;
  latencyMs?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  totalCost?: number;
}

export interface ModelResults {
  model: string;
  timestamp: string;
  samples: number;
  average_distance: number;
  average_latency?: number;
  average_prompt_tokens?: number;
  average_completion_tokens?: number;
  average_total_tokens?: number;
  total_cost?: number;
  results: Array<EvaluationResult>;
}

export interface GraderResults {
  grader: string;
  models: Record<string, ModelResults>;
}

export interface EvaluationDataNested {
  graderResults: Record<string, GraderResults>;
}

export interface EvaluationDataFlat {
  graderResults: Record<string, ModelResults & { grader: string }>;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatJson(jsonString: string): string {
  try {
    // Try to parse and prettify JSON
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch {
    // If not valid JSON, return as-is
    return jsonString;
  }
}

export function generateEvaluationHtml(
  data: EvaluationDataNested | EvaluationDataFlat,
): string {
  // Detect if we have nested structure (grader.models) or flat structure
  const firstGrader = Object.values(data.graderResults)[0];
  const isNested = firstGrader && "models" in firstGrader;

  // Create tab entries based on structure
  const tabEntries: Array<
    { key: string; label: string; graderName: string; modelName?: string }
  > = [];

  if (isNested) {
    // Nested structure: create tabs for each grader-model combination
    Object.entries((data as EvaluationDataNested).graderResults).forEach(
      ([graderName, graderData]) => {
        Object.entries(graderData.models || {}).forEach(([modelKey]) => {
          tabEntries.push({
            key: `${graderName}-${modelKey}`,
            label: `${graderName}-${modelKey}`,
            graderName,
            modelName: modelKey,
          });
        });
      },
    );
  } else {
    // Flat structure: create tabs for each grader
    Object.keys(data.graderResults).forEach((graderName) => {
      tabEntries.push({
        key: graderName,
        label: graderName,
        graderName,
      });
    });
  }

  const singleTab = tabEntries.length === 1;

  return `<!DOCTYPE html>
<html>
<head>
  <title>Evaluation results</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1, h2 {
      color: #333;
    }
    .summary {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .summary p {
      margin: 5px 0;
      font-size: 14px;
    }
    .results-grid {
      display: grid;
      grid-template-columns: 1fr 80px 80px 80px 100px 100px 100px;
      gap: 0;
      margin-top: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
      overflow: hidden;
    }
    .grid-header {
      background-color: #f8f9fa;
      font-weight: 600;
      padding: 10px;
      border-bottom: 1px solid #ddd;
      text-align: left;
      display: flex;
      align-items: center;
    }
    .grid-cell {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      min-height: 40px;
    }
    .grid-row {
      display: contents;
    }
    .expandable-row {
      grid-column: 1 / -1;
      border-bottom: 1px solid #ddd;
    }
    details {
      cursor: pointer;
    }
    summary {
      outline: none;
      list-style: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    .expandable-content {
      padding: 15px;
      background-color: #f8f9fa;
      cursor: initial;
    }
    .conversation {
      margin: 10px 0;
      padding: 10px;
      background-color: white;
      border-radius: 5px;
      border: 1px solid #e0e0e0;
    }
    .message-label {
      font-weight: 600;
      color: #666;
      margin-bottom: 5px;
    }
    .message-content {
      margin-left: 10px;
      white-space: pre-wrap;
    }
    .scores {
      display: flex;
      gap: 20px;
      margin: 10px 0;
    }
    .score-item {
      flex: 1;
      text-align: center;
      padding: 10px;
      border-radius: 5px;
      background-color: white;
      border: 1px solid #e0e0e0;
    }
    .grader-reasoning, .user-message, .assistant-response, .grader-raw-response {
      margin-top: 15px;
      padding: 10px;
      background-color: white;
      border-radius: 5px;
      border: 1px solid #e0e0e0;
    }
    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    .tab-radio {
      display: none;
    }
    .tab-label {
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      transition: all 0.2s;
      border: none;
      background: none;
      display: block;
    }
    .tab-label:hover {
      color: #333;
    }
    .tab-content {
      display: none;
    }
    /* Show content when there's only one tab */
    .single-tab .tab-content {
      display: block;
    }
    .tab-container {
      display: flex;
      flex-direction: column;
    }
    .verbose-prompt {
      margin-top: 15px;
      padding: 10px;
      background-color: white;
      border-radius: 5px;
      border: 1px solid #e0e0e0;
    }
    .verbose-prompt pre, .grader-raw-response pre {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
      line-height: 1.4;
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    /* Dynamic CSS rules for tabs */
    ${
    tabEntries.map((entry) => `
    #tab-radio-${entry.key}:checked ~ .tabs label[for="tab-radio-${entry.key}"] {
      color: #0066cc;
      border-bottom: 2px solid #0066cc;
      margin-bottom: -2px;
    }
    #tab-radio-${entry.key}:checked ~ .tab-container #tab-${entry.key} {
      display: block;
    }`).join("\n    ")
  }
  </style>
</head>
<body>
  <div class="container">
    <h1>Evaluation results</h1>
    
    <script type="application/json" id="evaluation-data">
    ${JSON.stringify(data)}
    </script>
  
    ${
    !singleTab
      ? `
    ${
        tabEntries.map((entry, index) => `
      <input type="radio" class="tab-radio" id="tab-radio-${entry.key}" name="tabs" ${
          index === 0 ? "checked" : ""
        }>
    `).join("")
      }
    <div class="tabs">
      ${
        tabEntries.map((entry) => `
        <label class="tab-label" for="tab-radio-${entry.key}">${entry.label}</label>
      `).join("")
      }
    </div>
    `
      : ""
  }
    
    <div class="tab-container${singleTab ? " single-tab" : ""}">
    ${
    tabEntries.map((entry) => {
      // Get the actual data based on nested or flat structure
      let resultData: ModelResults;
      if (isNested) {
        const nestedData = data as EvaluationDataNested;
        resultData =
          nestedData.graderResults[entry.graderName].models[entry.modelName!];
      } else {
        const flatData = data as EvaluationDataFlat;
        resultData = flatData.graderResults[entry.graderName];
      }

      const samplesWithTruth = resultData.results.filter((r) =>
        r.truth_score !== undefined
      ).length;
      const agreements =
        resultData.results.filter((r) => r.grader_score === r.truth_score)
          .length;
      const agreementPercent = samplesWithTruth > 0
        ? (agreements / samplesWithTruth * 100).toFixed(1)
        : 0;

      return `
    <div class="tab-content" id="tab-${entry.key}">
      ${singleTab ? `<h2>${entry.label}</h2>` : ""}
      
      <div class="summary">
        <details>
          <summary style="display: flex; justify-content: space-between; align-items: center; margin: 0; padding: 0; cursor: pointer; outline: none; list-style: none;">
            <span style="font-size: 16px;"><strong>${entry.graderName}</strong> • ${resultData.model} • ${resultData.samples} samples • ${agreementPercent}% agreement (${agreements}/${samplesWithTruth})</span>
            <span style="font-size: 12px; color: #666;">Show details ▼</span>
          </summary>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 15px; font-size: 14px;">
            <div style="text-align: center; padding: 8px;"><div style="font-weight: 600;">Average distance</div><div>${resultData.average_distance}</div></div>
            <div style="text-align: center; padding: 8px;"><div style="font-weight: 600;">Average latency</div><div>${
        resultData.average_latency
          ? `${(resultData.average_latency / 1000).toFixed(2)}s`
          : "N/A"
      }</div></div>
            <div style="text-align: center; padding: 8px;"><div style="font-weight: 600;">Average tokens</div><div>${
        resultData.average_total_tokens
          ? `${resultData.average_total_tokens.toFixed(0)} (${
            resultData.average_prompt_tokens?.toFixed(0) || 0
          } prompt, ${
            resultData.average_completion_tokens?.toFixed(0) || 0
          } completion)`
          : "N/A"
      }</div></div>
            <div style="text-align: center; padding: 8px;"><div style="font-weight: 600;">Total cost</div><div>${
        resultData.total_cost !== undefined && resultData.total_cost > 0
          ? `$${resultData.total_cost.toFixed(4)}`
          : "N/A"
      }</div></div>
          </div>
        </details>
      </div>
    
    <div class="results-container">
      <div class="header-row" style="display: flex; background-color: #f8f9fa; font-weight: 600; border-bottom: 1px solid #ddd; border: 1px solid #ddd; border-radius: 5px 5px 0 0; align-items: center;">
        <div style="flex: 3; min-width: clamp(120px, 20vw, 300px); padding: 10px; display: flex; align-items: center;">ID</div>
        <div style="flex: 0.8; min-width: clamp(50px, 6vw, 80px); padding: 10px; display: flex; align-items: center;">Grader score</div>
        <div style="flex: 0.8; min-width: clamp(50px, 6vw, 80px); padding: 10px; display: flex; align-items: center;">Truth score</div>
        <div style="flex: 0.8; min-width: clamp(50px, 6vw, 80px); padding: 10px; display: flex; align-items: center;">Distance</div>
        <div style="flex: 0.8; min-width: clamp(60px, 7vw, 90px); padding: 10px; display: flex; align-items: center;">Latency</div>
        <div style="flex: 0.8; min-width: clamp(60px, 7vw, 90px); padding: 10px; display: flex; align-items: center;">Tokens</div>
        <div style="flex: 0.8; min-width: clamp(60px, 7vw, 90px); padding: 10px; display: flex; align-items: center;">Cost</div>
        <div style="width: 30px; padding: 10px; display: flex; align-items: center; justify-content: center;"></div>
      </div>
      
      ${
        resultData.results
          .slice() // Create a copy to avoid mutating the original
          .sort((a, b) => a.id.localeCompare(b.id)) // Sort by ID alphabetically
          .map((result, _resultIndex) => {
            const distance = result.truth_score !== undefined
              ? Math.abs(result.grader_score - result.truth_score)
              : 0;
            const bgColor = getColorForDistance(distance);

            return `
      <details style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
        <summary style="display: flex; cursor: pointer; list-style: none; background-color: ${bgColor}; border-bottom: 1px solid #ddd; padding: 0; align-items: center;">
          <div style="flex: 3; min-width: clamp(120px, 20vw, 300px); padding: 10px; display: flex; align-items: center;">
            <span>${result.id}</span>
          </div>
          <div style="flex: 0.8; min-width: clamp(50px, 6vw, 80px); padding: 10px; display: flex; align-items: center;">${result.grader_score}</div>
          <div style="flex: 0.8; min-width: clamp(50px, 6vw, 80px); padding: 10px; display: flex; align-items: center;">${
              result.truth_score ?? "N/A"
            }</div>
          <div style="flex: 0.8; min-width: clamp(50px, 6vw, 80px); padding: 10px; display: flex; align-items: center;">${distance}</div>
          <div style="flex: 0.8; min-width: clamp(60px, 7vw, 90px); padding: 10px; display: flex; align-items: center;">${
              result.latencyMs
                ? `${(result.latencyMs / 1000).toFixed(2)}s`
                : "N/A"
            }</div>
          <div style="flex: 0.8; min-width: clamp(60px, 7vw, 90px); padding: 10px; display: flex; align-items: center;">${
              result.totalTokens ? `${result.totalTokens}` : "N/A"
            }</div>
          <div style="flex: 0.8; min-width: clamp(60px, 7vw, 90px); padding: 10px; display: flex; align-items: center;">${
              result.totalCost !== undefined
                ? `$${result.totalCost.toFixed(6)}`
                : "N/A"
            }</div>
          <div style="width: 30px; padding: 10px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px;">▼</div>
        </summary>
          
        <div class="expandable-content">
          ${
              result.notes
                ? `
          <div class="grader-reasoning">
            <div class="message-label" style="margin-bottom: 10px;">💭 Grader's reasoning</div>
            <div class="message-content">${result.notes}</div>
          </div>
          `
                : ""
            }
          
          ${
              result.userMessage || result.assistantResponse
                ? `
          <div class="messages" style="margin-top: 15px;">
            <details>
              <summary style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                <span class="message-label">💬 Messages</span>
                <span style="font-size: 12px; color: #666;">Click to expand ▼</span>
              </summary>
              <div style="margin-top: 10px;">
                ${
                  result.userMessage
                    ? `
                <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 5px; border: 1px solid #e0e0e0;">
                  <div class="message-label" style="margin-bottom: 5px;">User:</div>
                  <div class="message-content">${result.userMessage}</div>
                </div>
                `
                    : ""
                }
                ${
                  result.assistantResponse
                    ? `
                <div style="padding: 10px; background-color: white; border-radius: 5px; border: 1px solid #e0e0e0;">
                  <div class="message-label" style="margin-bottom: 5px;">Assistant:</div>
                  <div class="message-content">${result.assistantResponse}</div>
                </div>
                `
                    : ""
                }
              </div>
            </details>
          </div>
          `
                : ""
            }
          
          ${
              result.graderMetadata?.verbosePrompt || result.rawOutput
                ? `
          <div style="margin-top: 15px; font-size: 14px;">
            <a href="#" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; return false;" style="color: #666; text-decoration: none;">🔧 Advanced</a>
            <div style="display: none; margin-top: 10px;">
              ${
                  result.graderMetadata?.verbosePrompt
                    ? `
              <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 5px; border: 1px solid #e0e0e0;">
                <div class="message-label" style="margin-bottom: 10px;">⚙️ Grader input</div>
                <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 12px; line-height: 1.4; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${
                      escapeHtml(result.graderMetadata.verbosePrompt as string)
                    }</pre>
              </div>
              `
                    : ""
                }
              ${
                  result.rawOutput
                    ? `
              <div style="padding: 10px; background-color: white; border-radius: 5px; border: 1px solid #e0e0e0;">
                <div class="message-label" style="margin-bottom: 10px;">🤖 Grader response</div>
                <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 12px; line-height: 1.4; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${
                      escapeHtml(formatJson(result.rawOutput))
                    }</pre>
              </div>
              `
                    : ""
                }
            </div>
          </div>
          `
                : ""
            }
        </div>
      </details>`;
          }).join("")
      }
    </div>
    </div>
  `;
    }).join("")
  }
    </div>
  </div>
</body>
</html>`;
}

function getColorForDistance(distance: number): string {
  if (distance === 0) return "#d4edda"; // light green
  if (distance === 1) return "#fff3cd"; // light yellow
  if (distance === 2) return "#ffeaa7"; // light orange
  return "#f8d7da"; // light red
}
