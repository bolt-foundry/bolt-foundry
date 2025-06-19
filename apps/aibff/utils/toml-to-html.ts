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
  <title>Evaluation Results</title>
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
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f8f9fa;
      font-weight: 600;
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
      border-radius: 5px;
      margin-top: 10px;
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
    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 16px;
      color: #666;
      transition: all 0.2s;
    }
    .tab:hover {
      color: #333;
    }
    .tab.active {
      color: #0066cc;
      border-bottom: 2px solid #0066cc;
      margin-bottom: -2px;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
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
  </style>
</head>
<body>
  <div class="container">
    <h1>Evaluation Results</h1>
    
    <script type="application/json" id="evaluation-data">
    ${JSON.stringify(data)}
    </script>
  
    ${
    !singleTab
      ? `
    <div class="tabs">
      ${
        tabEntries.map((entry, index) => `
        <button class="tab ${
          index === 0 ? "active" : ""
        }" onclick="showTab('${entry.key}')">${entry.label}</button>
      `).join("")
      }
    </div>
    `
      : ""
  }
    
    ${
    tabEntries.map((entry, index) => {
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
    <div class="tab-content ${
        singleTab || index === 0 ? "active" : ""
      }" id="tab-${entry.key}">
      <h2>${entry.label}</h2>
      
      <div class="summary">
        <p><strong>Grader:</strong> ${entry.graderName}</p>
        <p><strong>Model:</strong> ${resultData.model}</p>
        <p><strong>Total Samples:</strong> ${resultData.samples}</p>
        <p><strong>Average Distance:</strong> ${resultData.average_distance}</p>
        <p><strong>Average Latency:</strong> ${
        resultData.average_latency
          ? `${resultData.average_latency.toFixed(0)}ms`
          : "N/A"
      }</p>
        <p><strong>Average Tokens:</strong> ${
        resultData.average_total_tokens
          ? `${resultData.average_total_tokens.toFixed(0)} (${
            resultData.average_prompt_tokens?.toFixed(0) || 0
          } prompt, ${
            resultData.average_completion_tokens?.toFixed(0) || 0
          } completion)`
          : "N/A"
      }</p>
        <p><strong>Total Cost:</strong> ${
        resultData.total_cost !== undefined && resultData.total_cost > 0
          ? `$${resultData.total_cost.toFixed(4)}`
          : "N/A"
      }</p>
        <p><strong>Agreement:</strong> ${agreementPercent}% (${agreements}/${samplesWithTruth})</p>
      </div>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Grader Score</th>
          <th>Truth Score</th>
          <th>Distance</th>
          <th>Latency</th>
          <th>Tokens</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
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
          <tr>
            <td style="background-color: ${bgColor}">
              <details>
                <summary style="display: flex; align-items: center; justify-content: space-between;">
                  <span>${result.id}</span>
                  <span style="font-size: 12px; color: #666;">Click to expand ▼</span>
                </summary>
                <div class="expandable-content">
                  ${
              result.userMessage
                ? `
                  <div class="user-message">
                    <details>
                      <summary style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <span class="message-label">💬 User Message</span>
                        <span style="font-size: 12px; color: #666;">Click to expand ▼</span>
                      </summary>
                      <div class="message-content" style="margin-top: 10px;">${result.userMessage}</div>
                    </details>
                  </div>
                  `
                : ""
            }
                  
                  ${
              result.assistantResponse
                ? `
                  <div class="assistant-response">
                    <details>
                      <summary style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <span class="message-label">🤖 Assistant Response</span>
                        <span style="font-size: 12px; color: #666;">Click to expand ▼</span>
                      </summary>
                      <div class="message-content" style="margin-top: 10px;">${result.assistantResponse}</div>
                    </details>
                  </div>
                  `
                : ""
            }
                  
                  <div class="scores">
                    <div class="score-item">
                      <div class="message-label">Grader Score</div>
                      <div style="font-size: 24px; font-weight: bold;">${result.grader_score}</div>
                    </div>
                    <div class="score-item">
                      <div class="message-label">Truth Score</div>
                      <div style="font-size: 24px; font-weight: bold;">${
              result.truth_score ?? "N/A"
            }</div>
                    </div>
                    <div class="score-item">
                      <div class="message-label">Distance</div>
                      <div style="font-size: 24px; font-weight: bold; color: ${
              distance === 0
                ? "#28a745"
                : distance === 1
                ? "#ffc107"
                : "#dc3545"
            }">${distance}</div>
                    </div>
                  </div>
                  
                  ${
              result.notes
                ? `
                  <div class="grader-reasoning">
                    <details>
                      <summary style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <span class="message-label">💭 Grader's Reasoning</span>
                        <span style="font-size: 12px; color: #666;">Click to expand ▼</span>
                      </summary>
                      <div class="message-content" style="margin-top: 10px;">${result.notes}</div>
                    </details>
                  </div>
                  `
                : ""
            }
                  
                  ${
              result.graderMetadata?.verbosePrompt
                ? `
                  <div class="verbose-prompt">
                    <details>
                      <summary style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <span class="message-label">⚙️ Grader Input</span>
                        <span style="font-size: 12px; color: #666;">Click to expand ▼</span>
                      </summary>
                      <pre>${
                  escapeHtml(result.graderMetadata.verbosePrompt as string)
                }</pre>
                    </details>
                  </div>
                  `
                : ""
            }
                  
                  ${
              result.rawOutput
                ? `
                  <div class="grader-raw-response">
                    <details>
                      <summary style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <span class="message-label">🤖 Grader Raw Response</span>
                        <span style="font-size: 12px; color: #666;">Click to expand ▼</span>
                      </summary>
                      <pre>${escapeHtml(formatJson(result.rawOutput))}</pre>
                    </details>
                  </div>
                  `
                : ""
            }
                </div>
              </details>
            </td>
            <td style="background-color: ${bgColor}">${result.grader_score}</td>
            <td style="background-color: ${bgColor}">${
              result.truth_score ?? "N/A"
            }</td>
            <td style="background-color: ${bgColor}">${distance}</td>
            <td style="background-color: ${bgColor}">${
              result.latencyMs ? `${result.latencyMs}ms` : "N/A"
            }</td>
            <td style="background-color: ${bgColor}">${
              result.totalTokens ? `${result.totalTokens}` : "N/A"
            }</td>
            <td style="background-color: ${bgColor}">${
              result.totalCost !== undefined
                ? `$${result.totalCost.toFixed(6)}`
                : "N/A"
            }</td>
          </tr>`;
          }).join("")
      }
      </tbody>
      </tbody>
    </table>
    </div>
  `;
    }).join("")
  }
  </div>
  
  ${
    !singleTab
      ? `
  <script>
    function showTab(graderName) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Show selected tab
      document.getElementById('tab-' + graderName).classList.add('active');
      event.target.classList.add('active');
    }
  </script>
  `
      : ""
  }
</body>
</html>`;
}

function getColorForDistance(distance: number): string {
  if (distance === 0) return "#d4edda"; // light green
  if (distance === 1) return "#fff3cd"; // light yellow
  if (distance === 2) return "#ffeaa7"; // light orange
  return "#f8d7da"; // light red
}
