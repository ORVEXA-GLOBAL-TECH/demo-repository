import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/currency_provider.dart';

class PharmaCalculatorScreen extends StatefulWidget {
  const PharmaCalculatorScreen({super.key});

  @override
  State<PharmaCalculatorScreen> createState() => _PharmaCalculatorScreenState();
}

class _PharmaCalculatorScreenState extends State<PharmaCalculatorScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Standard calculator state
  String _display = '0';
  String _expression = '';
  double? _firstOperand;
  String? _operator;
  bool _shouldResetDisplay = false;

  // Pharma calculator state
  final _mrpCtrl = TextEditingController(text: '150.00');
  final _retailerDiscountCtrl = TextEditingController(text: '20.0'); // 20%
  final _stockistDiscountCtrl = TextEditingController(text: '10.0'); // 10%
  final _buyQtyCtrl = TextEditingController(text: '10');
  final _freeQtyCtrl = TextEditingController(text: '1');
  final _gstRateCtrl = TextEditingController(text: '12.0'); // 12%

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _mrpCtrl.dispose();
    _retailerDiscountCtrl.dispose();
    _stockistDiscountCtrl.dispose();
    _buyQtyCtrl.dispose();
    _freeQtyCtrl.dispose();
    _gstRateCtrl.dispose();
    super.dispose();
  }

  // Calculator logic
  void _onDigitPress(String digit) {
    setState(() {
      if (_display == '0' || _shouldResetDisplay) {
        _display = digit;
        _shouldResetDisplay = false;
      } else {
        _display += digit;
      }
    });
  }

  void _onDecimalPress() {
    setState(() {
      if (!_display.contains('.')) {
        _display += '.';
      }
    });
  }

  void _onOperatorPress(String op) {
    setState(() {
      final current = double.tryParse(_display) ?? 0.0;
      if (_firstOperand == null) {
        _firstOperand = current;
      } else if (_operator != null) {
        _firstOperand = _calculate(_firstOperand!, current, _operator!);
        _display = _formatNumber(_firstOperand!);
      }
      _operator = op;
      _expression = '${_formatNumber(_firstOperand!)} $op';
      _shouldResetDisplay = true;
    });
  }

  void _onEqualsPress() {
    if (_firstOperand != null && _operator != null) {
      final second = double.tryParse(_display) ?? 0.0;
      final result = _calculate(_firstOperand!, second, _operator!);
      setState(() {
        _expression = '${_formatNumber(_firstOperand!)} $_operator ${_formatNumber(second)} =';
        _display = _formatNumber(result);
        _firstOperand = null;
        _operator = null;
        _shouldResetDisplay = true;
      });
    }
  }

  void _onClearPress() {
    setState(() {
      _display = '0';
      _expression = '';
      _firstOperand = null;
      _operator = null;
      _shouldResetDisplay = false;
    });
  }

  void _onBackspacePress() {
    setState(() {
      if (_display.length > 1) {
        _display = _display.substring(0, _display.length - 1);
      } else {
        _display = '0';
      }
    });
  }

  double _calculate(double a, double b, String op) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b != 0 ? a / b : 0.0;
      case '%':
        return a * (b / 100);
      default:
        return b;
    }
  }

  String _formatNumber(double num) {
    if (num % 1 == 0) {
      return num.toInt().toString();
    }
    return num.toStringAsFixed(2);
  }

  @override
  Widget build(BuildContext context) {
    final currencyProvider = context.watch<CurrencyProvider>();

    // Pharma Calculation
    final double mrp = double.tryParse(_mrpCtrl.text) ?? 0.0;
    final double retDiscPct = double.tryParse(_retailerDiscountCtrl.text) ?? 20.0;
    final double stkDiscPct = double.tryParse(_stockistDiscountCtrl.text) ?? 10.0;
    final int buyQty = int.tryParse(_buyQtyCtrl.text) ?? 10;
    final int freeQty = int.tryParse(_freeQtyCtrl.text) ?? 1;

    final double ptr = mrp * (1 - (retDiscPct / 100)); // Price to Retailer
    final double pts = ptr * (1 - (stkDiscPct / 100)); // Price to Stockist
    final double retailerProfitPerUnit = mrp - ptr;
    final double retailerMarginPct = mrp > 0 ? (retailerProfitPerUnit / mrp) * 100 : 0.0;

    // Scheme effective price
    final int totalQty = buyQty + freeQty;
    final double schemeTotalCost = ptr * buyQty;
    final double effectivePtrPerUnit = totalQty > 0 ? schemeTotalCost / totalQty : ptr;
    final double schemeExtraBenefitPct = ptr > 0 ? ((ptr - effectivePtrPerUnit) / ptr) * 100 : 0.0;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Pharma & Field Calculator', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5)),
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
            Tab(icon: Icon(Icons.calculate_rounded, size: 18), text: 'Math Calculator'),
            Tab(icon: Icon(Icons.price_check_rounded, size: 18), text: 'PTR / PTS Scheme Calc'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // =========================================================================
          // TAB 1: STANDARD FIELD MATH CALCULATOR
          // =========================================================================
          Column(
            children: [
              // Display Screen
              Expanded(
                flex: 2,
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.fromLTRB(24, 20, 24, 20),
                  color: const Color(0xFF0B172E),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        _expression,
                        style: const TextStyle(fontSize: 16, color: Color(0xFF38BDF8), fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 8),
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          _display,
                          style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Keypad
              Expanded(
                flex: 4,
                child: Container(
                  padding: const EdgeInsets.all(12),
                  color: Colors.white,
                  child: Column(
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            _buildCalcBtn('C', color: const Color(0xFFFFEBEE), textColor: const Color(0xFFE53935), onTap: _onClearPress),
                            _buildCalcBtn('⌫', color: const Color(0xFFF1F5F9), textColor: const Color(0xFF475569), onTap: _onBackspacePress),
                            _buildCalcBtn('%', color: const Color(0xFFE0F2FE), textColor: const Color(0xFF0288D1), onTap: () => _onOperatorPress('%')),
                            _buildCalcBtn('÷', color: const Color(0xFFE0F2FE), textColor: const Color(0xFF0288D1), onTap: () => _onOperatorPress('÷')),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Row(
                          children: [
                            _buildCalcBtn('7', onTap: () => _onDigitPress('7')),
                            _buildCalcBtn('8', onTap: () => _onDigitPress('8')),
                            _buildCalcBtn('9', onTap: () => _onDigitPress('9')),
                            _buildCalcBtn('×', color: const Color(0xFFE0F2FE), textColor: const Color(0xFF0288D1), onTap: () => _onOperatorPress('×')),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Row(
                          children: [
                            _buildCalcBtn('4', onTap: () => _onDigitPress('4')),
                            _buildCalcBtn('5', onTap: () => _onDigitPress('5')),
                            _buildCalcBtn('6', onTap: () => _onDigitPress('6')),
                            _buildCalcBtn('-', color: const Color(0xFFE0F2FE), textColor: const Color(0xFF0288D1), onTap: () => _onOperatorPress('-')),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Row(
                          children: [
                            _buildCalcBtn('1', onTap: () => _onDigitPress('1')),
                            _buildCalcBtn('2', onTap: () => _onDigitPress('2')),
                            _buildCalcBtn('3', onTap: () => _onDigitPress('3')),
                            _buildCalcBtn('+', color: const Color(0xFFE0F2FE), textColor: const Color(0xFF0288D1), onTap: () => _onOperatorPress('+')),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Row(
                          children: [
                            _buildCalcBtn('0', flex: 2, onTap: () => _onDigitPress('0')),
                            _buildCalcBtn('.', onTap: _onDecimalPress),
                            _buildCalcBtn('=', color: const Color(0xFF0288D1), textColor: Colors.white, onTap: _onEqualsPress),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // =========================================================================
          // TAB 2: PHARMA TRADE PRICING & SCHEME CALCULATOR
          // =========================================================================
          ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Inputs Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Trade Pricing Inputs', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _mrpCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'MRP Price', prefixText: '\$ '),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _gstRateCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'VAT / Tax', suffixText: '%'),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _retailerDiscountCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Retailer Margin', suffixText: '%'),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _stockistDiscountCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Stockist Margin', suffixText: '%'),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _buyQtyCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Scheme Buy Qty', prefixIcon: Icon(Icons.shopping_cart_outlined)),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _freeQtyCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Free Bonus Units', prefixIcon: Icon(Icons.card_giftcard_rounded)),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Live Breakdown Summary
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
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _summaryColumn('PTR (Price to Chemist)', currencyProvider.format(ptr), const Color(0xFF38BDF8)),
                        Container(width: 1, height: 38, color: Colors.white24),
                        _summaryColumn('PTS (Price to Stockist)', currencyProvider.format(pts), const Color(0xFF10B981)),
                      ],
                    ),
                    const Divider(color: Colors.white24, height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _summaryColumn('Retailer Margin %', '${retailerMarginPct.toStringAsFixed(1)}%', const Color(0xFFF59E0B)),
                        Container(width: 1, height: 38, color: Colors.white24),
                        _summaryColumn('Profit / Unit', currencyProvider.format(retailerProfitPerUnit), Colors.white),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Scheme Benefit Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(color: const Color(0xFFEDE7F6), borderRadius: BorderRadius.circular(10)),
                          child: const Icon(Icons.discount_rounded, color: Color(0xFF7E57C2), size: 20),
                        ),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Trade Scheme Benefit (10+1 / Free Units)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                              Text('Calculates effective cost per unit after bonus stock', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Scheme Offer:', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                        Text('Buy $buyQty Get $freeQty Free (${buyQty + freeQty} Total)', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Standard PTR:', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                        Text(currencyProvider.format(ptr), style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Effective PTR per Unit:', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF2E7D32))),
                        Text(currencyProvider.format(effectivePtrPerUnit), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2E7D32))),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Extra Chemist Scheme Margin:', style: TextStyle(fontSize: 12.5, color: Color(0xFF7E57C2), fontWeight: FontWeight.bold)),
                        Text('+${schemeExtraBenefitPct.toStringAsFixed(1)}% Extra', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF7E57C2))),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ],
      ),
    );
  }

  Widget _summaryColumn(String label, String value, Color col) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 11.5, color: Colors.white70)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: col)),
      ],
    );
  }

  Widget _buildCalcBtn(String label, {Color? color, Color? textColor, int flex = 1, VoidCallback? onTap}) {
    return Expanded(
      flex: flex,
      child: Padding(
        padding: const EdgeInsets.all(4),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            decoration: BoxDecoration(
              color: color ?? const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Center(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: textColor ?? const Color(0xFF0F172A),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
