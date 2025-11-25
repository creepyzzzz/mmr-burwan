import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { Application } from '../../types';
import { safeFormatDate } from '../../utils/dateUtils';

// Helper function to get image URL - React PDF works with absolute URLs
const getImageUrl = (path: string): string => {
  // In browser environment, use window.location.origin
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  // Fallback for server-side rendering
  return path;
};

// Register fonts - React PDF has built-in support for Helvetica, Times-Roman, and Courier
// For custom fonts, you would need to load font files and register them here
// Using built-in fonts for now - can be replaced with custom fonts if needed
// Font.register({
//   family: 'Calibri',
//   src: '/fonts/Calibri.ttf',
// });

// Format Aadhaar number with spaces
const formatAadhaar = (aadhaar: string | undefined): string => {
  if (!aadhaar || aadhaar === 'N/A') return 'N/A';
  const cleaned = aadhaar.replace(/\s/g, '');
  if (cleaned.length === 12) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`;
  }
  return aadhaar;
};

// Format address in the exact format
const formatAddress = (address: any): string => {
  if (!address || (!address.street && !address.city)) return 'N/A';
  const parts = [];
  
  const village = address.street ? address.street.toUpperCase().replace(/^VILL-?\s*/i, '').trim() : '';
  if (village) parts.push(`VILL- ${village}`);
  
  if (address.city) parts.push(`P.O- ${address.city.toUpperCase()}`);
  
  const ps = address.state || address.city || '';
  if (ps) parts.push(`P.S- ${ps.toUpperCase()}`);
  
  const district = address.state || address.city || '';
  if (district) parts.push(`DIST- ${district.toUpperCase()}`);
  
  parts.push('WEST BENGAL');
  
  if (address.zipCode) parts.push(`PIN- ${address.zipCode}`);
  
  return parts.length > 0 ? parts.join(', ') : 'N/A';
};

interface CertificatePDFProps {
  application: Application;
  certificateData: {
    verificationId: string;
    registrationDate: string;
    consecutiveNumber: string;
    book: string;
    volNo: string;
    serialNo: string;
    page: string;
    marriageDate: string;
    registrarName: string;
    registrarLicense: string;
    registrarOffice: string;
    registrarPhone: string;
    registrarEmail: string;
    userFirstName: string;
    userLastName: string;
    userFatherName: string;
    partnerFirstName: string;
    partnerLastName: string;
    partnerFatherName: string;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: '20 25 20 25',
    backgroundColor: '#ffffff',
    position: 'relative',
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#000000',
  },
  borderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  borderImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emblemContainer: {
    width: 55,
    height: 55,
    margin: '0 auto 6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblem: {
    width: 55,
    height: 55,
  },
  headerTitle1: {
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
    letterSpacing: 0.2,
    color: '#000000',
    textTransform: 'uppercase',
  },
  headerTitle2: {
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000000',
    textTransform: 'uppercase',
  },
  officeDetails: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 1.3,
    color: '#000000',
  },
  officeName: {
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 11,
  },
  actReference: {
    fontSize: 10,
    fontStyle: 'normal',
    marginTop: 3,
  },
  certificateTitle: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  certificateTitleText: {
    fontFamily: 'Times-Roman',
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#8b6914',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  certificateIntro: {
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 1.3,
    marginBottom: 6,
    paddingHorizontal: 8,
    color: '#000000',
  },
  certificateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 10,
    fontSize: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  detailBox: {
    flex: 1,
    border: '1.5 solid #8b6914',
    padding: 6,
    backgroundColor: '#ffffff',
  },
  detailBoxTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: '#8b6914',
    borderBottom: '2 solid #8b6914',
    paddingBottom: 2,
    textDecoration: 'underline',
  },
  detailText: {
    fontSize: 10,
    lineHeight: 1.3,
    marginTop: 2,
    color: '#000000',
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 9,
    marginTop: 1,
    lineHeight: 1.2,
  },
  sectionBox: {
    marginTop: 6,
    marginBottom: 6,
    padding: '6 8',
    backgroundColor: '#ffffff',
    border: '1.5 solid #8b6914',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#8b6914',
  },
  sectionText: {
    fontSize: 10,
    lineHeight: 1.3,
    color: '#000000',
    marginTop: 1,
  },
  sectionLabel: {
    fontWeight: 'bold',
  },
  registrationDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 10,
  },
  wishStatement: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    fontStyle: 'italic',
    color: '#8b6914',
    fontWeight: 'normal',
  },
  registrarDetails: {
    marginTop: 8,
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#ffffff',
    border: '1.5 solid #8b6914',
  },
  registrarTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#8b6914',
  },
  registrarText: {
    fontSize: 10,
    lineHeight: 1.3,
    color: '#000000',
    marginTop: 1,
  },
  registrarLabel: {
    fontWeight: 'bold',
  },
  photoQrSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#ffffff',
  },
  photoContainer: {
    width: 80,
    height: 100,
    border: '2 solid #8b6914',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholder: {
    fontSize: 9,
    color: '#999999',
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'flex-end',
  },
  qrPlaceholder: {
    width: 70,
    height: 70,
    border: '2 solid #8b6914',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    fontSize: 9,
    color: '#999999',
  },
  verificationId: {
    fontSize: 9,
    marginTop: 3,
    color: '#666666',
    textAlign: 'right',
  },
  signatureSection: {
    marginTop: 8,
    textAlign: 'center',
  },
  signatureLine: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    fontStyle: 'italic',
    color: '#000000',
  },
});

export const CertificatePDF: React.FC<CertificatePDFProps> = ({ application, certificateData }) => {
  const userDetails = application.userDetails || {};
  const partnerDetails = (application as any).partnerDetails || (application as any).partnerForm || {};
  const userAddress = application.userAddress || (application as any).address || {};
  const userCurrentAddress = application.userCurrentAddress || (application as any).currentAddress || {};
  const partnerAddress = ((application as any).partnerAddress || (partnerDetails as any).address || {}) as any;
  const partnerCurrentAddress = ((application as any).partnerCurrentAddress || {}) as any;
  
  const userPresentAddr = formatAddress(userCurrentAddress.street ? userCurrentAddress : userAddress);
  const userPermanentAddr = formatAddress(userAddress);
  const partnerPresentAddr = formatAddress(partnerCurrentAddress.street ? partnerCurrentAddress : partnerAddress);
  const partnerPermanentAddr = formatAddress(partnerAddress);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Border Image */}
        <View style={styles.borderContainer}>
          <Image 
            src={getImageUrl("/assets/certificate/border.png")} 
            style={styles.borderImage}
            cache={false}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.emblemContainer}>
              <Image 
                src={getImageUrl("/assets/certificate/emblem-india.png")} 
                style={styles.emblem}
                cache={false}
              />
            </View>
            <Text style={styles.headerTitle1}>GOVERNMENT OF WEST BENGAL</Text>
            <Text style={styles.headerTitle2}>LAW DEPARTMENT</Text>
            <View style={styles.officeDetails}>
              <Text style={styles.officeName}>OFFICE OF THE MUHAMMADAN MARRIAGE REGISTRAR & QAAZI</Text>
              <Text>VILL.& P.O. GRAMSHALIKA, P.S. BURWAN, DIST. MURSHIDABAD, PIN- 742132</Text>
              <Text style={styles.actReference}>Under The Bengal Muhammadan Marriages and Divorces Registration Act- 1876.</Text>
            </View>
          </View>

          {/* Certificate Title */}
          <View style={styles.certificateTitle}>
            <Text style={styles.certificateTitleText}>Certificate Of Marriage</Text>
            <Text style={styles.certificateIntro}>
              This is to certify that the marriage has been Registered in between the following bridegroom and bride details under the Bengal Muhammadan Marriages and Divorces Registration Act- 1876 & Under the Indian Qaazi's Act-1880.
            </Text>
            <View style={styles.certificateInfo}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Consecutive Number:</Text> {certificateData.consecutiveNumber}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Registration Date:</Text> {safeFormatDate(certificateData.registrationDate, 'dd-MM-yyyy')}
              </Text>
            </View>
          </View>

          {/* Details Grid - Groom and Bride */}
          <View style={styles.detailsGrid}>
            {/* Groom Details */}
            <View style={styles.detailBox}>
              <Text style={styles.detailBoxTitle}>Details of Groom</Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Name:</Text> {(certificateData.userFirstName + ' ' + certificateData.userLastName).toUpperCase()}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>S/O:</Text> {certificateData.userFatherName.toUpperCase()}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>DOB:</Text> {(userDetails as any).dateOfBirth ? safeFormatDate((userDetails as any).dateOfBirth, 'dd-MM-yyyy') : 'N/A'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Aadhaar:</Text> {formatAadhaar((userDetails as any).aadhaarNumber)}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Phone No:</Text> {(userDetails as any).mobileNumber || ''}
              </Text>
              <Text style={[styles.detailText, styles.addressText, { marginTop: 4 }]}>
                <Text style={styles.detailLabel}>Present Address:</Text> {userPresentAddr}
              </Text>
              <Text style={[styles.detailText, styles.addressText, { marginTop: 4 }]}>
                <Text style={styles.detailLabel}>Permanent Address:</Text> {userPermanentAddr}
              </Text>
            </View>

            {/* Bride Details */}
            <View style={styles.detailBox}>
              <Text style={styles.detailBoxTitle}>Details of Bride</Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Name:</Text> {(certificateData.partnerFirstName + ' ' + certificateData.partnerLastName).toUpperCase()}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>D/O:</Text> {certificateData.partnerFatherName.toUpperCase()}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>DOB:</Text> {(partnerDetails as any).dateOfBirth ? safeFormatDate((partnerDetails as any).dateOfBirth, 'dd-MM-yyyy') : 'N/A'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Aadhaar:</Text> {formatAadhaar((partnerDetails as any).aadhaarNumber || (partnerDetails as any).idNumber)}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Phone No:</Text> {(partnerDetails as any).mobileNumber || ''}
              </Text>
              <Text style={[styles.detailText, styles.addressText, { marginTop: 4 }]}>
                <Text style={styles.detailLabel}>Present Address:</Text> {partnerPresentAddr}
              </Text>
              <Text style={[styles.detailText, styles.addressText, { marginTop: 4 }]}>
                <Text style={styles.detailLabel}>Permanent Address:</Text> {partnerPermanentAddr}
              </Text>
            </View>
          </View>

          {/* Social Marriage Details */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionText}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#8b6914' }}>Social Marriage Details:</Text> <Text style={styles.sectionLabel}>Date of Marriage:</Text> {safeFormatDate(certificateData.marriageDate, 'dd-MM-yyyy')}
            </Text>
          </View>

          {/* Registration Details */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Registration Details:</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.sectionLabel}>Date:</Text> {safeFormatDate(certificateData.registrationDate, 'dd-MM-yyyy')}, <Text style={styles.sectionLabel}>Book No:</Text> {certificateData.book}, <Text style={styles.sectionLabel}>Vol No:</Text> {certificateData.volNo}, <Text style={styles.sectionLabel}>Serial No:</Text> {certificateData.serialNo}, <Text style={styles.sectionLabel}>Page:</Text> {certificateData.page}.
            </Text>
          </View>

          {/* Wish Statement */}
          <Text style={styles.wishStatement}>I wish them All Successful Life.</Text>

          {/* Registrar Details */}
          <View style={styles.registrarDetails}>
            <Text style={styles.registrarTitle}>Muhammadan Marriage Registrar & Qaazi Details:</Text>
            <Text style={styles.registrarText}>
              <Text style={styles.registrarLabel}>Name:</Text> {certificateData.registrarName}
            </Text>
            <Text style={styles.registrarText}>
              <Text style={styles.registrarLabel}>Licence No:</Text> {certificateData.registrarLicense}.
            </Text>
            <Text style={styles.registrarText}>
              <Text style={styles.registrarLabel}>Office Address:</Text> {certificateData.registrarOffice}.
            </Text>
            <Text style={[styles.registrarText, { marginTop: 2 }]}>
              <Text style={styles.registrarLabel}>Contact:</Text> {certificateData.registrarPhone} {certificateData.registrarEmail}
            </Text>
          </View>

          {/* Photo and QR Section */}
          <View style={styles.photoQrSection}>
            <View style={styles.photoContainer}>
              <Text style={styles.photoPlaceholder}>Couple Photo</Text>
            </View>
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrText}>QR Code</Text>
              </View>
              <Text style={styles.verificationId}>Verification ID: {certificateData.verificationId}</Text>
            </View>
          </View>

          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <Text style={styles.signatureLine}>Signature of Registrar with Seal</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

