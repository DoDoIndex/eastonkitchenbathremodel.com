'use client';

import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import { Thumbnails } from 'yet-another-react-lightbox/plugins';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
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
    project: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Scroll detection for tooltip
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowTooltip(scrollY > 100);
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
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 pt-1.5 pb-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
            <div className="flex-1 text-center md:text-left flex flex-col h-full pt-12 pb-0 md:py-24">
              <p className="text-4xl md:text-6xl font-bold mb-6 font-serif">
                Hi, I'm Travis
              </p>
              <h1 className="text-xl md:text-3xl mb-6 md:mb-8 max-w-lg font-sans">
                Your trusted local general contractor in 
                <span className="text-green-500 ml-2">Anaheim Hills</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-400 max-w-xl">
                My team specializes in <span className="text-white">kitchen &amp; bathroom remodeling</span> with over <span className="text-white">20 years</span> of professional experience. <span className="text-white inline-block">CSLB #1121194</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => setQuoteModalOpen(true)}
                  className="bg-white text-black text-xl px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Free Quote
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
            
            {/* Photo */}
            <div className="flex-1 flex justify-center h-full">
              <div className="w-full h-full overflow-hidden pt-6">
                <img 
                  src="/contractor.webp" 
                  alt="Travis - Licensed General Contractor specializing in kitchen and bathroom remodeling in Anaheim Hills, Orange County. CSLB License 1121194" 
                  className="w-full h-full object-cover object-bottom"
                  loading="eager"
                  width="400"
                  height="600"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Specialties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check out the two special services we offer. Yes, they're <span className="text-gray-900 font-medium">real photos</span> taken from projects we've done in Anaheim Hills or nearby Orange County areas.
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
                        <img 
                          src={image} 
                          alt={`${service.title} - Image ${imgIndex + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => openLightbox(service.images, imgIndex)}
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
                  >
                    <svg className="w-8 h-8 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    className={`swiper-button-next-${index} absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 hover:text-gray-300 transition-colors z-10`}
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

      {/* My Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              My Team
            </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We are <span className="text-gray-900 font-medium">fully licensed</span>, reliable, and not afraid to get our hands dirty to deliver quality work you can count on.
              </p>
          </div>

          <div className="w-full">
            <div className="bg-gray-200 overflow-hidden rounded-xl">
              <img 
                src="/travis-and-team.jpg" 
                alt="Travis and his team"
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const nextElement = target.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <div className="w-full h-96 bg-gray-300 flex items-center justify-center" style={{display: 'none'}}>
                <div className="text-center text-gray-500">
                  <div className="text-8xl mb-4">👥</div>
                  <p className="text-xl">Team Photo</p>
                  <p className="text-sm">(Add team photo here)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before and After Section */}
      <section id="transformations" className="py-16 bg-gray-50" aria-labelledby="transformations-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="transformations-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transformations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See the <span className="text-gray-900 font-medium">Before & After</span> photos that show how we turn outdated bathrooms into stunning modern spaces, crafted with care and detail.
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
      <section id="gallery" className="py-16 bg-white" aria-labelledby="gallery-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="gallery-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              More Photos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let the <span className="text-gray-900 font-medium">results</span> speak for themselves with expert craftsmanship in every detail.
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
                <img
                  src={photo.src}
                  alt={`${photo.type} Remodeling Project`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              aria-label="Call Travis at (657) 888-0026"
            >
              (657) 888-0026
            </a>
            <button 
              onClick={() => setQuoteModalOpen(true)}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Request Quote
            </button>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-600">
            <p className="text-gray-300 text-base text-center">
              CSLB Lic. 1121194
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
                  {formSubmitted ? 'Thank You!' : 'Get Free Estimate'}
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
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a project type</option>
                    <option value="Kitchen">Kitchen Remodeling</option>
                    <option value="Bathroom">Bathroom Remodeling</option>
                    <option value="Kitchen & Bath">Kitchen & Bathroom</option>
                    <option value="Other">Other</option>
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
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
                🛠️ Get Project Estimate
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
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
