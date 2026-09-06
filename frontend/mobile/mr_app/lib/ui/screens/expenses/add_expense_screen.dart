import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/expense_model.dart';
import '../../../providers/expense_provider.dart';
import '../../widgets/receipt_photo_uploader.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class AddExpenseScreen extends StatefulWidget {
  /// Pass an existing rejected claim to enter edit/resubmit mode
  final DailyExpenseClaim? initialClaim;
  const AddExpenseScreen({super.key, this.initialClaim});

  @override
  State<AddExpenseScreen> createState() => _AddExpenseScreenState();
}

class _AddExpenseScreenState extends State<AddExpenseScreen> {
  late DateTime _expenseDate;
  late WorkPlaceType _workPlace;

  late TextEditingController _routeCtrl;
  late TextEditingController _kmCtrl;
  late TextEditingController _fuelCtrl;
  late TextEditingController _taxiCtrl;
  late TextEditingController _hotelCtrl;
  late TextEditingController _foodCtrl;
  late TextEditingController _trainCtrl;
  late TextEditingController _flightCtrl;
  late TextEditingController _miscTitleCtrl;
  late TextEditingController _miscAmountCtrl;

  final String _billPhotoName = 'Fuel_Toll_Receipt_984.jpg';

  bool get isEditing => widget.initialClaim != null;

  @override
  void initState() {
    super.initState();
    final c = widget.initialClaim;
    _expenseDate = c?.date ?? DateTime.now();
    _workPlace = c?.workPlaceType ?? WorkPlaceType.hq;
    _routeCtrl = TextEditingController(text: c?.routeCovered ?? 'Bandra West - Khar West - Linking Road');
    _kmCtrl = TextEditingController(text: (c?.travelDistanceKm ?? 32).toStringAsFixed(0));
    _fuelCtrl = TextEditingController(text: (c?.fuelAmount ?? 450).toStringAsFixed(0));
    _taxiCtrl = TextEditingController(text: (c?.taxiAmount ?? 0).toStringAsFixed(0));
    _hotelCtrl = TextEditingController(text: (c?.hotelLodging ?? 0).toStringAsFixed(0));
    _foodCtrl = TextEditingController(text: (c?.foodAmount ?? 180).toStringAsFixed(0));
    _trainCtrl = TextEditingController(text: (c?.trainAmount ?? 0).toStringAsFixed(0));
    _flightCtrl = TextEditingController(text: (c?.flightAmount ?? 0).toStringAsFixed(0));
    _miscTitleCtrl = TextEditingController(
      text: c?.miscExpenses.isNotEmpty == true ? c!.miscExpenses.first.title : 'Clinic Parking & Toll',
    );
    _miscAmountCtrl = TextEditingController(
      text: c?.miscExpenses.isNotEmpty == true ? c!.miscExpenses.first.amount.toStringAsFixed(0) : '80',
    );
  }

  @override
  void dispose() {
    _routeCtrl.dispose();
    _kmCtrl.dispose();
    _fuelCtrl.dispose();
    _taxiCtrl.dispose();
    _hotelCtrl.dispose();
    _foodCtrl.dispose();
    _trainCtrl.dispose();
    _flightCtrl.dispose();
    _miscTitleCtrl.dispose();
    _miscAmountCtrl.dispose();
    super.dispose();
  }

  double _getTravelAllowance(ExpenseProvider p) => (double.tryParse(_kmCtrl.text) ?? 0.0) * p.managerTaRatePerKm;
  double _getDailyAllowance(ExpenseProvider p) => p.getDaForWorkPlace(_workPlace);

  double get _fuel => double.tryParse(_fuelCtrl.text) ?? 0.0;
  double get _taxi => double.tryParse(_taxiCtrl.text) ?? 0.0;
  double get _hotel => double.tryParse(_hotelCtrl.text) ?? 0.0;
  double get _food => double.tryParse(_foodCtrl.text) ?? 0.0;
  double get _train => double.tryParse(_trainCtrl.text) ?? 0.0;
  double get _flight => double.tryParse(_flightCtrl.text) ?? 0.0;
  double get _misc => double.tryParse(_miscAmountCtrl.text) ?? 0.0;
  double get _totalEnteredBills => _fuel + _taxi + _hotel + _food + _train + _flight + _misc;
  double _getGrandTotal(ExpenseProvider p) => _getDailyAllowance(p) + _getTravelAllowance(p) + _totalEnteredBills;

  void _submitExpense(ExpenseProvider provider) {
    final km = double.tryParse(_kmCtrl.text) ?? 0.0;
    final miscList = <MiscExpenseItem>[];
    if (_misc > 0) {
      miscList.add(MiscExpenseItem(
        title: _miscTitleCtrl.text.trim().isNotEmpty ? _miscTitleCtrl.text.trim() : 'Misc Field Expense',
        amount: _misc,
        category: ExpenseCategory.misc,
      ));
    }

    final claimId = widget.initialClaim?.id ?? 'exp_${DateTime.now().millisecondsSinceEpoch}';

    final claim = DailyExpenseClaim(
      id: claimId,
      date: _expenseDate,
      workPlaceType: _workPlace,
      routeCovered: _routeCtrl.text.trim(),
      travelDistanceKm: km,
      ratePerKm: provider.managerTaRatePerKm,
      dailyAllowance: _getDailyAllowance(provider),
      fuelAmount: _fuel,
      taxiAmount: _taxi,
      hotelLodging: _hotel,
      foodAmount: _food,
      trainAmount: _train,
      flightAmount: _flight,
      miscExpenses: miscList,
      status: 'Submitted',
      submittedAt: DateTime.now(),
      billPhotoName: _billPhotoName,
    );

    if (isEditing) {
      provider.resubmitExpenseClaim(claim);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Expense claim of ${CurrencyFormatter.formatInr(_getGrandTotal(provider))} resubmitted for ASM approval!'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      provider.addExpenseClaim(claim);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Expense claim of ${CurrencyFormatter.formatInr(_getGrandTotal(provider))} submitted for ASM approval!'),
          backgroundColor: AppColors.success,
        ),
      );
    }
    Navigator.pop(context);
  }

  Widget _buildCategoryField(String label, String emoji, TextEditingController ctrl) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 34,
            height: 34,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(emoji, style: const TextStyle(fontSize: 16)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Color(0xFF0F172A)),
            ),
          ),
          SizedBox(
            width: 100,
            child: AppTextField(
              controller: ctrl,
              keyboardType: TextInputType.number,
              onChanged: (_) => setState(() {}),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false, Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: isTotal ? Colors.white : Colors.white70,
              fontSize: isTotal ? 14 : 12,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: valueColor ?? (isTotal ? AppColors.goldLight : Colors.white),
              fontSize: isTotal ? 18 : 13,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final expenseProvider = context.watch<ExpenseProvider>();
    final fixedDa = _getDailyAllowance(expenseProvider);
    final fixedTa = _getTravelAllowance(expenseProvider);
    final grandTotal = _getGrandTotal(expenseProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back to Expenses',
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              isEditing ? 'Edit & Resubmit Expense' : 'Add Daily Expense Claim',
              style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            Text(
              isEditing ? 'Revise rejected claim & resubmit for approval' : 'Fill details & submit for ASM approval',
              style: const TextStyle(fontSize: 11, color: Colors.white60),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Chip(
              backgroundColor: isEditing ? const Color(0xFFFEF3C7) : const Color(0xFFE0F2FE),
              avatar: Icon(
                isEditing ? Icons.edit_note_rounded : Icons.receipt_long_rounded,
                size: 16,
                color: isEditing ? const Color(0xFFB45309) : const Color(0xFF0369A1),
              ),
              label: Text(
                isEditing ? 'EDIT MODE' : 'NEW CLAIM',
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.bold,
                  color: isEditing ? const Color(0xFFB45309) : const Color(0xFF0369A1),
                ),
              ),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        children: [
          // Rejection notice banner (edit mode only)
          if (isEditing && widget.initialClaim!.isRejected) ...[
            Container(
              margin: const EdgeInsets.only(bottom: 14),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFF87171), width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626), size: 18),
                      SizedBox(width: 8),
                      Text(
                        'Rejected by ASM — Action Required',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFDC2626)),
                      ),
                    ],
                  ),
                  if (widget.initialClaim!.managerRemarks != null) ...[
                    const SizedBox(height: 6),
                    Text(
                      'Reason: "${widget.initialClaim!.managerRemarks}"',
                      style: const TextStyle(fontSize: 12, height: 1.4, color: Color(0xFF991B1B), fontWeight: FontWeight.w500),
                    ),
                  ],
                  const SizedBox(height: 4),
                  const Text(
                    'Please correct the details below and resubmit for approval.',
                    style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontStyle: FontStyle.italic),
                  ),
                ],
              ),
            ),
          ],

          // Policy Banner
          Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.goldContainer.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.gold.withValues(alpha: 0.4)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.lock_outline_rounded, color: AppColors.onGoldContainer, size: 18),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Policy: DA fixed at ${CurrencyFormatter.formatUsd(fixedDa)} (${_workPlace.label}) & TA at \$${expenseProvider.managerTaRatePerKm}/km.',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.onGoldContainer),
                  ),
                ),
              ],
            ),
          ),

          // 1. Date & Workplace
          AppSectionCard(
            title: '1. Claim Date & Station Type',
            subtitle: 'Fixed Daily Allowance (DA) is auto-calculated by station',
            icon: Icons.calendar_month_rounded,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppDatePickerField(
                  label: 'Claim Date',
                  selectedDate: _expenseDate,
                  onDateSelected: (d) => setState(() => _expenseDate = d),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Work Station Type',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: WorkPlaceType.values.map((wp) {
                    final sel = _workPlace == wp;
                    return ChoiceChip(
                      label: Text(
                        wp.label,
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: sel ? FontWeight.bold : FontWeight.normal,
                          color: sel ? Colors.white : const Color(0xFF0F172A),
                        ),
                      ),
                      selected: sel,
                      selectedColor: AppColors.primary,
                      backgroundColor: const Color(0xFFF1F5F9),
                      onSelected: (v) {
                        if (v) setState(() => _workPlace = wp);
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),

          // 2. Route & Distance
          AppSectionCard(
            title: '2. Route Covered & Travel Distance',
            subtitle: 'Calculated TA: ${CurrencyFormatter.formatUsd(fixedTa)}',
            icon: Icons.directions_car_rounded,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppTextField(
                  controller: _routeCtrl,
                  label: 'Route Covered',
                  hint: 'e.g. Monivong - Daun Penh - Toul Kork',
                ),
                const SizedBox(height: 12),
                AppTextField(
                  controller: _kmCtrl,
                  label: 'Total Distance Traveled (KM)',
                  keyboardType: TextInputType.number,
                  onChanged: (_) => setState(() {}),
                ),
              ],
            ),
          ),

          // 3. Bills & Reimbursements
          AppSectionCard(
            title: '3. Actual Field Bills & Lodging',
            subtitle: 'Enter receipt amounts for reimbursement',
            icon: Icons.receipt_long_rounded,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildCategoryField('Fuel / Petrol (₹)', '⛽', _fuelCtrl),
                _buildCategoryField('Taxi / Auto (₹)', '🚕', _taxiCtrl),
                _buildCategoryField('Food / Lunch (₹)', '🍲', _foodCtrl),
                _buildCategoryField('Hotel / Lodging (₹)', '🏨', _hotelCtrl),
                _buildCategoryField('Train / Bus (₹)', '🚆', _trainCtrl),
                _buildCategoryField('Flight (₹)', '✈️', _flightCtrl),
                const Divider(height: 20),
                AppTextField(
                  controller: _miscTitleCtrl,
                  label: 'Misc Expense Note',
                  hint: 'e.g. Parking, toll',
                ),
                const SizedBox(height: 8),
                AppTextField(
                  controller: _miscAmountCtrl,
                  label: 'Misc Amount (₹)',
                  keyboardType: TextInputType.number,
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 14),
                const ReceiptPhotoUploader(title: 'Upload Bill Receipts / Invoices (Optional)'),
              ],
            ),
          ),

          // Grand Total Summary Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0B172E),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'CLAIM SUMMARY',
                  style: TextStyle(color: Colors.white54, fontSize: 10.5, fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
                const SizedBox(height: 10),
                _buildSummaryRow('Daily Allowance (DA)', CurrencyFormatter.formatInr(fixedDa)),
                _buildSummaryRow('Travel Allowance (TA)', CurrencyFormatter.formatInr(fixedTa)),
                _buildSummaryRow('Actual Bills Total', CurrencyFormatter.formatInr(_totalEnteredBills)),
                const Divider(color: Colors.white24, height: 18),
                _buildSummaryRow(
                  'Total Claim Amount',
                  CurrencyFormatter.formatInr(grandTotal),
                  isTotal: true,
                  valueColor: AppColors.goldLight,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.of(context).pop(),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.white70,
                          side: const BorderSide(color: Colors.white30),
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text('CANCEL', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: () => _submitExpense(expenseProvider),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isEditing ? const Color(0xFF0288D1) : AppColors.success,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: Text(
                          isEditing ? 'SAVE & RESUBMIT' : 'SUBMIT TO MANAGER',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),
        ],
      ),
    );
  }
}
