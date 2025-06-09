import { GraduationCap, Home, Smartphone } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <GraduationCap className="w-12 h-12 text-sky-600" />,
      title: "Verified .edu Users",
      description: "All listings are verified by students with valid .edu email addresses, ensuring a safe and trustworthy community."
    },
    {
      icon: <Home className="w-12 h-12 text-mint-600" />,
      title: "Easy Listing Creation",
      description: "Create and manage your property listings in minutes with our intuitive interface and smart templates."
    },
    {
      icon: <Smartphone className="w-12 h-12 text-sky-600" />,
      title: "Mobile-First Design",
      description: "Browse and manage listings on any device with our responsive, mobile-optimized platform."
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 