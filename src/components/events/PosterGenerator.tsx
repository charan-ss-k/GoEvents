
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import BlurContainer from '../ui/BlurContainer';
import { ImageIcon, Download, Loader2, Mail, RefreshCw, Palette } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/contexts/AuthContext';

const samplePosters = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2035&auto=format&fit=crop',
];

const PosterGenerator: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [style, setStyle] = useState('modern');
  const [includeQR, setIncludeQR] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGenerate = () => {
    if (!prompt || !eventName || !eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    // This is a mock API call. In a real implementation, this would call an AI image generation API
    setTimeout(() => {
      // Generate multiple posters by using the sample images array
      const randomizedImages = [...samplePosters].sort(() => 0.5 - Math.random());
      setGeneratedImages(randomizedImages);
      setSelectedImage(randomizedImages[0]);
      setLoading(false);
      toast.success('Posters generated successfully!');
    }, 2000);
  };

  const handleDownload = () => {
    if (!selectedImage) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = selectedImage;
    link.download = `${eventName.replace(/\s+/g, '-').toLowerCase()}-poster.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Poster downloaded successfully!');
  };

  const handleEmailPoster = () => {
    if (!selectedImage) return;
    
    // In a real app, this would call an API to send an email with the poster attached
    toast.success(`Poster email sent to ${user?.email || 'your email'}!`);
  };

  const handleCycleImage = () => {
    if (generatedImages.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % generatedImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(generatedImages[nextIndex]);
  };

  return (
    <BlurContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">AI Poster Generator</h3>
        <p className="text-muted-foreground text-sm">
          Generate professional event posters with AI. Describe your event and our AI will create unique posters for you.
        </p>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="event-name">Event Name</Label>
            <Input 
              id="event-name" 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Tech Summit 2025"
            />
          </div>
          
          <div>
            <Label htmlFor="event-date">Event Date</Label>
            <Input 
              id="event-date" 
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="15-06-2025"
            />
          </div>
          
          <div>
            <Label htmlFor="event-location">Event Location</Label>
            <Input 
              id="event-location" 
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Mumbai, India"
            />
          </div>
          
          <div>
            <Label htmlFor="poster-description">Poster Description</Label>
            <Textarea 
              id="poster-description"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the style, colors, and elements you want in your poster"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Poster Style</Label>
            <RadioGroup defaultValue="modern" value={style} onValueChange={setStyle} className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="modern" id="modern" />
                <Label htmlFor="modern">Modern</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minimalist" id="minimalist" />
                <Label htmlFor="minimalist">Minimalist</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vibrant" id="vibrant" />
                <Label htmlFor="vibrant">Vibrant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="corporate" id="corporate" />
                <Label htmlFor="corporate">Corporate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="traditional" id="traditional" />
                <Label htmlFor="traditional">Traditional</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="include-qr"
              checked={includeQR}
              onCheckedChange={setIncludeQR}
            />
            <Label htmlFor="include-qr">Include QR Code</Label>
          </div>
          
          <Button 
            onClick={handleGenerate}
            disabled={loading || !prompt || !eventName || !eventDate}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Posters
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg bg-secondary/30">
        {selectedImage ? (
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-md">
              <img 
                src={selectedImage} 
                alt="Generated event poster" 
                className="w-full h-auto animate-fade-in"
              />
              {includeQR && (
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-white p-1 rounded-md">
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOPSURBVO3BQY4cSRLAQDLQ//8yV0c/JZCoam3MAoyd2R+s+sOqP6z6w6o/rPrDqj+s+sOqP6z6w6o/rPrDqj+s+sOqP6z6w6o/rPrDqj+susOTt1D8xFTwFoqTqUvBibInUJxM3YPiRNkTKH5i6ptWfYPiDat+YuobFCfKTpQ9geLk7QFTn7DqGxS/YdUfVv1h1TdQnCibUJxMTRQTZSeKieLkDYqJsgllE8onKE6m3qLspuxE2YRyouzk7QGrvmHVH1b9YdU3KDtRdqJsQnGibELZRNmJshNlE4oJZRPKibITxYmyCeUTKG5R/AZld6z6hlV/WPWHVT9B2YTiFmV3UJxMnSg7UXYyNaFsQnGi7ERxomyi7AkUT1B2MjWhOFF2omxCOVH2hFV/WPWHVX9Y9QRlE8pOlE0od1B2B8WJshNlE8qJspOyCWUSNqGcKJtQJmETim9a9YdVf1j1h1VPUDahOFE2oUwoTpSdKDtR9g7KJpQTZU9Q9g7KJpQTZROKE2UTyolyx6o/rPrDqj+s+oZbTpRNKN+gbELZhPIJyk6UTShOlE0oJ8rulJ0ou2PVH1b9YdUfVv0ExQllJ8pOpiYUJ8omlE0oJ8ruUDahnCibUHaibEJxomxCcaJsQnGibEJ5w6o/rPrDqj+s+gbFybTbDyhOpiYUE8ruoJhQTpRNKE6UTSgnyk6UTSgnU5+w6g+r/rDqD6veoDiZmih7AmUnyk6UTSibUE6U3UJxomxCOVF2ojhRNqGcTL1h1TdQ/ITVH1b9YdUfVr1B8Q6KCcWJsgllJ8reQNmE8gsUE8omlE0od6z6BsW/bNUfVv1h1TdQ3KLsCYoJZSfKJpQnKJtQTpRNKCfKJpQTZRPKybTqG1b9YdUfVv0ExR0UE8qEsgllQnGibEI5UTahnCibUE6m3qDsRPkExTet+sOqP6z6w6onKJtQNqHcoexE2YTiZOoWZROKE2UTyonixNQTlJ0om1DuWPWHVX9Y9YdVb1CcKHuCshNlE4oTZRPKN1A2oZwoO1F2omxCcaLsCcpOlE0oJ8resuoPq/6w6g+r/rDqD6v+sOoPq/6w6g+r/rDqD6v+sOoPq/6w6g+r/rDqD6v+sOoPq/6w6g//BxWZqJWP8HhGAAAAAElFTkSuQmCC"
                    alt="QR Code"
                    className="w-full h-full"
                  />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/60 transition-opacity">
                <Button variant="secondary" onClick={handleCycleImage} className="mr-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Next
                </Button>
                <Button variant="secondary" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            <div className="w-full flex justify-center space-x-2">
              <Button onClick={handleDownload} className="mt-2">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleEmailPoster} variant="outline" className="mt-2">
                <Mail className="mr-2 h-4 w-4" />
                Email Poster
              </Button>
              <Button onClick={handleCycleImage} variant="outline" className="mt-2">
                <RefreshCw className="mr-2 h-4 w-4" />
                Next Design
              </Button>
            </div>
            <div className="flex justify-center mt-2">
              <p className="text-xs text-muted-foreground">
                Generated {currentIndex + 1} of {generatedImages.length} designs
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No poster generated yet</h3>
            <p className="text-sm text-muted-foreground">
              Fill in the details and click "Generate Posters" to create event posters.
            </p>
            <div className="mt-4 flex items-center justify-center">
              <Palette className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Multiple designs will be generated</span>
            </div>
          </div>
        )}
      </div>
    </BlurContainer>
  );
};

export default PosterGenerator;
