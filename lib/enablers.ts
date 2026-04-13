export type EnablerId =
  | "strategy"
  | "data"
  | "technology"
  | "talent"
  | "operating_model"
  | "governance"
  | "culture";

export type Enabler = {
  id: EnablerId;
  order: number;
  shortName: string;
  name: string;
};

export const ENABLERS: Enabler[] = [
  {
    id: "strategy",
    order: 1,
    shortName: "Strategy and ambition",
    name: "AI strategy is clearly defined and connected to business outcomes",
  },
  {
    id: "data",
    order: 2,
    shortName: "Data and analytics foundation",
    name: "Data is trusted, accessible, and ready to fuel AI",
  },
  {
    id: "technology",
    order: 3,
    shortName: "Technology and AI infrastructure",
    name: "Infrastructure is secure, flexible, and built to scale",
  },
  {
    id: "talent",
    order: 4,
    shortName: "Talent and digital literacy",
    name: "People have the skills and confidence to work effectively with AI",
  },
  {
    id: "operating_model",
    order: 5,
    shortName: "Operating model and agility",
    name: "Workflows and structures are redesigned around AI, not just adapted",
  },
  {
    id: "governance",
    order: 6,
    shortName: "Governance and responsible AI",
    name: "AI is governed responsibly with clear accountability and oversight",
  },
  {
    id: "culture",
    order: 7,
    shortName: "Culture and change management",
    name: "Culture and leadership actively drive AI adoption across the organization",
  },
];
