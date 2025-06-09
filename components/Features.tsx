import { ShieldCheck, PlusCircle, Smartphone } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
      title: "Verified .edu Users",
      description: "All listings are verified by students with valid .edu email addresses, ensuring a safe and trustworthy community."
    },
    {
      icon: <PlusCircle className="w-6 h-6 text-orange-600" />,
      title: "Easy Listing Creation",
      description: "Create and manage your property listings in minutes with our intuitive interface and smart templates."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-green-600" />,
      title: "Mobile-First Design",
      description: "Browse and manage listings on any device with our responsive, mobile-optimized platform."
    }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="feature-icon-bg w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 