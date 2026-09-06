import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/leave_model.dart';
import '../../../providers/leave_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class ApplyLeaveScreen extends StatefulWidget {
  const ApplyLeaveScreen({super.key});

  @override
  State<ApplyLeaveScreen> createState() => _ApplyLeaveScreenState();
}

class _ApplyLeaveScreenState extends State<ApplyLeaveScreen> {
  LeaveType _selectedType = LeaveType.casual;
  DateTime _startDate = DateTime.now().add(const Duration(days: 2));
  DateTime _endDate = DateTime.now().add(const Duration(days: 2));
  bool _isHalfDay = false;
  final _reasonCtrl = TextEditingController();
  final _contactCtrl = TextEditingController(text: '+91 98201 12233');

  @override
  void dispose() {
    _reasonCtrl.dispose();
    _contactCtrl.dispose();
    super.dispose();
  }

  void _submitApplication() {
    final reason = _reasonCtrl.text.trim();
    if (reason.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a reason for leave.'), backgroundColor: AppColors.error));
      return;
    }

    final totalDays = _isHalfDay ? 1 : (_endDate.difference(_startDate).inDays + 1);
    final leaveProvider = context.read<LeaveProvider>();

    leaveProvider.applyLeave(
      leaveType: _selectedType,
      startDate: _startDate,
      endDate: _endDate,
      totalDays: totalDays <= 0 ? 1 : totalDays,
      isHalfDay: _isHalfDay,
      reason: reason,
      emergencyContact: _contactCtrl.text.trim(),
    );

    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Leave application submitted to ASM for approval!'), backgroundColor: AppColors.success),
    );
  }

  @override
  Widget build(BuildContext context) {
    final leaveProvider = context.watch<LeaveProvider>();
    final balanceItem = leaveProvider.balances[_selectedType];
    final totalDays = _isHalfDay ? 0.5 : (_endDate.difference(_startDate).inDays + 1).toDouble();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary), onPressed: () => Navigator.pop(context)),
        title: const Text('Apply for Leave', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Color(0xFF0F172A))),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          // Leave Type
          AppSectionCard(
            title: 'Leave Category & Balance',
            subtitle: 'Remaining balance: ${balanceItem?.availableBalance ?? 0} days',
            icon: Icons.beach_access_rounded,
            child: AppDropdownField<LeaveType>(
              label: 'Leave Type',
              value: _selectedType,
              items: LeaveType.values.map((t) => DropdownMenuItem(value: t, child: Text(t.displayName))).toList(),
              onChanged: (t) {
                if (t != null) setState(() => _selectedType = t);
              },
            ),
          ),

          // Duration & Dates
          AppSectionCard(
            title: 'Leave Dates & Duration',
            subtitle: 'Requested duration: $totalDays Days',
            icon: Icons.calendar_month_rounded,
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: AppDatePickerField(
                        label: 'Start Date',
                        selectedDate: _startDate,
                        onDateSelected: (d) => setState(() {
                          _startDate = d;
                          if (_endDate.isBefore(d)) _endDate = d;
                        }),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: AppDatePickerField(
                        label: 'End Date',
                        selectedDate: _endDate,
                        firstDate: _startDate,
                        onDateSelected: (d) => setState(() => _endDate = d),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                SwitchListTile(
                  dense: true,
                  title: const Text('Half Day Leave', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: const Text('Applicable for morning or afternoon session only', style: TextStyle(fontSize: 11)),
                  value: _isHalfDay,
                  activeThumbColor: AppColors.primary,
                  onChanged: (v) => setState(() => _isHalfDay = v),
                ),
              ],
            ),
          ),

          // Reason & Emergency Contact
          AppSectionCard(
            title: 'Justification & Emergency Contact',
            subtitle: 'Provide purpose of leave and reachable phone',
            icon: Icons.edit_note_rounded,
            child: Column(
              children: [
                AppTextField(controller: _reasonCtrl, label: 'Reason for Leave *', hint: 'e.g. Family medical emergency / Personal travel', maxLines: 3),
                const SizedBox(height: 10),
                AppTextField(controller: _contactCtrl, label: 'Emergency Contact Number', keyboardType: TextInputType.phone),
              ],
            ),
          ),

          // Submit
          ElevatedButton(
            onPressed: _submitApplication,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('SUBMIT LEAVE APPLICATION', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
