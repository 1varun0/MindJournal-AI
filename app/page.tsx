import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, Sparkles, TrendingUp, Shield, Users, Star, CheckCircle, ArrowRight, BookOpen, BarChart3, Target, Heart, Zap, Calendar, Search, User, Github, Linkedin, GraduationCap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-blue-200/50 dark:border-gray-700/50">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindJournal AI
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">CBT-Powered</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium">
              How It Works
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" 
              size="lg" 
              className="text-lg px-4 py-3 border-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-300 hover:bg-transparent transition-all duration-300 hover:scale-105">
               Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Start Journaling Free
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-blue-200/50 dark:border-blue-800/30">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered CBT Tracker</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-balance leading-tight">
            Track Your Mind,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Transform Your Life</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 text-balance leading-relaxed max-w-3xl mx-auto">
            Discover emotional patterns, get AI-powered CBT insights, and build healthier mental habits with our science-based journaling platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                Start Your Journey Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#edu">
              <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-300 hover:bg-transparent transition-all duration-300 hover:scale-105"
            >
              Learn About CBT
              <GraduationCap className="ml-2 h-5 w-5" />
            </Button>
            </Link>
          </div>
          
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Comprehensive
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Mental Wellness </span>
            Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Everything you need to understand your mind and build lasting mental health habits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen className="w-8 h-8 text-white" />,
              bg: "from-blue-500 to-blue-600",
              title: "Daily CBT Journaling",
              description: "Guided reflections based on Cognitive Behavioral Therapy principles to help you process thoughts and emotions.",
              features: ["Mood/Anxiety/Stress tracking", "Guided prompts", "Secure private entries"]
            },
            {
              icon: <BarChart3 className="w-8 h-8 text-white" />,
              bg: "from-emerald-500 to-green-600",
              title: "Advanced Analytics",
              description: "Visualize your emotional journey with interactive charts and trend analysis.",
              features: ["Mood trend charts", "Stress & anxiety tracking", "Pattern detection"]
            },
            {
              icon: <Sparkles className="w-8 h-8 text-white" />,
              bg: "from-purple-500 to-pink-600",
              title: "AI-Powered Insights",
              description: "Get personalized CBT-based recommendations and emotional pattern analysis.",
              features: ["Emotion detection", "Personalized exercises", "Growth insights"]
            },
            {
              icon: <Target className="w-8 h-8 text-white" />,
              bg: "from-orange-500 to-red-600",
              title: "Progress Tracking",
              description: "Monitor your consistency and celebrate achievements with gamified milestones.",
              features: ["Day streaks", "Achievement system", "Weekly summaries"]
            },
            {
              icon: <Search className="w-8 h-8 text-white" />,
              bg: "from-indigo-500 to-purple-600",
              title: "Journal History",
              description: "Search and revisit past entries with full context and AI analysis preserved.",
              features: ["Searchable archive", "Filter by mood", "Historical insights"]
            },
            {
              icon: <Zap className="w-8 h-8 text-white" />,
              bg: "from-amber-500 to-yellow-600",
              title: "Quick Actions",
              description: "Immediate CBT exercises and breathing techniques for real-time emotional support.",
              features: ["5-minute exercises", "Stress relief tools", "Anxiety management"]
            }
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl m-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Start Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Wellness Journey</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Simple steps to meaningful mental health progress
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { 
              step: "01", 
              icon: <User className="w-8 h-8 text-white" />,
              title: "Sign Up", 
              description: "Create your secure account in 30 seconds" 
            },
            { 
              step: "02", 
              icon: <BookOpen className="w-8 h-8 text-white" />,
              title: "First Journal", 
              description: "Write your first entry with guided CBT prompts" 
            },
            { 
              step: "03", 
              icon: <Brain className="w-8 h-8 text-white" />,
              title: "AI Analysis", 
              description: "Get instant insights and emotional patterns" 
            },
            { 
              step: "04", 
              icon: <TrendingUp className="w-8 h-8 text-white" />,
              title: "Track Progress", 
              description: "Watch your mental wellness improve over time" 
            }
          ].map((item, index) => (
            <div key={index} className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition duration-300">
                  {item.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      
      
      {/* CBT Education Section */}
<section id="edu" className="mx-auto max-w-7xl px-4 py-20">
  <div className="text-center mb-16">
    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
      Built on
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Proven Science</span>
    </h2>
    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
      Understanding the foundation of Cognitive Behavioral Therapy (CBT)
    </p>
  </div>

  <div className="grid lg:grid-cols-2 gap-12 items-center">
    <div className="space-y-8">
      {[
        {
          icon: <Brain className="w-6 h-6 text-blue-600" />,
          title: "What is CBT?",
          description: "Cognitive Behavioral Therapy is a scientifically proven approach that helps identify and change negative thought patterns affecting emotions and behaviors."
        },
        {
          icon: <Target className="w-6 h-6 text-green-600" />,
          title: "How It Works",
          description: "CBT teaches you to recognize distorted thinking, challenge unhelpful beliefs, and develop healthier coping strategies."
        },
        {
          icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
          title: "Proven Effectiveness",
          description: "Extensive research shows CBT is highly effective for anxiety, depression, stress management, and overall mental wellness."
        },
        {
          icon: <BookOpen className="w-6 h-6 text-orange-600" />,
          title: "Our Approach",
          description: "MindJournal AI adapts CBT principles into daily journaling exercises, making professional techniques accessible to everyone."
        }
      ].map((benefit, index) => (
        <div key={index} className="flex items-start gap-4 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
            {benefit.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{benefit.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
          </div>
        </div>
      ))}
    </div>
    
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-bold mb-4">How We Implement CBT</h3>
        <div className="space-y-4">
          {[
            "Guided journaling prompts based on CBT principles",
            "AI analysis of thought patterns and emotional triggers", 
            "Personalized exercises to challenge negative thinking",
            "Progress tracking for behavioral changes over time",
            "Evidence-based techniques for stress management",
            "Tools to build lasting mental resilience"
          ].map((implementation, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
              <span className="text-blue-50">{implementation}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
          <p className="text-sm text-blue-100 text-center">
            <strong>Note:</strong> While based on CBT principles, this tool complements but doesn't replace professional therapy.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Add this section before the CTA */}
<section className="mx-auto max-w-4xl px-4 py-15">
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        About the Creator
      </h2>
    </div>
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Hi, I'm Varun 👋
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          I always thought journals were a great tool, but they felt a bit... analog. I wanted to build an upgrade—a journal with a 'helpful bot' for your head. I made MindJournal AI to be that. It's a sidekick I developed that uses AI and a CBT framework to analyze what you write, find patterns, and help you see your own mind more clearly.
        </p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <a 
            href="https://www.linkedin.com/in/varunvallamkonda/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            Connect on LinkedIn
          </a>
          <a 
            href="https://github.com/1varun0" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  </div>
</section>


       
                
      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Understand Your Mind?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join a community committed to mental wellness. Start your journey with AI-powered CBT insights today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                Start Journaling Free
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                Sign In to Continue
              </Button>
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            No credit card required • 100% private and secure
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 mt-20">
  <div className="mx-auto max-w-7xl px-4 py-16">
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      {/* Brand Section */}
      <div className="lg:col-span-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MindJournal AI
            </span>
            <div className="text-sm text-gray-500 font-medium">AI-Powered CBT Tracker</div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm max-w-md">
          Empowering mental wellness through evidence-based CBT and compassionate AI technology. 
          Your journey to better mental health starts here.
        </p>
      </div>
      
      {/* Product Links */}
      <div className="lg:col-span-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-lg">Features</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            "Daily Journaling",
            "Mood Analytics", 
            "AI Insights",
            "Progress Tracking",
            "Quick Actions",
            "History Search"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Important Note */}
      <div className="lg:col-span-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-lg">Important Note</h3>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong className="text-blue-600 dark:text-blue-400">Note:</strong> MindJournal AI is designed to support your mental wellness journey but does not replace professional therapy. If you're in crisis, please contact emergency services.
          </p>
        </div>
      </div>
    </div>
    
    {/* Bottom Section */}
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-12 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <span className="text-red-500">❤️</span>
          Built for better mental health everywhere
        </p>
      </div>
    </div>
  </div>
</footer>
    </div>
  )
}


