import { Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">UniHabitat</h3>
            <p className="mb-8 text-gray-400 leading-relaxed">
              Making student housing simple, safe, and stress-free.
              Join thousands of students finding their perfect home.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <p className="mb-6 text-gray-400">
              If you have any issues or questions, feel free to reach out to us directly.
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=rsenthi4@asu.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#FDF6ED] text-[#2C3E50] rounded-xl font-semibold shadow hover:bg-[#F5E6D6] transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 