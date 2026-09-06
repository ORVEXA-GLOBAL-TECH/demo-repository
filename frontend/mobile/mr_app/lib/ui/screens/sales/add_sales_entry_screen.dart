import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/sales_entry_model.dart';
import '../../../providers/sales_provider.dart';
import '../../../providers/doctor_provider.dart';
import '../../../providers/product_provider.dart';
import '../../widgets/app_section_card.dart';
import '../../widgets/receipt_photo_uploader.dart';

class AddSalesEntryScreen extends StatefulWidget {
  const AddSalesEntryScreen({super.key});

  @override
  State<AddSalesEntryScreen> createState() => _AddSalesEntryScreenState();
}

class _AddSalesEntryScreenState extends State<AddSalesEntryScreen> {
  final _formKey = GlobalKey<FormState>();
  String _buyerType = 'Chemist'; // 'Chemist' or 'Stockist'
  String? _selectedBuyerId;
  String? _selectedBuyerName;
  String _territoryPatch = 'Bandra West Patch A';
  String? _uploadedInvoicePhotoName;
  final _remarksController = TextEditingController();

  // Dynamic Product Lines
  final List<_ProductLineInput> _productLines = [];

  @override
  void initState() {
    super.initState();
    // Default initial line
    _productLines.add(_ProductLineInput(
      productId: 'prod_1',
      productName: 'CardioVasc-AM',
      batchNo: 'CV26A14',
      quantityController: TextEditingController(text: '50'),
      freeQtyController: TextEditingController(text: '5'),
      unitPriceController: TextEditingController(text: '165.0'),
      discountController: TextEditingController(text: '5.0'),
    ));
  }

  @override
  void dispose() {
    for (final line in _productLines) {
      line.dispose();
    }
    _remarksController.dispose();
    super.dispose();
  }

  void _addNewLine(ProductProvider productProvider) {
    final firstProd = productProvider.products.first;
    setState(() {
      _productLines.add(_ProductLineInput(
        productId: firstProd.id,
        productName: firstProd.brandName,
        batchNo: 'BT26${DateTime.now().millisecond}',
        quantityController: TextEditingController(text: '20'),
        freeQtyController: TextEditingController(text: '2'),
        unitPriceController: TextEditingController(text: firstProd.mrp.toStringAsFixed(1)),
        discountController: TextEditingController(text: '5.0'),
      ));
    });
  }

  void _removeLine(int index) {
    if (_productLines.length <= 1) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('At least one product line item is required.')),
      );
      return;
    }
    setState(() {
      final removed = _productLines.removeAt(index);
      removed.dispose();
    });
  }

  double get _grossTotal {
    return _productLines.fold(0.0, (sum, line) {
      final qty = int.tryParse(line.quantityController.text) ?? 0;
      final price = double.tryParse(line.unitPriceController.text) ?? 0.0;
      return sum + (qty * price);
    });
  }

  double get _discountTotal {
    return _productLines.fold(0.0, (sum, line) {
      final qty = int.tryParse(line.quantityController.text) ?? 0;
      final price = double.tryParse(line.unitPriceController.text) ?? 0.0;
      final disc = double.tryParse(line.discountController.text) ?? 0.0;
      return sum + ((qty * price) * (disc / 100));
    });
  }

  double get _gstTotal {
    final taxable = _grossTotal - _discountTotal;
    return taxable * 0.12; // 12% GST
  }

  double get _netGrandTotal => (_grossTotal - _discountTotal) + _gstTotal;

  void _submitSalesEntry() {
    if (_selectedBuyerName == null || _selectedBuyerName!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a Chemist or Stockist buyer.')),
      );
      return;
    }

    final items = _productLines.map((line) {
      final qty = int.tryParse(line.quantityController.text) ?? 0;
      final freeQty = int.tryParse(line.freeQtyController.text) ?? 0;
      final price = double.tryParse(line.unitPriceController.text) ?? 0.0;
      final disc = double.tryParse(line.discountController.text) ?? 0.0;

      return SalesLineItem(
        productId: line.productId,
        productName: line.productName,
        batchNo: line.batchNo,
        quantity: qty,
        freeQuantity: freeQty,
        unitPrice: price,
        discountPercent: disc,
        gstPercent: 12.0,
      );
    }).toList();

    final invoiceNumber = 'INV-2026-${(DateTime.now().millisecondsSinceEpoch % 10000).toString().padLeft(4, "0")}';

    final newInvoice = ProductSalesInvoice(
      id: 'inv_${DateTime.now().millisecondsSinceEpoch}',
      invoiceNumber: invoiceNumber,
      date: DateTime.now(),
      buyerType: _buyerType,
      buyerId: _selectedBuyerId ?? 'b_1',
      buyerName: _selectedBuyerName!,
      territoryPatch: _territoryPatch,
      items: items,
      invoicePhotoName: _uploadedInvoicePhotoName ?? 'tax_invoice_auto_${invoiceNumber.toLowerCase()}.jpg',
      status: 'Billed',
      remarks: _remarksController.text.trim().isNotEmpty ? _remarksController.text.trim() : null,
    );

    context.read<SalesProvider>().addSalesInvoice(newInvoice);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Colors.white),
            const SizedBox(width: 8),
            Text('Sales Invoice $invoiceNumber (\$${_netGrandTotal.toStringAsFixed(2)}) saved!'),
          ],
        ),
        backgroundColor: AppColors.success,
      ),
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final doctorProvider = context.watch<DoctorProvider>();
    final productProvider = context.watch<ProductProvider>();

    // Pre-populate buyer if null
    if (_selectedBuyerName == null) {
      if (_buyerType == 'Chemist' && doctorProvider.chemists.isNotEmpty) {
        _selectedBuyerId = doctorProvider.chemists.first.id;
        _selectedBuyerName = doctorProvider.chemists.first.shopName;
      } else if (doctorProvider.stockists.isNotEmpty) {
        _selectedBuyerId = doctorProvider.stockists.first.id;
        _selectedBuyerName = doctorProvider.stockists.first.agencyName;
      }
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Add Product Sales Entry', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // 1. Buyer & Territory Section
            AppSectionCard(
              title: 'Buyer & Territory Details',
              subtitle: 'Select Chemist store or Stockist distributor',
              icon: Icons.storefront_rounded,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: ['Chemist', 'Stockist'].map((type) {
                      final sel = _buyerType == type;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(type == 'Chemist' ? '🏪 Chemist Store' : '🏢 Stockist / Depot'),
                          selected: sel,
                          selectedColor: AppColors.primary,
                          backgroundColor: const Color(0xFFF1F5F9),
                          labelStyle: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: sel ? Colors.white : const Color(0xFF334155)),
                          onSelected: (s) {
                            if (s) {
                              setState(() {
                                _buyerType = type;
                                if (type == 'Chemist' && doctorProvider.chemists.isNotEmpty) {
                                  _selectedBuyerId = doctorProvider.chemists.first.id;
                                  _selectedBuyerName = doctorProvider.chemists.first.shopName;
                                } else if (doctorProvider.stockists.isNotEmpty) {
                                  _selectedBuyerId = doctorProvider.stockists.first.id;
                                  _selectedBuyerName = doctorProvider.stockists.first.agencyName;
                                }
                              });
                            }
                          },
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 12),
                  Text('Select $_buyerType:', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    initialValue: _selectedBuyerId,
                    dropdownColor: Colors.white,
                    style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    items: _buyerType == 'Chemist'
                        ? doctorProvider.chemists.map((c) => DropdownMenuItem(value: c.id, child: Text(c.shopName))).toList()
                        : doctorProvider.stockists.map((s) => DropdownMenuItem(value: s.id, child: Text(s.agencyName))).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() {
                          _selectedBuyerId = val;
                          if (_buyerType == 'Chemist') {
                            _selectedBuyerName = doctorProvider.chemists.firstWhere((c) => c.id == val).shopName;
                          } else {
                            _selectedBuyerName = doctorProvider.stockists.firstWhere((s) => s.id == val).agencyName;
                          }
                        });
                      }
                    },
                  ),
                  const SizedBox(height: 12),
                  const Text('Territory Micro-Patch:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    initialValue: _territoryPatch,
                    dropdownColor: Colors.white,
                    style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'Bandra West Patch A', child: Text('Bandra West Patch A')),
                      DropdownMenuItem(value: 'Khar West Patch B', child: Text('Khar West Patch B')),
                      DropdownMenuItem(value: 'Santacruz West Patch C', child: Text('Santacruz West Patch C')),
                    ],
                    onChanged: (val) => val != null ? setState(() => _territoryPatch = val) : null,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // 2. Product Line Items Section
            AppSectionCard(
              title: 'Product Line Items (${_productLines.length})',
              subtitle: 'Add medicines, batches, quantities & schemes',
              icon: Icons.medication_rounded,
              child: Column(
                children: [
                  ..._productLines.asMap().entries.map((entry) {
                    final index = entry.key;
                    final line = entry.value;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Line Item #${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: AppColors.primary)),
                              if (_productLines.length > 1)
                                InkWell(
                                  onTap: () => _removeLine(index),
                                  child: const Icon(Icons.delete_outline_rounded, size: 18, color: AppColors.error),
                                ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          DropdownButtonFormField<String>(
                            initialValue: line.productId,
                            dropdownColor: Colors.white,
                            style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13, fontWeight: FontWeight.bold),
                            decoration: InputDecoration(
                              labelText: 'Product Brand',
                              filled: true,
                              fillColor: Colors.white,
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            items: productProvider.products.map((p) => DropdownMenuItem(value: p.id, child: Text('${p.brandName} (${p.therapeuticCategory})'))).toList(),
                            onChanged: (val) {
                              if (val != null) {
                                final prod = productProvider.getProductById(val);
                                setState(() {
                                  line.productId = val;
                                  line.productName = prod?.brandName ?? '';
                                  line.unitPriceController.text = (prod?.mrp ?? 150.0).toStringAsFixed(1);
                                });
                              }
                            },
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                flex: 3,
                                child: TextFormField(
                                  controller: line.quantityController,
                                  keyboardType: TextInputType.number,
                                  onChanged: (_) => setState(() {}),
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                                  decoration: InputDecoration(
                                    labelText: 'Qty (Pcs)',
                                    filled: true,
                                    fillColor: Colors.white,
                                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                flex: 2,
                                child: TextFormField(
                                  controller: line.freeQtyController,
                                  keyboardType: TextInputType.number,
                                  style: const TextStyle(fontSize: 13),
                                  decoration: InputDecoration(
                                    labelText: 'Free Qty',
                                    filled: true,
                                    fillColor: Colors.white,
                                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                flex: 3,
                                child: TextFormField(
                                  controller: line.unitPriceController,
                                  keyboardType: TextInputType.number,
                                  onChanged: (_) => setState(() {}),
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                                  decoration: InputDecoration(
                                    labelText: 'Rate (\$)',
                                    filled: true,
                                    fillColor: Colors.white,
                                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }),
                  OutlinedButton.icon(
                    onPressed: () => _addNewLine(productProvider),
                    icon: const Icon(Icons.add_rounded, size: 16),
                    label: const Text('+ Add Another Product Line', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      minimumSize: const Size.fromHeight(38),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // 3. Invoice / Bill Photo Upload
            AppSectionCard(
              title: 'Upload Invoice / Challan Photo',
              subtitle: 'Attach physical bill proof with GST number',
              icon: Icons.receipt_long_rounded,
              child: ReceiptPhotoUploader(
                title: 'Sales Tax Invoice Proof',
                subtitle: 'Upload or take a photo of the signed supply invoice / receipt',
                onPhotoChanged: (fileName) {
                  setState(() => _uploadedInvoicePhotoName = fileName);
                },
              ),
            ),
            const SizedBox(height: 14),

            // 4. Grand Total & Summary Box
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF009CBF), Color(0xFF0F172A)]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  _summaryRow('Gross Total Amount:', CurrencyFormatter.formatInr(_grossTotal), isBold: false),
                  _summaryRow('Discount Deducted:', '- ${CurrencyFormatter.formatInr(_discountTotal)}', isBold: false),
                  _summaryRow('GST Tax (12%):', '+ ${CurrencyFormatter.formatInr(_gstTotal)}', isBold: false),
                  const Divider(color: Colors.white24, height: 16),
                  _summaryRow('Net Invoice Total:', CurrencyFormatter.formatInr(_netGrandTotal), isBold: true, isLarge: true),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Submit Button
            ElevatedButton.icon(
              onPressed: _submitSalesEntry,
              icon: const Icon(Icons.check_circle_outline_rounded),
              label: const Text('Save & Submit Product Sales Entry', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _summaryRow(String label, String val, {bool isBold = false, bool isLarge = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.white70, fontSize: isLarge ? 14 : 12, fontWeight: isBold ? FontWeight.bold : FontWeight.normal)),
          Text(val, style: TextStyle(color: Colors.white, fontSize: isLarge ? 18 : 13, fontWeight: isBold ? FontWeight.w800 : FontWeight.bold)),
        ],
      ),
    );
  }
}

class _ProductLineInput {
  String productId;
  String productName;
  String batchNo;
  final TextEditingController quantityController;
  final TextEditingController freeQtyController;
  final TextEditingController unitPriceController;
  final TextEditingController discountController;

  _ProductLineInput({
    required this.productId,
    required this.productName,
    required this.batchNo,
    required this.quantityController,
    required this.freeQtyController,
    required this.unitPriceController,
    required this.discountController,
  });

  void dispose() {
    quantityController.dispose();
    freeQtyController.dispose();
    unitPriceController.dispose();
    discountController.dispose();
  }
}
