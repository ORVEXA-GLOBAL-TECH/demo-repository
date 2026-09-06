import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/product_model.dart';
import '../../../providers/edetailing_provider.dart';
import '../../../providers/doctor_provider.dart';

class InteractivePresentationScreen extends StatefulWidget {
  final ProductModel product;

  const InteractivePresentationScreen({super.key, required this.product});

  @override
  State<InteractivePresentationScreen> createState() => _InteractivePresentationScreenState();
}

class _InteractivePresentationScreenState extends State<InteractivePresentationScreen> {
  late PageController _pageController;
  int _currentSlideIndex = 0;
  int _secondsElapsed = 0;
  Timer? _timer;
  bool _isPdfMode = false;
  bool _isVideoPlaying = false;
  double _videoProgress = 0.35;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _secondsElapsed++;
        });
      }
    });
  }

  String _formatTimer(int totalSecs) {
    final mins = (totalSecs ~/ 60).toString().padLeft(2, '0');
    final secs = (totalSecs % 60).toString().padLeft(2, '0');
    return '$mins:$secs';
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _showClinicalStudiesModal(BuildContext context, EdetailingProvider provider) {
    final studies = provider.getClinicalStudiesForProduct(widget.product.id);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.biotech_rounded, color: AppColors.primary, size: 24),
                      SizedBox(width: 8),
                      Text('Clinical Trials & RCT Evidence', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    ],
                  ),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              const SizedBox(height: 12),
              ...studies.map((s) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(s.studyName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: AppColors.primary)),
                    Text(s.journalReference, style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B), fontStyle: FontStyle.italic)),
                    const SizedBox(height: 6),
                    Text('Sample Size: ${s.sampleSize}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF334155))),
                    Text('Primary Endpoint: ${s.primaryEndpoint}', style: const TextStyle(fontSize: 11, color: Color(0xFF334155))),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(6)),
                      child: Text('Result: ${s.statisticalResult}', style: TextStyle(fontSize: 11, color: Colors.green.shade900, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 6),
                    Text('Conclusion: ${s.keyConclusion}', style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                  ],
                ),
              )),
            ],
          ),
        ),
      ),
    );
  }

  void _showDrugComparisonModal(BuildContext context, EdetailingProvider provider) {
    final comparisons = provider.getDrugComparisonsForProduct(widget.product.id);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.compare_arrows_rounded, color: AppColors.primary, size: 24),
                      const SizedBox(width: 8),
                      Text('${widget.product.brandName} vs Competitors', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    ],
                  ),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              const SizedBox(height: 12),
              ...comparisons.map((c) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(c.feature, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: Color(0xFF0F172A))),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(8)),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('${widget.product.brandName} (Our Brand)', style: TextStyle(fontSize: 9.5, color: Colors.green.shade900, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 2),
                                Text(c.ourBrandValue, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(8)),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Competitor Formulation', style: TextStyle(fontSize: 9.5, color: AppColors.error, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 2),
                                Text(c.competitorValue, style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              )),
            ],
          ),
        ),
      ),
    );
  }

  void _showVideoPlayerModal(BuildContext context, EdetailingProvider provider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setVideoState) => SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.ondemand_video_rounded, color: AppColors.primary, size: 22),
                        SizedBox(width: 8),
                        Text('3D Mechanism of Action Video', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                      ],
                    ),
                    IconButton(icon: const Icon(Icons.close, color: Color(0xFF64748B)), onPressed: () => Navigator.pop(ctx)),
                  ],
                ),
                const SizedBox(height: 12),
                // Video Screen Box
                Container(
                  height: 200,
                  width: double.maxFinite,
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Video graphics representation
                      Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.9), shape: BoxShape.circle),
                              child: Icon(_isVideoPlaying ? Icons.pause_rounded : Icons.play_arrow_rounded, color: Colors.white, size: 36),
                            ),
                            const SizedBox(height: 10),
                            Text('${widget.product.brandName} • 3D Dual Receptor Action', style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                      // Controls
                      Positioned(
                        bottom: 10,
                        left: 14,
                        right: 14,
                        child: Row(
                          children: [
                            IconButton(
                              icon: Icon(_isVideoPlaying ? Icons.pause : Icons.play_arrow, color: Colors.white),
                              onPressed: () => setVideoState(() => _isVideoPlaying = !_isVideoPlaying),
                            ),
                            Expanded(
                              child: Slider(
                                value: _videoProgress,
                                activeColor: AppColors.primary,
                                inactiveColor: Colors.white24,
                                onChanged: (v) => setVideoState(() => _videoProgress = v),
                              ),
                            ),
                            const Text('01:45 / 02:30', style: TextStyle(color: Colors.white70, fontSize: 10.5, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                const Text('Clinical Video Assets in Binder:', style: TextStyle(color: Color(0xFF334155), fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                ...provider.videoAssets.map((v) => Container(
                  margin: const EdgeInsets.only(bottom: 6),
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(v.title, style: const TextStyle(color: Color(0xFF0F172A), fontSize: 12, fontWeight: FontWeight.bold)),
                      Text(v.duration, style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                )),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showFaqsModal(BuildContext context, EdetailingProvider provider) {
    final faqs = provider.getFaqsForProduct(widget.product.id);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.help_outline_rounded, color: AppColors.primary, size: 24),
                      SizedBox(width: 8),
                      Text('Physician Clinical FAQs', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    ],
                  ),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              const SizedBox(height: 12),
              ...faqs.map((f) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE2E8F0))),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Q: ${f.question}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5, color: AppColors.primary)),
                    const SizedBox(height: 4),
                    Text('A: ${f.answer}', style: const TextStyle(fontSize: 11.5, color: Color(0xFF334155))),
                    const SizedBox(height: 4),
                    Text('Reference: ${f.evidenceReference}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B), fontStyle: FontStyle.italic)),
                  ],
                ),
              )),
            ],
          ),
        ),
      ),
    );
  }

  void _showLeaveBehindModal(BuildContext context, EdetailingProvider provider) {
    final lbls = provider.leaveBehinds;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.share_rounded, color: AppColors.primary, size: 22),
                      SizedBox(width: 8),
                      Text('Digital Leave-Behind (LBL)', style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    ],
                  ),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              const Text('Instantly share clinical monographs and dosage cards with the doctor:', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
              const SizedBox(height: 12),
              ...lbls.map((lbl) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE2E8F0))),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: AppColors.primaryContainer, borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.picture_as_pdf_rounded, color: AppColors.primary, size: 20),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(lbl.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
                          Text('${lbl.type} • ${lbl.fileSize}', style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                        ],
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('${lbl.title} shared via WhatsApp / Email to Doctor!'), backgroundColor: AppColors.success),
                        );
                      },
                      icon: const Icon(Icons.send_rounded, size: 14),
                      label: const Text('Share', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4)),
                    ),
                  ],
                ),
              )),
            ],
          ),
        ),
      ),
    );
  }

  void _showDoctorFeedbackModal(BuildContext context, EdetailingProvider edetailingProvider) {
    final doctorProvider = context.read<DoctorProvider>();
    String selectedDocId = doctorProvider.doctors.first.id;
    String selectedDocName = doctorProvider.doctors.first.name;
    String selectedSpecialty = doctorProvider.doctors.first.specialty;
    String interestRating = 'High - Rx Committed';
    final feedbackCtrl = TextEditingController(text: 'Doctor agreed with the dual vasodilation evidence. Committed 3 Rx/day.');

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: const Row(
            children: [
              Icon(Icons.rate_review_rounded, color: AppColors.primary),
              SizedBox(width: 8),
              Text('Doctor Detailing Feedback', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
                      });
                    }
                  },
                ),
                const SizedBox(height: 12),
                const Text('Physician Engagement & Interest:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: interestRating,
                  dropdownColor: Colors.white,
                  style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                  decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                  items: const [
                    DropdownMenuItem(value: 'High - Rx Committed', child: Text('⭐⭐⭐ High Interest - Rx Committed')),
                    DropdownMenuItem(value: 'Interested - Trial Pack', child: Text('⭐⭐ Interested - Requested Trial Packs')),
                    DropdownMenuItem(value: 'Moderate', child: Text('⭐ Moderate Engagement')),
                    DropdownMenuItem(value: 'Low', child: Text('⚪ Low Interest / Competitor Loyal')),
                  ],
                  onChanged: (val) => val != null ? setModalState(() => interestRating = val) : null,
                ),
                const SizedBox(height: 12),
                const Text('Physician Remarks & Reaction:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextField(
                  controller: feedbackCtrl,
                  maxLines: 3,
                  style: const TextStyle(fontSize: 12.5),
                  decoration: InputDecoration(filled: true, fillColor: const Color(0xFFF8FAFC), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                edetailingProvider.recordPresentationSession(
                  doctorId: selectedDocId,
                  doctorName: selectedDocName,
                  doctorSpecialty: selectedSpecialty,
                  productId: widget.product.id,
                  productName: widget.product.brandName,
                  totalDurationSeconds: _secondsElapsed,
                  slidesCoveredCount: widget.product.visualAidSlides.length,
                  physicianInterestRating: interestRating,
                  physicianFeedback: feedbackCtrl.text,
                );
                Navigator.pop(ctx);
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('e-Detailing session & doctor feedback saved to Analytics!'), backgroundColor: AppColors.success),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
              child: const Text('Save & End Session'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final edetailingProvider = context.watch<EdetailingProvider>();
    final slides = widget.product.visualAidSlides;

    if (slides.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: Text(widget.product.brandName)),
        body: const Center(child: Text('No visual slides available for this brand.')),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Colors.white),
          tooltip: 'Back',
          onPressed: () => Navigator.pop(context),
        ),
        backgroundColor: const Color(0xFF0B172E),
        foregroundColor: Colors.white,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.product.brandName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
            Text('Slide ${_currentSlideIndex + 1} of ${slides.length} • ${_isPdfMode ? "PDF Presentation Mode" : "Interactive Visual Binder"}', style: const TextStyle(fontSize: 10.5, color: Colors.white70)),
          ],
        ),
        actions: [
          // Live Presentation Timer
          Container(
            margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(12)),
            child: Row(
              children: [
                const Icon(Icons.timer_outlined, size: 14, color: AppColors.primaryLight),
                const SizedBox(width: 4),
                Text(_formatTimer(_secondsElapsed), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
              ],
            ),
          ),
          IconButton(
            icon: Icon(_isPdfMode ? Icons.view_carousel_rounded : Icons.picture_as_pdf_rounded, color: Colors.white),
            tooltip: _isPdfMode ? 'Switch to Interactive Mode' : 'Switch to PDF Presentation Mode',
            onPressed: () => setState(() => _isPdfMode = !_isPdfMode),
          ),
        ],
      ),
      body: Column(
        children: [
          // Main Slide Canvas
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              itemCount: slides.length,
              onPageChanged: (idx) => setState(() => _currentSlideIndex = idx),
              itemBuilder: (ctx, index) {
                final slide = slides[index];

                return Container(
                  margin: const EdgeInsets.all(12),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Slide Header
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(8)),
                              child: Text('SLIDE ${slide.slideNumber}', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800)),
                            ),
                            Text(widget.product.genericName, style: const TextStyle(color: Color(0xFF64748B), fontSize: 11.5, fontStyle: FontStyle.italic)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(slide.title, style: const TextStyle(color: Color(0xFF0F172A), fontSize: 20, fontWeight: FontWeight.w900)),
                        Text(slide.subtitle, style: const TextStyle(color: AppColors.primary, fontSize: 13, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),

                        // Clinical Claim Banner
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFFBEB),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFFDE68A)),
                          ),
                          child: Text('“${slide.clinicalClaim}”', style: const TextStyle(color: Color(0xFF92400E), fontSize: 12.5, fontStyle: FontStyle.italic, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(height: 14),

                        // Bullet Points
                        ...slide.bulletPoints.map((b) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 16),
                              const SizedBox(width: 8),
                              Expanded(child: Text(b, style: const TextStyle(color: Color(0xFF1E293B), fontSize: 13, fontWeight: FontWeight.w500))),
                            ],
                          ),
                        )),
                        const SizedBox(height: 12),

                        // Stats Highlight Box
                        if (slide.statsHighlight != null) ...[
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Row(
                              children: slide.statsHighlight!.entries.map((e) => Expanded(
                                child: Column(
                                  children: [
                                    Text(e.value, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w900, fontSize: 16)),
                                    Text(e.key, style: const TextStyle(color: Color(0xFF64748B), fontSize: 9.5, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                                  ],
                                ),
                              )).toList(),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Slide Scrub Strip
          Container(
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios_rounded, color: Color(0xFF475569), size: 18),
                  onPressed: _currentSlideIndex > 0 ? () => _pageController.previousPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut) : null,
                ),
                Row(
                  children: List.generate(slides.length, (i) => Container(
                    width: _currentSlideIndex == i ? 22 : 8,
                    height: 8,
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    decoration: BoxDecoration(
                      color: _currentSlideIndex == i ? AppColors.primary : const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  )),
                ),
                IconButton(
                  icon: const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF475569), size: 18),
                  onPressed: _currentSlideIndex < slides.length - 1 ? () => _pageController.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut) : null,
                ),
              ],
            ),
          ),

          // Interactive Clinical Tools Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
              boxShadow: [
                BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, -2)),
              ],
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _toolBtn(icon: Icons.biotech_rounded, label: 'Clinical Studies', onTap: () => _showClinicalStudiesModal(context, edetailingProvider)),
                  _toolBtn(icon: Icons.compare_arrows_rounded, label: 'Drug Comparison', onTap: () => _showDrugComparisonModal(context, edetailingProvider)),
                  _toolBtn(icon: Icons.ondemand_video_rounded, label: '3D Video Player', onTap: () => _showVideoPlayerModal(context, edetailingProvider)),
                  _toolBtn(icon: Icons.help_outline_rounded, label: 'Clinical FAQs', onTap: () => _showFaqsModal(context, edetailingProvider)),
                  _toolBtn(icon: Icons.share_rounded, label: 'Leave-Behind (LBL)', onTap: () => _showLeaveBehindModal(context, edetailingProvider)),
                  _toolBtn(icon: Icons.rate_review_rounded, label: 'Doctor Feedback', isPrimary: true, onTap: () => _showDoctorFeedbackModal(context, edetailingProvider)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _toolBtn({required IconData icon, required String label, required VoidCallback onTap, bool isPrimary = false}) {
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: ElevatedButton.icon(
        onPressed: onTap,
        icon: Icon(icon, size: 14),
        label: Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
        style: ElevatedButton.styleFrom(
          backgroundColor: isPrimary ? AppColors.primary : const Color(0xFFF1F5F9),
          foregroundColor: isPrimary ? Colors.white : const Color(0xFF0F172A),
          elevation: 0,
          side: isPrimary ? null : const BorderSide(color: Color(0xFFE2E8F0)),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
    );
  }
}
