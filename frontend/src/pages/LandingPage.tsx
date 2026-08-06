import { Link } from 'react-router-dom'
import {
  Users,
  Wallet,
  PieChart,
  Building2,
  ArrowRight,
  ChevronRight,
  Mail,
  Globe,
  Shield,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import heroImage from '@/assets/hero.png'
import hawiLogo from '@/assets/hawi-logo.png'

/* ─── Feature Cards Data ─── */
const features = [
  {
    icon: Users,
    title: 'Member Management',
    description:
      'Streamline on-boarding, KYC verification, and manage comprehensive member profiles securely.',
  },
  {
    icon: Wallet,
    title: 'Savings & Loans',
    description:
      'Automate contribution tracking, loan approvals, amortization schedules, and risk assessment.',
  },
  {
    icon: PieChart,
    title: 'Dividend Distribution',
    description:
      'Calculate and distribute dividends accurately based on member shares and institutional profitability.',
  },
  {
    icon: Building2,
    title: 'Multi-Tenant Platform',
    description:
      'Enterprise-grade architecture supporting multiple branches with centralized oversight and reporting.',
  },
]

/* ─── Steps Data ─── */
const steps = [
  {
    number: 1,
    title: 'Register Your SACCO',
    description:
      'Create your institutional profile, configure bylaws, and set up financial parameters.',
  },
  {
    number: 2,
    title: 'Add Members',
    description:
      'Bulk import existing members or invite them to register via the self-service portal.',
  },
  {
    number: 3,
    title: 'Start Managing',
    description:
      'Instantly process deposits, approve loans, and generate real-time financial reports.',
  },
]

/* ─── Footer Links Data ─── */
const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Updates', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact Support', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black text-[#0f1c3f] tracking-tight">
                SACCO MS
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-[#0f1c3f] font-medium">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#c8922a] hover:bg-[#b07f22] text-white font-medium rounded-lg px-5">
                  Register SACCO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f1c3f] to-[#1a2d5a]" />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-medium">
                  PLATFORM LIVE V2.0
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Modern SACCO</span>
                <br />
                <span className="text-[#c8922a]">Management Platform</span>
              </h1>

              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Digitize your cooperative — manage members, savings, loans,
                shares & dividends in one secure, unified workspace built for
                institutional stability.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-[#c8922a] hover:bg-[#b07f22] text-white font-semibold rounded-lg px-8 h-12 text-base shadow-lg shadow-amber-900/20"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold rounded-lg px-8 h-12 text-base"
                  >
                    Learn More
                  </Button>
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span>Bank-grade Security</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Real-time Reports</span>
                </div>
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#c8922a]/20 to-blue-500/20 rounded-2xl blur-2xl" />
              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
                <img
                  src={heroImage}
                  alt="SACCO Management Dashboard Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="relative h-16">
          <svg
            viewBox="0 0 1440 60"
            className="absolute bottom-0 w-full h-16"
            preserveAspectRatio="none"
          >
            <path d="M0,60 L0,20 Q720,0 1440,20 L1440,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1c3f] mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-500 text-lg">
              A comprehensive suite of tools designed specifically for Savings
              and Credit Co-operatives to operate efficiently and transparently.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white border border-gray-100 rounded-xl p-6 hover:shadow-xl hover:shadow-gray-100/80 hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-lg bg-[#0f1c3f]/5 flex items-center justify-center mb-5 group-hover:bg-[#0f1c3f] transition-colors duration-300">
                  <feature.icon className="h-6 w-6 text-[#0f1c3f] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-[#0f1c3f] text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works Section ─── */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1c3f] mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 text-lg">
              Deploy your new management system in three simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="text-center relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px]">
                    <div className="w-full h-full border-t-2 border-dashed border-[#c8922a]/30" />
                    <ChevronRight className="absolute -right-2 -top-[11px] h-5 w-5 text-[#c8922a]/40" />
                  </div>
                )}

                <div className="relative inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#c8922a] text-white text-xl font-bold mb-6 shadow-lg shadow-amber-200/50">
                  {step.number}
                </div>
                <h3 className="font-semibold text-[#0f1c3f] text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 bg-gradient-to-r from-[#0a1628] to-[#1a2d5a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Modernize Your SACCO?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of cooperatives already using our platform to manage
            their operations more efficiently.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-[#c8922a] hover:bg-[#b07f22] text-white font-semibold rounded-lg px-10 h-12 text-base shadow-lg"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#0a1628] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={hawiLogo} alt="HAWI Logo" className="h-9 w-9 object-contain" />
                <span className="text-white text-lg flex items-baseline tracking-wide">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">HAWI</span>
                  <span className="ml-1.5 font-medium text-gray-300 text-base">Software Solutions</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering institutions with cutting-edge software solutions
                designed for stability, transparency, and growth in the digital
                age.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Globe className="h-4 w-4 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Mail className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Connect
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Stay updated with our latest releases and news.
              </p>
              <a
                href="mailto:contact@saccomms.com"
                className="inline-flex items-center gap-2 text-[#c8922a] hover:text-[#d9a43b] text-sm transition-colors"
              >
                <Mail className="h-4 w-4" />
                contact@saccomms.com
              </a>
              <div className="mt-4 text-gray-400 text-sm">
                Follow us on{' '}
                <a href="#" className="text-white hover:text-[#c8922a] transition-colors">
                  LinkedIn
                </a>{' '}
                ·{' '}
                <a href="#" className="text-white hover:text-[#c8922a] transition-colors">
                  Twitter
                </a>{' '}
                ·{' '}
                <a href="#" className="text-white hover:text-[#c8922a] transition-colors">
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Hawi Software Solutions. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
