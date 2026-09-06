import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/doctor_provider.dart';
import '../../../models/doctor_model.dart';
import '../../../models/chemist_model.dart';
import '../../../models/stockist_model.dart';
import '../../../models/facility_model.dart';
import 'add_doctor_screen.dart';
import 'add_chemist_screen.dart';
import 'add_stockist_screen.dart';
import 'add_facility_screen.dart';
import '../dcr/universal_dcr_form_screen.dart';

class DirectoryHomeScreen extends StatefulWidget {
  const DirectoryHomeScreen({super.key});

  @override
  State<DirectoryHomeScreen> createState() => _DirectoryHomeScreenState();
}

class _DirectoryHomeScreenState extends State<DirectoryHomeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _showAddSelection(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 14),
              const Text('Add Master Record (MR Portal)', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
              const SizedBox(height: 14),
              ListTile(
                leading: const CircleAvatar(backgroundColor: Color(0xFFE3F2FD), child: Icon(Icons.person_add_rounded, color: Color(0xFF1E88E5))),
                title: const Text('Add Doctor', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                subtitle: const Text('Private & Government doctors, specialty, class & clinic', style: TextStyle(fontSize: 11.5)),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const AddDoctorScreen()));
                },
              ),
              ListTile(
                leading: const CircleAvatar(backgroundColor: Color(0xFFE8F5E9), child: Icon(Icons.local_pharmacy_rounded, color: Color(0xFF2E7D32))),
                title: const Text('Add Chemist / Retailer', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                subtitle: const Text('Retail pharmacy, drug license & mapped stockist', style: TextStyle(fontSize: 11.5)),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const AddChemistScreen()));
                },
              ),
              ListTile(
                leading: const CircleAvatar(backgroundColor: Color(0xFFF3E5F5), child: Icon(Icons.domain_rounded, color: Color(0xFF8E24AA))),
                title: const Text('Add Clinic, Hospital & Healthcare (Govt / Private)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                subtitle: const Text('Multi-specialty hospital, polyclinic, PHC, dispensary', style: TextStyle(fontSize: 11.5)),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const AddFacilityScreen()));
                },
              ),
              ListTile(
                leading: const CircleAvatar(backgroundColor: Color(0xFFE1F5FE), child: Icon(Icons.warehouse_rounded, color: Color(0xFF0288D1))),
                title: const Text('Add Stockist / Distributor', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                subtitle: const Text('Wholesale pharma depot & supply agency', style: TextStyle(fontSize: 11.5)),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const AddStockistScreen()));
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final doctorProvider = context.watch<DoctorProvider>();
    final doctors = doctorProvider.filteredDoctors;
    final chemists = doctorProvider.filteredChemists;
    final stockists = doctorProvider.filteredStockists;
    final facilities = doctorProvider.filteredFacilities;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Master Territory Directory', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline_rounded, color: Colors.white),
            tooltip: 'Add New Record',
            onPressed: () => _showAddSelection(context),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabAlignment: TabAlignment.start,
          indicatorColor: const Color(0xFF29B6F6),
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5),
          tabs: [
            Tab(text: 'Doctors (${doctors.length})'),
            Tab(text: 'Chemists (${chemists.length})'),
            Tab(text: 'Hospitals & Clinics (${facilities.length})'),
            Tab(text: 'Stockists (${stockists.length})'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddSelection(context),
        backgroundColor: const Color(0xFF1E88E5),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Master Entity', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search doctor, chemist, hospital, clinic or patch...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFF1E88E5)),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          doctorProvider.setSearchQuery('');
                        },
                      )
                    : null,
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
              ),
              onChanged: (val) => doctorProvider.setSearchQuery(val),
            ),
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. DOCTORS TAB
                _buildDoctorsList(context, doctors),

                // 2. CHEMISTS TAB
                _buildChemistsList(context, chemists),

                // 3. HOSPITALS & CLINICS TAB
                _buildFacilitiesList(context, facilities),

                // 4. STOCKISTS TAB
                _buildStockistsList(context, stockists),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 1. DOCTORS LIST
  Widget _buildDoctorsList(BuildContext context, List<DoctorModel> doctors) {
    final doctorProvider = context.watch<DoctorProvider>();
    final currentPractice = doctorProvider.selectedPracticeType;

    return Column(
      children: [
        // Practice Type Filter Chips (Hospital, Clinic, Pvt, Govt)
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: Row(
            children: [
              _buildPracticeFilterChip('All Doctors', 'All', currentPractice, doctorProvider),
              const SizedBox(width: 6),
              _buildPracticeFilterChip('🏥 Hospital Doctors', 'Hospital', currentPractice, doctorProvider),
              const SizedBox(width: 6),
              _buildPracticeFilterChip('🩺 Clinic Doctors', 'Clinic', currentPractice, doctorProvider),
              const SizedBox(width: 6),
              _buildPracticeFilterChip('🏢 Pvt Doctors', 'Pvt Doctor', currentPractice, doctorProvider),
              const SizedBox(width: 6),
              _buildPracticeFilterChip('🏛️ Govt Doctors', 'Govt Doctor', currentPractice, doctorProvider),
            ],
          ),
        ),
        Expanded(
          child: doctors.isEmpty
              ? const Center(child: Text('No doctors found for selected category.', style: TextStyle(color: Colors.grey)))
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                  itemCount: doctors.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 10),
                  itemBuilder: (ctx, idx) {
                    final doc = doctors[idx];
                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 22,
                                backgroundColor: const Color(0xFFE3F2FD),
                                child: const Icon(Icons.person, color: Color(0xFF1E88E5), size: 24),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(doc.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                                    Text('${doc.specialty} • ${doc.degree}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(color: const Color(0xFFE3F2FD), borderRadius: BorderRadius.circular(8)),
                                    child: Text(doc.doctorClass.shortCode, style: const TextStyle(color: Color(0xFF1E88E5), fontWeight: FontWeight.bold, fontSize: 11)),
                                  ),
                                  const SizedBox(height: 4),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(6)),
                                    child: Text(doc.practiceType.label, style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text('${doc.clinicName} • ${doc.patch}', style: const TextStyle(fontSize: 12, color: Color(0xFF475569))),
                          const Divider(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Edit Doctor Button (MR can Edit)
                  OutlinedButton.icon(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => AddDoctorScreen(initialDoctor: doc)));
                    },
                    icon: const Icon(Icons.edit_outlined, size: 15),
                    label: const Text('Edit Doctor', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                  // Call DCR Action
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => UniversalDcrFormScreen(
                            preselectedCategory: 'Doctor',
                            preselectedId: doc.id,
                            preselectedName: doc.name,
                            preselectedPatch: doc.patch,
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.add_task_rounded, size: 15),
                    label: const Text('DCR Visit', style: TextStyle(fontSize: 12)),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E88E5), foregroundColor: Colors.white),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    ),
  ),
],
);
}

  // 2. CHEMISTS LIST
  Widget _buildChemistsList(BuildContext context, List<ChemistModel> chemists) {
    if (chemists.isEmpty) {
      return const Center(child: Text('No chemists found.', style: TextStyle(color: Colors.grey)));
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
      itemCount: chemists.length,
      separatorBuilder: (context, index) => const SizedBox(height: 10),
      itemBuilder: (ctx, idx) {
        final chem = chemists[idx];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: const Color(0xFFE8F5E9),
                    child: const Icon(Icons.local_pharmacy, color: Color(0xFF2E7D32), size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(chem.shopName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                        Text('${chem.name} • ${chem.phone}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text('Patch: ${chem.patch} • Stockist: ${chem.mappedStockistName}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF475569))),
              const Divider(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Edit Chemist (MR can Edit)
                  OutlinedButton.icon(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => AddChemistScreen(initialChemist: chem)));
                    },
                    icon: const Icon(Icons.edit_outlined, size: 15),
                    label: const Text('Edit Chemist', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                  // Chemist DCR Call
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => UniversalDcrFormScreen(
                            preselectedCategory: 'Retailer (Chemist)',
                            preselectedId: chem.id,
                            preselectedName: chem.shopName,
                            preselectedPatch: chem.patch,
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.receipt_long_rounded, size: 15),
                    label: const Text('POB & DCR', style: TextStyle(fontSize: 12)),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981), foregroundColor: Colors.white),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  // 3. HOSPITALS & CLINICS LIST
  Widget _buildFacilitiesList(BuildContext context, List<FacilityModel> facilities) {
    if (facilities.isEmpty) {
      return const Center(child: Text('No hospitals or clinics found.', style: TextStyle(color: Colors.grey)));
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
      itemCount: facilities.length,
      separatorBuilder: (context, index) => const SizedBox(height: 10),
      itemBuilder: (ctx, idx) {
        final fac = facilities[idx];
        final isGovt = fac.sector == FacilitySector.government;

        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: isGovt ? const Color(0xFFFFF3E0) : const Color(0xFFF3E5F5),
                    child: Icon(
                      isGovt ? Icons.account_balance_rounded : Icons.local_hospital_rounded,
                      color: isGovt ? const Color(0xFFE65100) : const Color(0xFF8E24AA),
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(fac.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                        Text('${fac.category.label} • ${fac.sector.label}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isGovt ? const Color(0xFFFFF3E0) : const Color(0xFFF3E5F5),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      isGovt ? 'GOVT' : 'PVT',
                      style: TextStyle(
                        color: isGovt ? const Color(0xFFE65100) : const Color(0xFF8E24AA),
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text('${fac.contactPerson} (${fac.designation}) • ${fac.totalBeds} Beds', style: const TextStyle(fontSize: 11.5, color: Color(0xFF475569))),
              Text(fac.address, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
              const Divider(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Edit Hospital (MR can Edit)
                  OutlinedButton.icon(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => AddFacilityScreen(initialFacility: fac)));
                    },
                    icon: const Icon(Icons.edit_outlined, size: 15),
                    label: const Text('Edit Hospital', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                  // Institutional Call
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => UniversalDcrFormScreen(
                            preselectedCategory: 'Hospital (Govt/Pvt)',
                            preselectedId: fac.id,
                            preselectedName: fac.name,
                            preselectedPatch: fac.patch,
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.domain_verification_rounded, size: 15),
                    label: const Text('Institute Call', style: TextStyle(fontSize: 12)),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF8E24AA), foregroundColor: Colors.white),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  // 4. STOCKISTS LIST
  Widget _buildStockistsList(BuildContext context, List<StockistModel> stockists) {
    if (stockists.isEmpty) {
      return const Center(child: Text('No stockists found.', style: TextStyle(color: Colors.grey)));
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
      itemCount: stockists.length,
      separatorBuilder: (context, index) => const SizedBox(height: 10),
      itemBuilder: (ctx, idx) {
        final stk = stockists[idx];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: const Color(0xFFE1F5FE),
                    child: const Icon(Icons.warehouse, color: Color(0xFF0288D1), size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(stk.agencyName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                        Text('${stk.name} • ${stk.phone}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(stk.address, style: const TextStyle(fontSize: 11.5, color: Color(0xFF475569))),
              const Divider(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Edit Stockist (MR can Edit)
                  OutlinedButton.icon(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => AddStockistScreen(initialStockist: stk)));
                    },
                    icon: const Icon(Icons.edit_outlined, size: 15),
                    label: const Text('Edit Stockist', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => UniversalDcrFormScreen(
                            preselectedCategory: 'Stockist',
                            preselectedId: stk.id,
                            preselectedName: stk.agencyName,
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.inventory_2_rounded, size: 15),
                    label: const Text('DCR Order Visit', style: TextStyle(fontSize: 12)),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0288D1), foregroundColor: Colors.white),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPracticeFilterChip(String label, String value, String currentSelected, DoctorProvider provider) {
    final isSelected = currentSelected == value;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500)),
      selected: isSelected,
      selectedColor: const Color(0xFF1E88E5),
      backgroundColor: Colors.white,
      labelStyle: TextStyle(color: isSelected ? Colors.white : const Color(0xFF334155)),
      onSelected: (val) {
        if (val) provider.setPracticeTypeFilter(value);
      },
    );
  }
}
