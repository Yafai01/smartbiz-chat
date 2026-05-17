import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../lib/supabase';
import { generateAIReply } from '../../lib/gemini';
import { 
  ShoppingBag, 
  Plus, 
  Sparkles, 
  Search, 
  Trash2, 
  Send, 
  Package, 
  DollarSign, 
  Tag as TagIcon,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const CatalogView: React.FC = () => {
  const { products, addProduct, deleteProduct, setActiveContactId, setCurrentTab, contacts } = useApp();

  // Local States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number | ''>('');
  const [newProdStock, setNewProdStock] = useState<number | ''>(100);
  const [newProdCat, setNewProdCat] = useState('Accessories');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // Categories list
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Handle AI Description Generation
  const handleGenerateAIDesc = async () => {
    if (!newProdName.trim()) {
      toast.error('Please enter a product name first');
      return;
    }

    setIsGeneratingDesc(true);
    try {
      const desc = await generateAIReply({
        customerMessage: `Generate a premium, high-converting product description for our WhatsApp catalog item: "${newProdName}". Category: ${newProdCat}. Keep it 2 sentences, engaging, and highlight its key value props.`,
        tone: 'persuasive'
      });
      setNewProdDesc(desc);
      toast.success('AI description generated!');
    } catch (err) {
      toast.error('Failed to generate description');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  // Handle Form Submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) {
      toast.error('Please complete required fields');
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
      'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400'
    ];

    addProduct({
      name: newProdName,
      price: Number(newProdPrice),
      stock_count: Number(newProdStock) || 0,
      category: newProdCat,
      sku: newProdSku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      description: newProdDesc.trim() || 'Premium business quality product.',
      image_url: newProdImg.trim() || defaultImages[Math.floor(Math.random() * defaultImages.length)],
      currency: 'USD'
    });

    // Reset Form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock(100);
    setNewProdCat('Accessories');
    setNewProdSku('');
    setNewProdDesc('');
    setNewProdImg('');
    setIsAddModalOpen(false);
  };

  // Quick Send to Chat
  const handleQuickSend = (product: Product) => {
    // Pick active contact or first contact
    const targetContact = contacts[0];
    if (!targetContact) {
      toast.error('No leads available to send product');
      return;
    }

    setActiveContactId(targetContact.id);
    setCurrentTab('chat');
    toast(`Opening chat with ${targetContact.name} to send ${product.name}`, { icon: '📦' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-wa-dark-bg p-6 overflow-hidden select-none">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-wa-text flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-wa-green" /> Product Catalog System
          </h2>
          <p className="text-xs text-wa-subtext mt-1">Manage inventory, SKU pricing, and sync items instantly with WhatsApp Cloud API chats.</p>
        </div>

        {/* Add Product Button */}
        <Button 
          variant="primary" 
          size="md" 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shadow-lg shadow-wa-green/20"
        >
          <Plus className="w-5 h-5 text-black" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Search & Category Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-wa-subtext absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search catalog by name, SKU, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-wa-secondary text-wa-text placeholder-wa-subtext text-sm rounded-xl pl-9 pr-4 py-2.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-wa-green text-black font-bold shadow-sm' 
                  : 'bg-wa-secondary text-wa-subtext hover:text-wa-text border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pr-1 pb-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-wa-subtext text-sm glass-card max-w-md mx-auto p-8 rounded-2xl border border-white/5">
            <Package className="w-16 h-16 text-wa-green mx-auto mb-4 opacity-80" />
            <h4 className="font-semibold text-wa-text mb-1">No Products Found</h4>
            <p className="text-xs">Try adjusting your search query or add a new product to expand your WhatsApp catalog inventory.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="bg-wa-secondary border border-white/5 hover:border-wa-green/30 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-wa-dark-bg overflow-hidden border-b border-white/5">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <Badge variant={product.stock_count > 20 ? 'success' : product.stock_count > 0 ? 'warning' : 'danger'} size="sm">
                    {product.stock_count > 0 ? `${product.stock_count} in stock` : 'Out of Stock'}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="accent" size="sm" className="backdrop-blur-md bg-opacity-80">
                    {product.category}
                  </Badge>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-wa-text text-base line-clamp-1 group-hover:text-wa-green transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-extrabold text-wa-green text-lg flex-shrink-0">
                      ${product.price}
                    </span>
                  </div>

                  <p className="text-xs text-wa-subtext line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* SKU & Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-wa-subtext font-mono">
                    <TagIcon className="w-3.5 h-3.5 text-wa-subtext" />
                    <span>SKU: {product.sku}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => deleteProduct(product.id)}
                      className="p-2.5 hover:bg-red-500/30"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleQuickSend(product)}
                      className="px-3.5 py-2 flex items-center gap-1.5 shadow-md shadow-wa-green/10"
                    >
                      <Send className="w-3.5 h-3.5 text-black" />
                      <span>Send to Chat</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add Product to WhatsApp Catalog"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wa-text">Product Name *</label>
              <input 
                type="text" 
                required
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="e.g. Wireless Pro Earbuds Ultra"
                className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-3.5 py-2.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner"
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wa-text">Price ($ USD) *</label>
              <input 
                type="number" 
                step="0.01"
                required
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 149.99"
                className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-3.5 py-2.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner"
              />
            </div>

            {/* Stock Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wa-text">Initial Stock Count</label>
              <input 
                type="number" 
                value={newProdStock}
                onChange={(e) => setNewProdStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 100"
                className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-3.5 py-2.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wa-text">Category</label>
              <select 
                value={newProdCat}
                onChange={(e) => setNewProdCat(e.target.value)}
                className="w-full bg-wa-dark-bg text-wa-text text-xs rounded-xl px-3.5 py-2.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors cursor-pointer"
              >
                <option value="Accessories">Accessories</option>
                <option value="Audio">Audio</option>
                <option value="Smart Home">Smart Home</option>
                <option value="Displays">Displays</option>
                <option value="Software">Software</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* SKU */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-wa-text">SKU Code (Optional)</label>
              <input 
                type="text" 
                value={newProdSku}
                onChange={(e) => setNewProdSku(e.target.value)}
                placeholder="e.g. EAR-PRO-001 (Auto-generated if left blank)"
                className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-3.5 py-2.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner font-mono"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-wa-text flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-wa-green" /> Image URL (Optional)
              </label>
              <input 
                type="url" 
                value={newProdImg}
                onChange={(e) => setNewProdImg(e.target.value)}
                placeholder="https://images.unsplash.com/... (Default premium image used if blank)"
                className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-3.5 py-2.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner"
              />
            </div>

            {/* Description & AI Generator */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-wa-text">Product Description</label>
                <button
                  type="button"
                  onClick={handleGenerateAIDesc}
                  disabled={isGeneratingDesc}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingDesc ? 'animate-spin' : ''}`} />
                  {isGeneratingDesc ? 'Generating AI...' : 'AI Generate Description'}
                </button>
              </div>
              <textarea 
                rows={3}
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                placeholder="Enter product description or click 'AI Generate Description' above..."
                className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl p-3.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner leading-relaxed resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <Button variant="ghost" size="md" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="shadow-lg shadow-wa-green/20">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
