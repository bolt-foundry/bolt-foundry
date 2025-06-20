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

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
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
    {
      key: string;
      sanitizedKey: string;
      label: string;
      graderName: string;
      modelName?: string;
    }
  > = [];

  if (isNested) {
    // Nested structure: create tabs for each grader-model combination
    Object.entries((data as EvaluationDataNested).graderResults).forEach(
      ([graderName, graderData]) => {
        Object.entries(graderData.models || {}).forEach(([modelKey]) => {
          const key = `${graderName}-${modelKey}`;
          tabEntries.push({
            key,
            sanitizedKey: sanitizeId(key),
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
        sanitizedKey: sanitizeId(graderName),
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
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --pageBackground: #18191a;
      --primary-color: rgba(255, 215, 0, 1);
      --primary-light: rgba(255, 215, 0, 0.05);
      --emerald: rgba(0, 255, 124, 0.2);
      --yellow: rgba(255, 233, 0, 0.2);
      --orange: rgba(255, 137, 0, 0.2);
      --red: rgba(255, 0, 0, 0.2);
      --success-color: rgba(0, 255, 124, 1);
      --warning-color: rgba(255, 137, 0, 1);
      --error-color: rgba(255, 0, 0, 1);
      --gray-50: #1f2022;
      --gray-70: #222427;
      --gray-100: #2c2f33;
      --gray-200: #3a3d42;
      --gray-300: #51555b;
      --gray-400: #687078;
      --gray-500: #818991;
      --gray-600: #a6adb6;
      --gray-700: #c6ccd4;
      --gray-800: #e3e7eb;
      --gray-900: #f7fafb;
      --border-radius: 8px;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      margin: 0;
      padding: 0;
      background: var(--pageBackground);
      color: var(--gray-900);
      line-height: 1.6;
      min-height: 100vh;
    }

    .container {
      border-radius: var(--border-radius);
      overflow: hidden;
    }

    .header {
      color: white;
      padding: 2rem;
      padding-bottom: 0;
    }

    .header svg {
      height: 24px;
    }

    .header h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .header p {
      margin: 0.5rem 0 0 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .content {
      padding: 2rem;
    }

    .summary {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: var(--border-radius);
      overflow: hidden;
      margin-bottom: 2rem;
      transition: all 0.2s ease;
    }

    .summary-header {
      padding: 1rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.2s ease;
    }

    .summary-header:hover {
      background: var(--gray-70);
    }

    .summary-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .summary-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--gray-900);
    }

    .summary-subtitle {
      color: var(--gray-600);
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }

    .summary-toggle {
      color: var(--gray-400);
      font-size: 0.875rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    summary {
      cursor: pointer;
    }

    summary:hover .summary-toggle {
      color: var(--primary-color);
    }

    .summary-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
      border-top: 1px solid var(--gray-200);
      background: var(--pageBackground);
    }

    .metric-card {
      text-align: center;
      padding: 1rem;
      background: var(--gray-50);
      border-radius: 8px;
      border: 1px solid var(--gray-200);
    }

    .metric-label {
      font-weight: 600;
      color: var(--gray-700);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--gray-900);
    }

    .tabs {
      display: flex;
      margin-bottom: 2rem;
      overflow-x: auto;
    }

    .tab-radio {
      display: none;
    }

    .tab-label {
      padding: 1rem 1.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      color: var(--gray-600);
      border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
      white-space: nowrap;
      position: relative;
    }

    .tab-label:hover {
      color: var(--primary-color);
      background: var(--primary-light);
    }

    .tab-content {
      display: none;
    }

    .single-tab .tab-content {
      display: block;
    }

    .results-container {
      background: var(--pageBackground);
      border: 1px solid var(--gray-200);
      border-radius: var(--border-radius);
      overflow: hidden;
    }

    .header-row {
      display: flex;
      background: var(--gray-100);
      font-weight: 600;
      color: var(--gray-700);
      border-bottom: 2px solid var(--gray-200);
      align-items: center;
      font-size: 0.875rem;
    }

    .header-cell {
      padding: 1rem;
      display: flex;
      align-items: center;
    }

    .result-row {
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      transition: all 0.2s ease;
    }

    .result-row:hover {
      background: var(--gray-70);
    }

    .result-summary {
      display: flex;
      cursor: pointer;
      align-items: center;
      padding: 0;
      transition: all 0.2s ease;
    }

    .result-cell {
      padding: 1rem;
      display: flex;
      align-items: center;
    }

    .result-id {
      flex: 3;
      min-width: clamp(120px, 20vw, 300px);
      font-weight: 600;
      color: var(--gray-900);
    }

    .score-cell {
      flex: 0.8;
      min-width: clamp(50px, 6vw, 80px);
      font-weight: 600;
      justify-content: center;
    }

    .expandable-content {
      padding: 2rem;
      background: var(--gray-50);
      border-top: 1px solid var(--gray-200);
    }

    .content-section {
      margin-bottom: 2rem;
      background: var(--pageBackground);
      border-radius: 8px;
      border: 1px solid var(--gray-200);
      overflow: hidden;
    }

    .content-section:last-child {
      margin-bottom: 0;
    }

    .section-header {
      padding: 0.6rem 1.2rem;
      background: var(--gray-100);
      border-bottom: 1px solid var(--gray-200);
      font-weight: 600;
      color: var(--gray-800);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-content {
      padding: 1.5rem;
    }

    .message-content {
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.6;
    }

    .code-block {
      background: var(--gray-50);
      color: #e5e7eb;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .collapsible-section {
      cursor: pointer;
    }

    .collapsible-content {
      margin-top: 1rem;
    }

    .toggle-link {
      color: var(--gray-400);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s ease;
    }

    summary:hover .toggle-link {
      color: var(--primary-color);
    }

    .expand-icon {
      transition: transform 0.3s ease;
      font-size: 0.75rem;
    }

    summary:hover .expand-icon {
      color: var(--primary-color);
    }

    /* Animate expand icons when details are open */
    details[open] > summary .expand-icon {
      transform: rotate(180deg);
    }

    /* Smooth animation for expandable content */
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    details[open] .expandable-content,
    details[open] .summary-details,
    details[open] .section-content {
      animation: slideDown 0.3s ease-out;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-success {
      background: var(--emerald);
      color: var(--success-color);
    }

    .badge-warning {
      background: var(--orange);
      color: var(--warning-color);
    }

    .badge-error {
      background: var(--red);
      color: var(--error-color);
    }

    /* Dynamic CSS rules for tabs */
    ${
    tabEntries.map((entry) => `
    #tab-radio-${entry.sanitizedKey}:checked ~ .tabs label[for="tab-radio-${entry.sanitizedKey}"] {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
      background: var(--primary-light);
    }
    #tab-radio-${entry.sanitizedKey}:checked ~ .tab-container #tab-${entry.sanitizedKey} {
      display: block;
    }`).join("\n    ")
  }

    /* Responsive design */
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }

      .header {
        padding: 1.5rem;
      }

      .header h1 {
        font-size: 2rem;
      }

      .content {
        padding: 1rem;
      }

      .summary-details {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .header-row, .result-summary {
        font-size: 0.75rem;
      }

      .result-cell {
        padding: 0.75rem 0.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 3605.5 443.9" xml:space="preserve">
      <style type="text/css">
        .st0{fill-rule:evenodd;clip-rule:evenodd;fill:#FFFFFF;}
      </style>
      <path class="st0" d="M1752.1,395c95.6,0,173-77.5,173-173s-77.5-173-173-173s-173,77.5-173,173S1656.5,395,1752.1,395z M1752.1,436.7c118.6,0,214.8-96.2,214.8-214.8S1870.7,7.2,1752.1,7.2c-118.6,0-214.8,96.2-214.8,214.8S1633.4,436.7,1752.1,436.7z M2002.6,279.9c0,94.5,55.3,156.8,155.1,156.8c98.7,0,155.1-63.6,155.1-157.4V13.2h-47.5v265.6c0,69.5-37.4,113.5-107.6,113.5 c-70.1,0-107-44-107-112.9V13.2h-48.1V279.9z M2348.7,13.2h48.6l231.5,332.3V13.2h48v417.6h-48L2397.3,99.7v331.1h-48.6V13.2z M2712.6,430.8h86.1c139.9,0,224.2-70.4,224.2-208.8c0-130.7-81.3-208.8-224.2-208.8h-86.1V430.8z M2808.2,387.8H2761V56.7h47.2 c100.4,0,165,60.9,165,165.3C2973.2,331.1,2908.7,387.8,2808.2,387.8z M3107.2,430.8h-48.5V13.2h106.7c85.7,0,130.6,43,130.6,115.7 c0,49.5-24.6,94.9-73.1,110.4l104.3,191.5h-53.9l-94.7-181.4h-71.3V430.8z M3107.2,207.1h58.1c49.1,0,79.7-22.7,79.7-77.6 c0-44.1-23.4-73.4-82.7-73.4h-55.1V207.1z M3413.8,430.8V235.1L3285.3,13.2h55.1l97.1,176l98.9-176h53.3l-128.5,221.9v195.7H3413.8z M1328.5,13.2v417.6h48V244H1507v-43.6h-130.5V57.3h148.8V13.2H1328.5z"/>
      <path class="st0" d="M596.3,10.2v177.4h91.8L541.5,434.2c6.1,0.5,12.3,0.8,18.6,0.8c118.6,0,214.8-95.8,214.8-213.9 C774.8,115.3,697.6,27.4,596.3,10.2z M588.3,9L434.6,267.6h91.8v164.8c-102.6-16.1-181.1-104.6-181.1-211.3 C345.3,103,441.4,7.2,560,7.2C569.6,7.2,579.1,7.8,588.3,9z M809.4,13.2v417.6h238.6V327H928.1V13.2H809.4z M1086.2,117v313.8h119.5 V117h87V13.2h-292.3V117H1086.2z M15.9,13.2v417.6h164.7c83.5,0,151.5-38.8,151.5-126.5c0-40.6-17.9-74.6-57.9-92.5 c29.2-19.7,44.7-47.1,44.7-85.3c0-72.8-53.7-113.4-141.4-113.4H15.9z M168.7,171.3h-34.6v-59.1h33.4c20.3,0,30.4,11.9,30.4,28.6 C197.9,158.1,187.8,171.3,168.7,171.3z M176.4,331.2h-42.4v-67.4h44.1c20.9,0,32.2,16.7,32.2,33.4 C210.4,313.3,197.9,331.2,176.4,331.2z"/>
    </svg>
    <h1>Evaluation results</h1>
  </div>
  <div class="container">
    <div class="content">
      <script type="application/json" id="evaluation-data">
      ${JSON.stringify(data)}
      </script>

      ${
    !singleTab
      ? `
      ${
        tabEntries.map((entry, index) => `
        <input type="radio" class="tab-radio" id="tab-radio-${entry.sanitizedKey}" name="tabs" ${
          index === 0 ? "checked" : ""
        }>
      `).join("")
      }
      <div class="tabs">
        ${
        tabEntries.map((entry) => `
          <label class="tab-label" for="tab-radio-${entry.sanitizedKey}">${entry.label}</label>
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
      <div class="tab-content" id="tab-${entry.sanitizedKey}">
        ${
        singleTab
          ? `<h2 style="margin-top: 0; color: var(--gray-800);">${entry.label}</h2>`
          : ""
      }

        <div class="summary">
          <details>
            <summary class="summary-header">
              <div class="summary-row">
                <div class="summary-title">${entry.graderName} </div>
                <div class="summary-subtitle"> • ${resultData.model} • ${resultData.samples} samples • ${agreementPercent}% agreement (${agreements}/${samplesWithTruth})</div>
              </div>
              <div class="summary-toggle">
                <span class="expand-icon">▼</span>
              </div>
            </summary>
            <div class="summary-details">
              <div class="metric-card">
                <div class="metric-label">Average distance</div>
                <div class="metric-value">${resultData.average_distance}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Average latency</div>
                <div class="metric-value">${
        resultData.average_latency
          ? `${(resultData.average_latency / 1000).toFixed(2)}s`
          : "N/A"
      }</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Average tokens</div>
                <div class="metric-value">${
        resultData.average_total_tokens
          ? `${resultData.average_total_tokens.toFixed(0)}`
          : "N/A"
      }</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Total cost</div>
                <div class="metric-value">${
        resultData.total_cost !== undefined && resultData.total_cost > 0
          ? `${resultData.total_cost.toFixed(4)}`
          : "N/A"
      }</div>
              </div>
            </div>
          </details>
        </div>

        <div class="results-container">
          <div class="header-row">
            <div class="header-cell result-id">Test case ID</div>
            <div class="header-cell score-cell">Grader</div>
            <div class="header-cell score-cell">Truth</div>
            <div class="header-cell score-cell">Distance</div>
            <div class="header-cell score-cell">Latency</div>
            <div class="header-cell score-cell">Tokens</div>
            <div class="header-cell score-cell">Cost</div>
            <div class="header-cell" style="width: 30px;"></div>
          </div>

          ${
        resultData.results
          .slice()
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((result) => {
            const distance = result.truth_score !== undefined
              ? Math.abs(result.grader_score - result.truth_score)
              : 0;
            const bgColor = getEnhancedColorForDistance(distance);

            return `
        <div class="result-row">
          <details>
            <summary class="result-summary" style="background-color: ${bgColor};">
              <div class="result-cell result-id">
                <span>${result.id}</span>
                ${
              distance === 0
                ? '<span class="badge badge-success" style="margin-left: 0.5rem;">Perfect</span>'
                : distance >= 3
                ? '<span class="badge badge-error" style="margin-left: 0.5rem;">High Error</span>'
                : distance >= 1
                ? '<span class="badge badge-warning" style="margin-left: 0.5rem;">Low Error</span>'
                : ""
            }
              </div>
              <div class="result-cell score-cell">${result.grader_score}</div>
              <div class="result-cell score-cell">${
              result.truth_score ?? "N/A"
            }</div>
              <div class="result-cell score-cell">${distance}</div>
              <div class="result-cell score-cell">${
              result.latencyMs
                ? `${(result.latencyMs / 1000).toFixed(2)}s`
                : "N/A"
            }</div>
              <div class="result-cell score-cell">${
              result.totalTokens ? `${result.totalTokens}` : "N/A"
            }</div>
              <div class="result-cell score-cell">${
              result.totalCost !== undefined
                ? `$${result.totalCost.toFixed(6)}`
                : "N/A"
            }</div>
              <div class="result-cell" style="width: 30px; justify-content: center;">
                <span class="expand-icon">▼</span>
              </div>
            </summary>

            <div class="expandable-content">
              ${
              result.notes
                ? `
              <div class="content-section">
                <div class="section-header">
                  <span>💭</span>
                  <span>Grader's reasoning</span>
                </div>
                <div class="section-content">
                  <div class="message-content">${escapeHtml(result.notes)}</div>
                </div>
              </div>
              `
                : ""
            }

              ${
              result.userMessage || result.assistantResponse
                ? `
              <div class="content-section">
                <details>
                  <summary class="section-header">
                    <span>💬</span>
                    <span>Conversation</span>
                    <span style="margin-left: auto;" class="toggle-link">
                      <span class="expand-icon">▼</span>
                    </span>
                  </summary>
                  <div class="section-content">
                    ${
                  result.userMessage
                    ? `
                    <div class="content-section" style="margin-bottom: 1rem;">
                      <div class="section-header">
                        <span>👤 User</span>
                      </div>
                      <div class="section-content">
                        <div class="message-content">${
                      escapeHtml(result.userMessage)
                    }</div>
                      </div>
                    </div>
                    `
                    : ""
                }
                    ${
                  result.assistantResponse
                    ? `
                    <div class="content-section">
                      <div class="section-header">
                        <span>🤖 Assistant</span>
                      </div>
                      <div class="section-content">
                        <div class="message-content">${
                      escapeHtml(result.assistantResponse)
                    }</div>
                      </div>
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
              <div class="content-section">
                <details>
                  <summary class="section-header">
                    <span>🔧</span>
                    <span>Technical details</span>
                    <span style="margin-left: auto;" class="toggle-link">
                      <span class="expand-icon">▼</span>
                    </span>
                  </summary>
                  <div class="section-content">
                    ${
                  result.graderMetadata?.verbosePrompt
                    ? `
                    <div class="content-section" style="margin-bottom: 1rem;">
                      <div class="section-header">
                        <span>⚙️ Grader input</span>
                      </div>
                      <pre class="code-block">${
                      escapeHtml(result.graderMetadata.verbosePrompt as string)
                    }</pre>
                    </div>
                    `
                    : ""
                }
                    ${
                  result.rawOutput
                    ? `
                    <div class="content-section">
                      <div class="section-header">
                        <span>🤖 Grader raw response</span>
                      </div>
                      <pre class="code-block">${
                      escapeHtml(formatJson(result.rawOutput))
                    }</pre>
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
            </div>
          </details>
        </div>`;
          }).join("")
      }
        </div>
      </div>
    `;
    }).join("")
  }
      </div>
    </div>
  </div>
</body>
</html>`;
}

function getEnhancedColorForDistance(distance: number): string {
  if (distance === 0) return "var(--emerald)"; // emerald-50
  if (distance === 1) return "var(--yellow)"; // yellow-50
  if (distance === 2) return "var(--orange)"; // orange-50
  return "var(--red)"; // red-50
}
