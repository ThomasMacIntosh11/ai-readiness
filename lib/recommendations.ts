import { ENABLERS } from "./enablers";
import type { EnablerId } from "./enablers";

export type MaturityStage = "Explorer" | "Pilot" | "Builder" | "Integrator" | "Transformer";

export type Recommendation = { title: string; description: string };

export const STAGE_RECS: Record<MaturityStage, Recommendation> = {
  Explorer: {
    title: "Get interested people together to experiment on a core problem.",
    description:
      "Gather a small group of curious volunteers to pick one practical problem and experiment with AI-powered solutions. Document lessons learned so the organization grows smarter over time.",
  },
  Pilot: {
    title: "Pick 3 to 5 use cases and build them with a small side-of-desk team.",
    description:
      "Standing up a lean cross-functional team to ship rough versions of a handful of use cases gives you the hands-on experience and proof-of-value you need before investing at scale.",
  },
  Builder: {
    title: "Take one proven pilot enterprise-wide.",
    description:
      "Turning your most successful pilot into a true enterprise rollout builds the muscle for repeatable scale-ups and ensures the next one is faster, cleaner, and lower risk.",
  },
  Integrator: {
    title: "Formalize cross-functional AI governance and hunt for cross-enterprise value plays.",
    description:
      "A formal executive governance forum with real decision rights lets you move beyond isolated wins and capture value that no single function could deliver alone.",
  },
  Transformer: {
    title: "Redesign your operating model for a hybrid human and agentic workforce.",
    description:
      "Rebuilding organizational structure, performance management, incentives, and decision rights for a world where humans oversee agents is what unlocks the next leap in productivity and growth.",
  },
};

export const ENABLER_RECS: Record<EnablerId, { under50: Recommendation; overOrEqual50: Recommendation }> = {
  strategy: {
    under50: {
      title: "Get clear on why AI matters for your business.",
      description:
        "Agreeing on a simple, shared \"why\" gives every team a single anchor for decisions so AI effort stops fragmenting across functions.",
    },
    overOrEqual50: {
      title: "Map how AI directly supports your corporate strategy.",
      description:
        "Connecting AI explicitly to your strategic priorities ensures investment goes where it moves the business, not just where it's easiest to deploy.",
    },
  },
  data: {
    under50: {
      title: "Identify the 5 to 10 datasets behind your top use cases and fix quality, access, and ownership for those first.",
      description:
        "Concentrating data effort where AI is actually being used unblocks priority initiatives much faster than trying to fix everything at once.",
    },
    overOrEqual50: {
      title: "Build reusable data products that AI can consume directly.",
      description:
        "This stops every new use case from reinventing the data plumbing and lets AI act on live information rather than yesterday's snapshot.",
    },
  },
  technology: {
    under50: {
      title: "Pick a small, standard AI tool stack and put baseline security and cost controls around it.",
      description:
        "Standardizing early avoids paying twice for fragmented tooling and gives you visibility before AI spend and shadow IT get out of hand.",
    },
    overOrEqual50: {
      title: "Invest in orchestration, observability, and per-use-case cost visibility for agentic workloads.",
      description:
        "Set up the tools to manage AI workflows, monitor what is happening, and track costs so you can connect AI to real systems and add new use cases without rebuilding everything each time.",
    },
  },
  talent: {
    under50: {
      title: "Roll out role-based AI training tied to the actual work people do.",
      description:
        "Role-specific training applied to real work is what turns curiosity into daily productive use across the workforce.",
    },
    overOrEqual50: {
      title: "Have your AI-leading employees teach their peers directly.",
      description:
        "Peer-to-peer teaching from people doing the work spreads practical capability faster than any centralized training program could.",
    },
  },
  operating_model: {
    under50: {
      title: "Pick one important workflow and rebuild it from scratch with AI at the core.",
      description:
        "Redesigning instead of retrofitting shows the organization what AI-native work actually looks like and creates a template other teams can follow.",
    },
    overOrEqual50: {
      title: "Build lightweight scaling mechanisms (playbooks, scaling squads, internal showcases) to move pilots across business units.",
      description:
        "These mechanisms turn one-off wins into repeatable rollouts so successful AI moves quickly from a single team into shared enterprise value.",
    },
  },
  governance: {
    under50: {
      title: "Publish a one-page AI use policy covering data, accountability, and acceptable use.",
      description:
        "A clear baseline keeps employees moving confidently with AI and prevents the costly inconsistencies that appear when every team writes its own rules.",
    },
    overOrEqual50: {
      title: "Stand up an AI governance council with real authority to review outputs, track corrections, and prepare for regulation.",
      description:
        "Mature governance becomes a speed advantage by letting you ship AI faster because trust, compliance, and risk are managed by design.",
    },
  },
  culture: {
    under50: {
      title: "Have leaders openly share AI experiments, including failures, in town halls and team forums.",
      description:
        "This signals that trying AI is safe and expected, which is the single biggest unlock for moving from cautious early users to broad adoption.",
    },
    overOrEqual50: {
      title: "Tie AI adoption and outcomes directly into leadership performance reviews and incentives.",
      description:
        "What gets measured gets done, so embedding AI into how leaders are evaluated is what makes culture change actually stick.",
    },
  },
};

export function getReportRecommendations(
  stage: MaturityStage,
  enablerScores: Record<EnablerId, number>
): Recommendation[] {
  const stageRec = STAGE_RECS[stage];

  const sorted = ENABLERS.slice().sort((a, b) => {
    const scoreA = enablerScores[a.id] ?? 0;
    const scoreB = enablerScores[b.id] ?? 0;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.order - b.order;
  });

  const [first, second] = sorted;

  const rec2 = (enablerScores[first.id] ?? 0) < 50
    ? ENABLER_RECS[first.id].under50
    : ENABLER_RECS[first.id].overOrEqual50;

  const rec3 = (enablerScores[second.id] ?? 0) < 50
    ? ENABLER_RECS[second.id].under50
    : ENABLER_RECS[second.id].overOrEqual50;

  return [stageRec, rec2, rec3];
}
