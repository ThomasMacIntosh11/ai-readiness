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
    text: "1.	Strategic alignment: Your AI initiatives are directly connected to your most important business priorities for this year and not treated as a separate innovation project running in parallel.",
  },
  {
    id: "strategy_2",
    enablerId: "strategy",
    text: "2.	Leadership accountability: Your CEO or board reviews AI progress and results with the same seriousness as financial performance, not just as a periodic update or curiosity item.",
  },
  {
    id: "strategy_3",
    enablerId: "strategy",
    text: "3.	Ambition level: Your organisation is using AI to fundamentally change how it creates value (new products, new business models) - not just to save time on routine tasks.",
  },
  {
    id: "strategy_4",
    enablerId: "strategy",
    text: "4.	Dedicated investment: AI has its own clearly defined, multi-year budget rather than funding being cobbled together from other departments' leftovers.",
  },
  {
    id: "strategy_5",
    enablerId: "strategy",
    text: "5.	Build vs. buy clarity: You have a clear, shared approach for deciding when to use standard AI tools versus when to build something custom for your specific needs.",
  },
  {
    id: "data_1",
    enablerId: "data",
    text: "6.	Data accessibility: Your data is organised and easy for AI systems to use, rather than being locked away in separate systems that don't talk to each other.",
  },
  {
    id: "data_2",
    enablerId: "data",
    text: "7.	Data quality: You have a clear sense of how much of your data is clean, well-organised, and reliable — versus data that exists but isn't usable or trusted.",
  },
  {
    id: "data_3",
    enablerId: "data",
    text: "8.	Real-time access: Your AI tools can work with current, live business information, rather than being limited to old reports or last month's data exports.",
  },
  {
    id: "data_4",
    enablerId: "data",
    text: "9.	Ease of access: Getting access to a new dataset for an AI project is quick and straightforward instead of requiring multiple approvals and weeks of waiting.",
  },
  {
    id: "data_5",
    enablerId: "data",
    text: "10.	Data history & traceability: You can reliably trace where important data came from and how it was changed before it was used so you can trust what your AI is working with.",
  },
  {
    id: "technology_1",
    enablerId: "technology",
    text: "11.	Readiness for advanced AI: Your technical setup can support AI that takes actions, remembers context, and uses multiple tools autonomously. It's not just basic chatbots or search assistants.",
  },
  {
    id: "technology_2",
    enablerId: "technology",
    text: "12.	Flexibility & adaptability: You can swap in a new AI model or tool without breaking everything else and your systems aren't tightly locked to one vendor or approach.",
  },
  {
    id: "technology_3",
    enablerId: "technology",
    text: "13.	Cost visibility: You can see in real time what your AI tools are costing — broken down by team or project — rather than only discovering costs at month-end billing.",
  },
  {
    id: "technology_4",
    enablerId: "technology",
    text: "14.	Standardised development: Your technical teams have consistent, supported processes for building and deploying AI rather than improvising different solutions for every project.",
  },
  {
    id: "technology_5",
    enablerId: "technology",
    text: "15.	Security & safety controls: You have formal controls in place to protect sensitive data and prevent misuse when staff interact with AI systems, not just informal guidelines.",
  },
  {
    id: "talent_1",
    enablerId: "talent",
    text: "16.	Role-specific skills: AI training in your organisation goes beyond general awareness. Employees are learning how to use AI specifically for the tasks they do every week in their role.",
  },
  {
    id: "talent_2",
    enablerId: "talent",
    text: "17.	Everyday AI use: A meaningful portion of your workforce uses AI regularly for real, value-adding work — not just occasional summarisation or drafting.",
  },
  {
    id: "talent_3",
    enablerId: "talent",
    text: "18.	Bridge roles: You have people in your organisation whose job is to connect AI capability to business needs, translating between what technology can do and what the business actually wants.",
  },
  {
    id: "talent_4",
    enablerId: "talent",
    text: "19.	Living knowledge base: There is an active, regularly updated resource where staff share what's working with AI (tips, effective prompts, workflows etc.) that keeps pace with how the tools are evolving.",
  },
  {
    id: "talent_5",
    enablerId: "talent",
    text: "20.	Leadership AI literacy: Your non-technical leaders understand the meaningful differences between types of AI and can make informed decisions because of it.",
  },
  {
    id: "operating_model_1",
    enablerId: "operating_model",
    text: "21.	Process redesign: When you introduce AI into a workflow, you fundamentally rethink how that work should happen, rather than just automating the same steps that existed before.",
  },
  {
    id: "operating_model_2",
    enablerId: "operating_model",
    text: "22.	Decentralised experimentation: Individual teams and business units can run AI experiments and pilots on their own initiative instead of every request going through a central bottleneck.",
  },
  {
    id: "operating_model_3",
    enablerId: "operating_model",
    text: "23.	Speed from pilot to production: When an AI pilot proves its value, you have a fast, reliable path to rolling it out across the organisation. It doesn’t stall indefinitely after the proof of concept.",
  },
  {
    id: "operating_model_4",
    enablerId: "operating_model",
    text: "24.	Workforce redesign: Job roles and expectations have been formally updated to reflect working alongside AI rather than AI being an unofficial add-on to unchanged job descriptions.",
  },
  {
    id: "operating_model_5",
    enablerId: "operating_model",
    text: "25.	Feedback loops: End users can flag when AI outputs are wrong or unhelpful, and that feedback actually improves the system rather than disappearing into a void.",
  },
  {
    id: "governance_1",
    enablerId: "governance",
    text: "26.	Accountability clarity: When an AI system makes a costly mistake, it is immediately clear which person or team owns responsibility, there is no ambiguity about who is accountable.",
  },
  {
    id: "governance_2",
    enablerId: "governance",
    text: "27.	Bias & accuracy auditing: You have a regular, formal process for checking whether your AI systems are producing fair, accurate, and safe outputs — not just a one-time review at launch.",
  },
  {
    id: "governance_3",
    enablerId: "governance",
    text: "28.	Policy enforcement: Your rules for how AI should and shouldn't be used are actively enforced through your systems, not just documented in a policy document that few people have read.",
  },
  {
    id: "governance_4",
    enablerId: "governance",
    text: "29.	Regulatory awareness: You have a clear view of which AI regulations and standards apply to your organisation and are actively preparing for compliance instead of hoping it won't affect you.",
  },
  {
    id: "governance_5",
    enablerId: "governance",
    text: "30.	Output quality tracking: You track how much time your staff spend correcting or redoing AI outputs, and you actively work to reduce that rather than accepting low-quality AI results as inevitable.",
  },
  {
    id: "culture_1",
    enablerId: "culture",
    text: "31.	Psychological safety: Employees feel comfortable experimenting with AI and sharing what doesn't work without fear that using AI makes them look replaceable or that failing will reflect badly on them.",
  },
  {
    id: "culture_2",
    enablerId: "culture",
    text: "32.	Incentive alignment: Managers and team leads are genuinely rewarded for finding smarter, more efficient ways to work through AI and aren’t being incentivised to protect headcount and resist change.",
  },
  {
    id: "culture_3",
    enablerId: "culture",
    text: "33.	Visible experimentation: Leadership regularly shares honest stories about AI experiments that didn't work — modelling a culture where trying and learning is valued over always getting it right.",
  },
  {
    id: "culture_4",
    enablerId: "culture",
    text: "34.	Internal AI community: There is an active internal network where employees share successful AI uses, prompts, and workflows that creates momentum rather than isolated pockets of expertise.",
  },
  {
    id: "culture_5",
    enablerId: "culture",
    text: "35.	Strategic mindset: Across the organisation, AI is primarily viewed as a way to grow, innovate, and create new value, rather than mainly as a tool to cut costs or reduce headcount.",
  },
];
