export type EnablerId =
  | "alignment"
  | "business_value"
  | "test_learn"
  | "roles_capability"
  | "tech_data_ai"
  | "org_capability"
  | "change_management";

export type Enabler = {
  id: EnablerId;
  order: number;
  shortName: string;
  name: string;
};

export const ENABLERS: Enabler[] = [
  {
    id: "alignment",
    order: 1,
    shortName: "Broad alignment",
    name: "Broad Alignment on purpose, with strategy linked to execution",
  },
  {
    id: "business_value",
    order: 2,
    shortName: "Business value",
    name: "Rapid business improvements focused on realizing business value",
  },
  {
    id: "test_learn",
    order: 3,
    shortName: "Test and learn",
    name: "Empowered decision makers with test and learn behaviours",
  },
  {
    id: "roles_capability",
    order: 4,
    shortName: "Roles and teaming",
    name: "New roles, capabilities and teaming structures",
  },
  {
    id: "tech_data_ai",
    order: 5,
    shortName: "Tech, data and AI",
    name: "Scalable and flexible tech, data and AI models",
  },
  {
    id: "org_capability",
    order: 6,
    shortName: "Capability building",
    name: "Building capabilities across the organisation at scale",
  },
  {
    id: "change_management",
    order: 7,
    shortName: "Change management",
    name: "Strong change management to bring everyone on the journey",
  },
];
