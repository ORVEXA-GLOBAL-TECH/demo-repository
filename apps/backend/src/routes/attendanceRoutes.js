import { Router } from 'express';
import { attendanceRecords, leaveBalances } from '../data/mockStore.js';

const router = Router();

// GET /api/attendance
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: attendanceRecords,
    leaves: leaveBalances[0]
  });
});

// POST /api/attendance/punch-in
router.post('/punch-in', (req, res) => {
  const { locationName = 'Saket Sector 4 (28.5284, 77.2185)', mrName = 'Amit Verma', mrId = 'usr-004' } = req.body;
  const newRecord = {
    id: `att-${Date.now()}`,
    mrId,
    mrName,
    date: new Date().toISOString().split('T')[0],
    punchInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    punchOutTime: null,
    punchInLocation: locationName,
    punchOutLocation: null,
    totalHours: 0,
    status: 'PRESENT_FIELD',
    callsCompleted: 0,
    pobBooked: 0
  };
  attendanceRecords.unshift(newRecord);
  res.status(201).json({ success: true, message: 'Punch-in successful', data: newRecord });
});

// POST /api/attendance/punch-out
router.post('/punch-out', (req, res) => {
  const record = attendanceRecords[0];
  if (record && !record.punchOutTime) {
    record.punchOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    record.punchOutLocation = req.body.locationName || 'Saket Field HQ';
    record.totalHours = 8.5;
  }
  res.json({ success: true, message: 'Punch-out recorded', data: record });
});

// POST /api/attendance/leave-request
router.post('/leave-request', (req, res) => {
  const { leaveType, fromDate, toDate, reason } = req.body;
  const newLeave = {
    id: `leave-${Date.now()}`,
    leaveType,
    fromDate,
    toDate,
    reason,
    status: 'PENDING_APPROVAL',
    appliedOn: new Date().toISOString().split('T')[0]
  };
  leaveBalances[0].pendingLeaves.unshift(newLeave);
  res.status(201).json({ success: true, message: 'Leave application submitted', data: newLeave });
});

export default router;
