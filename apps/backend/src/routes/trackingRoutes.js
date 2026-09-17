import { Router } from 'express';
import { fieldTrackingPings, attendanceRecords } from '../data/mockStore.js';

const router = Router();

// GET /api/tracking
router.get('/', (req, res) => {
  res.json({
    success: true,
    activeFieldOfficers: [
      {
        id: 'usr-004',
        name: 'Amit Verma',
        role: 'MR',
        territory: 'South Delhi',
        status: 'IN_FIELD',
        battery: '74%',
        lastPingTime: '03:45 PM',
        currentLocation: 'Hauz Khas Outer Ring Road',
        lat: 28.5494,
        lng: 77.2001,
        todayCalls: 2,
        todayPob: '₹30,900',
        pings: fieldTrackingPings
      }
    ]
  });
});

export default router;
