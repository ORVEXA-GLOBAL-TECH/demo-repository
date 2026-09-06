import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/return_model.dart';
import '../../../models/product_model.dart';
import '../../../providers/return_provider.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/product_provider.dart';
import '../../widgets/app_section_card.dart';

class AddReturnScreen extends StatefulWidget {
  const AddReturnScreen({super.key});

  @override
  State<AddReturnScreen> createState() => _AddReturnScreenState();
}

class _AddReturnScreenState extends State<AddReturnScreen> {
  final _formKey = GlobalKey<FormState>();

  ReturnEntityType _entityType = ReturnEntityType.chemist;
  String _selectedPartyName = '';
  String _selectedPatch = 'Central Hospital Zone Hub';
  String _selectedEntityId = '';

  ProductModel? _selectedProduct;
  final _customProductCtrl = TextEditingController();

  final _batchCtrl = TextEditingController(text: 'ALV-2025-B92');
  final _expiryCtrl = TextEditingController(text: '09/2026');
  final _qtyCtrl = TextEditingController(text: '10');
  final _unitPriceCtrl = TextEditingController(text: '220');
  final _reasonDescCtrl = TextEditingController(text: 'Near-expiry stock with under 60 days remaining.');
  final _photoNameCtrl = TextEditingController(text: 'Pharmacy_Return_Bill_092.jpg');

  String _selectedUnit = 'Strips';
  ReturnReason _selectedReason = ReturnReason.nearExpiry;
  ReturnSettlement _settlementPreference = ReturnSettlement.creditNote;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final docProv = context.read<DoctorProvider>();
      final prodProv = context.read<ProductProvider>();

      if (prodProv.products.isNotEmpty) {
        setState(() {
          _selectedProduct = prodProv.products.first;
          _unitPriceCtrl.text = _selectedProduct!.ptr.toInt().toString();
        });
      }
      _syncDefaultParty(docProv);
    });
  }

  void _syncDefaultParty(DoctorProvider docProv) {
    switch (_entityType) {
      case ReturnEntityType.chemist:
        if (docProv.chemists.isNotEmpty) {
          _selectedPartyName = docProv.chemists.first.shopName;
          _selectedEntityId = docProv.chemists.first.id;
          _selectedPatch = docProv.chemists.first.patch;
        } else {
          _selectedPartyName = 'Apollo Pharmacy Bandra';
          _selectedEntityId = 'chem_1';
        }
        break;
      case ReturnEntityType.stockist:
        if (docProv.stockists.isNotEmpty) {
          _selectedPartyName = docProv.stockists.first.agencyName;
          _selectedEntityId = docProv.stockists.first.id;
          _selectedPatch = 'Industrial Sector 4 Depot';
        } else {
          _selectedPartyName = 'Metro Pharma Distributors';
          _selectedEntityId = 'stk_1';
        }
        break;
      case ReturnEntityType.hospitalClinic:
        if (docProv.facilities.isNotEmpty) {
          _selectedPartyName = docProv.facilities.first.name;
          _selectedEntityId = docProv.facilities.first.id;
          _selectedPatch = docProv.facilities.first.patch;
        } else {
          _selectedPartyName = 'Lilavati Hospital & Research Centre';
          _selectedEntityId = 'fac_1';
        }
        break;
      case ReturnEntityType.doctor:
        if (docProv.doctors.isNotEmpty) {
          _selectedPartyName = docProv.doctors.first.name;
          _selectedEntityId = docProv.doctors.first.id;
          _selectedPatch = docProv.doctors.first.patch;
        } else {
          _selectedPartyName = 'Dr. Rohan Deshmukh (Cardiologist)';
          _selectedEntityId = 'doc_1';
        }
        break;
    }
  }

  @override
  void dispose() {
    _customProductCtrl.dispose();
    _batchCtrl.dispose();
    _expiryCtrl.dispose();
    _qtyCtrl.dispose();
    _unitPriceCtrl.dispose();
    _reasonDescCtrl.dispose();
    _photoNameCtrl.dispose();
    super.dispose();
  }

  int get _qty => int.tryParse(_qtyCtrl.text) ?? 0;
  double get _unitPrice => _entityType == ReturnEntityType.doctor ? 0.0 : (double.tryParse(_unitPriceCtrl.text) ?? 0.0);
  double get _totalValue => _qty * _unitPrice;

  void _submitReturn() {
    if (!_formKey.currentState!.validate()) return;

    final productName = _selectedProduct != null ? _selectedProduct!.brandName : (_customProductCtrl.text.trim().isNotEmpty ? _customProductCtrl.text.trim() : 'Alleviare Pharma Product');
    final productId = _selectedProduct?.id ?? 'custom_p';

    final newReturn = ReturnClaimModel(
      id: 'RET-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
      date: DateTime.now(),
      entityType: _entityType,
      entityId: _selectedEntityId,
      entityName: _selectedPartyName,
      patch: _selectedPatch,
      isSampleReturn: _entityType == ReturnEntityType.doctor,
      productId: productId,
      productName: productName,
      batchNumber: _batchCtrl.text.trim().toUpperCase(),
      expiryDate: _expiryCtrl.text.trim(),
      quantity: _qty > 0 ? _qty : 1,
      unit: _selectedUnit,
      unitPrice: _unitPrice,
      reason: _selectedReason,
      reasonDescription: _reasonDescCtrl.text.trim(),
      settlementPreference: _settlementPreference,
      status: 'Submitted',
      managerRemarks: 'New return request logged by MR. Pending Area Sales Manager review.',
      billPhotoName: _photoNameCtrl.text.trim(),
    );

    context.read<ReturnProvider>().addReturnClaim(newReturn);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Colors.white),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Return claim ${newReturn.id} for $_selectedPartyName submitted successfully!',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF10B981),
        duration: const Duration(seconds: 3),
      ),
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final docProv = context.watch<DoctorProvider>();
    final prodProv = context.watch<ProductProvider>();

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
          'Log Return Claim',
          style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // 1. Source Entity Type Section
            AppSectionCard(
              title: 'Return Source & Party',
              subtitle: 'Select Chemist, Stockist, Clinic or Doctor Sample',
              icon: Icons.store_rounded,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: ReturnEntityType.values.map((type) {
                      final sel = _entityType == type;
                      return ChoiceChip(
                        label: Text('${type.iconEmoji} ${type.label}'),
                        selected: sel,
                        selectedColor: const Color(0xFF0B172E),
                        backgroundColor: const Color(0xFFF1F5F9),
                        labelStyle: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.bold,
                          color: sel ? Colors.white : const Color(0xFF334155),
                        ),
                        onSelected: (s) {
                          if (s) {
                            setState(() {
                              _entityType = type;
                              if (type == ReturnEntityType.doctor) {
                                _selectedReason = ReturnReason.doctorSampleRecall;
                                _selectedUnit = 'Sample Packs';
                              } else if (_selectedReason == ReturnReason.doctorSampleRecall) {
                                _selectedReason = ReturnReason.nearExpiry;
                                _selectedUnit = 'Strips';
                              }
                              _syncDefaultParty(docProv);
                            });
                          }
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 14),

                  // Select Specific Party Dropdown
                  Text('Select Party / Account Name', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                  const SizedBox(height: 6),
                  _buildPartyDropdown(docProv),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // 2. Product & Batch Details
            AppSectionCard(
              title: 'Product & Batch Information',
              subtitle: 'Select brand, batch number, and expiry date',
              icon: Icons.medication_liquid_rounded,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Product Brand', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<ProductModel>(
                    initialValue: _selectedProduct,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                    items: prodProv.products.map((p) {
                      return DropdownMenuItem<ProductModel>(
                        value: p,
                        child: Text('${p.brandName} (${p.therapeuticCategory})', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      );
                    }).toList(),
                    onChanged: (p) {
                      if (p != null) {
                        setState(() {
                          _selectedProduct = p;
                          if (_entityType != ReturnEntityType.doctor) {
                            _unitPriceCtrl.text = p.ptr.toInt().toString();
                          }
                        });
                      }
                    },
                  ),
                  const SizedBox(height: 12),

                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Batch Number', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: _batchCtrl,
                              textCapitalization: TextCapitalization.characters,
                              validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                              decoration: InputDecoration(
                                hintText: 'e.g. CS-2025-B10',
                                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Expiry Date (MM/YYYY)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: _expiryCtrl,
                              validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                              decoration: InputDecoration(
                                hintText: 'e.g. 10/2026',
                                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Quantity and Unit
                  Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Return Quantity', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: _qtyCtrl,
                              keyboardType: TextInputType.number,
                              validator: (v) => (int.tryParse(v ?? '') ?? 0) <= 0 ? 'Enter valid qty' : null,
                              onChanged: (_) => setState(() {}),
                              decoration: InputDecoration(
                                hintText: 'e.g. 20',
                                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        flex: 2,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Unit', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                            const SizedBox(height: 6),
                            DropdownButtonFormField<String>(
                              initialValue: _selectedUnit,
                              decoration: InputDecoration(
                                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                              ),
                              items: ['Strips', 'Bottles', 'Inhalers', 'Vials', 'Packs', 'Sample Packs'].map((u) {
                                return DropdownMenuItem<String>(value: u, child: Text(u, style: const TextStyle(fontSize: 13)));
                              }).toList(),
                              onChanged: (u) {
                                if (u != null) setState(() => _selectedUnit = u);
                              },
                            ),
                          ],
                        ),
                      ),
                      if (_entityType != ReturnEntityType.doctor) ...[
                        const SizedBox(width: 10),
                        Expanded(
                          flex: 2,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Unit Price (\$)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                              const SizedBox(height: 6),
                              TextFormField(
                                controller: _unitPriceCtrl,
                                keyboardType: TextInputType.number,
                                onChanged: (_) => setState(() {}),
                                decoration: InputDecoration(
                                  prefixText: '\$ ',
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                  filled: true,
                                  fillColor: const Color(0xFFF8FAFC),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Real-time calculated total
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF7ED),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFFFEDD5)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Estimated Claim Value:',
                          style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF9A3412)),
                        ),
                        Text(
                          _entityType == ReturnEntityType.doctor ? 'Physician Sample (\$0)' : CurrencyFormatter.formatUsd(_totalValue),
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFFEA580C)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // 3. Reason & Settlement Section
            AppSectionCard(
              title: 'Reason for Return & Settlement',
              subtitle: 'Categorize reason and select credit preference',
              icon: Icons.assignment_late_rounded,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Return Reason', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<ReturnReason>(
                    initialValue: _selectedReason,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                    items: ReturnReason.values.map((r) {
                      return DropdownMenuItem<ReturnReason>(
                        value: r,
                        child: Text(r.label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: r.color)),
                      );
                    }).toList(),
                    onChanged: (r) {
                      if (r != null) setState(() => _selectedReason = r);
                    },
                  ),
                  const SizedBox(height: 12),

                  Text('Settlement Preference', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<ReturnSettlement>(
                    initialValue: _settlementPreference,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                    items: ReturnSettlement.values.map((s) {
                      return DropdownMenuItem<ReturnSettlement>(
                        value: s,
                        child: Text(s.label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      );
                    }).toList(),
                    onChanged: (s) {
                      if (s != null) setState(() => _settlementPreference = s);
                    },
                  ),
                  const SizedBox(height: 12),

                  Text('Detailed Remarks / Cause', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _reasonDescCtrl,
                    maxLines: 2,
                    decoration: InputDecoration(
                      hintText: 'Enter reason details, damaged box notes, etc.',
                      contentPadding: const EdgeInsets.all(12),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Photo / Bill proof
                  Text('Invoice / Damage Photo Proof Attachment', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _photoNameCtrl,
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.attach_file_rounded, size: 18, color: Color(0xFF0288D1)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Submit Button
            SizedBox(
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _submitReturn,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEA580C),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 2,
                ),
                icon: const Icon(Icons.assignment_turned_in_rounded, size: 20),
                label: const Text(
                  'Submit Return Claim to ASM',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, letterSpacing: 0.3),
                ),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildPartyDropdown(DoctorProvider docProv) {
    List<String> partyNames = [];
    switch (_entityType) {
      case ReturnEntityType.chemist:
        partyNames = docProv.chemists.map((c) => c.shopName).toList();
        if (partyNames.isEmpty) partyNames = ['Apollo Pharmacy Bandra', 'MedPlus Pharmacy Linking Road', 'Wellness Forever Khar'];
        break;
      case ReturnEntityType.stockist:
        partyNames = docProv.stockists.map((s) => s.agencyName).toList();
        if (partyNames.isEmpty) partyNames = ['Metro Pharma Distributors', 'National Medicine Depot', 'Apex Pharma Supply'];
        break;
      case ReturnEntityType.hospitalClinic:
        partyNames = docProv.facilities.map((f) => f.name).toList();
        if (partyNames.isEmpty) partyNames = ['Lilavati Hospital & Research Centre', 'Bandra Heart Polyclinic', 'Sunrise Community Health Center'];
        break;
      case ReturnEntityType.doctor:
        partyNames = docProv.doctors.map((d) => d.name).toList();
        if (partyNames.isEmpty) partyNames = ['Dr. Rohan Deshmukh (Cardiologist)', 'Dr. Priya Sharma (Diabetologist)', 'Dr. Ananya Patel (General Physician)'];
        break;
    }

    if (!partyNames.contains(_selectedPartyName) && partyNames.isNotEmpty) {
      _selectedPartyName = partyNames.first;
    }

    return DropdownButtonFormField<String>(
      initialValue: partyNames.contains(_selectedPartyName) ? _selectedPartyName : (partyNames.isNotEmpty ? partyNames.first : null),
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
      ),
      items: partyNames.map((name) {
        return DropdownMenuItem<String>(
          value: name,
          child: Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
        );
      }).toList(),
      onChanged: (name) {
        if (name != null) {
          setState(() {
            _selectedPartyName = name;
            _selectedEntityId = 'ent_${DateTime.now().millisecondsSinceEpoch}';
          });
        }
      },
    );
  }
}
