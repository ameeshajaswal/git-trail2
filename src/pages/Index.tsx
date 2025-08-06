import { useState } from 'react';
import { Coffee, Star, MapPin, Phone, Clock, Award, Heart, Users, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import heroImage from '@/assets/hero-coffee.jpg';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addItem, getItemCount } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const menuItems = [
    {
      id: 1,
      name: 'Artisan Espresso',
      description: 'Rich, bold espresso made from our signature blend',
      price: '$3.50',
      category: 'espresso',
      image: '☕'
    },
    {
      id: 2,
      name: 'Vanilla Latte',
      description: 'Smooth espresso with steamed milk and vanilla syrup',
      price: '$4.75',
      category: 'latte',
      image: '🥛'
    },
    {
      id: 3,
      name: 'Caramel Macchiato',
      description: 'Espresso with steamed milk, vanilla and caramel drizzle',
      price: '$5.25',
      category: 'specialty',
      image: '🍮'
    },
    {
      id: 4,
      name: 'Cold Brew',
      description: 'Smooth, refreshing cold-brewed coffee',
      price: '$4.25',
      category: 'cold',
      image: '🧊'
    },
    {
      id: 5,
      name: 'Croissant',
      description: 'Fresh-baked buttery croissant',
      price: '$3.25',
      category: 'pastry',
      image: '🥐'
    },
    {
      id: 6,
      name: 'Blueberry Muffin',
      description: 'House-made muffin with fresh blueberries',
      price: '$2.95',
      category: 'pastry',
      image: '🧁'
    }
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'espresso', name: 'Espresso' },
    { id: 'latte', name: 'Lattes' },
    { id: 'specialty', name: 'Specialty' },
    { id: 'cold', name: 'Cold Drinks' },
    { id: 'pastry', name: 'Pastries' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        
        <div className="relative z-10 text-center text-cream max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Artisan Coffee
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed">
            Discover exceptional coffee crafted with passion and served with love
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-golden hover:bg-golden-light text-coffee-dark font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-golden"
              onClick={() => window.location.href = '/menu'}
            >
              Explore Menu
            </Button>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="border-golden text-golden hover:bg-golden hover:text-coffee-dark font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                Visit Us
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-golden text-golden hover:bg-golden hover:text-coffee-dark font-semibold px-4 py-4 rounded-full transition-all duration-300 flex items-center gap-2"
                onClick={() => window.location.href = '/cart'}
              >
                <ShoppingCart className="w-5 h-5" />
                Cart ({getItemCount()})
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-golden rounded-full mb-6">
                <Award className="w-8 h-8 text-coffee-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-coffee-dark">Premium Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                We source only the finest beans from sustainable farms worldwide
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-golden rounded-full mb-6">
                <Heart className="w-8 h-8 text-coffee-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-coffee-dark">Made with Love</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every cup is crafted by skilled baristas who care about perfection
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-golden rounded-full mb-6">
                <Users className="w-8 h-8 text-coffee-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-coffee-dark">Community</h3>
              <p className="text-muted-foreground leading-relaxed">
                A warm, welcoming space where friends gather and connections are made
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-coffee-dark">
              Our Menu
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From signature espresso drinks to fresh pastries, discover flavors that will delight your senses
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-coffee-medium text-cream shadow-warm' 
                    : 'border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-card transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl mb-2">{item.image}</div>
                    <span className="text-2xl font-bold text-golden">{item.price}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-coffee-dark">{item.name}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full border-golden text-golden hover:bg-golden hover:text-coffee-dark transition-all duration-300"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-coffee-dark">
                Our Story
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Founded in 2010, our coffee shop began as a small dream to bring exceptional coffee 
                to our community. We believe that great coffee is more than just a drink—it's a moment 
                of connection, a pause in the day, and a celebration of craftsmanship.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Today, we continue to roast our beans in-house, support sustainable farming practices, 
                and create a warm, welcoming space where everyone feels at home.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-6 h-6 text-golden fill-golden" />
                  ))}
                </div>
                <span className="text-coffee-dark font-semibold">500+ Happy Customers</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-card p-6 rounded-lg shadow-card">
                  <Coffee className="w-8 h-8 text-golden mb-4" />
                  <h4 className="font-semibold text-coffee-dark mb-2">Fresh Roasted</h4>
                  <p className="text-sm text-muted-foreground">Daily roasted beans for maximum flavor</p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-card">
                  <Award className="w-8 h-8 text-golden mb-4" />
                  <h4 className="font-semibold text-coffee-dark mb-2">Award Winning</h4>
                  <p className="text-sm text-muted-foreground">Recognized for excellence in coffee</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-card p-6 rounded-lg shadow-card">
                  <Heart className="w-8 h-8 text-golden mb-4" />
                  <h4 className="font-semibold text-coffee-dark mb-2">Sustainable</h4>
                  <p className="text-sm text-muted-foreground">Ethically sourced and eco-friendly</p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-card">
                  <Users className="w-8 h-8 text-golden mb-4" />
                  <h4 className="font-semibold text-coffee-dark mb-2">Community</h4>
                  <p className="text-sm text-muted-foreground">Supporting local farmers and community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-coffee-dark">
              Visit Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Come experience the perfect cup in our cozy, welcoming atmosphere
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-card transition-all duration-300">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-golden rounded-full mb-6">
                  <MapPin className="w-8 h-8 text-coffee-dark" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-coffee-dark">Location</h3>
                <p className="text-muted-foreground">
                  123 Coffee Street<br />
                  Downtown District<br />
                  Coffee City, CC 12345
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-card transition-all duration-300">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-golden rounded-full mb-6">
                  <Clock className="w-8 h-8 text-coffee-dark" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-coffee-dark">Hours</h3>
                <p className="text-muted-foreground">
                  Mon - Fri: 6:00 AM - 8:00 PM<br />
                  Sat - Sun: 7:00 AM - 9:00 PM<br />
                  Holidays: 8:00 AM - 6:00 PM
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-card transition-all duration-300">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-golden rounded-full mb-6">
                  <Phone className="w-8 h-8 text-coffee-dark" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-coffee-dark">Contact</h3>
                <p className="text-muted-foreground">
                  Phone: (555) 123-COFFEE<br />
                  Email: hello@artisancoffee.com<br />
                  Follow us @artisancoffee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coffee-dark text-cream py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coffee className="w-8 h-8 text-golden" />
              <span className="text-2xl font-bold">Artisan Coffee</span>
            </div>
            <p className="text-cream/80 mb-6">
              Crafting exceptional coffee experiences since 2010
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <a href="/menu" className="hover:text-golden transition-colors">Menu</a>
              <a href="/cart" className="hover:text-golden transition-colors">Cart</a>
              <a href="#about" className="hover:text-golden transition-colors">About</a>
              <a href="#contact" className="hover:text-golden transition-colors">Contact</a>
              <a href="#careers" className="hover:text-golden transition-colors">Careers</a>
            </div>
            <div className="mt-8 pt-8 border-t border-coffee-medium">
              <p className="text-cream/60 text-sm">
                © 2024 Artisan Coffee. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
