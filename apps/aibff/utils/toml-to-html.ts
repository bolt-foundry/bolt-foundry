import type { EvaluationData } from "../__tests__/fixtures/test-evaluation-results.ts";

export function generateEvaluationHtml(data: EvaluationData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Evaluation Results</title>
</head>
<body>
  <h1>Evaluation Results</h1>
  
  <script type="application/json" id="evaluation-data">
  ${JSON.stringify(data)}
  </script>
  
  ${
    Object.entries(data.graderResults).map(([graderName, graderData]) => `
    <h2>${graderName}</h2>
    <p>Average Distance: ${graderData.average_distance}</p>
    
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
        ${
      graderData.results.map((result) => {
        const distance = result.truth_score !== undefined
          ? Math.abs(result.grader_score - result.truth_score)
          : 0;
        const bgColor = getColorForDistance(distance);

        return `
          <tr style="background-color: ${bgColor}">
            <td>${result.id}</td>
            <td>${result.grader_score}</td>
            <td>${result.truth_score ?? "N/A"}</td>
            <td>${distance}</td>
          </tr>`;
      }).join("")
    }
      </tbody>
    </table>
  `).join("")
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
