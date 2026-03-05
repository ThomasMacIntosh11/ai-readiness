import type { EnablerId } from "./enablers";

type RecommendationSet = { title: string; bullets: string[] };

export const ENABLER_RECS: Record<EnablerId, { under50: RecommendationSet; overOrEqual50: RecommendationSet }> = {
  alignment: {
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
  business_value: {
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
  test_learn: {
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
  roles_capability: {
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
  tech_data_ai: {
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
  org_capability: {
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
  change_management: {
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

export const MATURITY_RECS: Record<string, { title: string; bullets: string[] }> = {
  Explorer: {
    title: "Explorer: Establish Core Foundations",
    bullets: [
      "Align leaders on why AI matters and where value will come from",
      "Select a small number of priority use cases and test quickly",
      "Set minimum governance and delivery guardrails",
    ],
  },
  Builder: {
    title: "Builder: Improve Repeatability",
    bullets: [
      "Standardize experiment design, delivery, and measurement",
      "Formalize how use cases are prioritized and funded",
      "Strengthen platform and data readiness for broader scale",
    ],
  },
  Integrator: {
    title: "Integrator: Embed And Scale",
    bullets: [
      "Integrate AI into core operating processes and decision making",
      "Expand capability building across all major business units",
      "Harden model governance, monitoring, and risk controls",
    ],
  },
  "Market Shaper": {
    title: "Market Shaper: Optimize And Differentiate",
    bullets: [
      "Optimize portfolio value realization with continuous reprioritization",
      "Use AI to unlock new products, services, and business models",
      "Advance governance maturity while accelerating innovation",
    ],
  },
};
