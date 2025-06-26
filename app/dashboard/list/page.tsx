'use client'

import { useState } from "react"
import { Step } from "@/components/Step"
import { Button } from "@/components/ui/button"
import UniversitySearch from "@/components/UniversitySearch"

const steps = [
  "Basic Info",
  "Details",
  "Photos",
  "Review & Submit"
]

export default function ListUnit() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: "",
    description: "",
    university: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    availableFrom: "",
    leaseLength: "",
    photos: [] as File[],
  })
  const [errors, setErrors] = useState<any>({})

  // Dummy validation for required fields
  const validate = () => {
    const errs: any = {}
    if (step === 0) {
      if (!form.title) errs.title = "Title required"
      if (!form.university) errs.university = "University required"
      if (!form.address) errs.address = "Address required"
    }
    if (step === 1) {
      if (!form.price) errs.price = "Price required"
      if (!form.bedrooms) errs.bedrooms = "Bedrooms required"
      if (!form.bathrooms) errs.bathrooms = "Bathrooms required"
      if (!form.availableFrom) errs.availableFrom = "Date required"
      if (!form.leaseLength) errs.leaseLength = "Lease length required"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validate()) setStep((s) => s + 1)
  }
  const handleBack = () => setStep((s) => s - 1)

  // Dummy photo upload handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, photos: Array.from(e.target.files) })
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6ED] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white/80 rounded-3xl shadow-2xl p-8 space-y-10">
        <div className="flex justify-between items-center mb-6">
          {steps.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-lg mb-1 ${i <= step ? 'bg-[#2C3E50]' : 'bg-[#BFAE9B]'}`}>{i+1}</div>
              <span className={`text-xs font-medium ${i === step ? 'text-[#2C3E50]' : 'text-[#BFAE9B]'}`}>{label}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <Step number={1} title="Basic Info">
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Title<span className="text-red-500">*</span></label>
                <input className={`w-full rounded-lg border px-4 py-2 ${errors.title ? 'border-red-400' : 'border-gray-200'}`} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea className="w-full rounded-lg border border-gray-200 px-4 py-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="block font-medium mb-1">University<span className="text-red-500">*</span></label>
                <UniversitySearch value={form.university} onChange={val => setForm({ ...form, university: val })} />
                {errors.university && <div className="text-red-500 text-xs mt-1">{errors.university}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">Address<span className="text-red-500">*</span></label>
                <input className={`w-full rounded-lg border px-4 py-2 ${errors.address ? 'border-red-400' : 'border-gray-200'}`} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
              </div>
            </div>
          </Step>
        )}
        {step === 1 && (
          <Step number={2} title="Details">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Price ($/month)<span className="text-red-500">*</span></label>
                  <input type="number" className={`w-full rounded-lg border px-4 py-2 ${errors.price ? 'border-red-400' : 'border-gray-200'}`} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                  {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                </div>
                <div>
                  <label className="block font-medium mb-1">Bedrooms<span className="text-red-500">*</span></label>
                  <input type="number" className={`w-full rounded-lg border px-4 py-2 ${errors.bedrooms ? 'border-red-400' : 'border-gray-200'}`} value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} />
                  {errors.bedrooms && <div className="text-red-500 text-xs mt-1">{errors.bedrooms}</div>}
                </div>
                <div>
                  <label className="block font-medium mb-1">Bathrooms<span className="text-red-500">*</span></label>
                  <input type="number" className={`w-full rounded-lg border px-4 py-2 ${errors.bathrooms ? 'border-red-400' : 'border-gray-200'}`} value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} />
                  {errors.bathrooms && <div className="text-red-500 text-xs mt-1">{errors.bathrooms}</div>}
                </div>
                <div>
                  <label className="block font-medium mb-1">Available From<span className="text-red-500">*</span></label>
                  <input type="date" className={`w-full rounded-lg border px-4 py-2 ${errors.availableFrom ? 'border-red-400' : 'border-gray-200'}`} value={form.availableFrom} onChange={e => setForm({ ...form, availableFrom: e.target.value })} />
                  {errors.availableFrom && <div className="text-red-500 text-xs mt-1">{errors.availableFrom}</div>}
                </div>
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Lease Length (months)<span className="text-red-500">*</span></label>
                  <input type="number" className={`w-full rounded-lg border px-4 py-2 ${errors.leaseLength ? 'border-red-400' : 'border-gray-200'}`} value={form.leaseLength} onChange={e => setForm({ ...form, leaseLength: e.target.value })} />
                  {errors.leaseLength && <div className="text-red-500 text-xs mt-1">{errors.leaseLength}</div>}
                </div>
              </div>
            </div>
          </Step>
        )}
        {step === 2 && (
          <Step number={3} title="Photos">
            <div className="space-y-4">
              <label className="block font-medium mb-1">Upload Photos</label>
              <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FDF6ED] file:text-[#2C3E50] hover:file:bg-[#F5E6D6]" />
              <div className="flex gap-2 flex-wrap mt-2">
                {form.photos.length > 0 ? form.photos.map((file, i) => (
                  <div key={i} className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <span className="text-xs text-gray-500 text-center px-1">{file.name}</span>
                  </div>
                )) : <span className="text-gray-400 text-sm">No photos uploaded yet.</span>}
              </div>
            </div>
          </Step>
        )}
        {step === 3 && (
          <Step number={4} title="Review & Submit">
            <div className="space-y-4">
              <div className="bg-[#FDF6ED] rounded-xl p-4">
                <div className="font-bold mb-2">Listing Preview</div>
                <div><b>Title:</b> {form.title}</div>
                <div><b>Description:</b> {form.description}</div>
                <div><b>University:</b> {form.university}</div>
                <div><b>Address:</b> {form.address}</div>
                <div><b>Price:</b> ${form.price}/month</div>
                <div><b>Bedrooms:</b> {form.bedrooms}</div>
                <div><b>Bathrooms:</b> {form.bathrooms}</div>
                <div><b>Available From:</b> {form.availableFrom}</div>
                <div><b>Lease Length:</b> {form.leaseLength} months</div>
                <div><b>Photos:</b> {form.photos.length} uploaded</div>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white" onClick={() => alert('Submitted! (dummy)')}>Submit Listing</Button>
            </div>
          </Step>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack} disabled={step === 0}>Back</Button>
          {step < steps.length - 1 && <Button onClick={handleNext}>Next</Button>}
        </div>
      </div>
    </div>
  )
} 