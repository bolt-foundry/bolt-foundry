import type { EvaluationData } from "../__tests__/fixtures/test-evaluation-results.ts";

export function generateEvaluationHtml(data: EvaluationData): string {
  const graderCount = Object.keys(data.graderResults).length;
  const singleGrader = graderCount === 1;
  
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
    .grader-reasoning {
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
  </style>
</head>
<body>
  <div class="container">
    <h1>Evaluation Results</h1>
    
    <script type="application/json" id="evaluation-data">
    ${JSON.stringify(data)}
    </script>
  
    ${!singleGrader ? `
    <div class="tabs">
      ${Object.keys(data.graderResults).map((name, index) => `
        <button class="tab ${index === 0 ? 'active' : ''}" onclick="showTab('${name}')">${name}</button>
      `).join('')}
    </div>
    ` : ''}
    
    ${Object.entries(data.graderResults).map(([graderName, graderData], index) => {
      const samplesWithTruth = graderData.results.filter(r => r.truth_score !== undefined).length;
      const agreements = graderData.results.filter(r => r.grader_score === r.truth_score).length;
      const agreementPercent = samplesWithTruth > 0 ? (agreements / samplesWithTruth * 100).toFixed(1) : 0;
      
      return `
    <div class="tab-content ${singleGrader || index === 0 ? 'active' : ''}" id="tab-${graderName}">
      <h2>${graderName}</h2>
      
      <div class="summary">
        <p><strong>Model:</strong> ${graderData.model}</p>
        <p><strong>Total Samples:</strong> ${graderData.samples}</p>
        <p><strong>Average Distance:</strong> ${graderData.average_distance}</p>
        <p><strong>Agreement:</strong> ${agreementPercent}% (${agreements}/${samplesWithTruth})</p>
      </div>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Grader Score</th>
          <th>Truth Score</th>
          <th>Distance</th>
        </tr>
      </thead>
      <tbody>
        ${graderData.results.map((result, resultIndex) => {
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
                  ${result.userMessage || result.assistantResponse ? `
                  <div class="conversation">
                    ${result.userMessage ? `
                    <div>
                      <div class="message-label">💬 User Message:</div>
                      <div class="message-content">${result.userMessage}</div>
                    </div>
                    ` : ''}
                    ${result.assistantResponse ? `
                    <div style="margin-top: 10px;">
                      <div class="message-label">🤖 Assistant Response:</div>
                      <div class="message-content">${result.assistantResponse}</div>
                    </div>
                    ` : ''}
                  </div>
                  ` : ''}
                  
                  <div class="scores">
                    <div class="score-item">
                      <div class="message-label">Grader Score</div>
                      <div style="font-size: 24px; font-weight: bold;">${result.grader_score}</div>
                    </div>
                    <div class="score-item">
                      <div class="message-label">Truth Score</div>
                      <div style="font-size: 24px; font-weight: bold;">${result.truth_score ?? 'N/A'}</div>
                    </div>
                    <div class="score-item">
                      <div class="message-label">Distance</div>
                      <div style="font-size: 24px; font-weight: bold; color: ${distance === 0 ? '#28a745' : distance === 1 ? '#ffc107' : '#dc3545'}">${distance}</div>
                    </div>
                  </div>
                  
                  ${result.notes ? `
                  <div class="grader-reasoning">
                    <div class="message-label">💭 Grader's Reasoning:</div>
                    <div class="message-content">${result.notes}</div>
                  </div>
                  ` : ''}
                </div>
              </details>
            </td>
            <td style="background-color: ${bgColor}">${result.grader_score}</td>
            <td style="background-color: ${bgColor}">${result.truth_score ?? "N/A"}</td>
            <td style="background-color: ${bgColor}">${distance}</td>
          </tr>`;
        }).join("")}
      </tbody>
      </tbody>
    </table>
    </div>
  `;
    }).join("")}
  </div>
  
  ${!singleGrader ? `
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
  ` : ''}
</body>
</html>`;
}

function getColorForDistance(distance: number): string {
  if (distance === 0) return "#d4edda"; // light green
  if (distance === 1) return "#fff3cd"; // light yellow
  if (distance === 2) return "#ffeaa7"; // light orange
  return "#f8d7da"; // light red
}
