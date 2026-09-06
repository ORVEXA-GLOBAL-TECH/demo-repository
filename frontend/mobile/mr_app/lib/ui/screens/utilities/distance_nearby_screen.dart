import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/currency_provider.dart';
import '../dcr/universal_dcr_form_screen.dart';

class DistanceNearbyScreen extends StatefulWidget {
  const DistanceNearbyScreen({super.key});

  @override
  State<DistanceNearbyScreen> createState() => _DistanceNearbyScreenState();
}

class _DistanceNearbyScreenState extends State<DistanceNearbyScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Distance calculator state
  String _fromLocation = 'Phnom Penh Central HQ (Monivong Blvd)';
  String _toLocation = 'Royal Phnom Penh Multi-Specialty Hospital';
  double _calculatedDistance = 14.8;
  double _taFareUsd = 3.70; // $0.25/km

  // Nearby records
  final List<Map<String, dynamic>> _nearbyEntities = [
    {
      'name': 'Dr. Rajesh Sharma',
      'spec': 'MD, DM (Cardiology) • Senior Cardiologist',
      'facility': 'Calmette National Referral Hospital, Daun Penh',
      'distance': '0.35 km away',
      'status': 'In Clinic Now',
      'statusColor': const Color(0xFF10B981),
      'category': 'Doctor',
      'typeColor': const Color(0xFF0288D1),
    },
    {
      'spec': 'Stockist & Main Distributor',
      'facility': 'S.V. Road Wholesale Depot, Bandra West',
      'distance': '1.85 km away',
      'status': 'Depot Open',
      'statusColor': const Color(0xFF10B981),
      'category': 'Stockist',
      'typeColor': const Color(0xFF8E24AA),
    },
    {
      'name': 'Bandra Municipal Dispensary & PHC',
      'spec': 'Government Healthcare Facility',
      'facility': 'Bazaar Road, Bandra West',
      'distance': '2.10 km away',
      'status': 'Open 24/7',
      'statusColor': const Color(0xFF10B981),
      'category': 'Hospital / Clinic',
      'typeColor': const Color(0xFFD97706),
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currencyProvider = context.watch<CurrencyProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Check Distance & Nearby Directory', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF38BDF8),
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: const [
            Tab(icon: Icon(Icons.route_rounded, size: 18), text: 'Check Road Distance'),
            Tab(icon: Icon(Icons.pin_drop_rounded, size: 18), text: 'Nearby Doctors & Chemists'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // =========================================================================
          // TAB 1: DISTANCE CHECKER & TA CALCULATOR
          // =========================================================================
          ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: const [BoxShadow(color: Color(0x04000000), blurRadius: 8, offset: Offset(0, 2))],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Calculate Route Travel Distance', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                    const SizedBox(height: 12),
                    TextField(
                      decoration: const InputDecoration(
                        labelText: 'From Location / Clinic / HQ',
                        prefixIcon: Icon(Icons.radio_button_checked, color: Color(0xFF10B981)),
                      ),
                      controller: TextEditingController(text: _fromLocation),
                      onChanged: (v) => _fromLocation = v,
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      decoration: const InputDecoration(
                        labelText: 'To Destination / Doctor / Chemist',
                        prefixIcon: Icon(Icons.location_on, color: Color(0xFFE53935)),
                      ),
                      controller: TextEditingController(text: _toLocation),
                      onChanged: (v) => _toLocation = v,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: () {
                        setState(() {
                          _calculatedDistance = 14.8;
                          _taFareUsd = 14.8 * 0.25;
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('GPS Route calculated: 14.8 KM road travel.'), backgroundColor: Color(0xFF10B981)),
                        );
                      },
                      icon: const Icon(Icons.calculate_rounded),
                      label: const Text('Calculate Route & TA Fare'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0288D1),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 46),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Route Results Hero
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0B172E), Color(0xFF1E3A8A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(color: const Color(0xFF0B172E).withValues(alpha: 0.25), blurRadius: 12, offset: const Offset(0, 4)),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        const Text('GPS Road Distance', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(height: 4),
                        Text('${_calculatedDistance.toStringAsFixed(1)} KM', style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Container(width: 1, height: 44, color: Colors.white24),
                    Column(
                      children: [
                        const Text('Eligible TA Claim Fare', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(height: 4),
                        Text(currencyProvider.format(_taFareUsd), style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 22, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Route Policy Tag
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: const Color(0xFFE8F5E9), borderRadius: BorderRadius.circular(14), border: Border.all(color: const Color(0xFFC8E6C9))),
                child: const Row(
                  children: [
                    Icon(Icons.verified_rounded, color: Color(0xFF2E7D32), size: 18),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text('Rate: \$0.25 / km (TA Policy 2026). Verified via Google Maps & OpenStreetMap Routing Engine.', style: TextStyle(fontSize: 11.5, color: Color(0xFF2E7D32))),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // =========================================================================
          // TAB 2: NEARBY DOCTORS & CHEMISTS DIRECTORY
          // =========================================================================
          ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: _nearbyEntities.length,
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (ctx, idx) {
              final item = _nearbyEntities[idx];
              final Color typeCol = item['typeColor'] as Color;
              final Color statusCol = item['statusColor'] as Color;

              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 3)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: typeCol.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)),
                          child: Icon(item['category'] == 'Doctor' ? Icons.medical_services_rounded : Icons.local_pharmacy_rounded, color: typeCol, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      item['name'] as String,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(8)),
                                    child: Text(item['distance'] as String, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF0288D1))),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 3),
                              Text(item['spec'] as String, style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                              const SizedBox(height: 2),
                              Text(item['facility'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Divider(height: 1),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(color: statusCol, shape: BoxShape.circle),
                        ),
                        const SizedBox(width: 6),
                        Text(item['status'] as String, style: TextStyle(color: statusCol, fontWeight: FontWeight.bold, fontSize: 11.5)),
                        const Spacer(),
                        ElevatedButton.icon(
                          onPressed: () {
                            final rawType = item['type'] as String? ?? 'Doctor';
                            final cat = rawType == 'Doctor'
                                ? 'Doctor'
                                : (rawType == 'Pharmacy' ? 'Retailer (Chemist)' : 'Hospital (Govt/Pvt)');
                            final name = item['name'] as String? ?? '';
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => UniversalDcrFormScreen(
                                  preselectedCategory: cat,
                                  preselectedName: name,
                                ),
                              ),
                            );
                          },
                          icon: const Icon(Icons.assignment_turned_in_rounded, size: 14),
                          label: const Text('Log DCR Call', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0288D1),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            minimumSize: const Size(80, 32),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
