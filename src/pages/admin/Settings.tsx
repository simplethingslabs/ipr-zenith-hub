import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Container } from '@/components/layout/Container';
import { mockSettings } from '@/lib/mockData';
import { settingsApi } from '@/lib/api';
import { Settings as SettingsType } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsType>(mockSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof SettingsType, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof SettingsType['address'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleSocialChange = (field: keyof SettingsType['socialLinks'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value },
    }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsApi.get();
        setSettings(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load settings',
          variant: 'destructive',
        });
      }
    };
    fetchSettings();
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsApi.update(settings);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been successfully updated.',
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: `Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Container>
        <div className="py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your site settings and contact information
              </p>
            </div>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Firm Information */}
            <Card>
              <CardHeader>
                <CardTitle>Firm Information</CardTitle>
                <CardDescription>Basic information about your firm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firmName">Firm Name</Label>
                  <Input
                    id="firmName"
                    value={settings.firmName}
                    onChange={(e) => handleChange('firmName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About / Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroImage">Hero Image URL</Label>
                  <Input
                    id="heroImage"
                    placeholder="https://example.com/hero.jpg"
                    value={settings.heroImage || ''}
                    onChange={(e) => handleChange('heroImage', e.target.value)}
                  />
                  {settings.heroImage && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted mt-2">
                      <img
                        src={settings.heroImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How clients can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="+919876543210"
                    value={settings.whatsapp || ''}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include country code without spaces or symbols
                  </p>
                </div>

                <Separator className="my-4" />

                <h4 className="font-medium">Address</h4>

                <div className="space-y-2">
                  <Label htmlFor="addressLine">Street Address</Label>
                  <Input
                    id="addressLine"
                    value={settings.address.line}
                    onChange={(e) => handleAddressChange('line', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={settings.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={settings.address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={settings.address.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Your social media profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/company/..."
                      value={settings.socialLinks.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/..."
                      value={settings.socialLinks.twitter || ''}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/..."
                      value={settings.socialLinks.facebook || ''}
                      onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button (Bottom) */}
          <div className="mt-8 flex justify-end">
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Container>
    </AdminLayout>
  );
}
