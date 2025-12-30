import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Container } from '@/components/layout/Container';
import { mockFees } from '@/lib/mockData';
import { FeeItem, Audience, FeeType } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface FeeFormData {
  name: string;
  audience: Audience;
  type: FeeType;
  priceMin: string;
  priceMax: string;
  category: string;
  notes: string;
}

const initialFormData: FeeFormData = {
  name: '',
  audience: 'Individuals',
  type: 'fixed',
  priceMin: '',
  priceMax: '',
  category: '',
  notes: '',
};

export default function FeesManager() {
  const { toast } = useToast();
  const [fees, setFees] = useState<FeeItem[]>(mockFees);
  const [searchQuery, setSearchQuery] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<Audience | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeItem | null>(null);
  const [formData, setFormData] = useState<FeeFormData>(initialFormData);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchesSearch = fee.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAudience = audienceFilter === 'all' || fee.audience === audienceFilter;
      return matchesSearch && matchesAudience;
    });
  }, [fees, searchQuery, audienceFilter]);

  const formatPrice = (fee: FeeItem) => {
    if (fee.type === 'fixed') {
      return `₹${fee.priceMin.toLocaleString()}`;
    }
    return `₹${fee.priceMin.toLocaleString()} - ₹${fee.priceMax?.toLocaleString() || ''}`;
  };

  const handleOpenDialog = (fee?: FeeItem) => {
    if (fee) {
      setEditingFee(fee);
      setFormData({
        name: fee.name,
        audience: fee.audience,
        type: fee.type,
        priceMin: fee.priceMin.toString(),
        priceMax: fee.priceMax?.toString() || '',
        category: fee.category,
        notes: fee.notes || '',
      });
    } else {
      setEditingFee(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFee(null);
    setFormData(initialFormData);
  };

  const handleChange = (field: keyof FeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a service name.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.priceMin || isNaN(Number(formData.priceMin))) {
      toast({
        title: 'Error',
        description: 'Please enter a valid minimum price.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.type === 'variable' && (!formData.priceMax || isNaN(Number(formData.priceMax)))) {
      toast({
        title: 'Error',
        description: 'Please enter a valid maximum price for variable fees.',
        variant: 'destructive',
      });
      return;
    }

    const feeData: FeeItem = {
      id: editingFee?.id || Date.now().toString(),
      name: formData.name,
      audience: formData.audience,
      type: formData.type,
      priceMin: Number(formData.priceMin),
      priceMax: formData.type === 'variable' ? Number(formData.priceMax) : undefined,
      category: formData.category,
      notes: formData.notes || undefined,
      createdAt: editingFee?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingFee) {
      setFees(fees.map((f) => (f.id === editingFee.id ? feeData : f)));
      toast({
        title: 'Fee updated',
        description: 'The fee item has been successfully updated.',
      });
    } else {
      setFees([...fees, feeData]);
      toast({
        title: 'Fee created',
        description: 'The fee item has been successfully created.',
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setFees(fees.filter((fee) => fee.id !== id));
    toast({
      title: 'Fee deleted',
      description: 'The fee item has been successfully deleted.',
    });
  };

  return (
    <AdminLayout>
      <Container>
        <div className="py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Fees</h1>
              <p className="text-muted-foreground">
                Manage your service pricing
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => handleOpenDialog()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Fee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingFee ? 'Edit Fee' : 'Add Fee'}</DialogTitle>
                  <DialogDescription>
                    {editingFee ? 'Update the fee item details.' : 'Create a new fee item.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Service Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Trademark Registration"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="audience">Audience</Label>
                      <Select
                        value={formData.audience}
                        onValueChange={(v) => handleChange('audience', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individuals">Individuals</SelectItem>
                          <SelectItem value="Businesses">Businesses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Price Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => handleChange('type', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="variable">Variable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceMin">
                        {formData.type === 'fixed' ? 'Price (₹)' : 'Min Price (₹)'}
                      </Label>
                      <Input
                        id="priceMin"
                        type="number"
                        placeholder="5000"
                        value={formData.priceMin}
                        onChange={(e) => handleChange('priceMin', e.target.value)}
                      />
                    </div>

                    {formData.type === 'variable' && (
                      <div className="space-y-2">
                        <Label htmlFor="priceMax">Max Price (₹)</Label>
                        <Input
                          id="priceMax"
                          type="number"
                          placeholder="15000"
                          value={formData.priceMax}
                          onChange={(e) => handleChange('priceMax', e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Trademarks, Patents, Copyrights"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional details about this service..."
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleSave}
                  >
                    {editingFee ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search fees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={audienceFilter} onValueChange={(v) => setAudienceFilter(v as Audience | 'all')}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Audiences</SelectItem>
                    <SelectItem value="Individuals">Individuals</SelectItem>
                    <SelectItem value="Businesses">Businesses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Fees Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Fees ({filteredFees.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFees.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No fee items found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Audience</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFees.map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell className="font-medium max-w-[250px]">
                            <span className="truncate block">{fee.name}</span>
                            {fee.notes && (
                              <span className="text-xs text-muted-foreground truncate block">
                                {fee.notes}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{fee.audience}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={fee.type === 'fixed' ? 'secondary' : 'default'}>
                              {fee.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{formatPrice(fee)}</TableCell>
                          <TableCell className="text-muted-foreground">{fee.category}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(fee)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Fee</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{fee.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(fee.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </AdminLayout>
  );
}
