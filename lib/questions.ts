import type { EnablerId } from "./enablers";

export type Question = {
  id: string;
  enablerId: EnablerId;
  text: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "strategy_1",
    enablerId: "strategy",
    text: "1. Our AI initiatives are directly tied to our top business priorities.",
  },
  {
    id: "strategy_2",
    enablerId: "strategy",
    text: "2. AI progress is reviewed by senior leadership with the same rigor as financial performance.",
  },
  {
    id: "strategy_3",
    enablerId: "strategy",
    text: "3. We are using AI to create new value (such as products or services), not just improve efficiency.",
  },
  {
    id: "strategy_4",
    enablerId: "strategy",
    text: "4. AI investment is planned and funded over multiple years.",
  },
  {
    id: "strategy_5",
    enablerId: "strategy",
    text: "5. We have a clear approach for when to use standard tools and when to build custom AI solutions.",
  },
  {
    id: "data_1",
    enablerId: "data",
    text: "6. Our data is structured and accessible across systems.",
  },
  {
    id: "data_2",
    enablerId: "data",
    text: "7. We understand which of our data is reliable and suitable for AI deployment.",
  },
  {
    id: "data_3",
    enablerId: "data",
    text: "8. Our AI systems can work with current, live data.",
  },
  {
    id: "data_4",
    enablerId: "data",
    text: "9. Getting access to data for AI use cases is fast and straightforward.",
  },
  {
    id: "data_5",
    enablerId: "data",
    text: "10. We can trace where important data comes from and how it has changed.",
  },
  {
    id: "technology_1",
    enablerId: "technology",
    text: "11. Our systems can support AI that performs multi-step workflows and actions, not just basic chat or search.",
  },
  {
    id: "technology_2",
    enablerId: "technology",
    text: "12. We can adopt new AI tools or models without major disruption to the technical architecture.",
  },
  {
    id: "technology_3",
    enablerId: "technology",
    text: "13. We have clear visibility into AI-related costs by team or initiative.",
  },
  {
    id: "technology_4",
    enablerId: "technology",
    text: "14. There are consistent and standard ways to build and deploy AI solutions.",
  },
  {
    id: "technology_5",
    enablerId: "technology",
    text: "15. We have formal controls in place to manage data and AI risks.",
  },
  {
    id: "talent_1",
    enablerId: "talent",
    text: "16. AI training is tailored to the work people do in their roles.",
  },
  {
    id: "talent_2",
    enablerId: "talent",
    text: "17. A meaningful portion of our workforce uses AI regularly for real work (e.g. beyond summarization).",
  },
  {
    id: "talent_3",
    enablerId: "talent",
    text: "18. We have people in official roles who connect business needs with AI capability.",
  },
  {
    id: "talent_4",
    enablerId: "talent",
    text: "19. There is an active space where teams share how they use AI.",
  },
  {
    id: "talent_5",
    enablerId: "talent",
    text: "20. Non-technical leaders understand enough about AI to make informed decisions.",
  },
  {
    id: "operating_model_1",
    enablerId: "operating_model",
    text: "21. When we introduce AI into a new workflow, we rethink how the work should be done.",
  },
  {
    id: "operating_model_2",
    enablerId: "operating_model",
    text: "22. Teams can run AI experiments without significant central approval or delays.",
  },
  {
    id: "operating_model_3",
    enablerId: "operating_model",
    text: "23. Successful AI pilots are scaled quickly across the organization.",
  },
  {
    id: "operating_model_4",
    enablerId: "operating_model",
    text: "24. Roles and job expectations have been formally updated to reflect working alongside AI.",
  },
  {
    id: "operating_model_5",
    enablerId: "operating_model",
    text: "25. There is a clear way for users to give feedback on AI outputs, and it leads to visible improvements.",
  },
  {
    id: "governance_1",
    enablerId: "governance",
    text: "26. Accountability is clear when AI systems fail.",
  },
  {
    id: "governance_2",
    enablerId: "governance",
    text: "27. We have a regular process for reviewing AI outputs for accuracy and bias.",
  },
  {
    id: "governance_3",
    enablerId: "governance",
    text: "28. AI usage policies are actively enforced.",
  },
  {
    id: "governance_4",
    enablerId: "governance",
    text: "29. We understand and are preparing for relevant AI regulations.",
  },
  {
    id: "governance_5",
    enablerId: "governance",
    text: "30. We track how often AI outputs need to be corrected and actively improve quality.",
  },
  {
    id: "culture_1",
    enablerId: "culture",
    text: "31. Employees feel comfortable using AI without concern that it will replace their role or reflect negatively on them.",
  },
  {
    id: "culture_2",
    enablerId: "culture",
    text: "32. Leaders are rewarded for improving work through AI.",
  },
  {
    id: "culture_3",
    enablerId: "culture",
    text: "33. Leadership shares examples of AI experiments, including failures.",
  },
  {
    id: "culture_4",
    enablerId: "culture",
    text: "34. There is an active internal community sharing AI practices.",
  },
  {
    id: "culture_5",
    enablerId: "culture",
    text: "35. AI is viewed as a way to grow and innovate.",
  },
];
