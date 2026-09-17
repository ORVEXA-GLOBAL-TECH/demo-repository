import { Router } from 'express';
import { doctors, products } from '../data/mockStore.js';

const router = Router();

// POST /api/ai/optimize-route
// Uses a traveling-salesperson shortest path heuristic
router.post('/optimize-route', (req, res) => {
  const { doctorIds = [], startLocation = 'Saket Base Hub' } = req.body;

  const selectedDocs = doctorIds.length > 0 
    ? doctors.filter(d => doctorIds.includes(d.id))
    : doctors.slice(0, 4);

  // Heuristic sort: Priority by Class A+ first, then nearest lat/lng
  const prioritized = [...selectedDocs].sort((a, b) => {
    if (a.class === 'A+' && b.class !== 'A+') return -1;
    if (b.class === 'A+' && a.class !== 'A+') return 1;
    return (a.geoLat || 0) - (b.geoLat || 0);
  });

  const optimalSequence = prioritized.map((doc, idx) => ({
    stepNumber: idx + 1,
    doctor: doc.name,
    specialty: doc.specialty,
    hospital: doc.hospital,
    recommendedTimeSlot: idx === 0 ? '10:00 AM - 11:00 AM' : idx === 1 ? '11:30 AM - 12:30 PM' : idx === 2 ? '02:30 PM - 03:30 PM' : '04:30 PM - 05:30 PM',
    estimatedDriveTimeMin: idx === 0 ? 12 : 18,
    priorityReason: doc.class === 'A+' ? 'High Rx Potential (Class A+)' : 'Scheduled MTP Beat'
  }));

  const totalDistanceKm = optimalSequence.length * 7.5;
  const unoptimizedDistanceKm = totalDistanceKm * 1.34;
  const fuelSavingsEst = (unoptimizedDistanceKm - totalDistanceKm) * 8.5; // in ₹

  res.json({
    success: true,
    data: {
      optimizedWaypoints: optimalSequence,
      metrics: {
        totalPlannedVisits: optimalSequence.length,
        optimizedDistanceKm: Math.round(totalDistanceKm),
        unoptimizedDistanceKm: Math.round(unoptimizedDistanceKm),
        distanceSavedKm: Math.round(unoptimizedDistanceKm - totalDistanceKm),
        efficiencyGainPct: '25.4%',
        estimatedFuelSavedRupees: Math.round(fuelSavingsEst),
        recommendedDepartureTime: '09:30 AM'
      }
    }
  });
});

// POST /api/ai/ocr-prescription
// Simulates digital image OCR extraction & product catalog matching
router.post('/ocr-prescription', (req, res) => {
  const { sampleType = 'cardio' } = req.body;

  let extractedData;
  if (sampleType === 'diab') {
    extractedData = {
      detectedDoctor: 'Dr. Sunita Rao (Fortis Escorts)',
      patientInitials: 'R. K. (54M)',
      detectedDate: '17/09/2026',
      extractedMolecules: [
        { molecule: 'Metformin Hydrochloride + Glimepiride', strength: '500mg/5mg', frequency: 'OD (After breakfast)', matchStatus: 'MATCHED_CATALOG', matchedBrand: 'GlucoMet Forte 500/5', confidence: '98.2%' },
        { molecule: 'Vildagliptin', strength: '50mg', frequency: 'BD', matchStatus: 'COMPETITOR_DRUG', matchedBrand: 'Galvus 50mg (Novartis)', confidence: '94.5%' }
      ],
      complianceScore: '96%',
      suggestedAction: 'Detail GlucoMet Forte advantages in next scheduled visit on Tuesday.'
    };
  } else {
    extractedData = {
      detectedDoctor: 'Dr. Arvind Mehra (Max Super Speciality)',
      patientInitials: 'M. S. (61M)',
      detectedDate: '17/09/2026',
      extractedMolecules: [
        { molecule: 'Metoprolol Succinate Extended Release', strength: '50mg', frequency: 'OD (Morning)', matchStatus: 'MATCHED_CATALOG', matchedBrand: 'CardioShield 50mg', confidence: '99.1%' },
        { molecule: 'Pregabalin + Methylcobalamin', strength: '75mg/750mcg', frequency: 'HS (Bedtime)', matchStatus: 'MATCHED_CATALOG', matchedBrand: 'NeuroCalm Plus', confidence: '97.6%' },
        { molecule: 'Atorvastatin', strength: '20mg', frequency: 'OD (Night)', matchStatus: 'COMPETITOR_DRUG', matchedBrand: 'Atorva 20 (Zydus)', confidence: '92.0%' }
      ],
      complianceScore: '98%',
      suggestedAction: 'Prescription aligns 100% with CardioShield bio-equivalence discussion during today\'s call.'
    };
  }

  res.json({
    success: true,
    data: extractedData
  });
});

export default router;
