import type { EnablerId } from "./enablers";

export type Question = {
  id: string;
  enablerId: EnablerId;
  text: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "alignment_1",
    enablerId: "alignment",
    text: "Our AI goals are clearly linked to business strategy.",
  },
  {
    id: "alignment_2",
    enablerId: "alignment",
    text: "Leadership communicates AI priorities consistently.",
  },
  {
    id: "business_value_1",
    enablerId: "business_value",
    text: "We measure business value from AI initiatives regularly.",
  },
  {
    id: "business_value_2",
    enablerId: "business_value",
    text: "We prioritize AI use cases based on impact and ROI.",
  },
  {
    id: "test_learn_1",
    enablerId: "test_learn",
    text: "Teams can run quick experiments before scaling AI solutions.",
  },
  {
    id: "test_learn_2",
    enablerId: "test_learn",
    text: "Decision makers support test-and-learn behaviors.",
  },
  {
    id: "roles_capability_1",
    enablerId: "roles_capability",
    text: "AI delivery roles and responsibilities are clearly defined.",
  },
  {
    id: "roles_capability_2",
    enablerId: "roles_capability",
    text: "Cross-functional teams collaborate effectively on AI delivery.",
  },
  {
    id: "tech_data_ai_1",
    enablerId: "tech_data_ai",
    text: "Our technology stack can scale priority AI use cases.",
  },
  {
    id: "tech_data_ai_2",
    enablerId: "tech_data_ai",
    text: "Data quality and access support production AI solutions.",
  },
  {
    id: "org_capability_1",
    enablerId: "org_capability",
    text: "We provide role-based AI capability development across the organization.",
  },
  {
    id: "org_capability_2",
    enablerId: "org_capability",
    text: "Teams have practical support to adopt AI tools and ways of working.",
  },
  {
    id: "change_management_1",
    enablerId: "change_management",
    text: "Change impacts are actively managed for AI-enabled initiatives.",
  },
  {
    id: "change_management_2",
    enablerId: "change_management",
    text: "Leaders and teams are aligned on the journey and expected outcomes.",
  },
];
