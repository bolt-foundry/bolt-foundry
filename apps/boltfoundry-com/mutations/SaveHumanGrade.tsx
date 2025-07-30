import { iso } from "@iso-bfc";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const SaveHumanGrade = iso(`
  field Mutation.SaveHumanGrade($sampleId: ID!, $grades: String!, $gradedBy: String!) @component {
    saveHumanGrade(sampleId: $sampleId, grades: $grades, gradedBy: $gradedBy) {
      id
      humanGrade
    }
  }
`)(function SaveHumanGrade({ data }) {
  logger.info("Grade saved successfully", { sampleId: data.saveHumanGrade.id });

  return {
    success: true,
    sampleId: data.saveHumanGrade.id,
    humanGrade: data.saveHumanGrade.humanGrade
      ? JSON.parse(data.saveHumanGrade.humanGrade)
      : null,
  };
});
