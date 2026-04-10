import type { EnablerId } from "./enablers";

type RecommendationSet = { title: string; bullets: string[] };

export const ENABLER_RECS: Record<EnablerId, { under50: RecommendationSet; overOrEqual50: RecommendationSet }> = {
  strategy: {
    under50: {
      title: "Strengthen Strategic Alignment For Foundation Stage",
      bullets: [
        "Define one clear AI purpose statement for the organization",
        "Map two priority AI outcomes to business strategy",
        "Assign one executive owner for monthly progress reviews",
      ],
    },
    overOrEqual50: {
      title: "Elevate Strategic Alignment For Scale Stage",
      bullets: [
        "Expand strategy linkage across all major business units",
        "Introduce quarterly portfolio rebalancing for AI priorities",
        "Track cross-functional execution metrics tied to outcomes",
      ],
    },
  },
  data: {
    under50: {
      title: "Increase Business Value For Early Delivery",
      bullets: [
        "Set simple value metrics for each pilot use case",
        "Prioritize quick-win initiatives with clear ROI",
        "Measure baseline and post-launch impact for each pilot",
      ],
    },
    overOrEqual50: {
      title: "Optimize Business Value Across Portfolio",
      bullets: [
        "Standardize value tracking across all active AI initiatives",
        "Introduce portfolio-level ROI and risk weighting",
        "Use outcome data to retire low-value initiatives quickly",
      ],
    },
  },
  technology: {
    under50: {
      title: "Build Test And Learn Foundations",
      bullets: [
        "Run two-week experiments with clear hypotheses",
        "Create one lightweight experiment decision template",
        "Document lessons learned after every pilot",
      ],
    },
    overOrEqual50: {
      title: "Accelerate Test And Learn At Scale",
      bullets: [
        "Increase experiment cadence across multiple squads",
        "Automate evidence capture for pilot decisions",
        "Create a reusable experimentation playbook",
      ],
    },
  },
  talent: {
    under50: {
      title: "Clarify Roles And Teaming Basics",
      bullets: [
        "Define core AI delivery roles and responsibilities",
        "Create one cross-functional squad for top use cases",
        "Set simple decision rights between business and tech",
      ],
    },
    overOrEqual50: {
      title: "Evolve Roles And Teaming For Performance",
      bullets: [
        "Scale cross-functional squads across high-value domains",
        "Introduce role-based competency expectations",
        "Refine governance for faster decision velocity",
      ],
    },
  },
  operating_model: {
    under50: {
      title: "Stabilize Tech Data And AI Foundations",
      bullets: [
        "Prioritize data quality fixes for top use cases",
        "Set baseline deployment and monitoring standards",
        "Define minimum governance controls for risk and privacy",
      ],
    },
    overOrEqual50: {
      title: "Scale Tech Data And AI Platform Capability",
      bullets: [
        "Standardize reusable data and model components",
        "Automate model monitoring and lifecycle workflows",
        "Expand governance controls for enterprise-wide rollout",
      ],
    },
  },
  governance: {
    under50: {
      title: "Build Organization Capability At Baseline",
      bullets: [
        "Launch role-based learning paths for key teams",
        "Provide practical coaching for pilot teams",
        "Track training completion and early application",
      ],
    },
    overOrEqual50: {
      title: "Scale Organization Capability With Consistency",
      bullets: [
        "Expand learning pathways to all major functions",
        "Formalize communities of practice across regions",
        "Measure capability uplift against business outcomes",
      ],
    },
  },
  culture: {
    under50: {
      title: "Establish Change Management Foundations",
      bullets: [
        "Create a targeted adoption plan for impacted users",
        "Publish clear change messages and role impacts",
        "Collect adoption feedback every sprint",
      ],
    },
    overOrEqual50: {
      title: "Advance Change Management For Scale",
      bullets: [
        "Coordinate adoption plans across multiple business units",
        "Use change champions to accelerate behavior shifts",
        "Track adoption KPIs and adjust enablement quickly",
      ],
    },
  },
};

type FocusItem = {
  title: string;
  subtitle: string;
};

export const MATURITY_RECS: Record<string, { subtitle: string; items: FocusItem[] }> = {
  Explorer: {
    subtitle: "Level 1 - Explorer (0-25%)",
    items: [
      {
        title: "Identify 3 to 5 practical AI use cases",
        subtitle: "Focus on areas where AI can improve speed, quality, or decision-making within existing workflows.",
      },
      {
        title: "Enable a small group of teams to start using AI",
        subtitle: "Provide access to tools and simple guidance. Focus on real work, not just training.",
      },
      {
        title: "Set basic guardrails for AI usage",
        subtitle: "Define what is acceptable, what data can be used, and who is responsible.",
      },
    ],
  },
  Pilot: {
    subtitle: "Level 2 - Pilot (26-50%)",
    items: [
      {
        title: "Prioritize a small number of high-value use cases",
        subtitle: "Align leadership around 2 to 3 use cases with clear business impact.",
      },
      {
        title: "Turn one successful pilot into a repeatable model",
        subtitle: "Document how it works and apply it in at least one additional team.",
      },
      {
        title: "Define ownership for AI initiatives",
        subtitle: "Make it clear who is responsible for outcomes and decisions.",
      },
    ],
  },
  Builder: {
    subtitle: "Level 3 - Builder (51-70%)",
    items: [
      {
        title: "Scale one or two proven use cases across teams",
        subtitle: "Select use cases that are already delivering value and expand them with clear ownership.",
      },
      {
        title: "Define a simple operating model for AI",
        subtitle: "Clarify how use cases are selected, managed, and scaled.",
      },
      {
        title: "Improve consistency in how teams use AI",
        subtitle: "Introduce simple standards or playbooks for priority workflows.",
      },
    ],
  },
  Integrator: {
    subtitle: "Level 4 - Integrator (71-85%)",
    items: [
      {
        title: "Standardize how AI is used in key workflows",
        subtitle: "Ensure consistency in how teams apply AI across similar tasks.",
      },
      {
        title: "Track and measure business impact",
        subtitle: "Link AI initiatives to clear outcomes such as time saved, cost reduction, or revenue impact.",
      },
      {
        title: "Strengthen governance and controls",
        subtitle: "Ensure accountability, monitoring, and risk management keep pace with adoption.",
      },
    ],
  },
  Transformer: {
    subtitle: "Level 5 - Transformer (86-100%)",
    items: [
      {
        title: "Expand AI into new value-creating areas",
        subtitle: "Identify opportunities for new products, services, or business models.",
      },
      {
        title: "Continuously improve performance and efficiency",
        subtitle: "Refine workflows, models, and outputs to increase impact.",
      },
      {
        title: "Invest in advanced capabilities and talent",
        subtitle: "Strengthen expertise in areas such as automation, orchestration, and AI-driven decision-making.",
      },
    ],
  },
};
