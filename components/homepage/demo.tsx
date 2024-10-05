"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Zap, CheckCircle, HelpCircle, Cpu, Globe, BarChart } from 'lucide-react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-[#333] font-sans" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className={`text-2xl font-bold flex items-center ${scrolled ? 'text-[#00ffff]' : 'text-[#1a1a1a]'}`}>
            <Zap className="w-6 h-6 mr-2" />
            SocialTargeter
          </div>
          <div className="space-x-4">
            <button className={`hover:text-[#00ffff] ${scrolled ? 'text-white' : 'text-[#1a1a1a]'}`}>Pricing</button>
            <button className={`hover:text-[#00ffff] ${scrolled ? 'text-white' : 'text-[#1a1a1a]'}`}>Blog</button>
            <button className={`hover:text-[#00ffff] ${scrolled ? 'text-white' : 'text-[#1a1a1a]'}`}>Dashboard</button>
            <button className="bg-[#00ffff] text-[#1a1a1a] px-4 py-2 rounded hover:bg-[#00cccc]">Contact Us</button>
          </div>
        </nav>
      </header>

      <main>
        <section className="h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#333] text-white">
          <div className="text-center">
            <motion.h1
              className="text-6xl font-bold mb-4 text-[#00ffff]"
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              Supercharge Your Product Mentions
            </motion.h1>
            <motion.p
              className="text-xl mb-8"
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              Harness AI to target the perfect audience and skyrocket your online presence
            </motion.p>
            <motion.button
              className="bg-[#00ffff] text-[#1a1a1a] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#00cccc] transition-colors duration-300"
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              Launch Your Campaign
            </motion.button>
          </div>
        </section>

        <section ref={ref} className="py-20 bg-[#f0f0f0]">
          <div className="container mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold mb-12 text-center text-[#1a1a1a]"
              initial="hidden"
              animate={controls}
              variants={textVariants}
            >
              How It Works
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Input Details', description: 'Provide your product information and target audience', icon: <Cpu className="w-12 h-12 text-[#00ffff]" /> },
                { title: 'AI Analysis', description: 'Our advanced AI scans and analyzes online platforms', icon: <Globe className="w-12 h-12 text-[#00ffff]" /> },
                { title: 'Get Recommendations', description: 'Receive data-driven suggestions for optimal product mentions', icon: <BarChart className="w-12 h-12 text-[#00ffff]" /> },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  initial="hidden"
                  animate={controls}
                  variants={textVariants}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex flex-col items-center text-center">
                    {step.icon}
                    <h3 className="text-xl font-semibold my-4">{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#1a1a1a] text-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">AI-Powered Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                'Reddit: "Your product is perfect for r/productivity. Post on Wednesdays for maximum engagement."',
                'Twitter: "Engage with @techinfluencer to showcase your product. Their followers align with your target demographic."',
                'LinkedIn: "Share your product in these 3 industry groups: [Group1], [Group2], [Group3]. Use hashtags #ProductivityHack #TechInnovation"',
                'Product Hunt: "Launch your product here on Tuesday at 00:01 PST for optimal visibility and upvotes."'
              ].map((example, index) => (
                <div key={index} className="bg-[#333] p-6 rounded-lg border border-[#00ffff]">
                  <p className="text-[#00ffff]">{example}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f0f0f0]">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-[#1a1a1a]">Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Starter', price: 29, features: ['50 AI-powered suggestions/month', 'Basic analytics dashboard', 'Email support'] },
                { name: 'Pro', price: 99, features: ['Unlimited AI suggestions', 'Advanced analytics & reporting', 'Priority support', 'Custom targeting parameters'] },
                { name: 'Enterprise', price: 299, features: ['All Pro features', 'Dedicated account manager', 'API access for integration', 'Custom AI model training'] }
              ].map((plan, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold mb-4 text-[#1a1a1a]">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-6 text-[#00ffff]">${plan.price}<span className="text-xl font-normal text-[#333]">/mo</span></p>
                  <ul className="mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-[#00ffff] mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-[#00ffff] text-[#1a1a1a] px-4 py-2 rounded-full font-semibold hover:bg-[#00cccc] transition-colors duration-300">
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-[#1a1a1a]">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How accurate are the AI suggestions?", a: "Our AI model boasts a 95% accuracy rate, continuously improving through machine learning and weekly updates." },
                { q: "Can I use SocialTargeter for multiple products?", a: "Create and manage multiple campaigns for different products, all from a single dashboard." },
                { q: "Is there a free trial available?", a: "Yes, we offer a 14-day free trial of our Pro plan, giving you full access to experience the power of our AI-driven platform." },
                { q: "How does the AI stay current with platform changes?", a: "Our AI model is updated weekly, incorporating the latest trends, algorithm changes, and user behavior across all supported platforms." }
              ].map((item, index) => (
                <div key={index} className="bg-[#f0f0f0] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 flex items-center text-[#1a1a1a]">
                    <HelpCircle className="w-6 h-6 text-[#00ffff] mr-2" />
                    {item.q}
                  </h3>
                  <p className="text-[#333]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a1a1a] text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} SocialTargeter. Empowering your online presence with cutting-edge AI.</p>
        </div>
      </footer>
    </div>
  )
}