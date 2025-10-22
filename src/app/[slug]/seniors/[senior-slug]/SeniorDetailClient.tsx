'use client';
import React from 'react';
import { ISenior } from '@/utils/interface';
import { capitalizeWords } from '@/utils/formatting';
import {
  ExternalLink,
  GraduationCap,
  Calendar,
  Globe,
  User,
  MessageCircle,
  Phone,
  MapPin,
  Eye,
} from 'lucide-react';
import Image from 'next/image';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';

interface SeniorDetailClientProps {
  senior: ISenior;
  collegeName: string;
}

const SeniorDetailClient: React.FC<SeniorDetailClientProps> = ({
  senior,
  collegeName,
}) => {
  // --- Helper functions ---
  const getSocialMediaIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return <Phone className='w-4 h-4 sm:w-5 sm:h-5' />;
      case 'telegram':
        return <MessageCircle className='w-4 h-4 sm:w-5 sm:h-5' />;
      default:
        return <ExternalLink className='w-4 h-4 sm:w-5 sm:h-5' />;
    }
  };

  const getSocialMediaColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/60';
      case 'telegram':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/60';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800/60';
    }
  };

  const getSocialMediaUrl = (platform: string, url: string) => {
    switch (platform) {
      case 'whatsapp':
        return `https://wa.me/${url}`;
      case 'telegram':
        return `https://t.me/${url}`;
      default:
        return url;
    }
  };

  return (
    <>
      <DetailPageNavbar path='seniors' fullPath={`/${collegeName}/seniors`} />
      <div className='max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6'>
        {/* Main Card */}
        <div className='relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60'>
          <div className='relative flex flex-col md:flex-row gap-6 p-6 sm:p-8'>
            {/* LEFT: Profile Image */}
            <div className='w-full md:w-1/3 flex justify-center items-start'>
              <div className='relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-lg'>
                {senior.profilePicture ? (
                  <Image
                    src={senior.profilePicture}
                    alt={senior.name}
                    fill
                    className='object-cover'
                    priority
                  />
                ) : (
                  <div className='flex items-center justify-center h-full w-full bg-gradient-to-br from-sky-600 to-cyan-500'>
                    <User className='w-12 h-12 sm:w-16 sm:h-16 text-white opacity-80' />
                  </div>
                )}
                {senior.submissionStatus !== 'approved' && (
                  <span
                    className={`absolute top-3 left-3 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-md ${
                      senior.submissionStatus === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-200'
                    }`}
                  >
                    {capitalizeWords(senior.submissionStatus)}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT: Name + Info + Socials */}
            <div className='w-full md:w-2/3 flex flex-col justify-between gap-4'>
              <div className='flex flex-col gap-2'>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                  {senior.name}
                </h1>
                <div className='flex flex-col gap-2 text-gray-700 dark:text-gray-300'>
                  <div className='flex items-center gap-2'>
                    <GraduationCap className='w-4 h-4 text-sky-500' />
                    <span>{senior.branch?.branchName || 'Not specified'}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-emerald-500' />
                    <span>{senior.year}</span>
                  </div>
                  {senior.domain && (
                    <div className='flex items-center gap-2'>
                      <Globe className='w-4 h-4 text-purple-500' />
                      <span>{senior.domain}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {senior.socialMediaLinks && senior.socialMediaLinks.length > 0 && (
                  <div className='mt-3 flex flex-wrap gap-3'>
                    {senior.socialMediaLinks.map((link, index) => (
                      <a
                        key={index}
                        href={getSocialMediaUrl(link.platform, link.url)}
                        target='_blank'
                        rel='noopener noreferrer'
                        title={capitalizeWords(link.platform)}
                        className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${getSocialMediaColor(
                          link.platform
                        )}`}
                      >
                        {getSocialMediaIcon(link.platform)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BELOW: About / Description */}
          {senior.description && (
            <div className='border-t border-gray-200 dark:border-gray-700 mt-6 p-6 sm:p-8'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                About
              </h2>
              <p className='text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap'>
                {senior.description}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className='border-t border-gray-200 dark:border-gray-700 mt-6 p-6 sm:p-8 flex flex-col sm:flex-row justify-between text-sm text-gray-500 dark:text-gray-400 gap-2 sm:gap-0'>
            <div className='flex items-center gap-2'>
              <MapPin className='w-4 h-4' />
              <span>{senior.college?.name || collegeName}</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full'>
                <Eye className='w-3 h-3 mr-1' /> {senior.clickCount || 0} views
              </span>
              <span className='bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full'>
                Joined: {new Date(senior.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeniorDetailClient;
