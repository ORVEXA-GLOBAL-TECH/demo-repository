import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../services/mock_data_service.dart';

class ProductProvider extends ChangeNotifier {
  final List<ProductModel> _products = MockDataService.getProducts();
  String _searchQuery = '';
  String _selectedCategory = 'All';

  List<ProductModel> get products => _products;
  String get searchQuery => _searchQuery;
  String get selectedCategory => _selectedCategory;

  List<String> get categories {
    final list = _products.map((p) => p.therapeuticCategory).toSet().toList();
    list.sort();
    return ['All', ...list];
  }

  List<ProductModel> get filteredProducts {
    return _products.where((product) {
      final matchesSearch = product.brandName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          product.genericName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          product.indication.toLowerCase().contains(_searchQuery.toLowerCase());
      
      final matchesCategory = _selectedCategory == 'All' || product.therapeuticCategory == _selectedCategory;

      return matchesSearch && matchesCategory;
    }).toList();
  }

  List<ProductModel> get focusProducts => _products.where((p) => p.isFocusBrand).toList();

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  ProductModel? getProductById(String id) {
    try {
      return _products.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }
}
