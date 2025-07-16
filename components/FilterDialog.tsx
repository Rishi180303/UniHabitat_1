import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Filter } from 'lucide-react';

export interface FilterState {
  subleaseType: string;
  furnishing: string;
  leaseType: string;
  totalBedrooms: string;
  availableBedrooms: string;
  totalBathrooms: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterDialogProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function FilterDialog({ filter, onChange, onApply, onClear }: FilterDialogProps) {
  const [open, setOpen] = useState(false);

  const handleField = (field: keyof FilterState, value: string) => {
    onChange({ ...filter, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-10 h-10 bg-white hover:bg-gray-50 text-[#2C3E50] rounded-xl transition-all duration-200 flex items-center justify-center border border-gray-200 shadow-sm hover:shadow-md">
          <Filter className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {/* Type of Place */}
          <div>
            <label className="block text-sm font-semibold mb-2">Type of Place</label>
            <Tabs value={filter.subleaseType || 'any'} onValueChange={v => handleField('subleaseType', v === 'any' ? '' : v)}>
              <TabsList>
                <TabsTrigger value="any">Any</TabsTrigger>
                <TabsTrigger value="private-bedroom">Private bedroom</TabsTrigger>
                <TabsTrigger value="entire-place">Entire place</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* Furnishing */}
          <div>
            <label className="block text-sm font-semibold mb-2">Furnishing</label>
            <Tabs value={filter.furnishing || 'any'} onValueChange={v => handleField('furnishing', v === 'any' ? '' : v)}>
              <TabsList>
                <TabsTrigger value="any">Any</TabsTrigger>
                <TabsTrigger value="move-in-ready">Move-in ready</TabsTrigger>
                <TabsTrigger value="furnished">Furnished</TabsTrigger>
                <TabsTrigger value="unfurnished">Unfurnished</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* Lease Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Lease Type</label>
            <Tabs value={filter.leaseType || 'any'} onValueChange={v => handleField('leaseType', v === 'any' ? '' : v)}>
              <TabsList>
                <TabsTrigger value="any">Any</TabsTrigger>
                <TabsTrigger value="sublease">Sublease</TabsTrigger>
                <TabsTrigger value="new-lease">New lease</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* Bedrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Total Bedrooms</label>
              <select value={filter.totalBedrooms} onChange={e => handleField('totalBedrooms', e.target.value)} className="w-full p-2 rounded-md border border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50]">
                <option value="">Any</option>
                {[2,3,4,5,6,7].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Available Bedrooms</label>
              <select value={filter.availableBedrooms} onChange={e => handleField('availableBedrooms', e.target.value)} className="w-full p-2 rounded-md border border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50]">
                <option value="">Any</option>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-semibold mb-2">Bathrooms</label>
            <select value={filter.totalBathrooms} onChange={e => handleField('totalBathrooms', e.target.value)} className="w-full p-2 rounded-md border border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50]">
              <option value="">Any</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Min Price</label>
              <Input type="number" min={0} value={filter.minPrice} onChange={e => handleField('minPrice', e.target.value)} placeholder="No min" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Max Price</label>
              <Input type="number" min={0} value={filter.maxPrice} onChange={e => handleField('maxPrice', e.target.value)} placeholder="No max" />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => { onClear(); setOpen(false); }} type="button">Clear all</Button>
          <Button onClick={() => { onApply(); setOpen(false); }} type="button" className="bg-[#2C3E50] text-white hover:bg-[#34495E]">Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 