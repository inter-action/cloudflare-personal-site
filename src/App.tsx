import { useState, useEffect } from 'react'
import { Cloud, Code, Zap, ArrowRight } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        outline: 'border border-slate-300 hover:bg-slate-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  )
}

interface ApiResponse {
  message: string
  timestamp: string
  region?: string
}

function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchApiData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/hello')
      const data = await response.json()
      setApiData(data)
    } catch (err) {
      setError('Failed to fetch API data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApiData()
  }, [])

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold">Cloudflare Site</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#api" className="text-slate-400 hover:text-white transition-colors">
              API
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Welcome to My Site
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Built with React, TypeScript, Tailwind CSS, and deployed on Cloudflare Pages.
            Fast, secure, and globally distributed.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={fetchApiData} disabled={loading}>
              {loading ? 'Loading...' : 'Test API'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => window.open('https://cloudflare.com', '_blank')}>
              Learn More
            </Button>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <Cloud className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cloudflare Pages</h3>
              <p className="text-slate-400">
                Deploy your static site with global CDN and edge computing.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <Code className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hono API</h3>
              <p className="text-slate-400">
                Lightweight API framework running on Cloudflare Workers.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <Zap className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-slate-400">
                Sub-second response times from edge locations worldwide.
              </p>
            </div>
          </div>
        </section>

        <section id="api" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">API Demo</h2>
          <div className="max-w-xl mx-auto">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-semibold mb-4">GET /api/hello</h3>
              {error ? (
                <p className="text-red-400">{error}</p>
              ) : apiData ? (
                <pre className="p-4 rounded-lg bg-slate-950 overflow-x-auto">
                  <code className="text-sm text-green-400">
                    {JSON.stringify(apiData, null, 2)}
                  </code>
                </pre>
              ) : (
                <p className="text-slate-500">Click "Test API" to fetch data...</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-500">
          <p>© 2024 Cloudflare Personal Site. Built with ❤️</p>
        </div>
      </footer>
    </div>
  )
}

export default App
