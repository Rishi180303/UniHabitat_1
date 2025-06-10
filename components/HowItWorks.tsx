import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Step } from "./Step"
import { RenterStep1, ListerStep1 } from "./StepContent"

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("renters")

  return (
    <section className="py-24 bg-[#FDF6ED]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-8">
            How UniHabitat Makes Student Housing Simple
          </h2>
          
          <Tabs 
            defaultValue="renters" 
            className="w-full max-w-md mx-auto"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 bg-white/50 p-1 rounded-full">
              <TabsTrigger 
                value="renters"
                className="data-[state=active]:bg-white data-[state=active]:text-[#2C3E50] rounded-full"
              >
                Renters
              </TabsTrigger>
              <TabsTrigger 
                value="listers"
                className="data-[state=active]:bg-white data-[state=active]:text-[#2C3E50] rounded-full"
              >
                Listers
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Steps Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-[#2C3E50]/10" />
          
          {/* Steps */}
          <div className="space-y-24">
            {activeTab === "renters" ? (
              <>
                <Step number={1} title="Find the perfect campus housing">
                  <RenterStep1 />
                </Step>
                {/* Add more steps here */}
              </>
            ) : (
              <>
                <Step number={1} title="List your place">
                  <ListerStep1 />
                </Step>
                {/* Add more steps here */}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 