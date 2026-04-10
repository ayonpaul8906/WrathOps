import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Workflow from '@/components/workflow'
import Features from '@/components/features'
import Dashboard from '@/components/dashboard'
import Pricing from '@/components/pricing'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-16">
        <Hero />
        <Workflow />
        <Features />
        <Dashboard />
        <Pricing />
      </div>
      
      <Footer />
    </main>
  )
}
