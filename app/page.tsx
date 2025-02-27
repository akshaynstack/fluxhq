import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Framer, Image, Shield, CreditCard, Check, Zap, Star } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Gradient Background */}
      <header className="relative border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex h-20 items-center justify-between py-4 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0">
          <div className="flex items-center gap-2">
            <Framer className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">FluxHQ</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/signin">
              <Button variant="outline" className="border-purple-200 hover:border-purple-300 dark:border-gray-700 dark:hover:border-gray-600">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
          {/* Abstract Background Elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-300 dark:bg-purple-700 blur-3xl"></div>
            <div className="absolute top-60 -left-20 w-60 h-60 rounded-full bg-blue-300 dark:bg-blue-700 blur-3xl"></div>
            <div className="absolute bottom-20 right-60 w-40 h-40 rounded-full bg-pink-300 dark:bg-pink-700 blur-3xl"></div>
          </div>

          <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col max-w-xl">
                <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300 w-fit">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI-Powered Image Generation
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                  Transform Your Ideas Into Stunning Visuals
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
                  Create beautiful, unique images in seconds with our advanced AI. No design skills needed — just describe what you want to see.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 text-white">
                      Start Creating <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/examples">
                    <Button size="lg" variant="outline" className="border-purple-200 hover:border-purple-300 dark:border-gray-700 dark:hover:border-gray-600">
                      View Gallery
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-10 grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Free Credits</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">No Credit Card</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">High Quality</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-900 dark:to-blue-900 rounded-xl blur-xl opacity-30 transform -rotate-6"></div>
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-lg shadow-lg transform translate-y-8">
                      <img 
                        src="https://images.unsplash.com/photo-1655635949212-1d8f4f103ea1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="AI generated fantasy landscape" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="overflow-hidden rounded-lg shadow-lg translate-y-8">
                      <img 
                        src="https://images.unsplash.com/photo-1675426513141-f0020092d72e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="AI generated portrait" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-lg shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1683009427540-c5bd6a32abf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="AI generated abstract art" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="overflow-hidden rounded-lg shadow-lg transform">
                      <img 
                        src="https://images.unsplash.com/photo-1739286955022-569369156bc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="AI generated cityscape" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How FluxHQ Works</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Create stunning images in three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-lg"></div>
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Describe Your Vision</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter a detailed description of the image you want to create. The more specific, the better the results.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-lg"></div>
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Customize Options</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select your preferred style, size, and format. Adjust settings to get exactly what you're looking for.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-lg"></div>
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Generate & Download</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI creates your image in seconds. Download, share, or modify it further to suit your needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Everything you need to bring your imagination to life
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 transition-transform hover:scale-105">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Image className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Advanced AI Models</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access state-of-the-art AI models like Stable Diffusion and DALL-E to create stunning, realistic images.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 transition-transform hover:scale-105">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Flexible Credit System</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Earn free credits through various activities. Use credits to generate images without subscription limits.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 transition-transform hover:scale-105">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data and creations are protected with enterprise-grade security and privacy controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Join thousands of creators already using FluxHQ
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  "FluxHQ has completely transformed my creative process. I can now visualize my ideas instantly without needing to hire a designer."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center mr-3">
                    <span className="font-semibold text-purple-700 dark:text-purple-300">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">Jessica Davis</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Marketing Director</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  "The quality of images I can generate with FluxHQ is mind-blowing. It's become an essential tool for my content creation workflow."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center mr-3">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">MT</span>
                  </div>
                  <div>
                    <p className="font-medium">Michael Thompson</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Content Creator</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  "As a small business owner, FluxHQ has saved me thousands in design costs. I can create professional visuals for my products in minutes."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center mr-3">
                    <span className="font-semibold text-green-700 dark:text-green-300">SL</span>
                  </div>
                  <div>
                    <p className="font-medium">Sarah Lee</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Entrepreneur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-900 dark:to-blue-900">
          <div className="container mx-auto max-w-7xl text-center px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to create amazing images?</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-10">
              Join thousands of creators using FluxHQ to bring their ideas to life. Start with 3 free credits today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">FluxHQ</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transform your ideas into stunning visuals with AI-powered image generation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Pricing</Link></li>
                <li><Link href="/examples" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Gallery</Link></li>
                <li><Link href="/roadmap" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Blog</Link></li>
                <li><Link href="/tutorials" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Tutorials</Link></li>
                <li><Link href="/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Documentation</Link></li>
                <li><Link href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">About</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Contact</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Terms</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} FluxHQ. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-sm text-gray-500 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}