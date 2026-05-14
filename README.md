<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/brain.svg" alt="MindJournal AI Logo" width="120" height="120" />
  
  # MindJournal AI 🧠✨
  **An AI-Powered Cognitive Behavioral Therapy (CBT) Tracker & Journal**

  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-FF9900?style=for-the-badge&logo=aws-amplify&logoColor=white)](https://aws.amazon.com/amplify/)
  [![Amazon Bedrock](https://img.shields.io/badge/Amazon_Bedrock-AI-005571?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/bedrock/)

  [View Demo](#) • [Report Bug](#) • [Request Feature](#)
</div>

---

## 📖 Project Overview

**MindJournal AI** is a full-stack, production-grade mental wellness application that merges the proven principles of Cognitive Behavioral Therapy (CBT) with cutting-edge Generative AI. 

Traditional journaling is great, but it lacks feedback. MindJournal AI acts as a compassionate "therapeutic sidekick." It analyzes your daily journal entries to detect emotional patterns, track mood/anxiety/stress scores, and provide actionable, highly personalized CBT exercises to help you build lasting mental resilience.

## 💡 Motivation & Problem Statement

Many people struggle to identify the underlying triggers of their emotional states. Professional therapy is highly effective but isn't always accessible 24/7. While standard journaling apps offer a blank page, they fail to provide constructive feedback.

**The Solution:** MindJournal AI bridges this gap by acting as an intelligent mirror. Using AWS Bedrock LLMs (DeepSeek / Qwen), the app automatically extracts nuances from raw journal entries and returns objective metrics (mood, stress, anxiety) alongside supportive insights and actionable CBT exercises—all within a highly secure, private environment.

---

## 🚀 Key Features

*   **📝 Guided CBT Journaling:** Write entries with prompts designed to challenge cognitive distortions and reframe negative thoughts.
*   **🤖 AI-Powered Emotional Analysis:** Automated extraction of mood, anxiety, and stress scores (1-10 scale), primary emotions, energy levels, and psychological triggers.
*   **🧠 Personalized CBT Exercises:** AI recommends specific, actionable techniques (e.g., *Progressive Muscle Relaxation*, *Thought Records*) based on your entry's content.
*   **📊 Advanced Analytics & Charts:** Visualize your emotional journey with interactive mood, stress, and anxiety trend graphs over time (Day/Week/Month/Year).
*   **🔥 Progress Tracking:** Gamified consistency tracking with day streaks, total entries, and milestone achievements.
*   **⚡ Quick Actions:** Immediate, 5-minute CBT exercises and breathing techniques for real-time emotional support.
*   **🔒 Complete Privacy:** Built with enterprise-grade AWS Cognito authentication to ensure your thoughts remain strictly yours.

---

## 🏗 Technical Architecture

MindJournal AI leverages a modern, serverless architecture optimized for high performance, scalability, and security.

### 💻 Frontend
*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Library:** [React 19](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for end-to-end type safety
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) for rapid, responsive design
*   **Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
*   **Data Visualization:** [Recharts](https://recharts.org/) for dynamic SVG charts
*   **Icons:** Lucide React

### ☁️ Backend & Cloud (AWS)
*   **Orchestration:** [AWS Amplify](https://aws.amazon.com/amplify/)
*   **API Layer:** [AWS AppSync](https://aws.amazon.com/appsync/) (GraphQL API)
*   **Database:** [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) (NoSQL single-table design concepts)
*   **Authentication:** [Amazon Cognito](https://aws.amazon.com/cognito/) (User & Identity Pools)
*   **Compute:** [AWS Lambda](https://aws.amazon.com/lambda/) (Event-driven processing)
*   **AI / LLM Layer:** [Amazon Bedrock](https://aws.amazon.com/bedrock/) (DeepSeek-V3 / Qwen models)
*   **Email Services:** Amazon SES (Simple Email Service)

---

## 🧠 AI Workflow & Implementation

The core magic of MindJournal AI happens asynchronously using an event-driven architecture:

1.  **Entry Submission:** User submits a journal entry via the Next.js frontend.
2.  **GraphQL Mutation:** AWS AppSync securely writes the `Entry` to a DynamoDB table.
3.  **DynamoDB Stream:** The database insertion triggers an AWS Lambda function (`cbt-bedrock-processor`).
4.  **Amazon Bedrock Inference:** The Lambda function constructs a highly specific therapeutic prompt and invokes Amazon Bedrock (falling back gracefully across DeepSeek and Qwen models).
5.  **Data Enrichment:** The LLM returns a structured JSON object containing:
    *   `moodScore`, `anxietyScore`, `stressScore`
    *   `detectedEmotions` (array)
    *   `energyLevel` & `moodCategory`
    *   `aiInsight` & `recommendedAction`
6.  **Database Update:** The Lambda updates the original DynamoDB record with the generated AI metrics.
7.  **Real-Time Sync:** The frontend fetches the enriched data, updating the user's dashboard and charts.

---

## 📂 Folder Structure

```text
mindjournal-ai/
├── amplify/                  # AWS Amplify Backend Configuration
│   ├── backend/              # Cloud resources (Auth, API, DB)
│   └── team-provider-info.json
├── app/                      # Next.js App Router (Frontend Pages)
│   ├── dashboard/            # Core user dashboard (Analytics & Trends)
│   ├── journal/              # Journal entry composition
│   ├── history/              # Searchable entry archives
│   ├── login/ & signup/      # Auth flows
│   ├── globals.css           # Global Tailwind & Theme tokens
│   └── layout.tsx            # Root layout with Amplify Provider
├── components/               # Reusable React UI Components
│   ├── ui/                   # Shadcn UI primitives (Buttons, Cards, Inputs)
│   ├── mood-chart.tsx        # Recharts visualizations
│   ├── insights-card.tsx     # AI analysis display
│   └── app-header.tsx        # Navigation components
├── lib/                      # Utility functions & Setup
│   ├── amplify.ts            # AWS Amplify client initialization
│   └── utils.ts              # Tailwind/Clsx merge utilities
├── src/
│   ├── graphql/              # Auto-generated AppSync GraphQL definitions
│   │   ├── queries.ts        
│   │   ├── mutations.ts      
│   │   └── subscriptions.ts  
│   └── API.ts                # TypeScript types for GraphQL models
├── AWS.txt                   # Cloud architecture & Lambda source code notes
├── components.json           # Shadcn configuration
├── tailwind.config.js        # Tailwind styling & theme config
└── tsconfig.json             # TypeScript compiler rules
```

---

## 🔐 Authentication & Security

*   **Amazon Cognito:** Manages the complete user lifecycle (Sign up, login, password recovery).
*   **JWT Tokens:** Secure session management handled automatically by Amplify Auth.
*   **Data Isolation:** GraphQL resolvers are strictly scoped (`@aws_cognito_user_pools`), meaning users can only query, mutate, or subscribe to their own journal entries (`owner` authorization).

---

## 📸 Screenshots (Placeholders)

*(Note: Replace placeholder links with actual repository images)*

| Dashboard Analytics | AI Journal Analysis |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250/1f2937/38bdf8?text=Dashboard+Analytics" alt="Dashboard" /> | <img src="https://via.placeholder.com/400x250/1f2937/a855f7?text=AI+Insights" alt="AI Journaling" /> |
| *Interactive Mood & Stress Tracking* | *Real-time Bedrock AI Insights & Exercises* |

| Journal History | Quick CBT Actions |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250/1f2937/10b981?text=History+Archive" alt="History" /> | <img src="https://via.placeholder.com/400x250/1f2937/f59e0b?text=CBT+Actions" alt="CBT Actions" /> |
| *Searchable Archive with Emotional Tags* | *Actionable therapeutic recommendations* |

---

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18.x or higher)
*   AWS CLI configured with appropriate IAM credentials
*   AWS Amplify CLI (`npm install -g @aws-amplify/cli`)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1varun0/MindJournal-AI.git
   cd MindJournal-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize AWS Amplify (Cloud Backend):**
   ```bash
   amplify init
   amplify pull
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎓 Learning Outcomes & Engineering Challenges

*   **Event-Driven Architecture:** Mastered AWS DynamoDB Streams to trigger Lambda functions asynchronously, preventing the frontend from hanging while waiting for slow LLM inference.
*   **Prompt Engineering & Reliability:** Developed robust fallback mechanisms across multiple Amazon Bedrock models (DeepSeek to Qwen) to guarantee analysis uptime even during individual model rate limits.
*   **Complex State Management:** Managed optimistic UI updates in React while waiting for background GraphQL syncs.
*   **Data Visualization:** Transformed raw psychological data into intuitive, actionable user metrics using Recharts.

---

## 🔮 Future Improvements Roadmap

- [ ] **Voice Journaling:** Integrate AWS Transcribe to allow users to record spoken journal entries.
- [ ] **Weekly PDF Reports:** Automated generation of therapeutic reports to share with real-world therapists.
- [ ] **Mobile App:** Port the responsive web app to React Native for native iOS/Android experiences.
- [ ] **Dark Mode:** Complete theme toggle implementation (currently supported via Tailwind `dark:` classes).

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Varun Vallamkonda**

*   **LinkedIn:** [linkedin.com/in/varunvallamkonda](https://www.linkedin.com/in/varunvallamkonda/)
*   **GitHub:** [@1varun0](https://github.com/1varun0)

<div align="center">
  <i>Built with ❤️ for better mental health everywhere.</i>
</div>
