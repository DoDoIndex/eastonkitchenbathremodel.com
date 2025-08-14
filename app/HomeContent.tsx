'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Google Ads conversion tracking
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

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

// Reusable Form Step Component
interface FormStepProps {
  step: number;
  formData: {
    name: string;
    email: string;
    phone: string;
    project: string;
    budget: string;
    financing: string;
    source: string;
    ad_source: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFirstSubmit: (e: React.FormEvent, source?: string) => void;
  onSecondSubmit: (e: React.FormEvent) => void;
  onPrevStep: () => void;
  isSubmitting: boolean;
  showStepNumbers?: boolean;
  source?: string;
}

function FormStep({ 
  step, 
  formData, 
  onInputChange, 
  onFirstSubmit, 
  onSecondSubmit, 
  onPrevStep, 
  isSubmitting,
  showStepNumbers = false,
  source 
}: FormStepProps) {
  if (step === 3) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent mb-4" />
        <p className="text-lg text-gray-600">Redirecting...</p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <form onSubmit={onSecondSubmit} className="space-y-4">
        {showStepNumbers && (
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">Step 2 of 3</span>
          </div>
        )}

        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
            Project Interest <span className="text-red-500">*</span>
          </label>
          <select
            id="project"
            name="project"
            value={formData.project}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900"
          >
            <option value="">Select a project type</option>
            <option value="Kitchen">Kitchen Remodeling</option>
            <option value="Bathroom">Bathroom Remodeling</option>
            <option value="Kitchen & Bath">Kitchen & Bathroom</option>
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Budget <span className="text-red-500">*</span>
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900"
          >
            <option value="">Select your budget range</option>
            <option value="Under 25k">Under $25k</option>
            <option value="25-35k">$25k - $35k</option>
            <option value="35-60k">$35k - $60k</option>
            <option value="60-100k">$60k - $100k</option>
            <option value="100-150k">$100k - $150k</option>
            <option value="150k+">$150k+</option>
          </select>
        </div>

        <div>
          <label htmlFor="financing" className="block text-sm font-medium text-gray-700 mb-2">
            Do you need Financing? <span className="text-red-500">*</span>
          </label>
          <select
            id="financing"
            name="financing"
            value={formData.financing}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900"
          >
            <option value="">Select an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-600 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>Submitting...</span>
              </>
            ) : (
              'Claim Free Design'
            )}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={(e) => onFirstSubmit(e, source)} className="space-y-4">
      {showStepNumbers && (
        <div className="text-center mb-4">
          <span className="text-sm text-gray-500">Step 1 of 3</span>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900"
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
          value={formData.email}
          onChange={onInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900"
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
          value={formData.phone}
          onChange={onInputChange}
          required
          maxLength={14}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900"
          placeholder="(000) 000-0000"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-600 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Submitting...</span>
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </form>
  );
}

export function HomeContent() {
  const searchParams = useSearchParams();
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
  const [formStep, setFormStep] = useState(1);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    budget: '',
    financing: '',
    source: '',
    ad_source: searchParams.get('ad_source') || ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

  // Update ad_source when URL parameters change
  useEffect(() => {
    const adSource = searchParams.get('ad_source');
    if (adSource) {
      setQuoteForm(prev => ({ ...prev, ad_source: adSource }));
    }
  }, [searchParams]);

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

  const openQuoteModal = (source: string) => {
    setQuoteForm(prev => ({ ...prev, source }));
    setQuoteModalOpen(true);
  };

  const handleFirstSubmit = async (e: React.FormEvent, source?: string) => {
    e.preventDefault();
    
    // Validate step 1 fields
    if (!quoteForm.name || !quoteForm.email || !quoteForm.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit first form with contact info
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: quoteForm.name,
          email: quoteForm.email,
          phone: quoteForm.phone,
          project: '', // Empty for now
          budget: '', // Empty for now
          source: source || quoteForm.source || 'Main Form', // Use source parameter or fallback to form source
          ad_source: quoteForm.ad_source,
          recaptchaToken: 'skip' // Skip reCAPTCHA
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmissionId(result.submissionId);
        
        // Google Ads conversion tracking
        if (typeof window !== 'undefined' && window.gtag) {
          console.log('Google Ads conversion tracking');
          window.gtag('event', 'conversion', {
            'send_to': 'AW-16598983555/G1hqCOOok4oaEIPHges9',
            'value': 1.0,
            'currency': 'USD'
          });
        }
        
        // Move to step 2
        setFormStep(2);
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

  const handleSecondSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submissionId) {
      toast.error('Error: No submission ID found. Please start over.');
      setFormStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the submission with project details
      const response = await fetch(`/api/update-quote/${submissionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: quoteForm.project,
          budget: quoteForm.budget,
          financing: quoteForm.financing,
        }),
      });

      if (response.ok) {
        // Move to step 3 (redirecting) and redirect after 3 seconds
        setFormStep(3);
        setTimeout(() => {
          window.location.href = `/upload/${submissionId}`;
        }, 3000);
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

  const prevStep = () => {
    setFormStep(1);
  };

  const resetForm = () => {
    setQuoteForm({
      name: '',
      email: '',
      phone: '',
      project: '',
      budget: '',
      financing: '',
      source: '',
      ad_source: searchParams.get('ad_source') || ''
    });
    setFormStep(1);
    setSubmissionId(null);
  };

  const isQualified = () => {
    // Allow all users to submit quotes regardless of budget
    return true;
  };

  const getQualificationMessage = () => {
    // No qualification messages needed since all users can submit
    return '';
  };

  const closeModal = () => {
    setQuoteModalOpen(false);
    // Only reset submission state, keep form data and step
    setTimeout(() => {
      setFormSubmitted(false);
      setIsSubmitting(false);
      setIsRedirecting(false);
      // Don't reset formStep - keep current step
      // Don't reset submissionId - keep current submission
      recaptchaRef.current?.reset();
    }, 300); // Small delay to allow modal close animation
  };

  return (
    <main className="min-h-screen" role="main">
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16 sm:h-20 lg:h-24 bg-white">
            {/* Logo */}
            <Image 
              src="/easton_logo.svg" 
              alt="Logo" 
              width={200} 
              height={80} 
              className="w-[200px] h-[80px] lg:w-[250px] lg:h-[100px]"
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pt-16 sm:pt-20 lg:pt-24" role="banner">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 h-full">
            {/* Text Content */}
            <div className="w-full lg:w-2/5 text-center md:text-left flex flex-col h-full py-8 lg:py-24">
              <h1 className="text-xl md:text-3xl mb-4 md:mb-8 max-w-4xl lg:max-w-lg font-sans" style={{ lineHeight: '1.45' }}>
                Get your Kitchen & Bathroom designed by 
                <span className="text-sky-500 font-semibold mx-2 inline-block">real professionals.</span><span className="text-white inline-block">No AI, no obligation.</span>
              </h1>
              <p className="text-base md:text-xl text-gray-400 max-w-4xl lg:max-w-xl">
                We <span className="text-white">normally charge $1,500</span> for this design offer. But for the month of <span className="text-white">{new Date().toLocaleDateString('en-US', { month: 'long' })}, it's FREE</span>. You'll see exactly what your remodel will look like, <span className="text-white">before spending a penny</span>.
              </p>
            </div>
            
            {/* Quote Form */}
            <div className="w-full lg:w-3/5 flex justify-center pt-0 pb-12 md:py-6 h-full">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 min-h-[415px]">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Request Free Design
                  </h3>
                  
                  <FormStep
                    step={formStep}
                    formData={quoteForm}
                    onInputChange={handleInputChange}
                    onFirstSubmit={handleFirstSubmit}
                    onSecondSubmit={handleSecondSubmit}
                    onPrevStep={prevStep}
                    isSubmitting={isSubmitting}
                    showStepNumbers={false}
                    source="Top Form"
                  />
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
              We’re confident in our craftsmanship. When you see our design, you’ll know you’re in good hands. <span className="text-sky-600 font-medium">Most people who receive the free design choose to hire us to do the remodeling.</span> Either way, it is yours to keep.
            </p>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Build Trust</h3>
                <p className="text-gray-600">Free designs show we know what we're doing and build confidence before any money is involved.</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">We're Confident</h3>
                <p className="text-gray-600">We believe in our work, so we offer free designs to show what's possible before you commit.</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Close Faster</h3>
                <p className="text-gray-600">When customers can visualize the result, they decide faster and with fewer objections.</p>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => openQuoteModal('Why Free')}
              className="bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors text-lg"
            >
              Claim Your Free Design
            </button>
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
              Check out the two special services we offer. Yes, they're <span className="text-sky-600 font-medium">real photos</span> taken from real projects we've done in Orange County.
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
          
          {/* CTA Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => openQuoteModal('What We Specialize In')}
              className="bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors text-lg"
            >
              Claim Free Design
            </button>
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
              These are recent 3D renderings crafted by our designers, so realistic they’re nearly <span className="text-sky-600 font-medium">indistinguishable from real life</span>. You’ll get the same level of quality, care, and attention to detail in your own design.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Benefits - Left Side */}
            <div className="bg-gray-50 rounded-xl shadow-lg p-8 h-full flex flex-col justify-center">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
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
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
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
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
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
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
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
                  loop={true}
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
          
          {/* CTA Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => openQuoteModal('What You Get')}
              className="bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors text-lg"
            >
              Get Your Free Design
            </button>
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
              Getting your free design is simple. <span className="text-sky-600 font-medium">No meetings, no sales pressure</span>, just a straightforward process to get you the design you deserve.
            </p>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Fill out a short form</h3>
                <p className="text-gray-600">Tell us a bit about you and your budget. It only takes a minute.</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Upload photos and inspiration</h3>
                <p className="text-gray-600">You will get redirected to a page so you can upload pictures and ideas.</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Get your free design in 3 days</h3>
                <p className="text-gray-600">Our designer will create a custom 3D design and send it straight to your inbox.</p>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => openQuoteModal('How It Works')}
              className="bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors text-lg"
            >
              Start Your Free Design
            </button>
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
          
          {/* CTA Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => openQuoteModal('Transformations')}
              className="bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors text-lg"
            >
              Get Started Today
            </button>
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
          
          {/* CTA Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => openQuoteModal('More Photos')}
              className="bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors text-lg"
            >
              Design My Space
            </button>
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
          
          {/* Quote Form */}
          <div className="flex justify-center mb-8 text-left">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Request Free Design
                </h3>
                
                <FormStep
                  step={formStep}
                  formData={quoteForm}
                  onInputChange={handleInputChange}
                  onFirstSubmit={handleFirstSubmit}
                  onSecondSubmit={handleSecondSubmit}
                  onPrevStep={prevStep}
                  isSubmitting={isSubmitting}
                  showStepNumbers={false}
                  source="Bottom Form"
                />
              </div>
            </div>
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
                  Request Free Design
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              {(
                // 2-Step Form Component
                <FormStep
                    step={formStep}
                    formData={quoteForm}
                    onInputChange={handleInputChange}
                    onFirstSubmit={handleFirstSubmit}
                    onSecondSubmit={handleSecondSubmit}
                    onPrevStep={prevStep}
                    isSubmitting={isSubmitting}
                    showStepNumbers={false}
                    source="Bottom Form"
                  />
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
            onClick={() => openQuoteModal('Bottom Right FAB')}
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
