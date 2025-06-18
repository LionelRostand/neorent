
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const PagesTab = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [pages, setPages] = useState([
    { id: '1', title: 'Home', url: '/', status: 'Published' },
    { id: '2', title: 'About', url: '/about', status: 'Published' },
    { id: '3', title: 'Contact', url: '/contact', status: 'Published' },
    { id: '4', title: 'Services', url: '/services', status: 'Draft' }
  ]);

  const [newPage, setNewPage] = useState({
    title: '',
    url: '',
    content: '',
    metaDescription: ''
  });

  const handleSavePages = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving pages:', { pages, newPage });
      
      toast.success('Pages saved successfully!', {
        description: 'Page configuration updated'
      });
    } catch (error) {
      toast.error('Error saving pages', {
        description: 'Please try again'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addNewPage = () => {
    if (newPage.title && newPage.url) {
      const page = {
        id: String(pages.length + 1),
        title: newPage.title,
        url: newPage.url,
        status: 'Draft'
      };
      setPages([...pages, page]);
      setNewPage({ title: '', url: '', content: '', metaDescription: '' });
      toast.success('Page added successfully!');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📄 Page Management</h2>
        <Button 
          onClick={handleSavePages} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        Create and manage your NeoRent website pages.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Existing Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{page.title}</h4>
                    <p className="text-sm text-gray-500">{page.url}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      page.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Add New Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input 
                placeholder="e.g. Our Services"
                value={newPage.title}
                onChange={(e) => setNewPage({...newPage, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input 
                placeholder="e.g. /services"
                value={newPage.url}
                onChange={(e) => setNewPage({...newPage, url: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>META Description</Label>
              <Textarea 
                placeholder="Description for SEO..."
                rows={2}
                value={newPage.metaDescription}
                onChange={(e) => setNewPage({...newPage, metaDescription: e.target.value})}
              />
            </div>
            <Button onClick={addNewPage} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PagesTab;
