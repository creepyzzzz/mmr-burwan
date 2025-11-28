import { Application } from '../types';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { CertificatePDF } from '../components/certificate/CertificatePDF';

// Generate random names for testing
const generateRandomName = () => {
  const firstNames = ['Ahmed', 'Mohammed', 'Hassan', 'Ali', 'Ibrahim', 'Omar', 'Yusuf', 'Khalid', 'Fatima', 'Aisha', 'Zainab', 'Mariam', 'Khadija', 'Aminah'];
  const lastNames = ['Khan', 'Ahmed', 'Hassan', 'Ali', 'Rahman', 'Hussain', 'Malik', 'Sheikh', 'Begum', 'Bibi'];
  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
  };
};

// Format Aadhaar number with spaces
const formatAadhaar = (aadhaar: string | undefined): string => {
  if (!aadhaar || aadhaar === 'N/A') return 'N/A';
  const cleaned = aadhaar.replace(/\s/g, '');
  if (cleaned.length === 12) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`;
  }
  return aadhaar;
};

// Format address in the exact format: "VILL- UPARIDHA, P.O- MUKUNDAPUR, P.S- BERHAMPORE, DIST- MURSHIDABAD, WEST BENGAL, PIN- 742187"
const formatAddress = (address: any): string => {
  if (!address || (!address.street && !address.city)) return 'N/A';
  const parts = [];
  
  // Extract village name (remove VILL- prefix if present)
  const village = address.street ? address.street.toUpperCase().replace(/^VILL-?\s*/i, '').trim() : '';
  if (village) parts.push(`VILL- ${village}`);
  
  // P.O (Post Office) - city
  if (address.city) parts.push(`P.O- ${address.city.toUpperCase()}`);
  
  // P.S (Police Station) - usually state or city
  const ps = address.state || address.city || '';
  if (ps) parts.push(`P.S- ${ps.toUpperCase()}`);
  
  // DIST (District) - usually state
  const district = address.state || address.city || '';
  if (district) parts.push(`DIST- ${district.toUpperCase()}`);
  
  // Always add WEST BENGAL
  parts.push('WEST BENGAL');
  
  // PIN code
  if (address.zipCode) parts.push(`PIN- ${address.zipCode}`);
  
  return parts.length > 0 ? parts.join(', ') : 'N/A';
};

// Parse certificate number: "WB-MSD-BRW-I-1-C-2024-16-2025-21"
const parseCertificateNumber = (certNumber: string | undefined) => {
  if (!certNumber) {
    const currentYear = new Date().getFullYear();
    return {
      book: 'I',
      volumeNumber: '1',
      volumeLetter: 'C',
      volumeYear: currentYear.toString(),
      serialNumber: '1',
      serialYear: (currentYear + 1).toString(),
      pageNumber: '1',
    };
  }

  // Format: WB-MSD-BRW-{book}-{volumeNumber}-{volumeLetter}-{volumeYear}-{serialNumber}-{serialYear}-{pageNumber}
  const parts = certNumber.split('-');
  if (parts.length >= 10 && parts[0] === 'WB' && parts[1] === 'MSD' && parts[2] === 'BRW') {
    return {
      book: parts[3] || 'I',
      volumeNumber: parts[4] || '1',
      volumeLetter: parts[5] || 'C',
      volumeYear: parts[6] || new Date().getFullYear().toString(),
      serialNumber: parts[7] || '1',
      serialYear: parts[8] || (new Date().getFullYear() + 1).toString(),
      pageNumber: parts[9] || '1',
    };
  }

  // Fallback to defaults
  const currentYear = new Date().getFullYear();
  return {
    book: 'I',
    volumeNumber: '1',
    volumeLetter: 'C',
    volumeYear: currentYear.toString(),
    serialNumber: '1',
    serialYear: (currentYear + 1).toString(),
    pageNumber: '1',
  };
};

export const generateCertificateData = (application: Application) => {
  const userDetails = application.userDetails || {};
  const partnerDetails = (application as any).partnerDetails || (application as any).partnerForm || {};
  
  const userRandomName = generateRandomName();
  const partnerRandomName = generateRandomName();
  
  const currentYear = new Date().getFullYear();
  
  // Use stored registration date and certificate number if available, otherwise generate defaults
  const registrationDate = application.registrationDate || application.verifiedAt || application.submittedAt || new Date().toISOString();
  const marriageDate = (application.declarations as any)?.marriageDate || application.submittedAt || new Date().toISOString();
  
  // Use stored certificate number if available, otherwise generate a default
  const consecutiveNumber = application.certificateNumber || `WB-MSD-BRW-I-1-C-${currentYear}-${Math.floor(Math.random() * 50) + 1}-${currentYear + 1}-${Math.floor(Math.random() * 30) + 1}`;
  const verificationId = `MMR-BW-${currentYear}-${String(Date.now()).slice(-6)}`;
  
  // Parse certificate number to extract components
  const certParts = parseCertificateNumber(application.certificateNumber || consecutiveNumber);
  
  // Format volume number: "1-C/2024"
  const volNo = `${certParts.volumeNumber}-${certParts.volumeLetter}/${certParts.volumeYear}`;
  
  // Format serial number: "3/2026"
  const serialNo = `${certParts.serialNumber}/${certParts.serialYear}`;
  
  return {
    verificationId,
    registrationDate,
    consecutiveNumber,
    book: certParts.book,
    volNo: volNo,
    serialNo: serialNo,
    page: certParts.pageNumber,
    marriageDate,
    registrarName: 'MINHAJUL ISLAM KHAN',
    registrarLicense: '04L(St.)/LW/O/St./4M-123/2019',
    registrarOffice: 'VILL. & P.O- GRAMSALIKA, P.S- BURWAN, DIST- MURSHIDABAD, WEST BENGAL, PIN-742132',
    registrarPhone: '9732688698',
    registrarEmail: 'mmrburwan@gmail.com',
    userFirstName: (userDetails as any).firstName || userRandomName.firstName,
    userLastName: (userDetails as any).lastName || userRandomName.lastName,
    userFatherName: (userDetails as any).fatherName || `MD ${userRandomName.firstName.toUpperCase()} SK`,
    partnerFirstName: (partnerDetails as any).firstName || partnerRandomName.firstName,
    partnerLastName: (partnerDetails as any).lastName || partnerRandomName.lastName,
    partnerFatherName: (partnerDetails as any).fatherName || `MD ${partnerRandomName.firstName.toUpperCase()} SK`,
  };
};


export const downloadCertificate = async (application: Application) => {
  const certificateData = generateCertificateData(application);
  
  // Generate PDF using React PDF
  const doc = React.createElement(CertificatePDF, { application, certificateData });
  const blob = await pdf(doc).toBlob();
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Marriage-Certificate-${certificateData.verificationId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  return certificateData;
};
