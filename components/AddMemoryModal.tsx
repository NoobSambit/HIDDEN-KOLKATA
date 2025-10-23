'use client';

import { useState } from 'react';
import { Camera, MapPin } from 'lucide-react';
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

interface AddMemoryModalProps {
  currentUserId?: string;
  onMemoryAdded?: () => void;
  defaultTrailName?: string;
}

export default function AddMemoryModal({
  currentUserId,
  onMemoryAdded,
  defaultTrailName = '',
}: AddMemoryModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    trail_name: defaultTrailName,
    caption: '',
    image_url: '',
    latitude: '',
    longitude: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUserId) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;
    const filePath = `memories/${fileName}`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      toast.error('Please log in to add memories');
      return;
    }

    if (!formData.image_url) {
      toast.error('Please upload a photo');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: memoryError } = await supabase.from('memories').insert({
        user_id: currentUserId,
        trail_name: formData.trail_name.trim() || 'Untitled Trail',
        caption: formData.caption.trim(),
        image_url: formData.image_url,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      });

      if (memoryError) throw memoryError;

      await supabase.rpc('award_xp', {
        user_uuid: currentUserId,
        xp_amount: 25,
      });

      toast.success('Memory added! +25 XP');
      setFormData({
        trail_name: defaultTrailName,
        caption: '',
        image_url: '',
        latitude: '',
        longitude: '',
      });
      setOpen(false);

      if (onMemoryAdded) {
        onMemoryAdded();
      }
    } catch (error) {
      toast.error('Failed to add memory');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-teal-500 to-mint-500 hover:from-teal-600 hover:to-mint-600">
          <Camera className="w-4 h-4 mr-2" />
          Add Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-500" />
            Add a Trail Memory
          </DialogTitle>
          <DialogDescription>
            Capture your favorite moments from the trails. Earn 25 XP!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="trail_name">Trail Name</Label>
            <Input
              id="trail_name"
              name="trail_name"
              value={formData.trail_name}
              onChange={handleInputChange}
              placeholder="e.g., Morning Walk at Victoria Memorial"
            />
          </div>

          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Share your thoughts about this moment..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image">Photo *</Label>
            <div className="mt-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={!currentUserId}
                className="cursor-pointer"
                required
              />
            </div>
            {formData.image_url && (
              <div className="mt-2 relative h-48 rounded-lg overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Optional"
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
              {isSubmitting ? 'Adding...' : 'Add Memory'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
