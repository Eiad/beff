import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, BarChart2, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import GeometricGrid from '../components/GeometricGrid';
import AnimatedLogo from '../components/AnimatedLogo';
import ScrollIndicator from '../components/ScrollIndicator';
import Navbar from '../components/Navbar';

const FEATURES = [
  {
    icon: BarChart2,
    title: 'Carbon Intelligence',
    description: 'Real-time CO₂ tracking across your fleet and operations. Understand your footprint with actionable insights, not just raw data.',
  },
  {
    icon: Shield,
    title: 'Compliance Automation',
    description: 'Stay ahead of ESG regulations automatically. B-eff monitors regulatory changes and keeps your reports audit-ready.',
  },
  {
    icon: Zap,
    title: 'Team Engagement',
    description: 'Enroll teams, set sustainability goals, and celebrate milestones. Green culture starts with visibility and recognition.',
  },
];

export default function Landing() {
  useEffect(() => {
    document.title = 'B-eff | Greener Business, Together';
  }, []);

  return (
    <div className="relative">
      <GeometricGrid />
      <Navbar />

      <main>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Badge variant="outline" className="text-xs font-medium px-3 py-1 border-gray-300">
            <Leaf size={12} className="mr-1 text-emerald-600" />
            500+ companies already on the waitlist
          </Badge>
        </motion.div>

        <AnimatedLogo />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-xl text-gray-500 text-lg leading-relaxed"
        >
          The B2B sustainability platform that turns green goals into measurable business results.
          Built for teams that want to do better — and prove it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 items-center"
        >
          <Link to="/register">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-600-dark text-white gap-2"
            >
              Join the Waitlist <ArrowRight size={16} />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="ghost" size="lg">See how it works</Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-10"
        >
          <ScrollIndicator />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-serif font-normal text-gray-900 mb-4">
            Everything your team needs to go green
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            B-eff brings sustainability metrics, compliance, and engagement into one platform designed for modern B2B teams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600-light flex items-center justify-center mb-4">
                <f.icon size={20} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-white/60 backdrop-blur-sm py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Leaf size={36} className="mx-auto text-emerald-600 mb-6" />
            <h2 className="text-3xl font-serif font-normal text-gray-900 mb-4">
              Why B-eff?
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Sustainability shouldn't be a compliance checkbox. It should be a competitive advantage.
              B-eff is built for the companies that understand this — and want the tools to act on it.
            </p>
            <p className="text-gray-500 leading-relaxed">
              We're in pre-launch, working closely with our early access partners to build exactly what
              forward-thinking B2B teams need. Join the waitlist and help shape the product.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-serif font-normal text-gray-900 mb-4">
            Be among the first
          </h2>
          <p className="text-gray-500 mb-8">
            Early access partners get priority onboarding, direct input on the roadmap, and founding member pricing.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-600-dark text-white gap-2">
              Request Early Access <ArrowRight size={16} />
            </Button>
          </Link>
        </motion.div>
      </section>

      </main>
      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Leaf size={14} className="text-emerald-600" />
            <span className="font-serif">B-eff</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              LinkedIn
            </a>
          </div>
          <p>© {new Date().getFullYear()} B-eff. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
