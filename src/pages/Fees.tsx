import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { feesApi } from '@/lib/api';
import { Audience, FeeItem } from '@/types';

function formatPrice(min: number, max?: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  if (max && max !== min) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  return formatter.format(min);
}

export default function Fees() {
  const [audience, setAudience] = useState<Audience>('Individuals');
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      setIsLoading(true);
      try {
        const data = await feesApi.getAll({ audience });
        setFees(data);
      } catch (error) {
        console.error('Failed to fetch fees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFees();
  }, [audience]);

  const categories = [...new Set(fees.map((fee) => fee.category))];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Fees</h1>
            <p className="text-lg text-muted-foreground">
              Transparent, competitive pricing for all our IP services. No hidden costs—you'll always know what you're paying for.
            </p>
          </div>
        </Container>
      </section>

      {/* Fee Tables */}
      <section className="py-16 md:py-24">
        <Container>
          <Tabs value={audience} onValueChange={(v) => setAudience(v as Audience)} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="Individuals">Individuals</TabsTrigger>
              <TabsTrigger value="Businesses">Businesses</TabsTrigger>
            </TabsList>

            <TabsContent value={audience}>
              <div className="space-y-12">
                {categories.map((category) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold mb-6">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fees
                        .filter((fee) => fee.category === category)
                        .map((fee) => (
                          <Card key={fee.id} className="border-border">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg">{fee.name}</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                  {fee.type === 'fixed' ? 'Fixed' : 'Variable'}
                                </span>
                              </div>
                              <p className="text-2xl font-bold text-accent mb-2">
                                {formatPrice(fee.priceMin, fee.priceMax)}
                              </p>
                              {fee.notes && (
                                <p className="text-sm text-muted-foreground">{fee.notes}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-serif font-semibold text-lg mb-2">Note on Pricing</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Government fees are included unless otherwise specified</li>
              <li>• Variable pricing depends on complexity and scope of work</li>
              <li>• Custom quotes available for complex or high-volume requirements</li>
              <li>• All prices are in Indian Rupees (INR) and exclusive of applicable taxes</li>
            </ul>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Quote?</h2>
            <p className="text-primary-foreground/80 mb-8">
              For complex projects or volume requirements, contact us for a personalized quote.
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">
                Request a Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
