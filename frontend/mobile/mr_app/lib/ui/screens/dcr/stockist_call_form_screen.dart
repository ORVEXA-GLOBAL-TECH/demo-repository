import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/stockist_model.dart';
import '../../../models/dcr_model.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/dcr_provider.dart';
import '../../widgets/receipt_photo_uploader.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/app_form_helpers.dart';

class StockistCallFormScreen extends StatefulWidget {
  final StockistModel? selectedStockist;
  const StockistCallFormScreen({super.key, this.selectedStockist});

  @override
  State<StockistCallFormScreen> createState() => _StockistCallFormScreenState();
}

class _StockistCallFormScreenState extends State<StockistCallFormScreen> {
  final _formKey = GlobalKey<FormState>();
  StockistModel? _currentStockist;
  final _orderController = TextEditingController(text: '45000');
  final _paymentController = TextEditingController(text: '30000');
  final _remarksController = TextEditingController(
    text: 'Stock audit completed. Reviewed inventory days for CardioVasc-AM and GlycoSmart-D10.',
  );

  @override
  void initState() {
    super.initState();
    _currentStockist = widget.selectedStockist;
  }

  @override
  void dispose() {
    _orderController.dispose();
    _paymentController.dispose();
    _remarksController.dispose();
    super.dispose();
  }

  void _submitStockistCall() {
    if (_currentStockist == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select a distributor/stockist.'), backgroundColor: AppColors.error));
      return;
    }
    final dcrProvider = context.read<DcrProvider>();
    final order = double.tryParse(_orderController.text) ?? 0.0;
    final payment = double.tryParse(_paymentController.text) ?? 0.0;

    final call = StockistCallReport(
      id: 'stk_call_${DateTime.now().millisecondsSinceEpoch}',
      stockistId: _currentStockist!.id,
      agencyName: _currentStockist!.agencyName,
      contactPerson: _currentStockist!.name,
      callTime: DateTime.now(),
      orderValue: order,
      paymentCollected: payment,
      remarks: _remarksController.text.trim(),
    );

    dcrProvider.addStockistCall(call);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Stockist DCR Logged for ${_currentStockist!.agencyName} (${CurrencyFormatter.formatInr(order)})!'), backgroundColor: AppColors.success),
    );
    Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    final doctorProvider = context.watch<DoctorProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary), onPressed: () => Navigator.pop(context)),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Execute Stockist DCR', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
            Text(_currentStockist?.agencyName ?? 'Distributor Orders & Collections', style: const TextStyle(fontSize: 11.5, color: AppColors.primary, fontWeight: FontWeight.w600)),
          ],
        ),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 12),
            child: Chip(
              avatar: Icon(Icons.gps_fixed, size: 13, color: AppColors.success),
              label: Text('GPS Verified', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppColors.success)),
              backgroundColor: AppColors.successContainer,
              side: BorderSide.none,
            ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            // Stockist Selector
            AppSectionCard(
              title: 'Stockist / Wholesaler Agency',
              subtitle: 'Select distributor account for stock audit and ledger settlement',
              icon: Icons.account_balance_outlined,
              child: AppDropdownField<String>(
                label: 'Distributor Agency',
                value: _currentStockist?.id,
                items: doctorProvider.stockists.map((s) => DropdownMenuItem(value: s.id, child: Text(s.agencyName))).toList(),
                onChanged: (id) {
                  if (id != null) setState(() => _currentStockist = doctorProvider.getStockistById(id));
                },
              ),
            ),

            // Order & Payment
            AppSectionCard(
              title: 'Commercial Bookings & Payment',
              subtitle: 'Capture primary purchase orders and outstanding recovery collection',
              icon: Icons.payments_outlined,
              child: Column(
                children: [
                  AppTextField(
                    controller: _orderController,
                    label: 'Primary Order Booked (\$)',
                    keyboardType: TextInputType.number,
                    prefixIcon: Icons.attach_money_rounded,
                  ),
                  const SizedBox(height: 12),
                  AppTextField(
                    controller: _paymentController,
                    label: 'Payment Collected / Cheque (\$)',
                    keyboardType: TextInputType.number,
                    prefixIcon: Icons.receipt_long_rounded,
                  ),
                ],
              ),
            ),

            // Audit Remarks
            AppSectionCard(
              title: 'Inventory Audit & Remarks',
              subtitle: 'Record stock inventory status, expiry claims, or distributor feedback',
              icon: Icons.note_alt_outlined,
              child: Column(
                children: [
                  AppTextField(
                    controller: _remarksController,
                    label: 'Stockist Remarks & Notes',
                    maxLines: 3,
                  ),
                  const SizedBox(height: 12),
                  const ReceiptPhotoUploader(title: 'Cheque / Stock Ledger Snapshot (Optional)'),
                ],
              ),
            ),

            // Submit Button
            ElevatedButton(
              onPressed: _submitStockistCall,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('SUBMIT STOCKIST CALL REPORT', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 0.5)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
