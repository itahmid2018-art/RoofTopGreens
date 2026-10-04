import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Heart,
  Share2,
  X,
  MapPin,
  Calendar,
  User,
  Filter,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Plus,
  MessageSquare,
  AlertCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { IMAGES } from '../assets/images';
import { useTheme } from '../context/ThemeContext';

export interface GalleryPost {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  city: string;
  state: string;
  locationName: string;
  contributorName: string;
  category: 'blooms' | 'sponge' | 'apiary' | 'food';
  timestamp: string;
  likes: number;
  isUserSubmission?: boolean;
}

const STORAGE_KEY = 'south_india_rooftop_gallery_submissions_v1';

// Seed community photos across South India
const INITIAL_COMMUNITY_POSTS: GalleryPost[] = [
  {
    id: 'seed-blr-krmarket',
    imageUrl: IMAGES.monsoonSpongeRoof,
    title: 'KR Market Wholesale Roof Sponge',
    description: '1,450m² coir-pith beds absorbing intense pre-monsoon cloudbursts right above Kalasipalya wholesale flower market. Notice the deep lemongrass buffer.',
    city: 'Bengaluru',
    state: 'Karnataka',
    locationName: 'KR Market Complex, Central Bengaluru',
    contributorName: 'Venkatesh K. (Civic Warden)',
    category: 'sponge',
    timestamp: '2 hours ago',
    likes: 42,
  },
  {
    id: 'seed-chn-besant',
    imageUrl: IMAGES.southIndiaRooftop,
    title: 'Besant Nagar Coastal Bio-Haven',
    description: 'Salt-spray resilient butterfly pea (Sankhupushpam) and periwinkle thriving with 4 stingless bee colonies just 300m from the Coromandel coast.',
    city: 'Chennai',
    state: 'Tamil Nadu',
    locationName: '4th Main Road, Besant Nagar',
    contributorName: 'Dr. Meenakshi Sundaram',
    category: 'blooms',
    timestamp: 'Yesterday',
    likes: 67,
  },
  {
    id: 'seed-koc-fort',
    imageUrl: IMAGES.cheruthenHoneyHarvest,
    title: 'Fort Kochi Heritage Cheruthen Apiary',
    description: 'First annual harvest of pure medicinal Cheruthen honey using sterile syringe suction. The colony forage across local cinnamon, mango, and coconut palms.',
    city: 'Kochi',
    state: 'Kerala',
    locationName: 'Princess Street Heritage Quarter',
    contributorName: 'Father George & Eco-Team',
    category: 'apiary',
    timestamp: '3 days ago',
    likes: 89,
  },
  {
    id: 'seed-hyd-hitec',
    imageUrl: IMAGES.tropicalFloraCanopy,
    title: 'HITEC City Tech Park Terrace',
    description: 'Our top floor slab temperature dropped by 4.8°C after rolling out coir drain cells and drought-hardy native flowering shrubs.',
    city: 'Hyderabad',
    state: 'Telangana',
    locationName: 'Madhapur Knowledge City',
    contributorName: 'Shruti V. (Sustainability Lead)',
    category: 'sponge',
    timestamp: '4 days ago',
    likes: 53,
  },
  {
    id: 'seed-chn-students',
    imageUrl: IMAGES.southStudentsRooftop,
    title: 'Kotturpuram Student Lab Terrace',
    description: '8th-standard students examining stingless bee propolis entrance tubes and recording hourly flower visitations for their science project.',
    city: 'Chennai',
    state: 'Tamil Nadu',
    locationName: 'Model Higher Secondary School',
    contributorName: 'Ananya S. (Biology Faculty)',
    category: 'apiary',
    timestamp: '5 days ago',
    likes: 112,
  },
];

export const RooftopGalleryPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { isDark } = useTheme();

  const [posts, setPosts] = useState<GalleryPost[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return [...parsed, ...INITIAL_COMMUNITY_POSTS];
        }
      } catch (e) {
        console.warn('Failed to parse stored gallery submissions:', e);
      }
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  // Filter & Search states
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPostForModal, setSelectedPostForModal] = useState<GalleryPost | null>(null);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState<string>('');
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [photoCity, setPhotoCity] = useState<string>('Bengaluru');
  const [photoLocation, setPhotoLocation] = useState<string>('');
  const [photoContributor, setPhotoContributor] = useState<string>('');
  const [photoCategory, setPhotoCategory] = useState<'blooms' | 'sponge' | 'apiary' | 'food'>('blooms');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and compress captured photos using HTML5 Canvas to keep storage lightweight (<300KB)
  const processImageFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setPreviewImage(compressedDataUrl);
          setIsUploadModalOpen(true);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleCaptureClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewImage) {
      setUploadError('Please take or upload a photo first.');
      return;
    }
    if (!photoTitle.trim()) {
      setUploadError('Please provide a short title for your rooftop capture.');
      return;
    }

    setIsSubmitting(true);

    const newPost: GalleryPost = {
      id: `user-${Date.now()}`,
      imageUrl: previewImage,
      title: photoTitle.trim(),
      description: photoDescription.trim() || 'Community rooftop living ecosystem capture.',
      city: photoCity,
      state:
        photoCity === 'Bengaluru'
          ? 'Karnataka'
          : photoCity === 'Chennai'
          ? 'Tamil Nadu'
          : photoCity === 'Kochi'
          ? 'Kerala'
          : 'Andhra / Telangana',
      locationName: photoLocation.trim() || `${photoCity} Terrace`,
      contributorName: photoContributor.trim() || 'Terrace Resident',
      category: photoCategory,
      timestamp: 'Just now',
      likes: 1,
      isUserSubmission: true,
    };

    try {
      const currentStored = localStorage.getItem(STORAGE_KEY);
      const existingUserPosts: GalleryPost[] = currentStored ? JSON.parse(currentStored) : [];
      const updatedUserPosts = [newPost, ...existingUserPosts];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUserPosts));

      setPosts((prev) => [newPost, ...prev]);

      // Reset form
      setPreviewImage(null);
      setPhotoTitle('');
      setPhotoDescription('');
      setPhotoLocation('');
      setPhotoContributor('');
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
      setUploadError('Could not save image to local storage. File might be too large.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPostIds((prev) => {
      const next = new Set(prev);
      const hasLiked = next.has(id);
      if (hasLiked) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const hasLiked = likedPostIds.has(id);
          return { ...p, likes: hasLiked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      })
    );
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCity =
        selectedCityFilter === 'all' || post.city.toLowerCase() === selectedCityFilter.toLowerCase();
      const matchesCategory =
        selectedCategoryFilter === 'all' || post.category === selectedCategoryFilter;
      return matchesCity && matchesCategory;
    });
  }, [posts, selectedCityFilter, selectedCategoryFilter]);

  const getCategoryLabel = (category: GalleryPost['category']) => {
    switch (category) {
      case 'blooms':
        return { label: 'Native Blooms & Pollinators', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' };
      case 'sponge':
        return { label: 'Sponge Terrace & Rain Catchment', color: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' };
      case 'apiary':
        return { label: 'Stingless Bee Hive Box', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' };
      case 'food':
        return { label: 'Organic Terrace Harvest', color: 'bg-purple-500/15 text-purple-700 dark:text-purple-300' };
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400">
      {/* Hidden File Inputs for Mobile Camera Capture and Gallery Upload */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 dark:bg-[#131D12]/90 backdrop-blur-md border-b border-[#243324]/10 dark:border-white/10 px-4 sm:px-8 lg:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1F2B1D] dark:text-[#F4EFE6] hover:text-[#059669] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>← Back to 2026 Annual Report</span>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Quick Camera Action Pill */}
            <button
              type="button"
              onClick={handleCaptureClick}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#10B981] hover:bg-[#059669] text-white flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Terrace</span>
            </button>
          </div>
        </div>
      </header>

      {/* Gallery Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 lg:px-12 border-b border-[#243324]/10 dark:border-white/10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
              Community Living Showcase · Sub-Directory /gallery
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1F2B1D] dark:text-[#F4EFE6] leading-[1.05] tracking-tight">
            Real photos from South India’s rooftop havens.
          </h1>

          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed max-w-4xl">
            A crowdsourced visual ledger of terrace bio-sponges, native pollinator canopies, and gentle Cheruthen apiaries photographed by residents and urban farmers across Karnataka, Tamil Nadu, Kerala, and Andhra Pradesh.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCaptureClick}
              className="px-5 py-3 rounded-2xl bg-[#1F2B1D] dark:bg-[#10B981] text-white dark:text-[#0C170B] font-medium text-xs sm:text-sm flex items-center gap-2 shadow-md hover:bg-[#2F452D] cursor-pointer transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo with Mobile Camera</span>
            </button>

            <button
              type="button"
              onClick={handleUploadClick}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-[#1F2B1D] border border-[#243324]/15 dark:border-white/15 text-[#1F2B1D] dark:text-[#F4EFE6] font-medium text-xs sm:text-sm flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload from Device</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Gallery Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1C2A1B] border border-[#243324]/10 dark:border-white/10 shadow-xs">
          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['all', 'Bengaluru', 'Chennai', 'Kochi', 'Hyderabad'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCityFilter(city)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
                  selectedCityFilter.toLowerCase() === city.toLowerCase()
                    ? 'bg-[#1F2B1D] dark:bg-[#2F452D] text-white shadow-xs'
                    : 'text-[#4A5D44] dark:text-[#CBD7C7] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {city === 'all' ? 'All Cities' : city}
              </button>
            ))}
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#657351] dark:text-[#A3B59E] hidden md:inline">Category:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              aria-label="Filter by rooftop category"
              className="p-2 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-xs text-[#1F2B1D] dark:text-[#F4EFE6] font-medium focus:outline-none"
            >
              <option value="all">All Ecosystem Types</option>
              <option value="blooms">Native Blooms & Flora</option>
              <option value="sponge">Sponge Terrace & Rain Catchment</option>
              <option value="apiary">Stingless Bee Hive Box</option>
              <option value="food">Organic Harvest</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const isLiked = likedPostIds.has(post.id);
            const badge = getCategoryLabel(post.category);

            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedPostForModal(post)}
                className="group rounded-3xl bg-white dark:bg-[#1C2A1B] border border-[#243324]/10 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md ${badge.color}`}>
                      {post.city}
                    </span>

                    {post.isUserSubmission && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#10B981] text-white shadow-xs">
                        Community Capture
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-1 text-[11px] truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-[#85E7B7]" />
                      <span className="truncate">{post.locationName}</span>
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      {post.likes}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#657351] dark:text-[#A3B59E]">
                      <span>{post.timestamp}</span>
                      <span>By {post.contributorName}</span>
                    </div>

                    <h3 className="font-display font-medium text-lg text-[#1F2B1D] dark:text-[#F4EFE6] leading-snug group-hover:text-[#059669] dark:group-hover:text-[#34D399] transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#4A5D44] dark:text-[#CBD7C7] font-light line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {/* Footer Row */}
                  <div className="pt-3 border-t border-[#243324]/10 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-[#657351] dark:text-[#A3B59E]">
                      {badge.label}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(post.id, e)}
                      className={`flex items-center gap-1.5 p-1.5 px-2.5 rounded-full transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : 'bg-[#F5F2EB] dark:bg-[#233522] text-[#4A5D44] dark:text-[#CBD7C7] hover:bg-rose-500/10 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="font-semibold text-[11px]">{post.likes}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1C2A1B] border border-[#243324]/10 dark:border-white/10 space-y-3">
            <Camera className="w-10 h-10 text-[#657351] mx-auto opacity-50" />
            <h3 className="font-display text-xl text-[#1F2B1D] dark:text-[#F4EFE6]">
              No rooftop photos found for this filter
            </h3>
            <p className="text-xs text-[#4A5D44] dark:text-[#CBD7C7]">
              Be the first to photograph and publish a terrace bio-haven in this category!
            </p>
            <button
              type="button"
              onClick={handleCaptureClick}
              className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold mt-2 cursor-pointer"
            >
              Take First Photo
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* PHOTO CAPTURE & DESCRIPTION MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1C2A1B] border border-[#243324]/15 dark:border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#243324]/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#10B981]" />
                  <h3 className="font-display text-xl text-[#1F2B1D] dark:text-[#F4EFE6] font-medium">
                    Publish Rooftop Capture
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg text-[#657351] hover:text-[#1F2B1D] dark:text-white/60 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Preview Thumbnail */}
              {previewImage && (
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-black border border-black/10">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleCaptureClick}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Form Inputs */}
              <form onSubmit={handlePublishPost} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label htmlFor="photo-title-input" className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6] uppercase text-[10px] tracking-wider block">
                    Capture Title *
                  </label>
                  <input
                    id="photo-title-input"
                    type="text"
                    required
                    placeholder="e.g., Indiranagar 4th Cross Rooftop Sanctuary"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] font-medium focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="photo-description-input" className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6] uppercase text-[10px] tracking-wider block">
                    Small Description / Story *
                  </label>
                  <textarea
                    id="photo-description-input"
                    required
                    rows={3}
                    placeholder="Describe your coir-pith beds, native pollinator plants (Tulasi, Sankhupushpam), stingless bee visits, or rain retention..."
                    value={photoDescription}
                    onChange={(e) => setPhotoDescription(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="photo-city-select" className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6] uppercase text-[10px] tracking-wider block">
                      City
                    </label>
                    <select
                      id="photo-city-select"
                      value={photoCity}
                      onChange={(e) => setPhotoCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] font-medium"
                    >
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Kochi">Kochi</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="photo-category-select" className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6] uppercase text-[10px] tracking-wider block">
                      Category
                    </label>
                    <select
                      id="photo-category-select"
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] font-medium"
                    >
                      <option value="blooms">Native Blooms & Pollinators</option>
                      <option value="sponge">Sponge Terrace & Rain Catchment</option>
                      <option value="apiary">Stingless Bee Hive Box</option>
                      <option value="food">Organic Harvest</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="photo-location-input" className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6] uppercase text-[10px] tracking-wider block">
                      Neighborhood / Street
                    </label>
                    <input
                      id="photo-location-input"
                      type="text"
                      placeholder="e.g. Mylapore 2nd Street"
                      value={photoLocation}
                      onChange={(e) => setPhotoLocation(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-[#1F2B1D] dark:text-[#F4EFE6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="photo-contributor-input" className="font-semibold text-[#1F2B1D] dark:text-[#F4EFE6] uppercase text-[10px] tracking-wider block">
                      Your Name / Handle
                    </label>
                    <input
                      id="photo-contributor-input"
                      type="text"
                      placeholder="e.g. Ramesh P."
                      value={photoContributor}
                      onChange={(e) => setPhotoContributor(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#152214] border border-[#243324]/10 dark:border-white/10 text-[#1F2B1D] dark:text-[#F4EFE6]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#243324]/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#243324]/15 dark:border-white/15 text-[#1F2B1D] dark:text-[#F4EFE6] hover:bg-black/5 cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isSubmitting ? 'Publishing...' : 'Publish to Gallery'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* HIGH-RES LIGHTBOX MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedPostForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPostForModal(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#1A2619] border border-white/15 overflow-hidden flex flex-col md:flex-row shadow-2xl cursor-default"
            >
              {/* Left/Top: Image Canvas */}
              <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px]">
                <img
                  src={selectedPostForModal.imageUrl}
                  alt={selectedPostForModal.title}
                  className="w-full h-full max-h-[70vh] object-contain"
                />
              </div>

              {/* Right/Bottom: Metadata Panel */}
              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-white space-y-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#10B981]/20 text-[#85E7B7] border border-[#10B981]/30">
                      {selectedPostForModal.city}, {selectedPostForModal.state}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPostForModal(null)}
                      className="p-1 rounded-lg text-white/60 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="font-display text-2xl font-normal leading-tight">
                    {selectedPostForModal.title}
                  </h3>

                  <div className="space-y-1 text-xs text-white/70">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{selectedPostForModal.locationName}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Submitted by {selectedPostForModal.contributorName}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{selectedPostForModal.timestamp}</span>
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed pt-2 border-t border-white/10">
                    {selectedPostForModal.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleToggleLike(selectedPostForModal.id, e)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-400 transition-colors cursor-pointer text-xs"
                  >
                    <Heart
                      className={`w-4 h-4 ${likedPostIds.has(selectedPostForModal.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span>{selectedPostForModal.likes} Community Likes</span>
                  </button>

                  <span className="text-[11px] text-white/50">
                    ID: {selectedPostForModal.id.slice(0, 12)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
