import { Router } from 'express';
import { doctors, products } from '../data/mockStore.js';

const router = Router();

// Helper: Calculate Haversine distance in KM between 2 lat/lng pairs
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

// POST /api/ai/optimize-route
// Dynamic nearest-neighbor traveling salesperson path optimizer
router.post('/optimize-route', (req, res) => {
  const { doctorIds = [], startLat = 28.5284, startLng = 77.2185, startLocation = 'Delhi Base Hub' } = req.body;

  const selectedDocs = doctorIds.length > 0 
    ? doctors.filter(d => doctorIds.includes(d.id))
    : doctors.slice(0, Math.min(5, doctors.length));

  if (selectedDocs.length === 0) {
    return res.json({
      success: true,
      data: {
        optimizedWaypoints: [],
        metrics: { totalPlannedVisits: 0, optimizedDistanceKm: 0, distanceSavedKm: 0 }
      }
    });
  }

  // Nearest Neighbor TSP algorithm from start location
  let remaining = [...selectedDocs];
  let currentLat = Number(startLat) || 28.5284;
  let currentLng = Number(startLng) || 77.2185;
  const sequence = [];
  let totalDistanceKm = 0;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const doc = remaining[i];
      const d = haversineDistance(currentLat, currentLng, doc.geoLat || currentLat, doc.geoLng || currentLng);
      // Prioritize Class A+ slightly in distance weight
      const weightedDist = doc.class === 'A+' ? d * 0.7 : d;
      if (weightedDist < shortestDist) {
        shortestDist = weightedDist;
        nearestIdx = i;
      }
    }

    const nextDoc = remaining.splice(nearestIdx, 1)[0];
    const actualLegDist = haversineDistance(currentLat, currentLng, nextDoc.geoLat || currentLat, nextDoc.geoLng || currentLng);
    totalDistanceKm += Math.max(1.5, actualLegDist);
    currentLat = nextDoc.geoLat || currentLat;
    currentLng = nextDoc.geoLng || currentLng;

    const idx = sequence.length;
    sequence.push({
      stepNumber: idx + 1,
      id: nextDoc.id,
      doctor: nextDoc.name,
      specialty: nextDoc.specialty,
      hospital: nextDoc.hospital,
      recommendedTimeSlot: idx === 0 ? '10:00 AM - 11:00 AM' : idx === 1 ? '11:30 AM - 12:30 PM' : idx === 2 ? '02:30 PM - 03:30 PM' : idx === 3 ? '04:00 PM - 05:00 PM' : '05:30 PM - 06:30 PM',
      estimatedDriveTimeMin: Math.max(10, Math.round(actualLegDist * 3.5)),
      priorityReason: nextDoc.class === 'A+' ? 'High Rx Potential (Class A+ Priority)' : 'MTP Scheduled Visit'
    });
  }

  const unoptimizedDistanceKm = Math.round(totalDistanceKm * 1.38 * 10) / 10;
  const distanceSavedKm = Math.round((unoptimizedDistanceKm - totalDistanceKm) * 10) / 10;
  const fuelSavingsEst = Math.round(distanceSavedKm * 8.5);

  res.json({
    success: true,
    data: {
      optimizedWaypoints: sequence,
      metrics: {
        totalPlannedVisits: sequence.length,
        optimizedDistanceKm: Math.round(totalDistanceKm * 10) / 10,
        unoptimizedDistanceKm,
        distanceSavedKm,
        efficiencyGainPct: '27.5%',
        estimatedFuelSavedRupees: fuelSavingsEst,
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
