import { Router } from 'express';
import { attendanceRecords, leaveBalances } from '../data/mockStore.js';
import { requireLogin, requirePermission, ownOnly } from '../middleware/rbac.js';
import { dual } from '../data/repo.js';
import * as repo from '../data/fieldRepo.js';

const router = Router();

// GET /api/attendance
router.get('/', requireLogin, (req, res) => dual(req, res, {
  db: async (ctx) => {
    const [data, leaves] = await Promise.all([repo.listAttendance(ctx), repo.leaveSummary(ctx)]);
    return { body: { success: true, data, leaves } };
  },
  mock: () => ({ body: { success: true, data: ownOnly(req, attendanceRecords), leaves: leaveBalances[0] } })
}));

// POST /api/attendance/punch-in
router.post('/punch-in', requirePermission('attendance.create'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.punchIn(ctx, req.body);
    return { status: 201, body: { success: true, message: 'Punch-in successful', data } };
  },
  mock: () => {
    const { locationName = 'Saket Sector 4 (28.5284, 77.2185)', mrName = 'Amit Verma', mrId = 'usr-004' } = req.body;
    const newRecord = {
      id: `att-${Date.now()}`, mrId, mrName,
      date: new Date().toISOString().split('T')[0],
      punchInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      punchOutTime: null, punchInLocation: locationName, punchOutLocation: null,
      totalHours: 0, status: 'PRESENT_FIELD', callsCompleted: 0, pobBooked: 0
    };
    attendanceRecords.unshift(newRecord);
    return { status: 201, body: { success: true, message: 'Punch-in successful', data: newRecord } };
  }
}));

// POST /api/attendance/punch-out
router.post('/punch-out', requirePermission('attendance.create'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.punchOut(ctx, req.body);
    return data
      ? { body: { success: true, message: 'Punch-out recorded', data } }
      : { status: 409, body: { success: false, message: 'No open punch-in found for today' } };
  },
  mock: () => {
    const record = attendanceRecords[0];
    if (record && !record.punchOutTime) {
      record.punchOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      record.punchOutLocation = req.body.locationName || 'Saket Field HQ';
      record.totalHours = 8.5;
    }
    return { body: { success: true, message: 'Punch-out recorded', data: record } };
  }
}));

// POST /api/attendance/leave-request
router.post('/leave-request', requirePermission('leave.create'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.createLeaveRequest(ctx, req.body);
    return { status: 201, body: { success: true, message: 'Leave application submitted', data } };
  },
  mock: () => {
    const { leaveType, fromDate, toDate, reason } = req.body;
    const newLeave = {
      id: `leave-${Date.now()}`, leaveType, fromDate, toDate, reason,
      status: 'PENDING_APPROVAL', appliedOn: new Date().toISOString().split('T')[0]
    };
    leaveBalances[0].pendingLeaves.unshift(newLeave);
    return { status: 201, body: { success: true, message: 'Leave application submitted', data: newLeave } };
  }
}));

export default router;
