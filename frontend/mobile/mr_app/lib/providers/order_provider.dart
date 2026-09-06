import 'package:flutter/material.dart';
import '../models/pob_order_model.dart';
import '../models/product_model.dart';
import '../models/chemist_model.dart';
import '../models/stockist_model.dart';
import '../services/mock_data_service.dart';

class OrderProvider extends ChangeNotifier {
  final List<PobOrderModel> _orders = MockDataService.getSampleOrders();

  // Active Draft Cart State
  ChemistModel? _selectedChemist;
  StockistModel? _selectedStockist;
  final List<OrderItem> _cartItems = [];
  String _paymentTerms = '15 Days Credit';
  String _orderRemarks = '';

  List<PobOrderModel> get orders => _orders;
  ChemistModel? get selectedChemist => _selectedChemist;
  StockistModel? get selectedStockist => _selectedStockist;
  List<OrderItem> get cartItems => _cartItems;
  String get paymentTerms => _paymentTerms;
  String get orderRemarks => _orderRemarks;

  int get cartCount => _cartItems.length;
  double get cartSubtotal => _cartItems.fold(0.0, (sum, i) => sum + i.subtotal);
  double get cartDiscount => _cartItems.fold(0.0, (sum, i) => sum + i.discountAmount);
  double get cartGst => _cartItems.fold(0.0, (sum, i) => sum + i.gstAmount);
  double get cartGrandTotal => _cartItems.fold(0.0, (sum, i) => sum + i.totalAmount);

  void selectChemist(ChemistModel chemist, List<StockistModel> stockists) {
    _selectedChemist = chemist;
    _selectedStockist = stockists.firstWhere(
      (s) => s.id == chemist.mappedStockistId,
      orElse: () => stockists.first,
    );
    notifyListeners();
  }

  void selectStockist(StockistModel stockist) {
    _selectedStockist = stockist;
    notifyListeners();
  }

  void setPaymentTerms(String terms) {
    _paymentTerms = terms;
    notifyListeners();
  }

  void setRemarks(String remarks) {
    _orderRemarks = remarks;
    notifyListeners();
  }

  void addToCart(ProductModel product, int quantity, {int freeQty = 0, double discount = 0.0}) {
    final existingIndex = _cartItems.indexWhere((i) => i.productId == product.id);
    if (existingIndex != -1) {
      final existing = _cartItems[existingIndex];
      _cartItems[existingIndex] = existing.copyWith(
        quantity: existing.quantity + quantity,
        freeQuantity: existing.freeQuantity + freeQty,
      );
    } else {
      _cartItems.add(
        OrderItem(
          productId: product.id,
          brandName: product.brandName,
          packing: product.packing,
          ptr: product.ptr,
          quantity: quantity,
          freeQuantity: freeQty,
          discountPercent: discount,
          gstPercent: product.gstRate,
        ),
      );
    }
    notifyListeners();
  }

  void updateCartItemQuantity(String productId, int newQty) {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    final index = _cartItems.indexWhere((i) => i.productId == productId);
    if (index != -1) {
      _cartItems[index] = _cartItems[index].copyWith(quantity: newQty);
      notifyListeners();
    }
  }

  void removeFromCart(String productId) {
    _cartItems.removeWhere((i) => i.productId == productId);
    notifyListeners();
  }

  void clearCart() {
    _cartItems.clear();
    _selectedChemist = null;
    _selectedStockist = null;
    _orderRemarks = '';
    notifyListeners();
  }

  PobOrderModel? placeOrder() {
    if (_selectedChemist == null || _selectedStockist == null || _cartItems.isEmpty) {
      return null;
    }

    final newOrder = PobOrderModel(
      id: 'ord_${DateTime.now().millisecondsSinceEpoch}',
      orderNumber: 'POB-2026-${(1000 + _orders.length + 1)}',
      chemistId: _selectedChemist!.id,
      chemistName: _selectedChemist!.name,
      chemistShopName: _selectedChemist!.shopName,
      stockistId: _selectedStockist!.id,
      stockistAgencyName: _selectedStockist!.agencyName,
      orderDate: DateTime.now(),
      items: List.from(_cartItems),
      paymentTerms: _paymentTerms,
      remarks: _orderRemarks,
      status: 'Forwarded to Stockist',
    );

    _orders.insert(0, newOrder);
    clearCart();
    notifyListeners();
    return newOrder;
  }
}
