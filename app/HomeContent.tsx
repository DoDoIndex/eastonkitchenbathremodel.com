'use client';

import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import { Thumbnails } from 'yet-another-react-lightbox/plugins';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import Image from 'next/image';
import 'react-before-after-slider-component/dist/build.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export function HomeContent() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: 'Kitchen Remodeling',
      description: 'Complete kitchen renovations including cabinets, countertops, flooring, and appliances.',
      icon: '🍳',
      images: Array.from({ length: 10 }, (_, i) => `/Kitchen/${i + 1}.jpg`)
    },
    {
      title: 'Bathroom Remodeling',
      description: 'Full bathroom renovations with modern fixtures, tile work, and plumbing upgrades.',
      icon: '🚿',
      images: Array.from({ length: 16 }, (_, i) => `/Bathroom/${i + 1}.jpg`)
    }
  ];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [beforeAfterIndex, setBeforeAfterIndex] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    budget: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Scroll detection for tooltip
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowTooltip(scrollY > 700);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hardcoded shuffled photos array
  const shuffledPhotos = [
    { src: '/Bathroom/7.jpg', type: 'Bathroom' },
    { src: '/Kitchen/3.jpg', type: 'Kitchen' },
    { src: '/Bathroom/12.jpg', type: 'Bathroom' },
    { src: '/Kitchen/8.jpg', type: 'Kitchen' },
    { src: '/Bathroom/2.jpg', type: 'Bathroom' },
    { src: '/Kitchen/1.jpg', type: 'Kitchen' },
    { src: '/Bathroom/15.jpg', type: 'Bathroom' },
    { src: '/Kitchen/6.jpg', type: 'Kitchen' },
    { src: '/Bathroom/4.jpg', type: 'Bathroom' },
    { src: '/Kitchen/9.jpg', type: 'Kitchen' },
    { src: '/Bathroom/11.jpg', type: 'Bathroom' },
    { src: '/Kitchen/2.jpg', type: 'Kitchen' },
    { src: '/Bathroom/8.jpg', type: 'Bathroom' },
    { src: '/Bathroom/16.jpg', type: 'Bathroom' },
    { src: '/Kitchen/5.jpg', type: 'Kitchen' },
    { src: '/Bathroom/1.jpg', type: 'Bathroom' },
    { src: '/Kitchen/10.jpg', type: 'Kitchen' },
    { src: '/Bathroom/9.jpg', type: 'Bathroom' },
    { src: '/Kitchen/4.jpg', type: 'Kitchen' },
    { src: '/Bathroom/6.jpg', type: 'Bathroom' },
    { src: '/Bathroom/14.jpg', type: 'Bathroom' },
    { src: '/Kitchen/7.jpg', type: 'Kitchen' },
    { src: '/Bathroom/3.jpg', type: 'Bathroom' },
    { src: '/Bathroom/13.jpg', type: 'Bathroom' },
    { src: '/Bathroom/5.jpg', type: 'Bathroom' },
    { src: '/Bathroom/10.jpg', type: 'Bathroom' }
  ];

  const beforeAfterProjects = [
    {
      before: '/BeforeAfter/1B.jpg',
      after: '/BeforeAfter/1A.jpg',
      title: 'Project 1'
    },
    {
      before: '/BeforeAfter/2B.jpg',
      after: '/BeforeAfter/2A.jpg',
      title: 'Project 2'
    },
    {
      before: '/BeforeAfter/3B.jpg',
      after: '/BeforeAfter/3A.jpg',
      title: 'Project 3'
    },
    {
      before: '/BeforeAfter/4B.jpg',
      after: '/BeforeAfter/4A.jpg',
      title: 'Project 4'
    }
  ];

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get reCAPTCHA token
    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit form with reCAPTCHA token
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...quoteForm,
          recaptchaToken
        }),
      });

      if (response.ok) {
        // Show success state
        setFormSubmitted(true);
      } else {
        toast.error('There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as (000) 000-0000
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Format phone number as user types
      const formattedPhone = formatPhoneNumber(value);
      setQuoteForm({
        ...quoteForm,
        [name]: formattedPhone
      });
    } else {
      setQuoteForm({
        ...quoteForm,
        [name]: value
      });
    }
  };

  const closeModal = () => {
    setQuoteModalOpen(false);
    // Reset form state when modal is closed
    setTimeout(() => {
      setFormSubmitted(false);
      setIsSubmitting(false);
      setQuoteForm({ name: '', email: '', phone: '', project: '' });
      recaptchaRef.current?.reset();
    }, 300); // Small delay to allow modal close animation
  };

  return (
    <main className="min-h-screen" role="main">
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-gray-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
            {/* Logo */}
            <div className="flex flex-col">
              <div className="text-md sm:text-xl lg:text-3xl font-bold text-white tracking-tight font-serif">
                Anaheim Hills Contractor
              </div>
              <div className="text-[11px] sm:text-sm lg:text-lg text-gray-300 italic font-medium tracking-wide font-sans">
                by Easton Designs and Consulting
              </div>
            </div>
            
            {/* Phone Button */}
            <div>
              <a 
                href="tel:6578880026"
                className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-4 pt-1.5 pb-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg font-semibold hover:from-sky-700 hover:to-sky-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-sm sm:text-base lg:text-xl font-semibold">(657) 888-0026</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pt-16 sm:pt-20 lg:pt-24" role="banner">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 h-full">
            {/* Text Content */}
            <div className="w-full lg:w-2/5 text-center lg:text-left flex flex-col h-full py-12 lg:py-24">
              <p className="text-4xl lg:text-6xl font-bold mb-6 font-serif">
                Anaheim Hills Home Owners
              </p>
              <h1 className="text-xl lg:text-3xl mb-6 lg:mb-8 max-w-4xl lg:max-w-lg font-sans">
                Get your Dream Kitchen or Bathroom designed 
                <span className="text-sky-500 font-semibold ml-2">for FREE</span>.
              </h1>
              <p className="text-lg lg:text-xl mb-8 text-gray-400 max-w-4xl lg:max-w-xl">
                We normally charge $450 for this design. For August, it’s free. You’ll see exactly what your remodel will look like, before spending money.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => setQuoteModalOpen(true)}
                  className="bg-white text-black text-xl px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Claim Package
                </button>
                <button 
                  onClick={() => {
                    const element = document.getElementById('services');
                    if (element) {
                      // Responsive navbar height: 64px on mobile, 80px on tablet, 96px on desktop
                      const isMobile = window.innerWidth < 640;
                      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
                      const navbarHeight = isMobile ? 64 : isTablet ? 80 : 96;
                      const elementPosition = element.offsetTop - navbarHeight;
                      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
                    }
                  }}
                  className="border-2 border-white text-xl text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
                >
                  View Services
                </button>
              </div>
            </div>
            
            {/* YouTube Video */}
            <div className="w-full lg:w-3/5 flex justify-center pt-0 pb-12 lg:py-6 h-full">
              <div className="w-full max-w-2xl">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/vX1yODjL7Gk"
                    title="Bathroom Remodeling Process"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Why Free Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Free?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We’re confident in our craftsmanship. When you see our design, you’ll know you’re in good hands. Some choose to hire us. Some don’t. Either way, the design is yours to keep.
            </p>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Build Trust</h3>
                <p className="text-gray-600">Free designs show we know what we're doing and build confidence before any money is involved.</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">We're Confident</h3>
                <p className="text-gray-600">We believe in our work, so we offer free designs to show what's possible before you commit.</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Close Faster</h3>
                <p className="text-gray-600">When customers can visualize the result, they decide faster and with fewer objections.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Specialize In
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check out the two special services we offer. Yes, they're <span className="text-sky-600 font-medium">real photos</span> taken from projects we've done in Anaheim Hills or nearby Orange County areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="aspect-[25/16] bg-gray-200 relative overflow-hidden">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                      nextEl: `.swiper-button-next-${index}`,
                      prevEl: `.swiper-button-prev-${index}`,
                    }}
                    pagination={{
                      el: `.swiper-pagination-${index}`,
                      clickable: true,
                    }}
                    loop={true}
                    className="h-full w-full"
                  >
                    {service.images.map((image, imgIndex) => (
                      <SwiperSlide key={imgIndex}>
                        <Image 
                          src={image} 
                          alt={`${service.title} - Image ${imgIndex + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => openLightbox(service.images, imgIndex)}
                          width={800}
                          height={512}
                          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 600px"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const nextElement = target.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center" style={{display: 'none'}}>
                          <div className="text-center text-gray-500">
                            <div className="text-6xl mb-2">{service.icon}</div>
                            <p className="text-sm">Image Placeholder</p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Custom Navigation Buttons */}
                  <button
                    className={`swiper-button-prev-${index} absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-2 hover:text-gray-300 transition-colors z-10`}
                    aria-label="Previous image"
                  >
                    <svg className="w-8 h-8 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    className={`swiper-button-next-${index} absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 hover:text-gray-300 transition-colors z-10`}
                    aria-label="Next image"
                  >
                    <svg className="w-8 h-8 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Custom Pagination */}
                  <div className={`swiper-pagination-${index} absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1`}></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <button 
                    onClick={() => openLightbox(service.images, 0)}
                    className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View Photos
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You Get
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These are <span className="text-sky-600 font-medium">real samples</span> crafted by our designers. You'll get the same level of quality, care, and attention to detail in your own design.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Benefits - Left Side */}
            <div className="bg-gray-50 rounded-xl shadow-lg p-8 h-full flex flex-col justify-center">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Custom 3D Design</h3>
                    <p className="text-gray-600">Custom 3D design tailored to your space</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Material Suggestions</h3>
                    <p className="text-gray-600">Material suggestions and layout ideas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Quick Delivery</h3>
                    <p className="text-gray-600">Delivered in 3 business days</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">No Obligation</h3>
                    <p className="text-gray-600">Yours to keep, no obligation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Slider - Right Side */}
            <div className="relative min-h-[400px]">
              <div className="bg-gray-200 relative overflow-hidden rounded-xl shadow-lg h-full cursor-pointer">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation={{
                    nextEl: '.swiper-button-next-whatyouget',
                    prevEl: '.swiper-button-prev-whatyouget',
                  }}
                  pagination={{
                    el: '.swiper-pagination-whatyouget',
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                  }}
                  className="h-full"
                >
                  {Array.from({ length: 15 }, (_, i) => `/3D/3d-${(i + 1).toString().padStart(2, '0')}.png`).map((image, index) => (
                    <SwiperSlide key={index}>
                      <div 
                        className="w-full h-full cursor-pointer"
                        onClick={() => {
                          const threeD3DImages = Array.from({ length: 15 }, (_, i) => `/3D/3d-${(i + 1).toString().padStart(2, '0')}.png`);
                          openLightbox(threeD3DImages, index);
                        }}
                      >
                        <Image
                          src={image}
                          alt={`3D Design example ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          width={400}
                          height={300}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <button
                  className="swiper-button-prev-whatyouget absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-2 hover:text-gray-300 transition-colors z-10"
                  aria-label="Previous image"
                >
                  <svg className="w-8 h-8 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  className="swiper-button-next-whatyouget absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 hover:text-gray-300 transition-colors z-10"
                  aria-label="Next image"
                >
                  <svg className="w-8 h-8 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Custom Pagination */}
                <div className="swiper-pagination-whatyouget absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              [Content to be added]
            </p>
          </div>
        </div>
      </section>

      {/* Before and After Section */}
      <section id="transformations" className="py-16 bg-white" aria-labelledby="transformations-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="transformations-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transformations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the <span className="text-sky-600 font-medium">Before & After</span> photos that show how we turn outdated bathrooms into stunning modern spaces, crafted with care and detail.
            </p>
          </div>

          <div className="w-full space-y-8">
            {beforeAfterProjects.map((project, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden shadow-lg aspect-[25/16] before-after-container">
                <ReactBeforeSliderComponent
                  firstImage={{
                    imageUrl: project.after,
                    alt: `After - ${project.title}`
                  }}
                  secondImage={{
                    imageUrl: project.before,
                    alt: `Before - ${project.title}`
                  }}
                  withResizeFeel={true}
                  delimiterIconStyles={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    color: '#333',
                    border: '3px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  delimiterColor="white"
                  currentPercentPosition={40}
                />
                
                    {/* Before Label - Left */}
                    <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                      BEFORE
                    </div>
                    
                    {/* After Label - Right */}
                    <div className="absolute bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                      AFTER
                    </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Photos Section */}
      <section id="gallery" className="py-16 bg-gray-50" aria-labelledby="gallery-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="gallery-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              More Photos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let the <span className="text-sky-600 font-medium">results</span> speak for themselves with expert craftsmanship in every detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Use pre-shuffled photos */}
            {shuffledPhotos.map((photo, index) => (
              <div 
                key={index} 
                className="relative aspect-[25/16] rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => openLightbox(shuffledPhotos.map(p => p.src), index)}
              >
                <Image
                  src={photo.src}
                  alt={`${photo.type} Remodeling Project`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  width={592}
                  height={379}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const nextElement = target.nextElementSibling;
                    if (nextElement) {
                      (nextElement as HTMLElement).style.display = 'flex';
                    }
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gray-200 items-center justify-center text-gray-500 hidden">
                  <span>Image not found</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 bg-black text-white" aria-labelledby="contact-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl mb-8">
            Contact us today for a free consultation and quote on your next project.
          </p>
          
          {/* Video */}
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg mb-8">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/Pfe_cH7hfUY"
              title="Bathroom Remodeling Process"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:6578880026" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
              aria-label="Call Travis at (657) 888-0026"
            >
              (657) 888-0026
            </a>
            <button 
              onClick={() => setQuoteModalOpen(true)}
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Get Started
            </button>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-600">
            <p className="text-gray-300 text-base text-center">
              CSLB Lic. #1121194
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages.map(src => ({ src }))}
        plugins={[Thumbnails]}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          border: 2,
          borderRadius: 4,
          padding: 4,
          gap: 16,
        }}
        styles={{
          container: { zIndex: 9999 }
        }}
        className="custom-lightbox"
      />

      {/* Quote Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {formSubmitted ? 'Thank You!' : 'Request Free Design'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              {formSubmitted ? (
                // Success Component
                <div className="text-center py-2">
                  <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-1">Request Submitted!</h4>
                    <p className="text-gray-600">
                      Thank you for your interest. We'll get back to you soon to discuss your project.
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      <a
                        href="tel:(657) 888-0026"
                        className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors text-center font-semibold"
                      >
                        (657) 888-0026
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                // Form Component
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={quoteForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={quoteForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={quoteForm.phone}
                    onChange={handleInputChange}
                    required
                    maxLength={14}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="(000) 000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Interest <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="project"
                    name="project"
                    value={quoteForm.project}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Select a project type</option>
                    <option value="Kitchen">Kitchen Remodeling</option>
                    <option value="Bathroom">Bathroom Remodeling</option>
                    <option value="Kitchen & Bath">Kitchen & Bathroom</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={quoteForm.budget}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Select your budget range</option>
                    <option value="Under 10k">Under $10k</option>
                    <option value="10-20k">$10k - $20k</option>
                    <option value="20-30k">$20k - $30k</option>
                    <option value="40-50k">$40k - $50k</option>
                    <option value="50k+">$50k+</option>
                  </select>
                </div>

                {/* reCAPTCHA */}
                <div className="py-4">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    theme="light"
                  />
                </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-600"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button with Tooltip */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative group">
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 pointer-events-none">
              <div className="bg-white text-gray-900 text-sm px-3 py-2 rounded-lg whitespace-nowrap relative border border-[#CCCCCC]">
                🛠️ Submit Your Project
                {/* Arrow pointing down to center of button with border */}
                <div className="absolute top-full" style={{right: '22px'}}>
                  <div className="w-0 h-0" style={{borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #AAAAAA'}}></div>
                  <div className="w-0 h-0 absolute top-0 left-0 transform -translate-y-px" style={{borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid white'}}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Button */}
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Get Quote"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
