import { useState } from 'react';
import { Coffee, ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { state, removeItem, updateQuantity, applyCoupon, removeCoupon } = useCart();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }

    const success = applyCoupon(couponCode);
    if (success) {
      toast({
        title: "Coupon Applied!",
        description: `Coupon ${couponCode.toUpperCase()} has been applied to your order.`,
      });
      setCouponCode('');
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async () => {
  try {
    const response = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerId: 1, // ⚠️ 確保 customerId 1 存在於資料庫
        items: state.items.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      })
    });

    const data = await response.json();

    if (response.ok) {
      toast({
        title: "Order Successful!",
        description: `Your order #${data.orderId} has been placed.`,
      });
    } else {
      toast({
        title: "Order Failed",
        description: data.error || "Unknown error occurred.",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Network Error",
      description: "Unable to reach the server.",
      variant: "destructive",
    });
  }
};

  const subtotal = state.items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  const discountAmount = subtotal * state.discount / 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-coffee-dark text-cream py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/menu" className="flex items-center gap-2 hover:text-golden transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>

            <div className="flex items-center gap-2">
              <Coffee className="w-8 h-8 text-golden" />
              <span className="text-2xl font-bold">Artisan Coffee</span>
            </div>

            <div className="flex items-center gap-2 text-golden">
              <ShoppingCart className="w-5 h-5" />
              <span>{state.items.length} items</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-coffee-dark">Your Cart</h1>
          <p className="text-xl text-muted-foreground">Review your order and apply any coupons before checkout</p>
        </div>

        {state.items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4 text-coffee-dark">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some delicious items from our menu!</p>
            <Link to="/menu">
              <Button className="bg-golden hover:bg-golden-light text-coffee-dark">Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-coffee-dark">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-coffee-dark">{item.name}</h3>
                        <p className="text-golden font-semibold">{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 p-0">
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 p-0">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-coffee-dark flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Apply Coupon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-green-800">{state.appliedCoupon}</p>
                        <p className="text-sm text-green-600">{state.discount}% discount applied</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-green-800 hover:text-green-900">
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleApplyCoupon} variant="outline" className="border-golden text-golden hover:bg-golden hover:text-coffee-dark">
                        Apply
                      </Button>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold mb-2">Available Coupons:</p>
                    <ul className="space-y-1">
                      <li>• WELCOME10 - 10% off your order</li>
                      <li>• COFFEE20 - 20% off your order</li>
                      <li>• STUDENT15 - 15% student discount</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-coffee-dark">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  {state.appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({state.discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span>Tax (8.5%)</span><span>${(state.total * 0.085).toFixed(2)}</span></div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-coffee-dark">
                      <span>Total</span>
                      <span>${(state.total + state.total * 0.085).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-golden hover:bg-golden-light text-coffee-dark font-semibold py-3"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                  <Link to="/menu" className="block">
                    <Button variant="outline" className="w-full">Continue Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-coffee-dark text-cream py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coffee className="w-8 h-8 text-golden" />
              <span className="text-2xl font-bold">Artisan Coffee</span>
            </div>
            <p className="text-cream/80 mb-6">Crafting exceptional coffee experiences since 2010</p>
            <div className="flex justify-center gap-8 text-sm">
              <Link to="/" className="hover:text-golden transition-colors">Home</Link>
              <Link to="/menu" className="hover:text-golden transition-colors">Menu</Link>
              <a href="#about" className="hover:text-golden transition-colors">About</a>
              <a href="#contact" className="hover:text-golden transition-colors">Contact</a>
            </div>
            <div className="mt-8 pt-8 border-t border-coffee-medium">
              <p className="text-cream/60 text-sm">© 2024 Artisan Coffee. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;