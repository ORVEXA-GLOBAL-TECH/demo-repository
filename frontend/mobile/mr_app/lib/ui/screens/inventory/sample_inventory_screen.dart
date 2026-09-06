import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/sample_inventory_model.dart';
import '../../../providers/sample_provider.dart';
import '../../../providers/doctor_provider.dart';
import '../../widgets/app_section_card.dart';

class SampleInventoryScreen extends StatefulWidget {
  const SampleInventoryScreen({super.key});

  @override
  State<SampleInventoryScreen> createState() => _SampleInventoryScreenState();
}

class _SampleInventoryScreenState extends State<SampleInventoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showDistributeModal(BuildContext context, SampleProvider sampleProvider) {
    final doctorProvider = context.read<DoctorProvider>();
    final samples = sampleProvider.drugSamples;

    String selectedDocId = doctorProvider.doctors.first.id;
    String selectedDocName = doctorProvider.doctors.first.name;
    String selectedSpecialty = doctorProvider.doctors.first.specialty;
    String selectedClinic = doctorProvider.doctors.first.clinicName;

    String selectedSampleId = samples.first.id;
    final qtyCtrl = TextEditingController(text: '4');
    String selectedAckType = 'Doctor Digital Sign';
    final signCtrl = TextEditingController(text: 'Dr. ${doctorProvider.doctors.first.name} (Signed)');

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: const Row(
            children: [
              Icon(Icons.medical_services_rounded, color: AppColors.primary),
              SizedBox(width: 8),
              Text('Distribute Sample to Doctor', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Select Doctor:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: selectedDocId,
                  dropdownColor: Colors.white,
                  style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                  decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                  items: doctorProvider.doctors.map((d) => DropdownMenuItem(value: d.id, child: Text('${d.name} (${d.specialty})'))).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      final doc = doctorProvider.getDoctorById(val);
                      setModalState(() {
                        selectedDocId = val;
                        selectedDocName = doc?.name ?? '';
                        selectedSpecialty = doc?.specialty ?? '';
                        selectedClinic = doc?.clinicName ?? '';
                        signCtrl.text = 'Dr. $selectedDocName (Signed)';
                      });
                    }
                  },
                ),
                const SizedBox(height: 12),
                const Text('Select Medicine Sample:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: selectedSampleId,
                  dropdownColor: Colors.white,
                  style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                  decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                  items: samples.map((s) => DropdownMenuItem(value: s.id, child: Text('${s.itemName} (Bal: ${s.currentBalance})'))).toList(),
                  onChanged: (val) => val != null ? setModalState(() => selectedSampleId = val) : null,
                ),
                const SizedBox(height: 12),
                const Text('Quantity to Distribute (Strips):', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextField(
                  controller: qtyCtrl,
                  keyboardType: TextInputType.number,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                  decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                ),
                const SizedBox(height: 12),
                const Text('Doctor Acknowledgment Type:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: selectedAckType,
                  dropdownColor: Colors.white,
                  style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                  decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                  items: const [
                    DropdownMenuItem(value: 'Doctor Digital Sign', child: Text('✍️ Doctor Digital Signature')),
                    DropdownMenuItem(value: 'Stamp Verified', child: Text('🏥 Chamber Stamp Verified')),
                    DropdownMenuItem(value: 'OTP Verified', child: Text('📱 Doctor Mobile OTP Verified')),
                  ],
                  onChanged: (val) => val != null ? setModalState(() => selectedAckType = val) : null,
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: signCtrl,
                  style: const TextStyle(fontSize: 12.5, color: AppColors.primary, fontWeight: FontWeight.bold),
                  decoration: InputDecoration(
                    labelText: 'Doctor Acknowledgment Signature',
                    filled: true,
                    fillColor: const Color(0xFFF0FDF4),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                final qty = int.tryParse(qtyCtrl.text) ?? 2;
                sampleProvider.distributeSampleToDoctor(
                  sampleItemId: selectedSampleId,
                  doctorId: selectedDocId,
                  doctorName: selectedDocName,
                  doctorSpecialty: selectedSpecialty,
                  clinicName: selectedClinic,
                  quantity: qty,
                  ackType: selectedAckType,
                  signatureText: signCtrl.text,
                );
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Handed over $qty samples to Dr. $selectedDocName with acknowledgment!'), backgroundColor: AppColors.success),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
              child: const Text('Confirm Handover'),
            ),
          ],
        ),
      ),
    );
  }

  void _showRequestStockModal(BuildContext context, SampleProvider sampleProvider) {
    final samples = sampleProvider.drugSamples;
    String selectedSample = samples.first.itemName;
    final qtyCtrl = TextEditingController(text: '50');
    String priority = 'Normal';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: const Row(
            children: [
              Icon(Icons.add_shopping_cart_rounded, color: AppColors.primary),
              SizedBox(width: 8),
              Text('Request Sample Stock', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Select Medicine Sample:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: selectedSample,
                  dropdownColor: Colors.white,
                  style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                  decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                  items: samples.map((s) => DropdownMenuItem(value: s.itemName, child: Text(s.itemName))).toList(),
                  onChanged: (val) => val != null ? setModalState(() => selectedSample = val) : null,
                ),
                const SizedBox(height: 12),
                const Text('Quantity Needed (Strips):', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextField(
                  controller: qtyCtrl,
                  keyboardType: TextInputType.number,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                  decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                ),
                const SizedBox(height: 12),
                const Text('Urgency Priority:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Row(
                  children: ['Normal', 'Urgent'].map((p) {
                    final sel = priority == p;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(p),
                        selected: sel,
                        selectedColor: p == 'Urgent' ? AppColors.error : AppColors.primary,
                        backgroundColor: const Color(0xFFF1F5F9),
                        labelStyle: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: sel ? Colors.white : const Color(0xFF334155)),
                        onSelected: (s) => s ? setModalState(() => priority = p) : null,
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                final qty = int.tryParse(qtyCtrl.text) ?? 50;
                sampleProvider.submitStockRequest(sampleName: selectedSample, quantity: qty, priority: priority);
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Stock request for $qty units of $selectedSample submitted to ASM!'), backgroundColor: AppColors.success),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
              child: const Text('Submit Request'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final sampleProvider = context.watch<SampleProvider>();
    final bagCount = sampleProvider.totalBagStockCount;
    final distributedCount = sampleProvider.totalDistributedCount;
    final receivedCount = sampleProvider.totalReceivedCount;
    final nearExpiry = sampleProvider.nearExpiryItemsCount;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Sample & Product Inventory',
          style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_box_outlined, color: AppColors.primary),
            tooltip: 'Request Stock from HO',
            onPressed: () => _showRequestStockModal(context, sampleProvider),
          ),
        ],
      ),
      body: Column(
        children: [
          // Summary Banner
          Container(
            margin: const EdgeInsets.fromLTRB(16, 10, 16, 8),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF009CBF), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('PHYSICIAN SAMPLE BAG LEDGER', style: TextStyle(color: Colors.white70, fontSize: 10.5, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    if (nearExpiry > 0)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(color: Colors.amber.shade700, borderRadius: BorderRadius.circular(6)),
                        child: Text('$nearExpiry Near Expiry', style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('$bagCount Units', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800)),
                    const Text('Live Balance in Bag', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _kpiChip('RECEIVED MTD', '$receivedCount Pcs', Icons.inbox_rounded),
                    const SizedBox(width: 8),
                    _kpiChip('DISTRIBUTED', '$distributedCount Pcs', Icons.outbox_rounded),
                    const SizedBox(width: 8),
                    _kpiChip('SAMPLES', '${sampleProvider.drugSamples.length} Brands', Icons.medication_rounded),
                  ],
                ),
              ],
            ),
          ),

          // Tabs
          TabBar(
            controller: _tabController,
            isScrollable: true,
            labelColor: AppColors.primary,
            unselectedLabelColor: const Color(0xFF64748B),
            indicatorColor: AppColors.primary,
            labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
            tabs: const [
              Tab(text: '📦 Balance Stock'),
              Tab(text: '🩺 Doctor Distributed'),
              Tab(text: '📥 Inward Receipts'),
              Tab(text: '📝 Stock Requisition'),
            ],
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Balance Stock & Batch Expiry
                _buildBalanceStockList(sampleProvider),

                // 2. Doctor Distribution Log with Acks
                _buildDistributionList(sampleProvider),

                // 3. Inward Challans
                _buildInwardChallansList(sampleProvider),

                // 4. Stock Requests
                _buildStockRequestsList(sampleProvider),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'sample_fab',
        onPressed: () => _showDistributeModal(context, sampleProvider),
        icon: const Icon(Icons.handshake_outlined),
        label: const Text('Distribute to Doctor', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _kpiChip(String label, String val, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
        child: Column(
          children: [
            Icon(icon, size: 14, color: Colors.white70),
            const SizedBox(height: 2),
            Text(val, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11.5)),
            Text(label, style: const TextStyle(color: Colors.white60, fontSize: 8, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceStockList(SampleProvider provider) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Drug Samples Section
        const Text('Physician Drug Samples (Rx)', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        const SizedBox(height: 8),
        ...provider.drugSamples.map((item) => _sampleItemCard(item)),
        const SizedBox(height: 16),

        // Promotional Gifts Section
        const Text('Promotional Gifts & Inputs', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        const SizedBox(height: 8),
        ...provider.promoGifts.map((item) => _sampleItemCard(item)),
      ],
    );
  }

  Widget _sampleItemCard(SampleInventoryItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: item.isNearExpiry ? Colors.amber.shade300 : const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(item.itemName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: item.currentBalance > 10 ? AppColors.successContainer : Colors.amber.shade100,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'Bal: ${item.currentBalance} ${item.unit}',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: item.currentBalance > 10 ? AppColors.success : Colors.amber.shade900),
                ),
              ),
            ],
          ),
          Text(item.molecule, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
          const SizedBox(height: 8),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(5)),
                child: Text('Batch: ${item.batchNumber}', style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF334155))),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: item.isNearExpiry ? Colors.amber.shade100 : const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(5),
                ),
                child: Text(
                  item.isNearExpiry ? '⚠️ Exp: ${item.expiryDate} (Near Expiry)' : 'Exp: ${item.expiryDate}',
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: item.isNearExpiry ? Colors.amber.shade900 : Colors.green.shade800),
                ),
              ),
            ],
          ),
          const Divider(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Opening: ${item.openingBalance}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
              Text('Received: +${item.receivedQuantity}', style: const TextStyle(fontSize: 10.5, color: AppColors.success, fontWeight: FontWeight.bold)),
              Text('Distributed: -${item.distributedQuantity}', style: const TextStyle(fontSize: 10.5, color: AppColors.error, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDistributionList(SampleProvider provider) {
    final history = provider.distributionHistory;

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: history.length,
      itemBuilder: (ctx, idx) {
        final dist = history[idx];

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(dist.doctorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
                        Text('${dist.doctorSpecialty} • ${dist.clinicName}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: AppColors.primaryContainer, borderRadius: BorderRadius.circular(6)),
                    child: Text('${dist.quantityDistributed} Strips', style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: AppColors.primary)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text('Sample: ${dist.sampleName}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF334155))),
              Text('Batch: ${dist.batchNumber} • Exp: ${dist.expiryDate} • ${DateFormatter.formatDisplayDate(dist.distributionDate)}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.green.shade200)),
                child: Row(
                  children: [
                    const Icon(Icons.verified_rounded, size: 14, color: AppColors.success),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Doctor Ack: ${dist.doctorAckSign ?? "Verified"} (${dist.acknowledgmentType})',
                        style: TextStyle(fontSize: 11, color: Colors.green.shade900, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildInwardChallansList(SampleProvider provider) {
    final challans = provider.inwardChallans;

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: challans.length,
      itemBuilder: (ctx, idx) {
        final chl = challans[idx];

        return AppSectionCard(
          title: 'Challan #${chl.challanNumber}',
          subtitle: 'Received on ${DateFormatter.formatDisplayDate(chl.receivedDate)}',
          icon: Icons.inventory_2_rounded,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Sample: ${chl.sampleName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
              Text('Depot: ${chl.sourceDepot}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Batch: ${chl.batchNumber} • Exp: ${chl.expiryDate}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF334155))),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: AppColors.successContainer, borderRadius: BorderRadius.circular(6)),
                    child: Text('+${chl.quantityReceived} Units Stocked', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.success)),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStockRequestsList(SampleProvider provider) {
    final requests = provider.stockRequests;

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: requests.length,
      itemBuilder: (ctx, idx) {
        final req = requests[idx];

        return AppSectionCard(
          title: req.requestNumber,
          subtitle: 'Requested on ${DateFormatter.formatDisplayDate(req.requestDate)}',
          icon: Icons.outbox_rounded,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(req.sampleName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: req.priority == 'Urgent' ? AppColors.errorContainer : AppColors.primaryContainer, borderRadius: BorderRadius.circular(6)),
                    child: Text(req.priority.toUpperCase(), style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: req.priority == 'Urgent' ? AppColors.error : AppColors.primary)),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Quantity: ${req.quantityRequested} Units', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: req.status.contains('Received') ? AppColors.successContainer : AppColors.goldContainer,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(req.status, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: req.status.contains('Received') ? AppColors.success : AppColors.goldDark)),
                  ),
                ],
              ),
              if (req.asmRemarks != null) ...[
                const SizedBox(height: 6),
                Text('ASM Note: ${req.asmRemarks}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B), fontStyle: FontStyle.italic)),
              ],
            ],
          ),
        );
      },
    );
  }
}
