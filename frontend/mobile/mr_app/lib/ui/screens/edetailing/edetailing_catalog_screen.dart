import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../models/product_model.dart';
import '../../../providers/product_provider.dart';
import '../../../providers/edetailing_provider.dart';
import 'interactive_presentation_screen.dart';
import '../../widgets/app_section_card.dart';

class EdetailingCatalogScreen extends StatefulWidget {
  const EdetailingCatalogScreen({super.key});

  @override
  State<EdetailingCatalogScreen> createState() => _EdetailingCatalogScreenState();
}

class _EdetailingCatalogScreenState extends State<EdetailingCatalogScreen> with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = context.watch<ProductProvider>();
    final edetailingProvider = context.watch<EdetailingProvider>();
    final products = productProvider.filteredProducts;
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
        title: const Text('E-Detailing & Visual Aid', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Colors.white)),
      ),
      body: Column(
        children: [
          // 1. Executive Presentation Analytics Banner
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
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('DIGITAL E-DETAILING ANALYTICS', style: TextStyle(color: Colors.white70, fontSize: 10.5, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    Text('96% Engagement Score', style: TextStyle(color: Colors.greenAccent, fontSize: 10.5, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('${edetailingProvider.totalSessionsDone} Sessions Completed', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800)),
                    Text('Avg ${edetailingProvider.averageDurationMinutes.toStringAsFixed(1)} Mins / Call', style: const TextStyle(color: Colors.amberAccent, fontSize: 11.5, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _analyticsPill('LBLS SHARED', '${edetailingProvider.totalLBLsShared} Sent', Icons.share_rounded),
                    const SizedBox(width: 8),
                    _analyticsPill('3D VIDEOS', '${edetailingProvider.videoAssets.length} In Binder', Icons.ondemand_video_rounded),
                    const SizedBox(width: 8),
                    _analyticsPill('PRODUCTS', '${products.length} Interactive', Icons.medication_rounded),
                  ],
                ),
              ],
            ),
          ),

          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: TextField(
              controller: _searchController,
              onChanged: productProvider.setSearchQuery,
              style: const TextStyle(fontSize: 13),
              decoration: InputDecoration(
                hintText: 'Search brand, molecule, or indication...',
                prefixIcon: const Icon(Icons.search_rounded, size: 20, color: AppColors.primary),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          productProvider.setSearchQuery('');
                        },
                      )
                    : null,
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
              ),
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
              Tab(text: '📚 Product Binders'),
              Tab(text: '🎬 3D Medical Videos'),
              Tab(text: '📤 Leave-Behinds (LBL)'),
              Tab(text: '📈 Presentation Log'),
            ],
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Product Binders Grid
                _buildProductBindersGrid(products),

                // 2. 3D Medical Videos
                _buildVideoLibraryList(edetailingProvider),

                // 3. Leave-Behinds (LBLs)
                _buildLblList(edetailingProvider),

                // 4. Presentation Analytics Log
                _buildPresentationAnalyticsLog(edetailingProvider),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _analyticsPill(String label, String val, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
        child: Column(
          children: [
            Icon(icon, size: 13, color: Colors.white70),
            const SizedBox(height: 2),
            Text(val, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
            Text(label, style: const TextStyle(color: Colors.white60, fontSize: 7.5, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildProductBindersGrid(List<ProductModel> products) {
    if (products.isEmpty) {
      return const Center(child: Text('No products match your search criteria.'));
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.85,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        final product = products[index];

        return InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => InteractivePresentationScreen(product: product)),
            );
          },
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 6, offset: const Offset(0, 2)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: AppColors.primaryContainer, borderRadius: BorderRadius.circular(6)),
                      child: Text('${product.visualAidSlides.length} Slides', style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ),
                    const Icon(Icons.picture_as_pdf_rounded, size: 16, color: Color(0xFF64748B)),
                  ],
                ),
                const Spacer(),
                Text(product.brandName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)), maxLines: 1, overflow: TextOverflow.ellipsis),
                Text(product.genericName, style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)), maxLines: 2, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 6),
                Container(
                  width: double.maxFinite,
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(6)),
                  child: const Center(
                    child: Text('Present Visual Aid', style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildVideoLibraryList(EdetailingProvider provider) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.videoAssets.length,
      itemBuilder: (ctx, idx) {
        final vid = provider.videoAssets[idx];

        return AppSectionCard(
          title: vid.title,
          subtitle: '${vid.category} • Duration: ${vid.duration}',
          icon: Icons.ondemand_video_rounded,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('High-resolution 3D medical animation mode of action showing cellular receptor interaction and pharmacological onset.', style: TextStyle(fontSize: 11.5, color: Color(0xFF475569))),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(6)),
                    child: const Text('4K 60fps Rendered', style: TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Playing ${vid.title} in Fullscreen mode!'), backgroundColor: AppColors.primary),
                      );
                    },
                    icon: const Icon(Icons.play_circle_filled_rounded, size: 16),
                    label: const Text('Play Video'),
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4)),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLblList(EdetailingProvider provider) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.leaveBehinds.length,
      itemBuilder: (ctx, idx) {
        final lbl = provider.leaveBehinds[idx];

        return AppSectionCard(
          title: lbl.title,
          subtitle: '${lbl.type} • File Size: ${lbl.fileSize}',
          icon: Icons.picture_as_pdf_rounded,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text('Approved digital brochure for direct physician trial follow-up and clinical review.', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              ),
              const SizedBox(width: 8),
              ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('${lbl.title} shared to Doctor!'), backgroundColor: AppColors.success),
                  );
                },
                icon: const Icon(Icons.send_rounded, size: 14),
                label: const Text('Share LBL'),
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4)),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPresentationAnalyticsLog(EdetailingProvider provider) {
    final sessions = provider.sessions;

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: sessions.length,
      itemBuilder: (ctx, idx) {
        final s = sessions[idx];

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
                        Text(s.doctorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
                        Text('${s.doctorSpecialty} • Detailed: ${s.productName}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: AppColors.primaryContainer, borderRadius: BorderRadius.circular(6)),
                    child: Text('${(s.totalDurationSeconds / 60).toStringAsFixed(1)} Mins', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primary)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(5)),
                    child: Text(s.physicianInterestRating, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Colors.green.shade900)),
                  ),
                  const SizedBox(width: 8),
                  Text('${s.slidesCoveredCount} Slides • ${DateFormatter.formatDisplayDate(s.sessionDate)}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                ],
              ),
              if (s.physicianFeedback.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text('“${s.physicianFeedback}”', style: const TextStyle(fontSize: 11, color: Color(0xFF334155), fontStyle: FontStyle.italic)),
              ],
            ],
          ),
        );
      },
    );
  }
}
