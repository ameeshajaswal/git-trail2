import { useState, useEffect } from 'react';
import { Coffee, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const { addItem, getItemCount } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetch('/products') // Vite dev server 會 proxy 去 http://localhost:3000
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          id: item[0],
          name: item[1],
          image: item[2]?.includes('.jpg') ? '☕' : '🍩',
          price: `$${item[3].toFixed(2)}`,
          category: 'all', // 暫時全部歸類為 all
          description: 'Delicious handmade item.'
        }));
        setMenuItems(formatted);
      })
      .catch((err) => {
        console.error("❌ Failed to load products:", err);
      });
  }, []);

  const handleAddToCart = (item) => {
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

  const categories = [
    { id: 'all', name: 'All Items' },
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
      {/* Header */}
      <header className="bg-coffee-dark text-cream py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:text-golden transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Coffee className="w-8 h-8 text-golden" />
              <span className="text-2xl font-bold">Artisan Coffee</span>
            </div>
            <Link to="/cart" className="flex items-center gap-2 hover:text-golden transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart ({getItemCount()})</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Menu Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-coffee-dark">Our Menu</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our complete selection of artisan coffees, specialty drinks, and fresh pastries.
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-card transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl mb-2">{item.image}</div>
                    <span className="text-2xl font-bold text-golden">{item.price}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-coffee-dark">{item.name}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{item.description}</p>
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

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Showing {filteredItems.length} of {menuItems.length} items
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coffee-dark text-cream py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="w-8 h-8 text-golden" />
            <span className="text-2xl font-bold">Artisan Coffee</span>
          </div>
          <p className="text-cream/80 mb-6">Crafting exceptional coffee experiences since 2010</p>
          <div className="flex justify-center gap-8 text-sm">
            <Link to="/" className="hover:text-golden transition-colors">Home</Link>
            <Link to="/cart" className="hover:text-golden transition-colors">Cart</Link>
            <a href="#about" className="hover:text-golden transition-colors">About</a>
            <a href="#contact" className="hover:text-golden transition-colors">Contact</a>
            <a href="#careers" className="hover:text-golden transition-colors">Careers</a>
          </div>
          <div className="mt-8 pt-8 border-t border-coffee-medium">
            <p className="text-cream/60 text-sm">© 2024 Artisan Coffee. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Menu;