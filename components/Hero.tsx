import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Find Your Next Home on Campus
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The easiest way to discover and secure your perfect off-campus housing. 
          Verified listings, trusted by students.
        </p>
        <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
          Get Started
        </Button>
      </div>
    </section>
  )
} 