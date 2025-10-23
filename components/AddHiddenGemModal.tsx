'use client';

import { useState } from 'react';
import { Sparkles, Upload, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface AddHiddenGemModalProps {
  currentUserId?: string;
  onGemAdded?: () => void;
}

export default function AddHiddenGemModal({ currentUserId, onGemAdded }: AddHiddenGemModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    image_url: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUserId) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;
    const filePath = `gems/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('trail-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('trail-images').getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      toast.error('Please log in to add hidden gems');
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.latitude ||
      !formData.longitude ||
      isNaN(Number(formData.latitude)) ||
      isNaN(Number(formData.longitude))
    ) {
      toast.error('Please fill all required fields with valid data');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: gemError } = await supabase.from('hidden_gems').insert({
        name: formData.name.trim(),
        description: formData.description.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        image_url: formData.image_url,
        created_by: currentUserId,
      });

      if (gemError) throw gemError;

      await supabase.rpc('award_xp', {
        user_uuid: currentUserId,
        xp_amount: 50,
        stat_to_increment: 'gems_created',
      });

      toast.success('Hidden gem added! +50 XP');
      setFormData({
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        image_url: '',
      });
      setOpen(false);

      if (onGemAdded) {
        onGemAdded();
      }
    } catch (error) {
      toast.error('Failed to add hidden gem');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
          toast.success('Location captured');
        },
        () => {
          toast.error('Failed to get location');
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-teal-500 to-mint-500 hover:from-teal-600 hover:to-mint-600">
          <Sparkles className="w-4 h-4 mr-2" />
          Add Hidden Gem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            Add a Hidden Gem
          </DialogTitle>
          <DialogDescription>
            Share a special place you've discovered in Kolkata. Earn 50 XP!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Cozy Chai Corner"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="What makes this place special?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="22.5726"
                required
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="88.3639"
                required
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            className="w-full"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Use Current Location
          </Button>

          <div>
            <Label htmlFor="image">Photo</Label>
            <div className="mt-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={!currentUserId}
                className="cursor-pointer"
              />
            </div>
            {formData.image_url && (
              <div className="mt-2 relative h-32 rounded-lg overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !currentUserId}
              className="flex-1 bg-gradient-to-r from-teal-500 to-mint-500"
            >
              {isSubmitting ? 'Adding...' : 'Add Gem'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
